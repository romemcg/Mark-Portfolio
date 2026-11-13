"use client";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import type { Building } from "@/lib/building/scene";
import { readouts, type BuildingState } from "@/lib/building/model";

// Pinned 3D building. Owns one WebGL context (created lazily, only while on screen). The hidden operational layer is
// driven by the shared global mask (lib/twin/reveal.ts, owned by TechBackground), so there is a single mask system.

type Label = { key: "asset" | "ahu3" | "zone3b" | "chiller" | "spatial"; win: [number, number]; small?: boolean };
const LABELS: Label[] = [
  { key: "asset", win: [0.7, 2.3] },
  { key: "chiller", win: [2.0, 3.7], small: true },
  { key: "ahu3", win: [2.2, 7.6] },
  { key: "zone3b", win: [2.2, 7.6] },
  { key: "spatial", win: [2.8, 4.4], small: true },
];

export function BuildingStage({ stageRef, state, xray, reduce, onReady }: {
  stageRef: MutableRefObject<number>; state: BuildingState; xray: boolean; reduce: boolean; onReady?: (ok: boolean) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const live = useRef({ state, xray, reduce });
  const invalidate = useRef<() => void>(() => {});
  const [status, setStatus] = useState<"loading" | "ready" | "none">("loading");
  live.current = { state, xray, reduce };
  useEffect(() => { invalidate.current(); }, [state, xray, reduce]);

  useEffect(() => {
    const canvas = cv.current!, box = wrap.current!;
    let b: Building | null = null, raf = 0, visible = false, inView = false, disposed = false, dirty = true, loading = false;
    const gl2 = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
    if (!gl2) { setStatus("none"); onReady?.(false); return; }

    const size = () => { const r = box.getBoundingClientRect(); b?.resize(r.width, r.height); dirty = true; };
    const labelsTick = () => {
      if (!b) return;
      const mc = b.maskCenter(), s = stageRef.current;
      LABELS.forEach((l, i) => {
        const el = labelEls.current[i]; if (!el) return;
        const p = b!.project(l.key);
        let a = Math.min(1, Math.max(0, Math.min(s - l.win[0] + 0.5, l.win[1] - s + 0.5) * 1.6));
        if (live.current.xray) a = Math.max(a, 1);
        if (p && mc && mc.k > 0.05) { const d = Math.hypot(p.x - mc.x, p.y - mc.y) / mc.r; if (d < 0.8) a = Math.max(a, Math.min(1, (0.8 - d) * 3) * mc.k); }
        if (!p || !p.ok) a = 0;
        el.style.opacity = String(a); el.style.visibility = a < 0.02 ? "hidden" : "visible";
        if (p) el.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px) translate(-50%, -112%)`;
      });
    };
    const frame = (t: number) => {
      raf = 0; if (!b || !visible || disposed) return;
      const { state: st, xray: xr, reduce: rd } = live.current;
      const animating = b.render(stageRef.current, st, t, { reduce: rd, xray: xr });
      labelsTick();
      dirty = false;
      if (!rd || animating) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (visible && b && !raf && !disposed) raf = requestAnimationFrame(frame); };
    invalidate.current = () => { dirty = true; kick(); };

    const load = async () => {
      if (b || loading) return; loading = true;
      try {
        const mod = await import("@/lib/building/scene");
        if (disposed) return;
        b = mod.createBuilding(canvas); size(); setStatus("ready"); onReady?.(true); kick();
      } catch { setStatus("none"); onReady?.(false); }
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting; visible = inView && !document.hidden;
      if (visible) { void load(); kick(); } else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: "100px" });
    io.observe(box);
    const ro = new ResizeObserver(() => { size(); kick(); }); ro.observe(box);
    const onVis = () => { visible = inView && !document.hidden; if (visible) kick(); };
    document.addEventListener("visibilitychange", onVis);
    const onScroll = () => kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    // the shared mask moves with the pointer: keep drawing while it is on
    const onMove = () => kick();
    window.addEventListener("pointermove", onMove, { passive: true });
    const onLost = () => { setStatus("none"); onReady?.(false); };
    canvas.addEventListener("webglcontextlost", onLost);

    // desktop mouse drag nudges the camera a little; touch is left to the browser so scrolling always works
    let drag: { x: number; y: number } | null = null;
    const down = (e: PointerEvent) => { if (e.pointerType === "mouse" && e.button === 0) { drag = { x: e.clientX, y: e.clientY }; box.setPointerCapture(e.pointerId); box.style.cursor = "grabbing"; } };
    const move = (e: PointerEvent) => { if (drag && b) { b.nudge(e.clientX - drag.x, e.clientY - drag.y); drag = { x: e.clientX, y: e.clientY }; kick(); } };
    const up = () => { drag = null; box.style.cursor = ""; };
    box.addEventListener("pointerdown", down); box.addEventListener("pointermove", move); box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);

    return () => {
      disposed = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis); window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      box.removeEventListener("pointerdown", down); box.removeEventListener("pointermove", move); box.removeEventListener("pointerup", up); box.removeEventListener("pointercancel", up);
      b?.dispose(); b = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const r = readouts(state);
  return (
    <div ref={wrap} className="relative h-full w-full select-none overflow-hidden" style={{ touchAction: "pan-y" }} data-building-stage>
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {LABELS.map((l, i) => {
          const d = r[l.key];
          return (
            <div key={l.key} ref={(el) => { labelEls.current[i] = el; }} className={`${l.small ? "hidden sm:block" : ""} absolute left-0 top-0 whitespace-nowrap rounded-lg border border-white/15 bg-[#0A162E]/85 px-2.5 py-1.5 text-[11px] leading-snug text-ink shadow-lg backdrop-blur-sm`} style={{ opacity: 0, visibility: "hidden", willChange: "transform, opacity" }}>
              <div className="font-semibold text-accent">{d.title}</div>
              {d.lines.map((x) => <div key={x} className="text-soft">{x}</div>)}
            </div>
          );
        })}
      </div>
      {status === "none" && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-soft">
          <p>The interactive 3D building needs WebGL, which is not available here. The full story below reads the same without it.</p>
        </div>
      )}
      <p className="sr-only">A three dimensional model of a five floor commercial building with rooftop air handling units and a chilled water plant. The camera and highlighted systems change as you scroll through the six stages.</p>
    </div>
  );
}
