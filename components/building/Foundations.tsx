"use client";
import { useState } from "react";
import { Tag, type TagKind } from "./Tag";

type Tab = { id: string; label: string; tag: TagKind; body: React.ReactNode };
const li = "rounded-xl bg-white/5 p-3 text-[15px] leading-relaxed text-ink/90";

const TABS: Tab[] = [
  {
    id: "integration", label: "Integration", tag: "industry",
    body: (
      <div className="grid gap-3 md:grid-cols-2">
        <p className={li}><b className="text-ink">BMS and protocols.</b> The supervisory system is usually the richest source of plant data and the gatekeeper for any control action. BACnet is common in building automation, Modbus in meters and plant, MQTT for lightweight device telemetry; KNX appears in some room level systems.</p>
        <p className={li}><b className="text-ink">Gateways and normalization.</b> Gateways translate field protocols and keep operational technology separated from IT. Names, units, sampling and meaning are made consistent and tied to the asset model. Every value carries its age, source and a confidence flag.</p>
        <p className={li}><b className="text-ink">Existing building realities.</b> Undocumented points, inconsistent naming, mixed firmware, intermittent links and limited write access. A hardware agnostic approach that works with legacy systems is the realistic path.</p>
        <p className={li}><b className="text-ink">Safe control boundary.</b> A short list of permitted points, limited ranges, rate limits, fallback to existing BMS logic and a full audit trail. Read before write: observation earns the right to recommend, and recommendation earns the right to act. <Tag kind="proposed" /></p>
      </div>
    ),
  },
  {
    id: "views", label: "Product views", tag: "proposed",
    body: (
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["A · Spatial operations", "Facility or operations manager", "Where is something changing, and which equipment is involved?", "Building view, zone conditions, equipment health, contextual overlays."],
          ["B · Operational intelligence", "Operations engineer or BMS specialist", "What is happening, and what could be causing it?", "Incident context, affected assets, trends, possible causes with evidence."],
          ["C · Decision and verification", "Authorized operator or building manager", "What should we do, and did it work?", "Option comparison, constraints, expected effect, observed result."],
        ].map(([t, u, q, s]) => (
          <div key={t} className={li}><b className="text-ink">{t}</b><br /><span className="text-soft">{u}</span><br />{q}<br /><span className="text-soft">Shows: {s}</span></div>
        ))}
        <p className="text-xs text-soft md:col-span-3">Conceptual views, illustrative only. They are not screenshots of a working application and are not modeled on any existing product.</p>
      </div>
    ),
  },
  {
    id: "scale", label: "Scale and lifecycle", tag: "author",
    body: (
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Establish the foundation", "Stages 1 and 2", "Access to drawings, BIM or survey data; naming standards; owner scope decisions.", "Outdated as built information; inconsistent asset naming.", "Model to site spot checks and asset register reconciliation."],
          ["Connect and verify", "Stages 3 to 5", "BMS access; network and cybersecurity approval; gateway availability.", "Undocumented points, unstable links, vendor access limits.", "Point to point tests, freshness rules, operator sign off."],
          ["Prove and scale", "Stages 6 to 8", "A baseline period, agreed success measures, clear authority for control action.", "Plausible but wrong recommendations, limited trust, drift.", "Back testing, supervised trials, agreed before and after method, audit review."],
        ].map(([t, s, d, r, v]) => (
          <div key={t} className={li}><b className="text-ink">{t}</b> <span className="text-soft">{s}</span><br /><b>Depends on:</b> {d}<br /><b>Risks:</b> {r}<br /><b>Validation:</b> {v}</div>
        ))}
        <p className="text-xs text-soft md:col-span-3">A conceptual lifecycle. It carries no timelines and no performance claims.</p>
      </div>
    ),
  },
];

export function Foundations() {
  const [i, setI] = useState(0);
  const t = TABS[i];
  return (
    <div>
      <div role="tablist" aria-label="How the foundation works" className="flex flex-wrap gap-2">
        {TABS.map((x, k) => (
          <button key={x.id} role="tab" id={`tab-${x.id}`} aria-selected={k === i} aria-controls={`panel-${x.id}`} tabIndex={k === i ? 0 : -1} type="button" onClick={() => setI(k)}
            onKeyDown={(e) => { if (e.key === "ArrowRight") setI((i + 1) % TABS.length); if (e.key === "ArrowLeft") setI((i + TABS.length - 1) % TABS.length); }}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${k === i ? "border-accent bg-accent/15 text-accent" : "border-white/15 text-soft hover:text-ink"}`}>{x.label}</button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} className="mt-4">
        <div className="mb-3"><Tag kind={t.tag} /></div>
        {t.body}
      </div>
    </div>
  );
}
