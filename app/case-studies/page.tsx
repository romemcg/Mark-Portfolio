import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { ProjectCover } from "@/components/ProjectCover";
import { caseStudies } from "@/content/data";

export const metadata: Metadata = { title: "Case Studies", description: "How I think: problems, decisions and trade-offs, with demonstrated outcomes kept separate from hypotheses.", alternates: { canonical: "/case-studies/" } };

export default function CaseStudies() {
  return (
    <>
      <PageHeader eyebrow="Case studies" title="How I think." intro="Problems, decisions and trade offs, from my roles and my own projects." />
      <section className="wrap grid gap-6 py-8">
        <Reveal>
          <article className="card group relative p-7 transition hover:-translate-y-1 hover:border-accent/60 md:p-10">
            <div className="mb-6 flex h-36 items-center justify-between overflow-hidden rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#0A162E,#2563EB)" }} aria-hidden>
              <svg viewBox="0 0 24 24" className="h-16 w-16 shrink-0 opacity-95" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l6-4v17M9 21V11l6-3v13M15 21h6V10l-6-2" /></svg>
            </div>
            <p className="eyebrow">Digital Twin and Smart Buildings, interactive</p>
            <h2 className="display mt-2 text-3xl md:text-4xl"><a href="/case-study/" className="after:absolute after:inset-0">From physical assets to autonomous operations</a></h2>
            <p className="mt-3 max-w-2xl text-ink/90">An animated, interactive walkthrough of how a building becomes a decision support system, from fragmented data to a supervised closed loop.</p>
          </article>
        </Reveal>
        {caseStudies.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
            <article className="card group relative p-7 transition hover:-translate-y-1 hover:border-accent/60 md:p-10">
              <div className="mb-6"><ProjectCover index={i + 1} tech={[]} title={c.title} slug={c.slug} /></div>
              <p className="eyebrow">{c.category}</p>
              <h2 className="display mt-2 text-3xl md:text-4xl"><Link href={`/case-studies/${c.slug}/`} className="after:absolute after:inset-0">{c.title}</Link></h2>
              <p className="mt-3 max-w-2xl text-ink/90">{c.blurb}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-soft">{c.flow.map((f, k) => <span key={f} className="flex items-center gap-2"><span className="rounded-full bg-tint px-3 py-1 font-medium text-ink">{f}</span>{k < c.flow.length - 1 && <span aria-hidden className="text-accent">→</span>}</span>)}</div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
