import { GlassCard } from "@/components/ui/glass-card";
import { formatDate } from "@/lib/utils";
import { isUnlocked } from "@/lib/types";

interface SummaryCapsule {
  unlock_at: string;
}

export function SummaryCards({ capsules }: { capsules: SummaryCapsule[] }) {
  const total = capsules.length;
  const unlocked = capsules.filter(isUnlocked).length;
  const locked = total - unlocked;
  const next = capsules
    .filter((c) => !isUnlocked(c))
    .sort((a, b) => new Date(a.unlock_at).getTime() - new Date(b.unlock_at).getTime())[0];

  const stats = [
    { label: "Total capsules", value: total },
    { label: "Locked", value: locked },
    { label: "Unlocked", value: unlocked },
    { label: "Next unlock", value: next ? formatDate(next.unlock_at) : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <GlassCard key={s.label} className="p-5">
          <p className="text-xs uppercase tracking-widest text-moonlight-300/50">{s.label}</p>
          <p className="mt-2 font-display text-2xl text-moonlight-100 sm:text-3xl">{s.value}</p>
        </GlassCard>
      ))}
    </div>
  );
}
