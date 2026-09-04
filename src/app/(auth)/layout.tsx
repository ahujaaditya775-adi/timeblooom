import Link from "next/link";
import { StarField, GlowOrb } from "@/components/ui/star-field";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950" />
      <StarField count={60} className="absolute inset-0" />
      <GlowOrb className="left-[10%] top-[15%] h-64 w-64 bg-lavender-400" />
      <GlowOrb className="right-[10%] bottom-[10%] h-72 w-72 bg-gold-400" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 block text-center font-display text-2xl text-moonlight-100">
          TimeBloom
        </Link>
        {children}
      </div>
    </div>
  );
}
