"use client";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

type Spot = "ceiling" | "rack" | "window";
const spots: { id: Spot; label: string; ok: boolean; why: string }[] = [
  { id: "ceiling", label: "Ceiling, centre of the room", ok: true, why: "Mounted where air mixes, away from heat sources. It reads what people in the room feel." },
  { id: "rack", label: "Beside the server rack", ok: false, why: "Rejected. A rack throws off heat, so the sensor would read the rack, not the room." },
  { id: "window", label: "On the window glass", ok: false, why: "Rejected. Glass follows the weather outside, so the reading would swing with the sun." },
];
const rooms = ["Private Office", "Lifts and Stairs", "Break Room", "Meeting Room", "Open Office", "IT Room"];

const heat = (t: number) => (t < 24 ? "#38BDF8" : t < 27 ? "#F59E0B" : "#F87171");

export function LikaroStats() {
  const s: [string, string][] = [["17", "use cases on one shared model"], ["6", "operations lab cases"], ["252", "unit tests passing"], ["55", "frames per second in Chrome"]];
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
      {s.map(([v, l]) => (
        <Reveal key={l}>
          <div className="card p-5 text-center">
            <p className="display text-4xl text-accent"><CountUp value={v} /></p>
            <p className="mt-1 text-xs text-soft sm:text-sm">{l}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function LikaroPlayground() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [reject, setReject] = useState<string | null>(null);
  const [gateway, setGateway] = useState(true);
  const [people, setPeople] = useState(4);
  const [auto, setAuto] = useState(false);
  const [real, setReal] = useState(23);
  const [twin, setTwin] = useState<number | null>(null);
  const [age, setAge] = useState(0);
  const last = useRef(0);
  const st = useRef({ spot, gateway, people, auto });
  st.current = { spot, gateway, people, auto };

  useEffect(() => {
    const id = setInterval(() => {
      const c = st.current;
      setReal((r) => {
        let target = 22 + c.people * 0.55;
        if (c.auto && target > 25) target = 25 + (target - 25) * 0.25;
        const n = r + (target - r) * 0.18;
        if (c.spot === "ceiling" && c.gateway) { setTwin(n); last.current = Date.now(); }
        return n;
      });
      setAge(last.current ? Math.round((Date.now() - last.current) / 1000) : 0);
    }, 500);
    return () => clearInterval(id);
  }, []);

  const placed = spot === "ceiling";
  const flowing = placed && gateway;
  const stale = placed && !gateway && age >= 3;
  const gap = twin !== null ? Math.abs(real - twin) : 0;
  const reset = () => { setSpot(null); setReject(null); setGateway(true); setPeople(4); setAuto(false); setReal(23); setTwin(null); last.current = 0; };

  let mind = "Start by placing the sensor. In the real world, where you mount a device decides whether its data means anything.";
  if (reject) mind = reject;
  else if (placed && !gateway) mind = stale ? `The gateway is unplugged. The sensor still measures the room, but nothing reaches the platform, so the twin froze ${age} seconds ago and is now ${gap.toFixed(1)} °C off. This is how a twin goes stale.` : "The gateway just lost power. The twin will keep showing its last value until you notice the data stopped.";
  else if (placed && real >= 27) mind = auto ? "It is hot, but your automation is cooling the room. Watch the reading settle." : "The room is overheating. Switch on the automation rule and the twin will trigger cooling for you.";
  else if (placed) mind = "Data is flowing. The sensor reading is linked to the Meeting Room, which is what turns a list of numbers into a twin. Now add people, or break the connection.";

  return (
    <Reveal>
      <section className="mt-10 overflow-hidden rounded-3xl border border-line/10 bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Try the mission</p>
            <h2 className="display mt-1 text-2xl sm:text-3xl">Make the Meeting Room Smart</h2>
            <p className="mt-1 max-w-xl text-sm text-soft">A small version of the first LIKARO mission. Mount a sensor, connect it, then break it and see what the digital twin does.</p>
          </div>
          <button onClick={reset} className="btn btn-ghost !px-4 !py-2 text-sm">Reset</button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <div>
              <p className="text-sm font-semibold"><span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-onaccent">1</span>Where do you mount the sensor?</p>
              <div className="mt-2 grid gap-2">
                {spots.map((s) => (
                  <button key={s.id} onClick={() => { if (s.ok) { setSpot(s.id); setReject(null); last.current = Date.now(); } else { setSpot(null); setReject(s.why); setTwin(null); last.current = 0; } }}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition ${spot === s.id ? "border-accent bg-accent/15" : "border-line/15 hover:border-accent/60"}`} aria-pressed={spot === s.id}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={placed ? "" : "pointer-events-none opacity-40"}>
              <p className="text-sm font-semibold"><span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-onaccent">2</span>Gateway power</p>
              <button onClick={() => setGateway((g) => !g)} aria-pressed={gateway} className={`mt-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${gateway ? "border-accent text-accent" : "border-[#F87171] text-[#F87171]"}`}>
                {gateway ? "Connected. Click to unplug" : "Unplugged. Click to restore"}
              </button>
            </div>
            <div className={placed ? "" : "pointer-events-none opacity-40"}>
              <p className="text-sm font-semibold"><span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-onaccent">3</span>People in the room: {people}</p>
              <input type="range" min={0} max={12} value={people} onChange={(e) => setPeople(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--accent))]" aria-label="People in the meeting room" />
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="accent-[rgb(var(--accent))]" />
                Automation: cool the room above 25 °C
              </label>
            </div>
          </div>

          <div className="lg:col-span-3">
            <svg viewBox="0 0 600 110" className="w-full" role="img" aria-label="Data path from sensor to gateway to IoT platform to digital twin">
              {[0, 1, 2].map((i) => {
                const x1 = 70 + i * 153, x2 = x1 + 153 - 0;
                const on = i === 0 ? placed : flowing;
                return <line key={i} x1={x1 + 28} y1={55} x2={x2 - 28} y2={55} strokeWidth={3} strokeDasharray={on ? "0" : "6 6"} className={on ? "stroke-accent" : "stroke-soft/50"} />;
              })}
              {[0, 1, 2].map((i) => {
                const x1 = 98 + i * 153, on = i === 0 ? placed : flowing;
                return on ? <circle key={i} r={5} className="fill-blue"><animateMotion dur="1.4s" repeatCount="indefinite" path={`M${x1} 55 L${x1 + 97} 55`} /></circle> : null;
              })}
              {["Sensor", "Gateway", "IoT platform", "Digital twin"].map((n, i) => {
                const ok = i === 0 ? placed : i === 1 ? placed && gateway : flowing;
                return (
                  <g key={n}>
                    <circle cx={70 + i * 153} cy={55} r={28} className={ok ? "fill-accent/20 stroke-accent" : "fill-card stroke-soft/50"} strokeWidth={2} />
                    <text x={70 + i * 153} y={59} textAnchor="middle" className="fill-ink" fontSize={11} fontWeight={700}>{["📡", "📶", "☁", "🏢"][i]}</text>
                    <text x={70 + i * 153} y={102} textAnchor="middle" className="fill-soft" fontSize={12}>{n}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-line/10 p-3 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-soft">Digital twin · Floor plan · Level 3</p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {rooms.map((r) => {
                    const meet = r === "Meeting Room";
                    return (
                      <div key={r} className="grid min-h-[58px] place-items-center rounded-lg border border-line/10 p-1 text-center text-[11px] leading-tight transition-colors"
                        style={meet && twin !== null ? { background: `${heat(twin)}22`, borderColor: heat(twin) } : undefined}>
                        <span>{r}{meet && <b className="mt-0.5 block text-base" style={{ color: twin !== null ? heat(twin) : undefined }}>{twin !== null ? `${twin.toFixed(1)} °C` : "no data"}</b>}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs">{!placed ? <span className="text-soft">Waiting for a sensor</span> : stale ? <span className="font-semibold text-[#F59E0B]">Stale · last update {age}s ago</span> : <span className="font-semibold text-accent">Live · updated just now</span>}</p>
              </div>
              <div className="rounded-2xl border border-line/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-soft">Real room</p>
                <p className="display mt-3 text-4xl" style={{ color: heat(real) }}>{real.toFixed(1)}<span className="text-lg"> °C</span></p>
                <p className="mt-1 text-xs text-soft">{placed && gap > 0.8 ? `Twin is ${gap.toFixed(1)} °C behind` : "What is actually happening"}</p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-accent/40 bg-accent/10 p-4" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">LIKARO Mind says</p>
              <p className="mt-1 text-sm">{mind}</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-soft">A simplified browser version of the mission. The full LIKARO runs in 3D with the same rules.</p>
      </section>
    </Reveal>
  );
}
