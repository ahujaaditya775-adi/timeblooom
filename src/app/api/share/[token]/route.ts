import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "capsule-media";

/**
 * GET /api/share/[token] — public endpoint for shareable-link capsules.
 * Uses the service-role client deliberately (an anonymous visitor has no
 * Supabase session, so a normal RLS-scoped query would return nothing) but
 * re-implements the same authorization by hand: privacy must be
 * "shareable", and before unlock only non-content fields are ever returned.
 */
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const supabase = createServiceRoleClient();

  const { data: capsule, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("share_token", params.token)
    .single();

  if (error || !capsule) {
    return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
  }

  if (capsule.privacy !== "shareable") {
    return NextResponse.json({ error: "This capsule is not shared" }, { status: 403 });
  }

  const locked = new Date(capsule.unlock_at).getTime() > Date.now();

  if (locked) {
    const { memory_text, recipient_email, user_id, ...safe } = capsule;
    return NextResponse.json({ capsule: safe, locked: true });
  }

  const { data: media } = await supabase
    .from("capsule_media")
    .select("*")
    .eq("capsule_id", capsule.id)
    .order("display_order", { ascending: true });

  // Resolve signed URLs for media just-in-time rather than storing public URLs.
  const mediaWithUrls = await Promise.all(
    (media ?? []).map(async (m) => {
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(m.file_url, 60 * 30);
      return { ...m, signed_url: signed?.signedUrl ?? null };
    })
  );

  const { recipient_email, user_id, ...safe } = capsule;
  return NextResponse.json({ capsule: { ...safe, media: mediaWithUrls }, locked: false });
}
