import Image from "next/image";
import Link from "next/link";
import { aldarProjects, disruptxProjects } from "@/content/data";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";

export function DeliveryProjects() {
  return (
    <>
      <section className="wrap py-10">
        <Reveal>
          <div className="flex items-center gap-4"><Logo id="disruptx" name="Disrupt-X" size={44} /><div><p className="eyebrow">Disrupt-X</p><h2 className="display text-3xl md:text-4xl">Key projects.</h2></div></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {disruptxProjects.map((p) => (
              <article key={p.name} className="card group relative overflow-hidden">
                <Image src={`/img/projects/${p.img}.webp`} alt={p.name} width={900} height={560} className="h-44 w-full object-cover sm:h-48" />
                <div className="p-5"><h3 className="display text-xl"><Link href={`/projects/${p.slug}/`} className="after:absolute after:inset-0">{p.name}</Link></h3><p className="mt-1 text-sm text-soft">{p.scope}</p><span aria-hidden className="mt-3 inline-block text-sm text-accent transition group-hover:translate-x-1">Read the project →</span></div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="wrap py-10">
        <Reveal>
          <div className="flex items-center gap-4"><Logo id="aldar" name="Aldar" size={44} /><div><p className="eyebrow">Aldar</p><h2 className="display text-3xl md:text-4xl">Smart city and digital transformation.</h2></div></div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {aldarProjects.map((p) => (
              <article key={p.name} className="card flex flex-col overflow-hidden sm:flex-row">
                {p.img && <Image src={`/img/projects/${p.img}.webp`} alt={p.name} width={900} height={560} className="h-40 w-full object-cover sm:h-auto sm:w-40 sm:shrink-0" />}
                <div className="p-5"><h3 className="display text-xl">{p.name}</h3><p className="mt-2 text-sm leading-relaxed text-ink/90">{p.body}</p></div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
