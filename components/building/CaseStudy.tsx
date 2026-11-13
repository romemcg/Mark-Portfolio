"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BuildingStage } from "./BuildingStage";
import { Scenario } from "./Scenario";
import { Foundations } from "./Foundations";
import { Tag, type TagKind } from "./Tag";
import { STAGE_COUNT, stateForStage, type BuildingState } from "@/lib/building/model";

type Step = { n: string; title: string; tags: TagKind[]; body: string; points: string[] };
const STEPS: Step[] = [
  { n: "01", title: "Physical and connected assets", tags: ["industry", "author"],
    body: "Before a platform can reason about a building, every important asset must exist digitally with a stable identity, a location, relationships and live data. That is an information problem before it is an AI problem.",
    points: ["One identifier shared by the model, the BMS point list and the maintenance record.", "BIM and IFC supply geometry plus classified asset data; ISO 19650 supplies the discipline.", "Site, building, floor, zone, room: the spatial hierarchy the rest depends on."] },
  { n: "02", title: "Sensor telemetry and operational state", tags: ["industry", "simulated"],
    body: "Existing buildings speak many dialects. Integration translates them into one trustworthy stream without asking the owner to replace what already works. Reveal the hidden layer to see the sensors behind each zone.",
    points: ["Every point is tied to the asset it describes, with units and meaning.", "Each value carries its age, source and a confidence flag.", "Readings shown here are invented for explanation."] },
  { n: "03", title: "Systems and contextual relationships", tags: ["author", "simulated"],
    body: "A reading means little alone. A CO₂ value of 1,180 ppm is a number. The same value in a crowded, west facing zone on a hot afternoon, served by a lagging air handler, is a situation. The model links the chiller to AHU 03 and AHU 03 to Floor 3.",
    points: ["Equipment to zone association turns a reading into an operational impact.", "Solar gain, occupant heat and ventilation load all end up as demand on the same plant."] },
  { n: "04", title: "Anomaly detection", tags: ["simulated"],
    body: "Six events build through the afternoon. With spatial and asset relationships in place, they connect to one zone and its serving equipment instead of raising six unrelated alarms.",
    points: ["Outdoor temperature rises, solar exposure builds on the west façade.", "Occupancy increases on Floor 3, so CO₂ rises in Zone 3B.", "HVAC demand rises at AHU 03, which behaves abnormally against its own history."] },
  { n: "05", title: "AI assisted reasoning and decision options", tags: ["author", "proposed"],
    body: "The platform correlates conditions, equipment state, spatial relationships and history, then evaluates candidate interventions against operating constraints and explains the trade offs. Reasoning that respects physical constraints is more useful than pattern matching alone.",
    points: ["Interpretation comes before recommendation.", "Each option states its expected effect and its cost."] },
  { n: "06", title: "Recommended action and outcome", tags: ["proposed"],
    body: "An authorized operator reviews, modifies or approves. Nothing executes without that step. Later conditions are compared with the intended outcome and recorded for learning, inside a safe control boundary with a full audit trail.",
    points: ["Read before write: observation earns the right to recommend, recommendation earns the right to act.", "Fallback to existing BMS logic always remains."] },
];

function usePrefersReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)"); setR(m.matches);
    const f = () => setR(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f);
  }, []);
  return r;
}

