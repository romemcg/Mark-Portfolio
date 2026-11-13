"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { chapters } from "@/content/data";
import { Reveal } from "./Reveal";

const kindColor: Record<string, string> = { Origin: "#F59E0B", Education: "#8B5CF6", Work: "#2563EB", Milestone: "#16A34A", Now: "#EC4899" };

export function Timeline() {
  const [open, setOpen] = useState<string | null>("now");
  return (
    <ol className="relative ml-3 border-l-2 border-accent/40 pl-6 md:ml-6 md:pl-10">
      {chapters.map((c, idx) => {
        const isOpen = open === c.id;
        return (
          <li key={c.id} className="relative pb-8 last:pb-0">
            <span aria-hidden className={`absolute -left-[2.05rem] top-2 h-4 w-4 rounded-full border-2 border-accent transition md:-left-[3.05rem] ${isOpen ? "bg-accent scale-125" : "bg-bg"}`} />
            <Reveal delay={Math.min(idx * 0.03, 0.2)}>
              <button onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen} className="card w-full p-5 text-left transition hover:-translate-y-0.5 hover:border-accent/50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-accent">{c.year}</span>
                  <span className="chip" style={{ color: `color-mix(in srgb, ${kindColor[c.kind]} 40%, rgb(var(--ink)))`, background: `color-mix(in srgb, ${kindColor[c.kind]} 16%, transparent)`, borderColor: `color-mix(in srgb, ${kindColor[c.kind]} 45%, transparent)` }}>{c.kind}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <h3 className="display text-2xl">{c.title}</h3>
                  <span aria-hidden className={`text-xl transition ${isOpen ? "rotate-45" : ""}`}>+</span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="mt-3 leading-relaxed text-ink/90">{c.body}</p>
                      {c.words && <p className="mt-3 border-l-4 border-accent pl-3 text-lg italic leading-snug text-ink">&ldquo;{c.words}&rdquo;</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
