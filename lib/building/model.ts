// Shared, framework-free model for the Digital Twin case study: stages, simulated telemetry and the
// AHU abnormal-temperature scenario. Everything here is SIMULATED / illustrative, never a measurement.

export type Health = "ok" | "warn" | "fault" | "recover";
export type BuildingState = { ahu3: Health; zone3b: Health; chiller: Health };

export const STAGE_COUNT = 8; // 0 intro, 1 assets, 2 telemetry, 3 context, 4 anomaly, 5 reasoning, 6 action, 7 scenario

// Visual health for the narrative stages (the scenario overrides this at stage 7).
export function stateForStage(i: number): BuildingState {
  if (i < 3.5) return { ahu3: "ok", zone3b: "ok", chiller: "ok" };
  if (i < 4.5) return { ahu3: "fault", zone3b: "warn", chiller: "ok" };
  if (i < 5.5) return { ahu3: "fault", zone3b: "fault", chiller: "ok" };
  if (i < 6.5) return { ahu3: "recover", zone3b: "recover", chiller: "ok" };
  return { ahu3: "ok", zone3b: "ok", chiller: "ok" };
}

// ---- Simulated telemetry (invented values, always shown with a "simulated" label)
export type Readout = { id: string; title: string; lines: string[] };
export function readouts(s: BuildingState): Record<string, Readout> {
  const ahuT = { ok: "13.1", warn: "15.6", fault: "17.8", recover: "14.4" }[s.ahu3];
  const ahuSt = { ok: "Normal", warn: "Drifting", fault: "Abnormal vs own history", recover: "Recovering" }[s.ahu3];
  const co2 = { ok: "640", warn: "910", fault: "1,180", recover: "820" }[s.zone3b];
  const zt = { ok: "23.1", warn: "24.6", fault: "26.4", recover: "24.8" }[s.zone3b];
  const occ = s.zone3b === "ok" ? "38" : "64";
  return {
    ahu3: { id: "ahu3", title: "AHU 03", lines: [`Supply air ${ahuT} °C`, ahuSt] },
    zone3b: { id: "zone3b", title: "Zone 3B · Floor 3", lines: [`CO₂ ${co2} ppm`, `${zt} °C · ${occ} people`] },
    chiller: { id: "chiller", title: "CH 01 · Chilled water", lines: ["Supply 6.4 °C", "Load within range"] },
    asset: { id: "asset", title: "Asset record · AHU-03", lines: ["Roof plant · serves Floor 3", "Linked to BMS point list"] },
    spatial: { id: "spatial", title: "Spatial model", lines: ["Site › Building › Floor 3 › 3B"] },
  };
}

// ---- Scenario state machine: "AHU 03 supply air temperature drifts high" (simulated)
export type Phase = "ready" | "detected" | "context" | "options" | "applied";
export type OptionId = "valve" | "reset" | "hold";
export type Option = { id: OptionId; label: string; detail: string; effect: string; risk: string };

export const OPTIONS: Option[] = [
  { id: "valve", label: "Raise chilled water valve limit by 10%", detail: "Inside the permitted point list and rate limit.", effect: "Supply air returns toward set point in about 12 min (simulated).", risk: "Slightly higher plant load. Needs operator approval." },
  { id: "reset", label: "Reset AHU 03 set point and re-check", detail: "Low impact, reversible, fully audited.", effect: "Partial recovery in about 20 min; CO₂ stays elevated longer (simulated).", risk: "May not clear an underlying fault." },
  { id: "hold", label: "Hold, and raise a work order", detail: "No control action. Escalate to a technician.", effect: "Zone 3B stays out of range until the visit (simulated).", risk: "Comfort impact continues; safest for equipment." },
];

export const PHASE_ORDER: Phase[] = ["ready", "detected", "context", "options", "applied"];

export const SCENARIO_TEXT: Record<Phase, { title: string; body: string }> = {
  ready: { title: "Ready to run", body: "A simulated afternoon. Nothing here is a measurement and nothing is connected to a real building." },
  detected: { title: "What is detected", body: "AHU 03 supply air runs 4.7 °C above its own typical value for this load. Six unrelated alarms would normally fire around it." },
  context: { title: "What it touches", body: "The model links AHU 03 to Floor 3, so zones 3A, 3B and 3C depend on it. Zone 3B is west facing and crowded, with CO₂ at 1,180 ppm." },
  options: { title: "Available responses", body: "Candidates are checked against the safe control boundary. An authorized operator chooses. Nothing executes by itself." },
  applied: { title: "Simulated result", body: "The building state updates as the response takes effect. Later conditions are then compared with the intended outcome." },
};

export function stateForScenario(phase: Phase, choice: OptionId | null, recovered: boolean): BuildingState {
  if (phase === "ready") return { ahu3: "ok", zone3b: "ok", chiller: "ok" };
  if (phase === "detected") return { ahu3: "fault", zone3b: "warn", chiller: "ok" };
  if (phase === "context" || phase === "options") return { ahu3: "fault", zone3b: "fault", chiller: "ok" };
  if (choice === "hold" || !choice) return { ahu3: "fault", zone3b: "fault", chiller: "ok" };
  if (choice === "reset") return recovered ? { ahu3: "recover", zone3b: "recover", chiller: "ok" } : { ahu3: "fault", zone3b: "fault", chiller: "ok" };
  return recovered ? { ahu3: "ok", zone3b: "ok", chiller: "ok" } : { ahu3: "recover", zone3b: "recover", chiller: "ok" };
}

// Supply-air temperature trace (simulated), one point per simulated minute, up to minute `t`.
export function trace(phase: Phase, choice: OptionId | null, t: number): number[] {
  const out: number[] = [];
  const faulty = phase !== "ready";
  const rate = choice === "valve" ? 12 : choice === "reset" ? 20 : 0;
  for (let m = 0; m <= 30; m++) {
    let v = 13.1 + 0.12 * Math.sin(m * 0.9);
    if (faulty && m > 6) v += Math.min(4.7, (m - 6) * 0.8);
    if (phase === "applied" && rate && m > 14) v -= (v - 13.4) * Math.min(1, (m - 14) / rate);
    out.push(m <= t ? v : NaN);
  }
  return out;
}
