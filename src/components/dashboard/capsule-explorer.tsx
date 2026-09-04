"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/states";
import { CapsuleCard, type CapsuleCardData } from "@/components/dashboard/capsule-card";
import { isUnlocked, MOODS } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "locked" | "unlocked";

export function CapsuleExplorer({ capsules }: { capsules: CapsuleCardData[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [mood, setMood] = useState<string>("all");

  const filtered = useMemo(() => {
    return capsules
      .filter((c) => (status === "all" ? true : status === "locked" ? !isUnlocked(c) : isUnlocked(c)))
      .filter((c) => (mood === "all" ? true : c.mood === mood))
      .filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()));
  }, [capsules, query, status, mood]);

  if (capsules.length === 0) {
    return (
      <EmptyState
        title="Your first memory is waiting to be planted"
        description="Capsules you create will bloom here — locked until the date you choose, then ready to rediscover."
        action={{ label: "Create your first memory", href: "/capsule/new" }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search capsules by title…"
          className="sm:max-w-xs"
          aria-label="Search capsules"
        />

        <div className="flex flex-wrap gap-2">
          {(["all", "locked", "unlocked"] as StatusFilter[]).map((s) => (
            <FilterPill key={s} active={status === s} onClick={() => setStatus(s)}>
              {s === "all" ? "All" : s === "locked" ? "Locked" : "Unlocked"}
            </FilterPill>
          ))}
        </div>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-moonlight-200 outline-none focus-visible:ring-2 focus-visible:ring-lavender-400/40 sm:ml-auto"
          aria-label="Filter by mood"
        >
          <option value="all">Every mood</option>
          {MOODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No capsules match" description="Try a different search term, mood, or status filter." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CapsuleCard key={c.id} capsule={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-lavender-400/50 bg-lavender-400/15 text-lavender-200"
          : "border-white/10 bg-white/5 text-moonlight-300/70 hover:text-moonlight-100"
      )}
    >
      {children}
    </button>
  );
}
