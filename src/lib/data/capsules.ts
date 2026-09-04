import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Capsule, CapsuleMedia } from "@/lib/types";

/** Columns safe to send to the dashboard/list views — never the memory text. */
const SUMMARY_COLUMNS =
  "id, title, description, mood, cover_theme, cover_image_url, unlock_at, timezone, privacy, created_at";

export async function listMyCapsules(): Promise<Pick<
  Capsule,
  "id" | "title" | "description" | "mood" | "cover_theme" | "cover_image_url" | "unlock_at" | "timezone" | "privacy" | "created_at"
>[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("capsules")
    .select(SUMMARY_COLUMNS)
    .order("unlock_at", { ascending: true });

  if (error) {
    console.error("[data] listMyCapsules", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Fetches a single capsule the current user owns. Locked content
 * (memory_text, media) is stripped server-side unless the unlock date has
 * passed — enforced here, not just in the UI, so a direct fetch can't
 * bypass it.
 */
export async function getMyCapsule(id: string): Promise<{ capsule: Capsule | null; locked: boolean }> {
  const supabase = createClient();

  const { data: capsule, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !capsule) return { capsule: null, locked: false };

  const locked = new Date(capsule.unlock_at).getTime() > Date.now();

  if (locked) {
    return {
      capsule: { ...capsule, memory_text: "", media: [] } as Capsule,
      locked: true,
    };
  }

  const { data: media } = await supabase
    .from("capsule_media")
    .select("*")
    .eq("capsule_id", id)
    .order("display_order", { ascending: true });

  return { capsule: { ...capsule, media: (media ?? []) as CapsuleMedia[] } as Capsule, locked: false };
}
