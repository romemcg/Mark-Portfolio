import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { recommendations } from "@/content/data";

export const metadata: Metadata = { title: "Recommendations", description: "What colleagues and partners say about working with Mark Gomez.", alternates: { canonical: "/recommendations/" } };

const initials = (n: string) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

export default function Recommendations() {
  return (
    <>
      <PageHeader eyebrow="Recommendations" title="What people say." intro="Words from colleagues, leaders and partners I have worked with, as written on LinkedIn." />
      <section className="wrap py-8">
        <div className="grid gap-5 md:grid-cols-2">
          {recommendations.map((r, i) => (
            <Reveal key={r.name} delay={(i % 2) * 0.07}>
              <figure className="card flex h-full flex-col p-7">
                <blockquote className="flex-1 leading-relaxed text-ink/85">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span aria-hidden className="orb grid h-11 w-11 place-items-center rounded-full text-sm font-semibold text-white">{initials(r.name)}</span>
                  <span><span className="block font-semibold">{r.name}</span><span className="block text-sm text-soft">{r.role}{r.org ? `, ${r.org}` : ""}</span></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
