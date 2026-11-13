import { ProjectCover } from "@/components/ProjectCover";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/content/data";
import { Reveal } from "@/components/Reveal";
import { FlowDiagram } from "@/components/FlowDiagram";

export function generateStaticParams() { return caseStudies.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const c = caseStudies.find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.blurb, alternates: { canonical: `/case-studies/${c.slug}/` } } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();
  const Sec = ({ t, children }: { t: string; children: React.ReactNode }) => <Reveal><section className="border-t border-line/10 py-8"><h2 className="display text-2xl">{t}</h2><div className="prose-s mt-3">{children}</div></section></Reveal>;
  const ul = (a: string[]) => <ul>{a.map((x) => <li key={x}>{x}</li>)}</ul>;
  return (
    <article className="wrap max-w-3xl pb-10 pt-16 md:pt-24">
      <Link href="/case-studies/" className="text-sm text-soft hover:text-accent">← All case studies</Link>
      <p className="eyebrow mt-6">{c.category}</p>
      <div className="mb-8"><ProjectCover index={caseStudies.indexOf(c) + 1} tech={[]} title={c.title} slug={c.slug} /></div>
      <h1 className="display mt-2 text-[clamp(2.2rem,6vw,3.8rem)]">{c.title}</h1>
      <p className="mt-3 text-soft">{c.context}</p>
      {c.studio && <div className="mt-6 rounded-2xl border border-line/10 bg-tint p-5"><p className="eyebrow">My role</p><p className="mt-2 text-sm text-ink">{c.studio.role}</p></div>}
      <div className="mt-8">
        <Reveal><div className="mb-2 rounded-[1.5rem] bg-tint p-5 md:p-8"><FlowDiagram steps={c.flow} /></div></Reveal>
        <Sec t="The problem"><p>{c.problem}</p></Sec>
        {c.studio && <Sec t="The hypothesis"><p>{c.studio.hypothesis}</p></Sec>}
        <Sec t="What I did">{ul(c.approach)}</Sec>
        {c.studio && <Sec t="How the workflow fits together">
          <p>This is the working process at a conceptual level. The connections represent human-directed handoffs between AI capabilities.</p>
          <ol className="mt-5 space-y-5 list-none pl-0">{c.studio.workflow.map((step) => <li key={step.title} className="rounded-2xl border border-line/10 bg-tint p-5"><h3 className="font-semibold text-ink">{step.title}</h3><p className="mt-2">{step.description}</p></li>)}</ol>
        </Sec>}
        <Sec t="Decisions and trade offs">{ul(c.decisions)}</Sec>
        {c.studio && <Sec t="Outputs and current status">
          <div className="grid gap-4 sm:grid-cols-2">{c.studio.outputs.map((output) => <div key={output.title} className="rounded-2xl border border-line/10 p-5"><p className="text-xs font-semibold uppercase tracking-wide text-accent">{output.status}</p><h3 className="mt-2 font-semibold text-ink">{output.title}</h3><p className="mt-2">{output.description}</p></div>)}</div>
        </Sec>}
        <Sec t="Outcome">{ul(c.outcome)}</Sec>
        {c.studio && <Sec t="Challenges and limits">{ul(c.studio.challenges)}</Sec>}
        <Sec t="What I took from it"><p>{c.learned}</p></Sec>
        {c.studio && <Sec t="Future roadmap">{ul(c.studio.roadmap)}</Sec>}
      </div>
    </article>
  );
}
