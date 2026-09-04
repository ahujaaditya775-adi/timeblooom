"use client";

import { motion } from "framer-motion";
import { StarField, GlowOrb } from "@/components/ui/star-field";
import { Countdown } from "@/components/ui/countdown";
import { formatDateTime } from "@/lib/utils";
import { MOODS, type Mood } from "@/lib/types";

export function LockedCapsuleView({
  title,
  unlockAt,
  timezone,
  mood,
}: {
  title: string;
  unlockAt: string;
  timezone: string;
  mood: Mood;
}) {
  const moodLabel = MOODS.find((m) => m.value === mood)?.label;

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-4xl border border-white/10 bg-midnight-950/60 px-6 py-20 text-center">
      <StarField count={50} className="absolute inset-0" />
      <GlowOrb className="left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 bg-lavender-400" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 flex h-40 w-40 items-center justify-center"
      >
        <div className="absolute h-40 w-40 animate-float rounded-[45%] border border-white/25 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md shadow-glow" />
        <div className="absolute h-16 w-16 rounded-full bg-lavender-300/40 blur-2xl" />
        <span className="relative font-display text-3xl text-moonlight-200/70">✦</span>
      </motion.div>

      {moodLabel && (
        <span className="relative z-10 mt-8 rounded-full bg-white/5 px-3 py-1 text-xs text-moonlight-300/70">
          {moodLabel}
        </span>
      )}
      <h1 className="relative z-10 mt-4 font-display text-3xl text-moonlight-100 sm:text-4xl">{title}</h1>
      <p className="relative z-10 mt-3 max-w-md text-moonlight-300/70">
        This memory is resting until {formatDateTime(unlockAt, timezone)}.
      </p>

      <div className="relative z-10 mt-10">
        <Countdown target={unlockAt} />
      </div>
    </div>
  );
}
