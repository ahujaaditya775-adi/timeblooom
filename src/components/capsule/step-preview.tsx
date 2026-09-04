"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Countdown } from "@/components/ui/countdown";
import { Button } from "@/components/ui/button";
import { MOODS, type Mood } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import type { PendingMedia } from "@/components/capsule/step-content";

export function StepPreview({
  title,
  description,
  mood,
  memoryText,
  media,
  unlockAtIso,
  timezone,
  sealing,
  sealed,
  onSeal,
}: {
  title: string;
  description: string;
  mood: Mood;
  memoryText: string;
  media: PendingMedia[];
  unlockAtIso: string;
  timezone: string;
  sealing: boolean;
  sealed: boolean;
  onSeal: () => void;
}) {
  const moodLabel = MOODS.find((m) => m.value === mood)?.label;

  if (sealed) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/50 bg-gold-400/10 shadow-glow-gold animate-seal-pulse"
        >
          <span className="font-display text-3xl text-gold-300">✦</span>
        </motion.div>
        <h2 className="mt-6 font-display text-3xl text-moonlight-100">Sealed.</h2>
        <p className="mt-2 max-w-sm text-moonlight-300/70">
          “{title}” is resting now. It opens on {formatDateTime(unlockAtIso, timezone)}.
        </p>
        <div className="mt-8">
          <Countdown target={unlockAtIso} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-moonlight-100">{title || "Untitled capsule"}</h3>
          {moodLabel && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-moonlight-300/80">{moodLabel}</span>}
        </div>
        {description && <p className="mt-2 text-sm text-moonlight-300/70">{description}</p>}

        <p className="mt-5 whitespace-pre-wrap font-display text-lg italic leading-relaxed text-moonlight-100/90 line-clamp-6">
          {memoryText || "Your letter will appear here."}
        </p>

        {media.length > 0 && (
          <p className="mt-4 text-xs text-moonlight-300/50">
            {media.filter((m) => m.kind === "image").length} photo(s)
            {media.some((m) => m.kind === "video") && " · 1 video"}
            {media.some((m) => m.kind === "audio") && " · 1 voice note"}
          </p>
        )}

        <div className="mt-5 border-t border-white/10 pt-4 text-sm text-moonlight-300/70">
          Unlocks {formatDateTime(unlockAtIso, timezone)}
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <Button size="lg" loading={sealing} onClick={onSeal} className="animate-seal-pulse">
          {sealing ? "Sealing…" : "Seal the capsule"}
        </Button>
      </div>
    </div>
  );
}
