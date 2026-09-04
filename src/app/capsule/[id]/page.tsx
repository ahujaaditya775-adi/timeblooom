import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyCapsule } from "@/lib/data/capsules";
import { AppTopbar } from "@/components/layout/app-topbar";
import { LockedCapsuleView } from "@/components/capsule/locked-view";
import { RevealCapsuleView } from "@/components/capsule/reveal-view";
import type { Reflection } from "@/lib/types";

export default async function CapsuleDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectTo=/capsule/${params.id}`);

  const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
  const { capsule, locked } = await getMyCapsule(params.id);

  if (!capsule) notFound();

  let existingReflection: Reflection | null = null;
  if (!locked) {
    const { data } = await supabase
      .from("reflections")
      .select("*")
      .eq("capsule_id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();
    existingReflection = data as Reflection | null;
  }

  return (
    <div className="min-h-screen bg-midnight-900">
      <AppTopbar userName={profile?.full_name || user.email || "there"} avatarUrl={profile?.avatar_url ?? null} />
      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        {locked ? (
          <LockedCapsuleView title={capsule.title} unlockAt={capsule.unlock_at} timezone={capsule.timezone} mood={capsule.mood} />
        ) : (
          <RevealCapsuleView capsule={capsule} existingReflection={existingReflection} />
        )}
      </main>
    </div>
  );
}
