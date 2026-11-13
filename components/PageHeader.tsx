import { Reveal } from "./Reveal";
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="wrap pb-6 pt-16 md:pt-24">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-3 max-w-3xl text-[clamp(2.4rem,7vw,4.5rem)]">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/90">{intro}</p>}
      </Reveal>
    </section>
  );
}
