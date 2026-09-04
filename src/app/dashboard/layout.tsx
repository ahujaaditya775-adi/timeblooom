import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppTopbar } from "@/components/layout/app-topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-midnight-900">
      <AppTopbar userName={profile?.full_name || user.email || "there"} avatarUrl={profile?.avatar_url ?? null} />
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