export function CaseStudy() {
  const stageRef = useRef(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<BuildingState>(stateForStage(0));
  const [xray, setXray] = useState(false);
  const [paused, setPaused] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const prefers = usePrefersReduced();
  const reduce = prefers || paused;
  const scenarioState = useRef<BuildingState | null>(null);
  const apply = useCallback(() => {
    const s = stageRef.current;
    const next = s >= 6.5 && scenarioState.current ? scenarioState.current : stateForStage(s);
    setState((p) => (p.ahu3 === next.ahu3 && p.zone3b === next.zone3b && p.chiller === next.chiller ? p : next));
  }, []);
  const onScenario = useCallback((s: BuildingState) => { scenarioState.current = s; apply(); }, [apply]);

  useEffect(() => {
    const compute = () => {
      const els = Array.from(stepsRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
      if (els.length < 2) return;
      const sticky = stickyRef.current!.getBoundingClientRect();
      const desktop = window.innerWidth >= 1024;
      const vc = desktop ? window.innerHeight * 0.5 : (Math.max(sticky.bottom, 0) + window.innerHeight) / 2;
      const c = els.map((e) => { const r = e.getBoundingClientRect(); return r.top + r.height / 2; });
      let s = 0;
      if (vc <= c[0]) s = 0; else if (vc >= c[c.length - 1]) s = els.length - 1;
      else for (let i = 0; i < c.length - 1; i++) if (vc >= c[i] && vc < c[i + 1]) { s = i + (vc - c[i]) / (c[i + 1] - c[i]); break; }
      stageRef.current = Math.min(STAGE_COUNT - 1, s); apply();
    };
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; compute(); }); };
    compute(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [apply]);

  const jump = (i: number) => { const el = stepsRef.current?.querySelector<HTMLElement>(`[data-step="${i}"]`); el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); };

  return (
    <div className="mx-auto w-full max-w-[1360px] px-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
        <Link href="/case-studies/" className="text-sm text-soft hover:text-ink">&larr; All case studies</Link>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={xray} onClick={() => setXray((v) => !v)} disabled={!webgl}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40 ${xray ? "border-accent bg-accent/15 text-accent" : "border-white/20 text-ink/90 hover:border-accent"}`}>
            {xray ? "Hide operational layer" : "Show operational layer"}
          </button>
          <button type="button" aria-pressed={paused} onClick={() => setPaused((v) => !v)} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-ink/90 transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
            {paused ? "Resume motion" : "Pause motion"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-x-10 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* pinned stage: top on mobile, right column on desktop */}
        <div className="sticky top-16 z-10 order-1 lg:static lg:z-auto lg:order-2">
          <div ref={stickyRef} className="h-[42svh] min-h-[250px] border-b border-white/10 bg-[#070E1C] lg:sticky lg:top-16 lg:h-[calc(100svh-5rem)] lg:rounded-3xl lg:border lg:bg-[#070E1C]/55">
            <BuildingStage stageRef={stageRef} state={state} xray={xray} reduce={reduce} onReady={setWebgl} />
            <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-[11px] leading-snug text-soft">
              <span className="hidden [@media(hover:hover)]:inline">Move your cursor over the building to reveal the hidden operational layer. Drag to look around.</span>
              <span className="[@media(hover:hover)]:hidden">Touch the building to reveal the hidden operational layer.</span>{" "}Conceptual model, simulated values.
            </p>
          </div>
        </div>

        <div ref={stepsRef} className="order-2 lg:order-1">
          <section data-step="0" className="flex min-h-[58svh] flex-col justify-center py-10 lg:min-h-[calc(100svh-5rem)]">
            <p className="eyebrow">Independent technical case study</p>
            <h1 className="display mt-3 text-4xl uppercase sm:text-5xl lg:text-[3.4rem]">From physical assets to autonomous operations</h1>
            <p className="mt-5 text-lg text-soft">Designing the information, integration and operational workflows behind intelligent buildings.</p>
            <div className="mt-6 border-l-4 border-accent pl-4">
              <p className="eyebrow !text-[11px]">The central question</p>
              <p className="mt-1 text-lg text-ink">What does it take to transform a physical building into a trustworthy, context aware, intelligent operational environment?</p>
            </div>
            <p className="mt-6 text-ink"><b>Mark Jerome Gomez</b><br /><span className="text-soft">Product Manager and Licensed Electronics Engineer · IoT, smart infrastructure and digital twin platforms</span></p>
            <p className="mt-4 text-xs leading-relaxed text-soft">Independent technical case study, November 2026. A personal conceptual case study based on publicly available information and general solution design principles. All proposed capabilities and interface illustrations are illustrative and are not evidence of a deployed solution.</p>
            <p className="mt-6 text-sm text-accent" aria-hidden>Scroll to follow one building through six stages ↓</p>
          </section>

          {STEPS.map((s, i) => (
            <section key={s.n} data-step={i + 1} aria-labelledby={`st-${s.n}`} className="flex min-h-[62svh] items-center py-6 lg:min-h-[80svh]">
              <div className="rounded-2xl border border-white/10 bg-[#0A162E]/85 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">Stage {s.n}</span>{s.tags.map((t) => <Tag key={t} kind={t} />)}</div>
                <h2 id={`st-${s.n}`} className="display mt-2 text-2xl sm:text-3xl">{s.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/90">{s.body}</p>
                <ul className="mt-3 grid gap-1.5 text-[14px] leading-relaxed text-soft">{s.points.map((p) => <li key={p} className="flex gap-2"><span aria-hidden className="text-accent">›</span><span>{p}</span></li>)}</ul>
              </div>
            </section>
          ))}

          <section data-step="7" aria-labelledby="st-sim" className="flex min-h-[70svh] items-center py-6 lg:min-h-[90svh]">
            <div className="w-full">
              <div className="mb-3 flex flex-wrap items-center gap-2"><span className="eyebrow">Interactive</span><Tag kind="simulated" /></div>
              <h2 id="st-sim" className="display mb-3 text-2xl sm:text-3xl">Try it: AHU 03 runs warm</h2>
              <Scenario onState={onScenario} reduce={reduce} />
            </div>
          </section>
        </div>
      </div>

      {/* quick stage navigation, keyboard friendly */}
      <nav aria-label="Jump to stage" className="mx-auto mt-2 flex flex-wrap justify-center gap-2 pb-6 text-xs">
        {["Intro", "Assets", "Telemetry", "Context", "Anomaly", "Reasoning", "Action", "Scenario"].map((l, i) => (
          <button key={l} type="button" onClick={() => jump(i)} className="rounded-full border border-white/15 px-3 py-1.5 text-soft transition hover:border-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">{l}</button>
        ))}
      </nav>

      <section className="mx-auto max-w-5xl py-14" aria-labelledby="found">
        <p className="eyebrow">Beneath the model</p>
        <h2 id="found" className="display mt-2 text-3xl sm:text-4xl">What makes it trustworthy</h2>
        <p className="mt-3 max-w-3xl text-ink/90">Intelligence on top of a building is only as good as the foundation under it. Three views of that foundation, kept short.</p>
        <div className="mt-6"><Foundations /></div>
      </section>

      <section className="mx-auto max-w-5xl pb-16" aria-labelledby="how">
        <h2 id="how" className="display text-2xl sm:text-3xl">How to read this study</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {([["industry", "Established and publicly documented."], ["author", "My own conceptual reasoning."], ["simulated", "Invented for explanation, not a measurement or a deployed solution."], ["proposed", "A design consideration I suggest, not an existing product."]] as [TagKind, string][]).map(([k, t]) => (
            <div key={k} className="rounded-xl bg-white/5 p-3 text-sm text-ink/90"><Tag kind={k} /><p className="mt-2">{t}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl pb-16" aria-labelledby="align">
        <p className="eyebrow">Professional alignment</p>
        <h2 id="align" className="display mt-2 text-3xl">Connecting engineering, product thinking and real operations</h2>
        <p className="mt-3 max-w-3xl text-ink/90">This study reflects how I approach intelligent building problems: start from physical truth, respect the systems that already exist, and design for the people who must trust the result.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            ["Aldar Properties", "Oct 2024 to Oct 2025", "Product Owner and Smart City Lead", "Smart city and connected infrastructure initiatives, including building platforms at Saadiyat Grove, digital twin related integrations, smart parking and command and control environments."],
            ["Terminus Group", "Oct 2025 to Aug 2026", "Product Manager, Enterprise AI and IoT Platforms", "AIoT and smart city platform strategy, connected product requirements, solution evaluation and predictive maintenance use cases."],
            ["Disrupt-X", "Mar 2023 to Oct 2024", "Product Engineer, then Product Manager", "IoT platforms, connected devices, telemetry and platform workflows for facility management."],
          ].map(([o, d, r, t]) => (
            <div key={o} className="rounded-2xl border border-white/10 bg-[#0A162E]/80 p-5 text-sm">
              <div className="flex items-baseline justify-between gap-2"><b className="text-ink">{o}</b><span className="text-[11px] text-soft">{d}</span></div>
              <div className="mt-1 font-semibold text-accent">{r}</div><p className="mt-2 text-ink/85">{t}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-soft">Foundation: BS Electronics Engineering, Licensed Electronics Engineer and MBA. Scope of this document: it describes concepts and judgment. It does not describe deliverables, ownership, results or architecture from those roles, nor any vendor&apos;s product.</p>
        <blockquote className="mt-8 border-l-4 border-accent pl-4 text-lg text-ink">The value of a digital twin is not simply in representing physical infrastructure digitally, but in enabling people to understand how interconnected systems behave, evaluate operational decisions, and act with greater confidence.</blockquote>
      </section>

      <section className="mx-auto max-w-5xl pb-20 text-xs leading-relaxed text-soft" aria-labelledby="src">
        <h2 id="src" className="text-sm font-semibold text-ink">Sources</h2>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2">
          {["ISO 19650 series, information management using building information modelling.", "buildingSMART International, Industry Foundation Classes (IFC), ISO 16739.", "ANSI/ASHRAE Standard 135, BACnet.", "Modbus Organization, Modbus Application Protocol Specification.", "OASIS, MQTT Version 5.0.", "ISO/IEC 30173:2023, Digital twin: concepts and terminology.", "IEC 62443 series, security for industrial automation and control systems.", "ANSI/ASHRAE Standard 62.1, ventilation and acceptable indoor air quality."].map((t, i) => <li key={t}>{i + 1}. {t}</li>)}
        </ol>
        <p className="mt-4">Disclaimer. A personal conceptual case study based on publicly available information and general solution design principles. All proposed capabilities and interface illustrations are illustrative and are not evidence of a deployed solution. © 2026 Mark Jerome Gomez · Independent Technical Case Study</p>
      </section>
    </div>
  );
}
