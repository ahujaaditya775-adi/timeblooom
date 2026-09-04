import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateMediaFile } from "@/lib/utils";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "capsule-media";

/**
 * POST /api/media/upload — multipart upload of a single file for a capsule
 * the caller owns. Stored under {user_id}/{capsule_id}/{filename} in the
 * private "capsule-media" bucket, matching the storage RLS policy in
 * supabase/schema.sql.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const capsuleId = formData.get("capsule_id") as string | null;
  const displayOrder = Number(formData.get("display_order") ?? 0);

  if (!file || !capsuleId) {
    return NextResponse.json({ error: "file and capsule_id are required" }, { status: 400 });
  }

  // Confirm ownership before writing anything to storage or the DB.
  const { data: capsule, error: capsuleError } = await supabase
    .from("capsules")
    .select("id")
    .eq("id", capsuleId)
    .eq("user_id", user.id)
    .single();

  if (capsuleError || !capsule) {
    return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
  }

  const validated = validateMediaFile(file);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${user.id}/${capsuleId}/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: mediaRow, error: dbError } = await supabase
    .from("capsule_media")
    .insert({
      capsule_id: capsuleId,
      file_url: path, // storage path; resolved to a signed URL below and on read
      file_type: validated.kind,
      file_name: file.name,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (dbError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);

  return NextResponse.json({ media: mediaRow, signedUrl: signed?.signedUrl }, { status: 201 });
}

/** DELETE /api/media/upload?id=... — remove a media item the caller owns. */
export async function DELETE(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { data: media, error: fetchError } = await supabase
    .from("capsule_media")
    .select("*, capsules!inner(user_id)")
    .eq("id", id)
    .single();

  if (fetchError || !media || (media as any).capsules.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await supabase.storage.from(BUCKET).remove([media.file_url]);
  const { error: deleteError } = await supabase.from("capsule_media").delete().eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
