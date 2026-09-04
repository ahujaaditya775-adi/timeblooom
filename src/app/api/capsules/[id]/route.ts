import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isUnlocked, toLockedCapsule, type Capsule } from "@/lib/types";

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(400).optional(),
  memory_text: z.string().optional(),
  mood: z.enum(["joyful", "nostalgic", "hopeful", "peaceful", "grateful", "bittersweet"]).optional(),
  cover_theme: z.string().optional(),
  unlock_at: z.string().datetime().optional(),
  timezone: z.string().optional(),
  privacy: z.enum(["private", "shareable", "recipient"]).optional(),
  recipient_email: z.string().email().nullable().optional(),
  recipient_subject: z.string().max(160).nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
});

/**
 * GET /api/capsules/[id] — fetch a single owned capsule. If it isn't
 * unlocked yet, memory_text and media are stripped from the response
 * server-side no matter what the client requests.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: capsule, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !capsule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isUnlocked(capsule as Capsule)) {
    return NextResponse.json({ capsule: toLockedCapsule(capsule as Capsule), locked: true });
  }

  const { data: media } = await supabase
    .from("capsule_media")
    .select("*")
    .eq("capsule_id", params.id)
    .order("display_order", { ascending: true });

  return NextResponse.json({ capsule: { ...capsule, media: media ?? [] }, locked: false });
}

/** PATCH /api/capsules/[id] — edit a capsule the caller owns. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("capsules")
    .update(parsed.data)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ capsule: data });
}

/** DELETE /api/capsules/[id] — media rows and storage files cascade via FK. */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("capsules").delete().eq("id", params.id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
