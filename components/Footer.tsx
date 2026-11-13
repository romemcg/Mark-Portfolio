import Link from "next/link";
import { site } from "@/content/data";
import { Wordmark } from "./Wordmark";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";

export function Footer() {
  const links = [["/projects/", "Projects"], ["/case-studies/", "Case studies"], ["/career/", "Career"], ["/recommendations/", "Recommendations"], ["/about/", "About"], ["/now/", "Now"], ["/contact/", "Contact"]];
  return (
    <footer className="mt-24 bg-tint py-12">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark large />
          <p className="mt-1 text-sm text-soft">{site.tagline}</p>
        </div>
        <nav aria-label="More" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map(([h, l]) => <Link key={h} href={h} className="text-ink/90 hover:text-accent">{l}</Link>)}
        </nav>
        <div className="flex gap-2">
          {[[site.linkedin, "LinkedIn", <LinkedinIcon key="l" />], [site.github, "GitHub", <GithubIcon key="g" />], [`mailto:${site.email}`, "Email", <MailIcon key="m" />]].map(([h, l, i]) => (
            <a key={l as string} href={h as string} aria-label={l as string} className="grid h-10 w-10 place-items-center rounded-full bg-card text-ink shadow-sm transition hover:-translate-y-0.5 hover:text-accent">{i}</a>
          ))}
        </div>
      </div>
      <p className="wrap mt-8 text-xs text-soft">© 2026 Mark Gomez · {site.base}</p>
    </footer>
  );
}
