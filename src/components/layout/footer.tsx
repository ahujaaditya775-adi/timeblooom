import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight-950/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-4">
        <div>
          <p className="font-display text-xl text-moonlight-100">TimeBloom</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-moonlight-300/60">
            A quiet place to keep a memory safe until the day it's meant to be found again.
          </p>
        </div>

        <FooterColumn
          title="Product"
          links={[
            { href: "/#how-it-works", label: "How it works" },
            { href: "/#features", label: "Features" },
            { href: "/signup", label: "Create a capsule" },
          ]}
        />
        <FooterColumn
          title="Account"
          links={[
            { href: "/login", label: "Log in" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/settings", label: "Settings" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { href: "/privacy", label: "Privacy policy" },
            { href: "/contact", label: "Contact" },
          ]}
        />
      </div>
      <div className="border-t border-white/5 px-6 py-6 text-center text-xs text-moonlight-300/40 sm:px-10">
        © {new Date().getFullYear()} TimeBloom. Every memory here belongs to the person who kept it.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-moonlight-300/50">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-moonlight-300/70 transition hover:text-moonlight-100">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
