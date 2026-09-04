import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createCapsuleSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(400).optional().default(""),
  memory_text: z.string().min(1, "Write at least a few words for future you."),
  mood: z.enum(["joyful", "nostalgic", "hopeful", "peaceful", "grateful", "bittersweet"]),
  cover_theme: z.string().default("midnight"),
  unlock_at: z.string().datetime(),
  timezone: z.string().default("UTC"),
  privacy: z.enum(["private", "shareable", "recipient"]).default("private"),
  recipient_email: z.string().email().optional().nullable(),
  recipient_subject: z.string().max(160).optional().nullable(),
  cover_image_url: z.string().url().optional().nullable(),
});

/**
 * GET /api/capsules — list the current user's capsules, summary fields
 * only (no memory_text/media) since the dashboard grid never needs a
 * locked capsule's contents. RLS additionally guarantees these rows all
 * belong to the caller.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("capsules")
    .select("id, title, description, mood, cover_theme, cover_image_url, unlock_at, timezone, privacy, created_at")
    .order("unlock_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ capsules: data });
}

/** POST /api/capsules — seal a new capsule. */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createCapsuleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;

  if (new Date(input.unlock_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: "unlock_at must be in the future" }, { status: 400 });
  }

  if (input.privacy === "recipient" && !input.recipient_email) {
    return NextResponse.json(
      { error: 'recipient_email is required when privacy is "recipient"' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("capsules")
    .insert({ ...input, user_id: user.id })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ capsule: data }, { status: 201 });
}
