import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppTopbar } from "@/components/layout/app-topbar";
import { CapsuleWizard } from "@/components/capsule/capsule-wizard";

export default async function NewCapsulePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/capsule/new");

  const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();

  return (
    <div className="min-h-screen bg-midnight-900">
      <AppTopbar userName={profile?.full_name || user.email || "there"} avatarUrl={profile?.avatar_url ?? null} />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lavender-400/70">New capsule</p>
          <h1 className="mt-2 font-display text-4xl text-moonlight-100">Plant a memory</h1>
        </div>
        <CapsuleWizard />
      </main>
    </div>
  );
}
