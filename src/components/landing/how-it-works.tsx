import { Reveal } from "@/components/landing/reveal";

const steps = [
  {
    number: "01",
    title: "Capture a memory",
    description:
      "Write the letter you'd want to read again. Add photographs, a short video, even a voice note — whatever holds the feeling best.",
  },
  {
    number: "02",
    title: "Choose an unlock date",
    description:
      "A month from now, a decade from now, the morning of a birthday not yet here. The capsule stays sealed until that exact moment.",
  },
  {
    number: "03",
    title: "Rediscover it later",
    description:
      "When the date arrives, TimeBloom opens the capsule for you — a slow, cinematic reveal of who you were and what you felt.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lavender-400/80">The process</p>
          <h2 className="mt-4 text-4xl text-moonlight-100 sm:text-5xl">How it works</h2>
        </Reveal>

        <div className="relative mt-20 grid gap-16 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
          />
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.15} className="relative text-center md:text-left">
              <span className="font-display text-6xl italic text-white/10">{step.number}</span>
              <h3 className="mt-4 font-display text-2xl text-moonlight-100">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-moonlight-300/70">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
