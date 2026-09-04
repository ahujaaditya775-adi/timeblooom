"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { toggleNotificationsAction } from "@/app/settings/actions";

export function NotificationsToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    startTransition(async () => {
      const result = await toggleNotificationsAction(next);
      if (result.error) {
        setEnabled(!next);
        toast.error(result.error);
      }
    });
  }

  return (
    <GlassCard className="flex items-center justify-between p-6 sm:p-8">
      <div>
        <h2 className="font-display text-2xl text-moonlight-100">Email notifications</h2>
        <p className="mt-1 max-w-sm text-sm text-moonlight-300/70">
          Get an email when a capsule is about to open, and again the moment it unlocks.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={isPending}
        onClick={handleToggle}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          enabled ? "bg-lavender-400" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </GlassCard>
  );
}
