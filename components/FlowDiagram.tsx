"use client";
import { motion } from "motion/react";

export function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3 md:flex md:items-stretch md:gap-0">
      {steps.map((s, i) => (
        <motion.li key={s} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.12, duration: 0.5 }} className="flex items-center md:flex-1">
          <div className="card flex w-full items-center gap-3 p-4 md:flex-col md:items-start md:gap-2">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${i === steps.length - 1 ? "bg-accent text-onaccent" : "bg-accent/10 text-accent"}`}>{i + 1}</span>
            <span className="text-sm font-semibold leading-snug">{s}</span>
          </div>
          {i < steps.length - 1 && <span aria-hidden className="mx-1 hidden text-xl text-accent md:block">→</span>}
        </motion.li>
      ))}
    </ol>
  );
}
