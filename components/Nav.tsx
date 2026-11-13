"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/projects/", label: "Projects" },
  { href: "/case-studies/", label: "Case Studies" },
  { href: "/career/", label: "Career" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export function Nav() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Wordmark onClick={() => setOpen(false)} />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path.startsWith(l.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-sm transition hover:bg-ink/10 ${path.startsWith(l.href) ? "font-semibold text-accent" : "text-ink/90"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/career/" className="btn btn-accent ml-2 !px-4 !py-2 !text-sm">Recruiter view</Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button aria-expanded={open} aria-controls="mobile-nav" aria-label="Menu" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-line/20">
            <span aria-hidden className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="wrap grid gap-1 pb-4 md:hidden">
          {[{ href: "/", label: "Home" }, ...links, { href: "/recommendations/", label: "Recommendations" }, { href: "/now/", label: "Now" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-lg hover:bg-ink/10">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
