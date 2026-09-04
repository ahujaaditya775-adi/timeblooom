"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonClasses } from "@/components/ui/button";
import { StarField, GlowOrb } from "@/components/ui/star-field";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Muted looping background video — clouds drifting past a moonlit sky */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/videos/moonlit-clouds.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/70 via-midnight-900/80 to-midnight-900" />

      <StarField count={90} className="absolute inset-0" />
      <GlowOrb className="left-[8%] top-[20%] h-72 w-72 bg-lavender-400" />
      <GlowOrb className="right-[10%] top-[55%] h-96 w-96 bg-gold-400" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        {/* Signature element: a floating glass capsule holding a soft light, drifting gently */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-10 flex h-32 w-32 items-center justify-center"
        >
          <div className="absolute h-32 w-32 animate-float-slow rounded-[45%] border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md shadow-glow" />
          <div className="absolute h-14 w-14 animate-pulse rounded-full bg-gold-300/70 blur-xl" />
          <div className="relative h-3 w-3 rounded-full bg-moonlight-100" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="text-balance font-display text-5xl italic text-moonlight-100 sm:text-6xl md:text-7xl"
        >
          Some moments deserve to wait.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-moonlight-300/80"
        >
          TimeBloom lets you seal a letter, a photograph, a feeling — and send it forward to a date
          only you choose. A private museum for the memories still becoming what they'll mean.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/signup" className={buttonClasses({ size: "lg" })}>
            Create your first capsule
          </Link>
          <Link href="#how-it-works" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            Explore how it works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
