"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { StarField, GlowOrb } from "@/components/ui/star-field";
import { formatDate, formatDateTime, timeAgo, cn } from "@/lib/utils";
import { MOODS, type Capsule, type Reflection } from "@/lib/types";
import { addReflection } from "@/app/capsule/actions";

export function RevealCapsuleView({
  capsule,
  existingReflection,
}: {
  capsule: Capsule;
  existingReflection: Reflection | null;
}) {
  const [opened, setOpened] = useState(false);
  const moodLabel = MOODS.find((m) => m.value === capsule.mood)?.label;
  const photos = capsule.media?.filter((m) => m.file_type === "image") ?? [];
  const video = capsule.media?.find((m) => m.file_type === "video");
  const audio = capsule.media?.find((m) => m.file_type === "audio");

  if (!opened) {
    return (
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-4xl border border-white/10 bg-midnight-950/60 px-6 py-20 text-center">
        <StarField count={110} className="absolute inset-0" />
        <GlowOrb className="left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-gold-400" />

        <motion.button
          onClick={() => setOpened(true)}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          whileHover={{ scale: 1.04 }}
          className="relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full"
          aria-label={`Open capsule: ${capsule.title}`}
        >
          <span className="absolute h-44 w-44 animate-seal-pulse rounded-full border border-gold-400/50 bg-gold-400/10 backdrop-blur-md" />
          <span className="relative font-display text-4xl text-gold-300">✦</span>
          <span className="relative mt-2 text-xs uppercase tracking-widest text-moonlight-200/70">Tap to open</span>
        </motion.button>

        <h1 className="relative z-10 mt-8 font-display text-3xl text-moonlight-100 sm:text-4xl">{capsule.title}</h1>
        <p className="relative z-10 mt-2 text-moonlight-300/70">Unlocked and ready to be rediscovered.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {moodLabel && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-moonlight-300/70">{moodLabel}</span>}
        <h1 className="mt-4 font-display text-4xl text-moonlight-100">{capsule.title}</h1>
        <p className="mt-2 text-sm text-moonlight-300/60">
          Written {formatDate(capsule.created_at)} · {timeAgo(capsule.created_at)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <GlassCard className="p-8 sm:p-10">
          <p className="whitespace-pre-wrap font-display text-xl italic leading-relaxed text-moonlight-100/90">
            {capsule.memory_text}
          </p>
        </GlassCard>
      </motion.div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
              className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
            >
              <Image
                src={p.file_url}
                alt={`Photo from ${capsule.title}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      )}

      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <video controls className="w-full rounded-2xl border border-white/10" preload="metadata">
            <source src={video.file_url} />
          </video>
        </motion.div>
      )}

      {audio && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
          <audio controls className="w-full" preload="metadata">
            <source src={audio.file_url} />
          </audio>
        </motion.div>
      )}

      <ReflectionForm capsuleId={capsule.id} existing={existingReflection} />

      {capsule.privacy === "shareable" && (
        <p className="text-center text-sm text-moonlight-300/50">
          Sharing is on for this capsule — anyone with its link can view it now that it's unlocked.
        </p>
      )}
    </div>
  );
}

function ReflectionForm({ capsuleId, existing }: { capsuleId: string; existing: Reflection | null }) {
  const [text, setText] = useState(existing?.reflection_text ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!existing);

  async function handleSave() {
    setSaving(true);
    const result = await addReflection(capsuleId, text);
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setSaved(true);
    toast.success("Reflection saved.");
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="font-display text-xl text-moonlight-100">How do you feel seeing this now?</h2>
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        placeholder="Write a few honest lines about reading this today…"
        className="mt-4 min-h-[120px]"
      />
      <div className="mt-4 flex justify-end">
        <Button size="sm" loading={saving} disabled={!text.trim() || saved} onClick={handleSave}>
          {saved ? "Saved" : "Save reflection"}
        </Button>
      </div>
    </GlassCard>
  );
}
