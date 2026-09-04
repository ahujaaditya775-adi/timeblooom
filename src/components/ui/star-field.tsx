"use client";

import { useMemo } from "react";

interface StarFieldProps {
  count?: number;
  className?: string;
}

/** Decorative only — aria-hidden, and stars simply stop twinkling under prefers-reduced-motion (see globals.css). */
export function StarField({ count = 70, className }: StarFieldProps) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    [count]
  );

  return (
    <div aria-hidden="true" className={className}>
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-moonlight-100 animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cnOrb(className)}
    />
  );
}

function cnOrb(className?: string) {
  return [
    "pointer-events-none absolute rounded-full blur-3xl opacity-30",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
