"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { roles } from "@/content/data";
import { Logo } from "./Logo";

type Item = { id: string; name: string; title: string; dates: string; text: string; tags?: string[]; logo?: string; next?: boolean };
const r = (id: string) => roles.find((x) => x.id === id)!;
const items: Item[] = [
  { id: "ub", name: "University of Batangas", title: "BS Electronics Engineering", dates: "2015 to 2020", text: "The engineering foundation. Licensed Electronics Engineer in April 2022." },
  { id: "samsung", name: "Samsung Electro-Mechanics", title: "Product Development Engineer, then Manager", dates: "Jul 2020 to Feb 2023", text: r("samsung").summary, tags: r("samsung").tools.slice(0, 3), logo: r("samsung").logo },
  { id: "disruptx", name: "Disrupt-X", title: "Product Engineer, then Product Manager", dates: "Mar 2023 to Oct 2024", text: r("disruptx").summary, tags: ["IoT SaaS", "UAT", "GITEX"], logo: r("disruptx").logo },
  { id: "aldar", name: "Aldar Properties", title: "Product Owner and Smart City Lead", dates: "Oct 2024 to Oct 2025", text: r("aldar").summary, tags: ["Smart community", "Multi vendor", "AED 30M+ portfolio"], logo: r("aldar").logo },
  { id: "pcu", name: "Philippine Christian University", title: "MBA with Distinction", dates: "2024 to 2025", text: "Strategy, finance, operations and entrepreneurship, studied alongside full time work." },
  { id: "terminus", name: "Terminus Group", title: "Product Manager, Enterprise AI and IoT Platforms", dates: "Oct 2025 to Aug 2026", text: r("terminus").summary, tags: ["AIoT", "AI City OS", "Digital twin", "Presales"], logo: r("terminus").logo },
];

const urls: Record<string, string> = {"samsung": "https://www.samsungsem.com", "disruptx": "https://www.disrupt-x.io", "aldar": "https://www.aldar.com", "terminus": "https://www.terminusgroup.com"};

export function CareerJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <div ref={ref} className="relative mx-auto max-w-4xl">
      <div aria-hidden className="absolute bottom-0 left-7 top-0 w-0.5 bg-line/10 md:left-1/2 md:-translate-x-1/2" />
      <motion.div aria-hidden style={{ scaleY, transformOrigin: "top" }} className="absolute bottom-0 left-7 top-0 w-0.5 bg-gradient-to-b from-accent to-blue md:left-1/2 md:-translate-x-1/2" />
      <ol className="space-y-10 md:space-y-14">
        {items.map((it, i) => {
          const right = i % 2 === 1;
          return (
            <li key={it.id} className="relative pl-20 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span aria-hidden className="absolute left-7 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-bg bg-accent shadow md:left-1/2" />
              <motion.div initial={{ opacity: 0, x: right ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                className={`card p-5 md:p-6 ${right ? "md:col-start-2" : "md:col-start-1 md:row-start-1"} ${it.next ? "!border-dashed !border-accent/60" : ""}`}>
                <div className="flex items-center gap-4">
                  <Logo id={it.id} name={it.name} size={52} />
                  <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-accent">{it.dates}</p><h3 className="display text-xl leading-tight">{urls[it.id] ? <a href={urls[it.id]} target="_blank" rel="noopener noreferrer" className="underline decoration-accent/40 underline-offset-4 hover:text-accent">{it.name}</a> : it.name}</h3></div>
                </div>
                <p className="mt-3 font-medium">{it.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/90">{it.text}</p>
                {it.tags && <div className="mt-3 flex flex-wrap gap-1.5">{it.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
