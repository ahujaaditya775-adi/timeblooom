import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { signOutAction } from "@/app/(auth)/actions";

export function AppTopbar({ userName, avatarUrl }: { userName: string; avatarUrl: string | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-midnight-900/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/dashboard" className="font-display text-xl text-moonlight-100">
          TimeBloom
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/dashboard" className="text-sm text-moonlight-300/80 hover:text-moonlight-100">
            Dashboard
          </Link>
          <Link href="/capsule/new" className="text-sm text-moonlight-300/80 hover:text-moonlight-100">
            New capsule
          </Link>
          <Link href="/settings" className="text-sm text-moonlight-300/80 hover:text-moonlight-100">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/capsule/new" className={buttonClasses({ size: "sm", className: "hidden sm:inline-flex" })}>
            New capsule
          </Link>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm text-moonlight-100">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={`${userName}'s avatar`} className="h-full w-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-moonlight-300/60 transition hover:text-moonlight-100"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
