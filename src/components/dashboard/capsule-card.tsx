"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Countdown } from "@/components/ui/countdown";
import { formatDate } from "@/lib/utils";
import { isUnlocked, MOODS, type Mood } from "@/lib/types";

export interface CapsuleCardData {
  id: string;
  title: string;
  description: string;
  mood: Mood;
  cover_theme: string;
  cover_image_url: string | null;
  unlock_at: string;
  created_at: string;
}

export function CapsuleCard({ capsule }: { capsule: CapsuleCardData }) {
  const unlocked = isUnlocked(capsule);
  const mood = MOODS.find((m) => m.value === capsule.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/capsule/${capsule.id}`}>
        <GlassCard className="group h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow">
          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-lavender-500/20 to-midnight-800">
            {capsule.cover_image_url ? (
              <Image
                src={capsule.cover_image_url}
                alt={`Cover image for ${capsule.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover opacity-90 transition group-hover:opacity-100"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="h-10 w-10 rounded-[45%] border border-white/20 bg-white/5" aria-hidden="true" />
              </div>
            )}
            <span
              className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                unlocked ? "bg-teal-500/20 text-teal-300" : "bg-white/10 text-moonlight-200"
              }`}
            >
              {unlocked ? "Unlocked" : "Locked"}
            </span>
          </div>

          <div className="p-5">
            <h3 className="font-display text-xl text-moonlight-100 line-clamp-1">{capsule.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-moonlight-300/70">{capsule.description}</p>

            <div className="mt-4 flex items-center justify-between text-xs text-moonlight-300/50">
              <span>Created {formatDate(capsule.created_at)}</span>
              {mood && <span className="rounded-full bg-white/5 px-2.5 py-1">{mood.label}</span>}
            </div>

            {!unlocked && (
              <div className="mt-4">
                <Countdown target={capsule.unlock_at} compact />
              </div>
            )}
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
