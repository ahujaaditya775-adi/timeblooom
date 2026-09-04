"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Mood, Privacy } from "@/lib/types";

const capsuleSchema = z.object({
  title: z.string().trim().min(1, "Give your capsule a title.").max(120),
  description: z.string().trim().max(300).optional().default(""),
  mood: z.enum(["joyful", "nostalgic", "hopeful", "peaceful", "grateful", "bittersweet"]),
  coverTheme: z.string().min(1).default("midnight"),
  memoryText: z.string().trim().min(1, "Write at least a few words for future you."),
  unlockAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Choose a valid unlock date."),
  timezone: z.string().min(1),
  privacy: z.enum(["private", "shareable", "recipient"]),
  recipientEmail: z.string().trim().email().optional().or(z.literal("")),
  recipientSubject: z.string().trim().max(150).optional().or(z.literal("")),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

export interface CreateCapsuleInput {
  title: string;
  description: string;
  mood: Mood;
  coverTheme: string;
  memoryText: string;
  unlockAt: string; // ISO
  timezone: string;
  privacy: Privacy;
  recipientEmail: string;
  recipientSubject: string;
  coverImageUrl: string;
}

export async function createCapsule(input: CreateCapsuleInput) {
  const parsed = capsuleSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the capsule details." };
  }

  const unlockAt = new Date(parsed.data.unlockAt);
  if (unlockAt.getTime() <= Date.now()) {
    return { error: "The unlock date must be in the future." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired — please log in again." };

  const { data, error } = await supabase
    .from("capsules")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      memory_text: parsed.data.memoryText,
      mood: parsed.data.mood,
      cover_theme: parsed.data.coverTheme,
      unlock_at: unlockAt.toISOString(),
      timezone: parsed.data.timezone,
      privacy: parsed.data.privacy,
      recipient_email: parsed.data.recipientEmail || null,
      recipient_subject: parsed.data.recipientSubject || null,
      cover_image_url: parsed.data.coverImageUrl || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[actions] createCapsule", error?.message);
    return { error: "Something went wrong sealing your capsule. Please try again." };
  }

  revalidatePath("/dashboard");
  return { id: data.id as string };
}

export async function deleteCapsule(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("capsules").delete().eq("id", id);
  if (error) return { error: "Couldn't delete that capsule." };
  revalidatePath("/dashboard");
  return { ok: true };
}

const reflectionSchema = z.string().trim().min(1).max(2000);

export async function addReflection(capsuleId: string, text: string) {
  const parsed = reflectionSchema.safeParse(text);
  if (!parsed.success) return { error: "Write a little about how you feel first." };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired — please log in again." };

  const { error } = await supabase.from("reflections").upsert(
    { capsule_id: capsuleId, user_id: user.id, reflection_text: parsed.data },
    { onConflict: "capsule_id,user_id" }
  );

  if (error) return { error: "Couldn't save your reflection." };
  revalidatePath(`/capsule/${capsuleId}`);
  return { ok: true };
}
