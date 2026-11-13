import Link from "next/link";
import { Hero } from "@/components/Hero";
import { LogoStrip, TechStrip } from "@/components/LogoStrip";
import { Reveal } from "@/components/Reveal";
import { Feature } from "@/components/Feature";
import { CountUp } from "@/components/CountUp";
import { Constellation } from "@/components/Constellation";
import { StatusBadge } from "@/components/StatusBadge";
import { ai, chapters, outcomes, projects, now, site, recommendations, transformation } from "@/content/data";
import { Transformation } from "@/components/Transformation";

export default function Home() {
  const pick = projects.filter((p) => p.type === "Personal").slice(0, 4);
  return (
    <>
      <Hero />
      <LogoStrip />

      <Feature title="Adoption, not launch, is the finish line." body="Across manufacturing, IoT SaaS and smart city programmes, the work that mattered was what people actually used. These are approximate results from my own roles." cta="See the career" href="/career/">
        <div className="grid grid-cols-2 gap-3">
          {outcomes.map((o) => (
            <div key={o.label} className="card p-5"><p className="display text-4xl text-accent"><CountUp value={o.value} /></p><p className="mt-2 text-sm leading-snug">{o.label}</p><p className="mt-1 text-xs text-soft">{o.where}</p></div>
          ))}
        </div>
      </Feature>

      <Feature reverse title={ai.headline} body={ai.body} cta="Read the AI case study" href="/case-studies/ai-that-cannot-invent/">
        <div className="card p-6">
          <div className="flex flex-wrap gap-2">{ai.skills.map((k) => <span key={k} className="chip">{k}</span>)}</div>
          <ul className="mt-6 divide-y divide-line/10">
            {ai.proof.map((p) => (
              <li key={p.name}><Link href={p.href} className="block py-3 transition hover:text-accent"><p className="font-semibold">{p.name}</p><p className="text-sm text-soft">{p.what}</p></Link></li>
            ))}
          </ul>
        </div>
      </Feature>

      <Feature title="Things I build to learn faster." body="Planning apps, a knowledge platform for smart cities, a job search tool that cannot invent facts." cta="All projects" href="/projects/">
        <div className="card divide-y divide-line/10 overflow-hidden">
          {pick.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}/`} className="flex items-center justify-between gap-3 p-4 transition hover:bg-tint">
              <div className="min-w-0"><p className="font-semibold">{p.name}</p><p className="line-clamp-1 text-sm text-soft">{p.blurb}</p></div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </div>
      </Feature>

      <Reveal className="wrap py-4 md:py-5">
        <div className="rounded-[2rem] bg-tint p-6 md:p-14">
          <h2 className="display max-w-2xl text-3xl md:text-4xl">Not a list of skill bars. A web of what connects.</h2>
          <p className="mt-4 max-w-xl text-ink/90">Select a capability to see where it shows up in my work.</p>
          <div className="mt-8"><Constellation /></div>
        </div>
      </Reveal>

      <Feature reverse title="Get to know me." body="From Batangas to the UAE. Eagle Scout, licensed engineer, MBA. Quiet by default, and learning to share earlier." cta="Read my story" href="/about/">
        <div className="card divide-y divide-line/10 overflow-hidden">
          {[chapters[1], chapters[3], chapters[5], chapters[9]].map((c) => (
            <div key={c.id} className="p-4"><p className="text-xs font-semibold text-accent">{c.year}</p><p className="font-semibold">{c.title}</p></div>
          ))}
        </div>
      </Feature>

      <Feature title="What I'm up to right now." body={now.focus} cta="See the Now page" href="/now/">
        <ul className="card space-y-3 p-6">{now.building.map((b) => <li key={b} className="flex gap-3"><span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />{b}</li>)}</ul>
      </Feature>

      <Feature reverse title="A 43 kg transformation." body={transformation.text} cta="Read my story" href="/about/#beyond-work">
        <Transformation />
      </Feature>

      <Feature title="What people say." body="Colleagues, leaders and partners across Aldar, Disrupt-X, Terminus and clients in the region." cta="Read the recommendations" href="/recommendations/">
        <figure className="card p-7">
          <blockquote className="text-lg leading-relaxed">&ldquo;{recommendations[0].quote.split(". ").slice(-1)[0]}&rdquo;</blockquote>
          <figcaption className="mt-4 text-sm text-soft"><b className="text-ink">{recommendations[0].name}</b>, {recommendations[0].role}, {recommendations[0].org}</figcaption>
        </figure>
      </Feature>

      <TechStrip />

      <Reveal className="wrap py-20 text-center">
        <span className="orb-float mx-auto block h-14 w-14" aria-hidden><span className="orb orb-live block h-14 w-14 rounded-full" /></span>
        <h2 className="display mt-6 text-4xl md:text-5xl">Let&apos;s talk.</h2>
        <div className="mx-auto mt-8 flex max-w-xs flex-col gap-3">
          <a href={`mailto:${site.email}`} className="btn btn-accent cta-pulse justify-center">Email me</a>
          <a href={site.linkedin} className="btn btn-ghost cta-glow justify-center">LinkedIn</a>
        </div>
      </Reveal>
    </>
  );
}
