"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownProps {
  target: string;
  onComplete?: () => void;
  compact?: boolean;
}

export function Countdown({ target, onComplete, compact = false }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(target));

  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeRemaining(target);
      setRemaining(next);
      if (!next.isPast && next.totalMs <= 0) onComplete?.();
    }, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  useEffect(() => {
    if (remaining.isPast) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining.isPast]);

  if (remaining.isPast) {
    return <p className="font-display italic text-gold-300">This memory has unlocked.</p>;
  }

  const units = [
    { label: "days", value: remaining.days },
    { label: "hrs", value: remaining.hours },
    { label: "min", value: remaining.minutes },
    { label: "sec", value: remaining.seconds },
  ];

  return (
    <div className={compact ? "flex gap-3" : "flex gap-4 sm:gap-6"} role="timer" aria-live="off">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div
            className={
              compact
                ? "w-12 rounded-xl bg-white/5 border border-white/10 py-1.5 font-mono text-lg text-moonlight-100"
                : "w-16 sm:w-20 rounded-2xl bg-white/5 border border-white/10 py-3 font-mono text-2xl sm:text-3xl text-moonlight-100"
            }
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={u.value}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                {String(u.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="mt-1.5 block text-[11px] uppercase tracking-widest text-moonlight-300/50">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
