import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/landing/reveal";

const features = [
  {
    title: "Private by default",
    description:
      "Every capsule is yours alone unless you decide otherwise. Row-level security keeps your letters and photos unreadable to anyone else — including before they unlock.",
    accent: "lavender",
  },
  {
    title: "Messages to your future self",
    description:
      "Set an unlock date years out and TimeBloom holds the line — no early peeking, not even through a direct link.",
    accent: "gold",
  },
  {
    title: "Photos, video, and voice",
    description:
      "Layer a memory with more than words. Add a gallery of photos, a short video clip, or a voice note to sit alongside your letter.",
    accent: "rose",
  },
  {
    title: "A living countdown",
    description:
      "Watch each capsule's countdown tick down from your dashboard, so the wait itself becomes part of the memory.",
    accent: "teal",
  },
];

const accentClasses: Record<string, string> = {
  lavender: "bg-lavender-400/15 text-lavender-300",
  gold: "bg-gold-400/15 text-gold-300",
  rose: "bg-rose-400/15 text-rose-300",
  teal: "bg-teal-400/15 text-teal-300",
};

export function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300/80">Built for keeping</p>
          <h2 className="mt-4 text-4xl text-moonlight-100 sm:text-5xl">Everything a memory needs</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <GlassCard className="h-full p-8 transition-transform duration-300 hover:-translate-y-1">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${accentClasses[f.accent]}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-moonlight-100">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-moonlight-300/70">{f.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
