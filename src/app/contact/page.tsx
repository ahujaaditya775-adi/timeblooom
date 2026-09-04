import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="border-b border-white/10 bg-midnight-950 pb-16 pt-32">
        <div className="mx-auto max-w-xl px-6 sm:px-10">
          <h1 className="font-display text-4xl text-moonlight-100">Get in touch</h1>
          <p className="mt-4 text-moonlight-300/70">
            Questions, feedback, or something that felt off about a memory you kept — we'd like to hear it.
          </p>

          <GlassCard className="mt-8 p-8">
            <p className="text-moonlight-200">
              Email us at{" "}
              <a href="mailto:hello@timebloom.app" className="text-lavender-300 hover:underline">
                hello@timebloom.app
              </a>
            </p>
            <p className="mt-3 text-sm text-moonlight-300/60">
              We typically reply within two business days.
            </p>
          </GlassCard>
        </div>
      </div>
      <Footer />
    </>
  );
}
