import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  capsule_id: z.string().uuid(),
  reflection_text: z.string().min(1).max(2000),
});

/**
 * POST /api/reflections — add a reflection to an unlocked capsule the
 * caller owns. The RLS policy re-checks unlock_at <= now(), so this can't
 * be bypassed even if this handler's own logic were skipped.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reflections")
    .upsert({ ...parsed.data, user_id: user.id }, { onConflict: "capsule_id,user_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message.includes("row-level security") ? "This capsule is still locked." : error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ reflection: data }, { status: 201 });
}
