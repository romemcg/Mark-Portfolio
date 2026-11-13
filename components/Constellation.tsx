"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { capabilities } from "@/content/data";

const W = 760, H = 460, CX = W / 2, CY = H / 2, RX = 240, RY = 165;
const SHORT: Record<string, string> = { product: "Product Strategy", delivery: "Delivery", systems: "Systems Thinking", analysis: "Business Analysis", platforms: "Platforms", research: "Prototyping", stakeholders: "Stakeholders", data: "Data", iot: "IoT and AIoT", business: "Business" };
const pos = capabilities.map((c, i) => {
  const a = (i / capabilities.length) * Math.PI * 2 - Math.PI / 2;
  return { id: c.id, x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
});
const P = Object.fromEntries(pos.map((p) => [p.id, p]));

export function Constellation() {
  const [active, setActive] = useState(capabilities[0].id);
  const cur = capabilities.find((c) => c.id === active)!;
  const edges: [string, string][] = [];
  capabilities.forEach((c) => c.links.forEach((l) => { if (c.id < l) edges.push([c.id, l]); else if (!capabilities.find((x) => x.id === l)!.links.includes(c.id)) edges.push([l, c.id]); }));
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="card p-2 md:p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Skills constellation. Select a capability to see the evidence.">
          {edges.map(([a, b], i) => {
            const hot = a === active || b === active;
            return <motion.line key={i} x1={P[a].x} y1={P[a].y} x2={P[b].x} y2={P[b].y} stroke="rgb(var(--accent))" strokeWidth={hot ? 2.5 : 1} strokeOpacity={hot ? 0.9 : 0.25} animate={{ strokeOpacity: hot ? 0.9 : 0.25 }} />;
          })}
          {capabilities.map((c) => {
            const p = P[c.id];
            const on = c.id === active;
            const linked = cur.links.includes(c.id);
            const left = p.x < CX - 20, right = p.x > CX + 20;
            const anchor = left ? "end" : right ? "start" : "middle";
            const dx = left ? -16 : right ? 16 : 0;
            const dy = !left && !right ? (p.y < CY ? -18 : 28) : 5;
            return (
              <g key={c.id} role="button" tabIndex={0} aria-pressed={on} aria-label={c.name} onClick={() => setActive(c.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(c.id); } }} style={{ cursor: "pointer" }}>
                <motion.circle cx={p.x} cy={p.y} r={on ? 13 : linked ? 10 : 8} fill={on ? "rgb(var(--accent))" : "rgb(var(--bg))"} stroke="rgb(var(--accent))" strokeWidth={2.5} animate={{ r: on ? 13 : linked ? 10 : 8 }} whileHover={{ scale: 1.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                <text x={p.x + dx} y={p.y + dy} textAnchor={anchor} fontSize="14" fontWeight={on ? 700 : 500} fill="rgb(var(--ink))">{SHORT[c.id]}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 lg:hidden" role="group" aria-label="Capabilities">
        {capabilities.map((c) => <button key={c.id} onClick={() => setActive(c.id)} aria-pressed={c.id === active} className={`chip ${c.id === active ? "border-accent text-accent" : ""}`}>{c.name}</button>)}
      </div>
      <div className="card p-6" aria-live="polite">
        <p className="eyebrow">Capability</p>
        <h3 className="display mt-1 text-3xl">{cur.name}</h3>
        <p className="mt-1 text-soft">{cur.short}</p>
        <p className="mt-5 text-sm font-semibold">Where it shows up</p>
        <ul className="mt-2 space-y-2">
          {cur.evidence.map((e) => <li key={e} className="flex gap-2 text-ink/85"><span aria-hidden className="text-accent">✦</span>{e}</li>)}
        </ul>
        <p className="mt-5 text-sm font-semibold">Connected to</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cur.links.map((l) => { const t = capabilities.find((x) => x.id === l)!; return <button key={l} onClick={() => setActive(l)} className="chip hover:border-accent hover:text-accent">{t.name}</button>; })}
        </div>
      </div>
    </div>
  );
}
