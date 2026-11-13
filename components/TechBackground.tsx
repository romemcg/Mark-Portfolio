"use client";
import { useEffect, useRef } from "react";
import { createReveal, REVEAL_RADIUS } from "@/lib/twin/reveal";
import type { Twin } from "@/lib/twin/scene";
import { createInk } from "@/lib/twin/ink";

// Interactive dot grid: dots bulge away from the cursor and link up like a circuit, with a slow ambient scan.
// The reveal ("mask") around the cursor or finger shows a real-time 3D smart city digital twin (lib/twin).
// The pointer/touch tracking, falloff and reset are the original mask logic (lib/twin/reveal.ts), shared
// by the 2D dot layer and the 3D layer. If WebGL is unavailable the original acronym glyphs are shown instead.
export function TechBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 40, R = REVEAL_RADIUS;
    const glyphs = ["AI", "IoT", "PRD", "MG", "AIoT", "PM", "PMO", "RAID", "KPI", "UAT", "MBA", "ECE", "UAE", "MQTT", "API", "LoRa", "BMS", "SaaS", "OKR", "ML", "LLM", "BLE", "NB-IoT", "MVP", "ROI", "SQL", "01", "{ }", "</>"];
    let w = 0, h = 0, dpr = 1, raf = 0, rgb = "37 99 235";
    type Dot = { ox: number; oy: number; x: number; y: number };
    let dots: Dot[] = [], cols = 0;

    // ---- 3D digital twin (lazy). "glyphs" = original acronym reveal, used only when 3D cannot run.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const gl = glRef.current!;
    const webgl = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; } })();
    const eligible = webgl && !nav.connection?.saveData && (nav.deviceMemory ?? 8) >= 2;
    let twin: Twin | null = null, twinState: "idle" | "loading" | "ready" | "failed" = eligible ? "idle" : "failed";
    let disposed = false, idleHandle = 0;
    const loadTwin = async () => {
      if (twinState !== "idle") return;
      twinState = "loading";
      try {
        const mod = await import("@/lib/twin/scene");
        if (disposed) return;
        twin = mod.createTwin(gl);
        twin.resize(window.innerWidth, window.innerHeight);
        twinState = "ready";
        if (new URLSearchParams(location.search).has("twinDebug")) (window as unknown as { __twin: Twin }).__twin = twin;
      } catch {
        twinState = "failed";
      }
    };
    const onGlLost = () => { twinState = "failed"; twin?.dispose(); twin = null; };
    gl.addEventListener("webglcontextlost", onGlLost);

    const reveal = reduce ? null : createReveal({
      // touch devices build the scene on the first touch; desktops prepare it while idle (below)
      onActivate: () => { if (twinState === "idle") void loadTwin(); },
    });
    const ink = reduce ? null : createInk();
    const m = reveal ? reveal.state : { x: -9999, y: -9999, tx: -9999, ty: -9999, k: 1 };

    const readColor = () => { rgb = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || rgb; };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = []; cols = Math.ceil(w / GAP) + 1;
      for (let y = 0; y <= h + GAP; y += GAP) for (let x = 0; x <= w + GAP; x += GAP) dots.push({ ox: x, oy: y, x, y });
      twin?.resize(w, h);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      reveal?.step();
      const inf: number[] = new Array(dots.length);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.ox - m.x, dy = d.oy - m.y, dist = Math.hypot(dx, dy) || 1;
        const k = Math.max(0, 1 - dist / R); inf[i] = k;
        const push = k * k * 34;
        d.x += (d.ox + (dx / dist) * push - d.x) * 0.18;
        d.y += (d.oy + (dy / dist) * push - d.y) * 0.18;
        const scan = 0.5 + 0.5 * Math.sin(t * 0.0009 - (d.ox + d.oy) * 0.006);
        const a = 0.05 + scan * 0.04 + k * 0.75;
        ctx.fillStyle = `rgb(${rgb} / ${a})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.1 + k * 2.6, 0, 6.2832); ctx.fill();
      }
      // masked reveal, fallback: code glyphs only visible through the cursor spotlight (when 3D is unavailable)
      if (twinState === "failed") {
        ctx.font = "12px ui-monospace, monospace"; ctx.textAlign = "center";
        for (let i = 0; i < dots.length; i += 2) {
          if (inf[i] < 0.05) continue;
          ctx.fillStyle = `rgb(${rgb} / ${Math.min(1, inf[i] * 1.3) * m.k})`;
          ctx.fillText(glyphs[(i * 31) % glyphs.length], dots[i].x + GAP / 2, dots[i].y + GAP / 2 + 4);
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        if (inf[i] < 0.12) continue;
        const r = dots[i + 1], b = dots[i + cols];
        for (const n of [r, b]) {
          const j = n === r ? i + 1 : i + cols;
          if (!n || (n === r && (i + 1) % cols === 0) || inf[j] < 0.12) continue;
          ctx.strokeStyle = `rgb(${rgb} / ${Math.min(inf[i], inf[j]) * 0.55})`;
          ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }
      if (m.x > -999) {
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R);
        g.addColorStop(0, `rgb(${rgb} / 0.14)`); g.addColorStop(1, `rgb(${rgb} / 0)`);
        ctx.fillStyle = g; ctx.fillRect(m.x - R, m.y - R, R * 2, R * 2);
      }
      if (twin) twin.render(m as Parameters<Twin["render"]>[0], t);
      ink?.update(m as Parameters<Twin["render"]>[0], twin);
    };
    const loop = (t: number) => { if (!document.hidden) draw(t); raf = requestAnimationFrame(loop); };
    readColor(); resize();
    const mo = new MutationObserver(() => { readColor(); twin?.setTheme(); }); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    if (reduce) { draw(0); } else {
      raf = requestAnimationFrame(loop);
      // desktop: build the scene once the page is idle so the first reveal is instant (touch builds on first touch)
      if (eligible && !window.matchMedia("(pointer: coarse)").matches) {
        const start = () => { idleHandle = window.setTimeout(() => { if ("requestIdleCallback" in window) (window as Window).requestIdleCallback(() => void loadTwin(), { timeout: 4000 }); else void loadTwin(); }, 1800); };
        if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
      }
    }
    return () => {
      disposed = true; cancelAnimationFrame(raf); window.clearTimeout(idleHandle); mo.disconnect();
      window.removeEventListener("resize", resize); reveal?.dispose(); ink?.dispose();
      gl.removeEventListener("webglcontextlost", onGlLost); twin?.dispose(); twin = null;
    };
  }, []);
  return (
    <>
      <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
      <canvas ref={glRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}
