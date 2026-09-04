import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppTopbar } from "@/components/layout/app-topbar";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";
import { NotificationsToggle } from "@/components/settings/notifications-toggle";
import { CapsuleManagement, DeleteAccountSection } from "@/components/settings/danger-zone";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, email_notifications")
    .eq("id", user.id)
    .single();

  const { data: capsules } = await supabase
    .from("capsules")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-midnight-900">
      <AppTopbar userName={profile?.full_name || user.email || "there"} avatarUrl={profile?.avatar_url ?? null} />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-12 sm:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lavender-400/70">Account</p>
          <h1 className="mt-2 font-display text-4xl text-moonlight-100">Settings</h1>
        </div>

        <ProfileForm userId={user.id} initialFullName={profile?.full_name || ""} initialAvatarUrl={profile?.avatar_url ?? null} />
        <PasswordForm />
        <NotificationsToggle initialEnabled={profile?.email_notifications ?? true} />
        <CapsuleManagement capsules={capsules ?? []} />
        <DeleteAccountSection />
      </main>
    </div>
  );
}
