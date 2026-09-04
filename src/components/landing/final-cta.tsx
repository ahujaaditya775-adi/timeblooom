import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { GlowOrb } from "@/components/ui/star-field";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <GlowOrb className="left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 bg-lavender-400/60" />
      <Reveal className="relative mx-auto max-w-2xl px-6 text-center sm:px-10">
        <h2 className="text-4xl text-moonlight-100 sm:text-5xl">
          Somewhere out there is a version of you waiting to read this.
        </h2>
        <p className="mt-5 text-lg text-moonlight-300/70">
          Start a capsule today — it takes a few minutes, and the moment it seals, the waiting begins.
        </p>
        <Link href="/signup" className={buttonClasses({ size: "lg", className: "mt-9 inline-flex" })}>
          Create your first capsule
        </Link>
      </Reveal>
    </section>
  );
}
