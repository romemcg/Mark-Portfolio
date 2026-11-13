import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { now, site } from "@/content/data";

export const metadata: Metadata = { title: "Now", description: "What Mark Gomez is building, learning and focused on right now.", alternates: { canonical: "/now/" } };

export default function Now() {
  const Col = ({ t, items }: { t: string; items: string[] }) => (
    <Reveal><div className="card h-full p-6"><h2 className="display text-2xl">{t}</h2><ul className="mt-3 space-y-2">{items.map((i) => <li key={i} className="flex gap-2"><span aria-hidden className="text-accent">✦</span>{i}</li>)}</ul></div></Reveal>
  );
  return (
    <>
      <PageHeader eyebrow="Now" title="What I'm doing right now." intro={now.focus} />
      <section className="wrap grid gap-5 py-8 md:grid-cols-3">
        <Col t="Building" items={now.building} />
        <Col t="Learning" items={now.learning} />
        <Col t="Recently completed" items={now.recent} />
      </section>
      <p className="wrap pb-4 text-sm text-soft">Last updated {site.updated}.</p>
    </>
  );
}
