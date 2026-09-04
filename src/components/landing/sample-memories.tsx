import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/landing/reveal";

const memories = [
  {
    quote:
      "I sealed a letter to myself the week before my daughter was born, unlocking on her fifth birthday. Reading it back with her asleep upstairs undid me in the best way.",
    author: "Priya, opened after 5 years",
    mood: "Grateful",
  },
  {
    quote:
      "We wrote capsules for each other the night before I moved abroad, set to unlock a year later. It felt like getting a letter from a version of my best friend I hadn't met yet.",
    author: "Théo, opened after 1 year",
    mood: "Bittersweet",
  },
  {
    quote:
      "I keep a running capsule for my first year of sobriety, unlocking on each anniversary. It's the only place I let myself be that honest.",
    author: "Marcus, opened yearly",
    mood: "Hopeful",
  },
];

export function SampleMemories() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300/80">Kept and reopened</p>
          <h2 className="mt-4 text-4xl text-moonlight-100 sm:text-5xl">Memories people have sent forward</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {memories.map((m, i) => (
            <Reveal key={m.author} delay={i * 0.1}>
              <GlassCard className="flex h-full flex-col p-8">
                <p className="font-display text-lg italic leading-relaxed text-moonlight-100/90">
                  “{m.quote}”
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-moonlight-300/60">{m.author}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-moonlight-300/70">{m.mood}</span>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
