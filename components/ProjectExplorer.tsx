"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/content/data";
import { StatusBadge } from "./StatusBadge";
import { ProjectCover } from "./ProjectCover";
import { TechIcon } from "./Icons";

export function ProjectExplorer() {
  const types = ["All", "Personal", "Professional"];
  const [type, setType] = useState("All");
  const statuses = ["All", ...Array.from(new Set(projects.map((p) => p.status).filter(Boolean) as string[]))];
  const [status, setStatus] = useState("All");
  const list = useMemo(() => projects.filter((p) => !p.parent && (type === "All" || p.type === type) && (status === "All" || p.status === status)), [type, status]);
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${type === t ? "border-accent bg-accent text-onaccent" : "border-line/15 bg-card hover:border-accent hover:text-accent"}`}>{t === "All" ? "All types" : t}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatus(s)} aria-pressed={status === s} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${status === s ? "border-accent bg-accent text-onaccent" : "border-line/15 bg-card hover:border-accent hover:text-accent"}`}>{s === "All" ? "Any status" : s}</button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.article layout key={p.slug} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="card group relative p-6">
              <ProjectCover index={projects.indexOf(p)} tech={p.tech} title={p.name} slug={p.slug} />
              <div className="mt-5 flex items-center justify-between gap-2"><StatusBadge status={p.status} /><span className="text-xs text-soft">{p.period}</span></div>
              <h3 className="display mt-4 text-3xl"><Link href={`/projects/${p.slug}/`} className="after:absolute after:inset-0">{p.name}</Link></h3>
              <p className="mt-3 text-ink/90">{p.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">{p.tech.slice(0, 5).map((t) => <span key={t} className="chip gap-1.5"><TechIcon name={t} className="h-3 w-3" />{t}</span>)}</div>
              <span aria-hidden className="mt-5 inline-block text-accent transition group-hover:translate-x-1">Read the project →</span>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
