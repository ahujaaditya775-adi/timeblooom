import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="font-display text-xl tracking-wide text-moonlight-100">
          TimeBloom
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#how-it-works" className="text-sm text-moonlight-300/80 transition hover:text-moonlight-100">
            How it works
          </Link>
          <Link href="/#features" className="text-sm text-moonlight-300/80 transition hover:text-moonlight-100">
            Features
          </Link>
          <Link href="/login" className="text-sm text-moonlight-300/80 transition hover:text-moonlight-100">
            Log in
          </Link>
        </div>
        <Link href="/signup" className={buttonClasses({ size: "sm", className: "hidden md:inline-flex" })}>
          Create your first capsule
        </Link>
        <Link href="/signup" className={buttonClasses({ size: "sm", className: "md:hidden" })}>
          Start
        </Link>
      </nav>
    </header>
  );
}
