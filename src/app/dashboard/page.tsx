import { createClient } from "@/lib/supabase/server";
import { listMyCapsules } from "@/lib/data/capsules";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CapsuleExplorer } from "@/components/dashboard/capsule-explorer";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const firstName = (profile?.full_name || "").split(" ")[0] || "there";
  const capsules = await listMyCapsules();

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-lavender-400/70">Welcome back</p>
        <h1 className="mt-2 font-display text-4xl text-moonlight-100">
          Hello, {firstName}.
        </h1>
        <p className="mt-2 text-moonlight-300/70">
          {capsules.length === 0
            ? "Your archive is empty for now — that's about to change."
            : "Here's everything you've kept, and everything still waiting to open."}
        </p>
      </div>

      <SummaryCards capsules={capsules} />
      <CapsuleExplorer capsules={capsules} />
    </div>
  );
}
