import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { SampleMemories } from "@/components/landing/sample-memories";
import { FinalCta } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <SampleMemories />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
