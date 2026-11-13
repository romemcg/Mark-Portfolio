import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, caseStudies } from "@/content/data";
import { StatusBadge } from "@/components/StatusBadge";
import { Reveal } from "@/components/Reveal";
import { ProjectCover } from "@/components/ProjectCover";
import { TechIcon } from "@/components/Icons";
import { FlowDiagram } from "@/components/FlowDiagram";
import { PrdSections } from "@/components/PrdSections";
import { prds } from "@/content/prd";

export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.blurb, alternates: { canonical: `/projects/${p.slug}/` } } : {};
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <Reveal><section className="border-t border-line/10 py-8"><h2 className="display text-2xl">{title}</h2><div className="prose-s mt-3">{children}</div></section></Reveal>;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const prd = prds[p.slug];
  const kids = projects.filter((x) => x.parent === p.slug);
  const parent = p.parent ? projects.find((x) => x.slug === p.parent) : undefined;
  const list = (a?: string[]) => a && <ul>{a.map((x) => <li key={x}>{x}</li>)}</ul>;
  return (
    <article className="wrap max-w-5xl pb-10 pt-16 md:pt-24"><div className="max-w-3xl">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm"><Link href="/projects/" className="text-soft hover:text-accent">← All projects</Link>{parent && <Link href={`/projects/${parent.slug}/`} className="text-soft hover:text-accent">Part of {parent.name}</Link>}</div>
      <div className="mt-6 flex items-center gap-3"><StatusBadge status={p.status} /><span className="text-sm text-soft">{p.period} · {p.type}</span></div>
      <h1 className="display mt-3 text-[clamp(2.4rem,7vw,4.2rem)]">{p.name}</h1>
      {!p.gallery && <div className="mt-6"><ProjectCover index={projects.indexOf(p)} tech={p.tech} title={p.name} slug={p.slug} /></div>}
      <p className="mt-4 text-xl text-ink/90">{p.blurb}</p>
      {p.links?.some((l) => l.label.startsWith("Live")) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {p.links.filter((l) => l.label.startsWith("Live")).map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-accent !px-6 !py-3">{l.label.startsWith("Live demo") ? "Open the live demo" : "Open the live platform"} <span aria-hidden>↗</span></a>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-1.5">{p.tech.map((t) => <span key={t} className="chip gap-1.5"><TechIcon name={t} className="h-3 w-3" />{t}</span>)}</div>
      {p.shot && (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.shot.src} alt={p.shot.alt} width={412} height={800} loading="lazy" className="mx-auto h-auto w-full max-w-[260px] rounded-[2rem] shadow-lg" />
          <figcaption className="mt-3 text-center text-sm text-soft">{p.shot.caption}</figcaption>
        </figure>
      )}
      </div>
      {p.gallery && (
        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
          {p.gallery.map((g, i) => (
            <Reveal key={g.src}>
              <figure className={i === 0 ? "md:col-span-2" : ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} width={1600} height={1000} sizes={i === 0 ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw"} decoding="async" loading={i === 0 ? "eager" : "lazy"} className="aspect-[16/10] h-auto w-full rounded-xl border border-line/10 object-cover object-top shadow-lg sm:rounded-2xl" />
                <figcaption className="mt-2 text-center text-xs text-soft sm:text-sm">{g.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
      <div className="mt-8 max-w-3xl">
        {p.flow && <Block title="The flow"><div className="not-prose"><FlowDiagram steps={p.flow} /></div></Block>}
        {p.problem && <Block title="The problem"><p>{p.problem}</p></Block>}
        {!prd && p.users && <Block title="Who it is for"><p>{p.users}</p></Block>}
        {p.role && <Block title="My role"><p>{p.role}</p></Block>}
        {!prd && p.features && <Block title="What it does">{list(p.features)}</Block>}
        {!prd && p.approach && <Block title="Approach">{list(p.approach)}</Block>}
        {p.decisions && <Block title="Product decisions">{list(p.decisions)}</Block>}
        {p.challenges && <Block title="Challenges and what I learned">{list(p.challenges)}</Block>}
        {p.results && <Block title="Results">{list(p.results)}</Block>}
        {!prd && p.roadmap && <Block title="What is next">{list(p.roadmap)}</Block>}
      </div>
      {prd && <PrdSections prd={prd} />}
      {kids.length > 0 && (
        <div className="mt-8"><h2 className="display text-2xl">Key projects</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{kids.map((c) => (
            <Link key={c.slug} href={`/projects/${c.slug}/`} className="card block p-4 hover:-translate-y-1 transition"><p className="font-semibold">{c.name}</p><p className="mt-1 text-sm text-soft">{c.blurb}</p></Link>
          ))}</div></div>
      )}
      <div className="mt-8 max-w-3xl">
        {p.caseStudies && (
          <Block title="Related case studies">
            <ul>{p.caseStudies.map((cs) => { const c = caseStudies.find((x) => x.slug === cs); return c && <li key={cs}><Link className="underline decoration-accent" href={`/case-studies/${cs}/`}>{c.title}</Link></li>; })}</ul>
          </Block>
        )}
        {p.links && <Block title="Links"><ul>{p.links.map((l) => <li key={l.href}><a className="underline decoration-accent" href={l.href}>{l.label}</a></li>)}</ul></Block>}
      </div>
    </article>
  );
}
