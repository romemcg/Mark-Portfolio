"use client";
import { useEffect, useMemo, useState } from "react";
import { OPTIONS, SCENARIO_TEXT, readouts, stateForScenario, trace, type BuildingState, type OptionId, type Phase } from "@/lib/building/model";

// Simulated interactive scenario: AHU 03 supply air temperature drifts high. Clearly labelled; all values invented.
export function Scenario({ onState, reduce }: { onState: (s: BuildingState) => void; reduce: boolean }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [choice, setChoice] = useState<OptionId | null>(null);
  const [t, setT] = useState(4);
  const target = phase === "ready" ? 4 : phase === "applied" ? 30 : 14;

  useEffect(() => {
    if (reduce) { setT(target); return; }
    if (t === target) return;
    const id = window.setInterval(() => setT((v) => { const n = v + Math.sign(target - v) * 0.5; return Math.abs(target - n) < 0.5 ? target : n; }), 90);
    return () => window.clearInterval(id);
  }, [t, target, reduce]);

  const recoveredAt = choice === "valve" ? 27 : 29;
  const st = useMemo(() => stateForScenario(phase, choice, t >= recoveredAt), [phase, choice, t, recoveredAt]);
  useEffect(() => { onState(st); }, [st, onState]);

  const r = readouts(st);
  const pts = trace(phase, choice, Math.floor(t));
  const W = 260, H = 70, lo = 12, hi = 19;
  const path = pts.map((v, i) => (Number.isNaN(v) ? "" : `${i === 0 || Number.isNaN(pts[i - 1]) ? "M" : "L"}${(i / 30) * W},${H - ((v - lo) / (hi - lo)) * H}`)).join(" ");
  const txt = SCENARIO_TEXT[phase];
  const next: Partial<Record<Phase, [string, Phase]>> = { ready: ["Run the simulation", "detected"], detected: ["Show affected assets", "context"], context: ["Show available responses", "options"] };
  const reset = () => { setPhase("ready"); setChoice(null); };
  const retry = () => { setPhase("options"); setChoice(null); };

  return (
    <div className="rounded-2xl border border-accent/40 bg-[#0A162E]/90 p-4 sm:p-5" role="group" aria-label="Simulated scenario">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">Simulated scenario</span>
        <span className="text-[11px] text-soft">Invented values. Not a real building.</span>
      </div>
      <h3 className="display mt-3 text-xl" aria-live="polite">{txt.title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink/90" aria-live="polite">{txt.body}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        {[
          ["AHU 03 supply", r.ahu3.lines[0].replace("Supply air ", "")],
          ["Zone 3B CO₂", r.zone3b.lines[0].replace("CO₂ ", "")],
          ["Zone 3B temp", r.zone3b.lines[1].split(" · ")[0]],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/5 px-2 py-2"><div className="text-soft">{k}</div><div className="mt-0.5 text-sm font-semibold text-ink">{v}</div></div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H + 14}`} className="mt-3 w-full" role="img" aria-label="Simulated supply air temperature over 30 minutes">
        <line x1="0" x2={W} y1={H - ((13.4 - lo) / (hi - lo)) * H} y2={H - ((13.4 - lo) / (hi - lo)) * H} stroke="#60a5fa" strokeOpacity=".35" strokeDasharray="3 4" />
        <path d={path} fill="none" stroke={st.ahu3 === "fault" ? "#f87171" : st.ahu3 === "recover" ? "#fbbf24" : "#60a5fa"} strokeWidth="2" strokeLinejoin="round" />
        <text x="0" y={H + 11} fontSize="8" fill="#b8c6db">0 min</text><text x={W} y={H + 11} fontSize="8" fill="#b8c6db" textAnchor="end">30 min · simulated supply air °C</text>
      </svg>

      {phase === "options" && (
        <div className="mt-4 grid gap-2" role="group" aria-label="Available responses">
          {OPTIONS.map((o) => (
            <button key={o.id} type="button" onClick={() => { setChoice(o.id); setPhase("applied"); }}
              className="rounded-xl border border-white/15 bg-white/5 p-3 text-left text-sm transition hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
              <span className="block font-semibold text-ink">{o.label}</span>
              <span className="mt-0.5 block text-soft">{o.detail}</span>
              <span className="mt-1 block text-[12px] text-soft">Expected: {o.effect} Trade off: {o.risk}</span>
            </button>
          ))}
        </div>
      )}
      {phase === "applied" && choice && (
        <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-ink/90" aria-live="polite">
          <span className="font-semibold text-accent">Operator chose: </span>{OPTIONS.find((o) => o.id === choice)!.label}. {OPTIONS.find((o) => o.id === choice)!.effect}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {next[phase] && <button type="button" className="btn btn-accent !px-4 !py-2 !text-sm" onClick={() => setPhase(next[phase]![1])}>{next[phase]![0]}</button>}
        {phase !== "ready" && <button type="button" className="btn btn-ghost !px-4 !py-2 !text-sm" onClick={phase === "applied" ? retry : reset}>{phase === "applied" ? "Try another response" : "Reset"}</button>}
        {phase === "applied" && <button type="button" className="btn btn-ghost !px-4 !py-2 !text-sm" onClick={reset}>Reset</button>}
      </div>
    </div>
  );
}
