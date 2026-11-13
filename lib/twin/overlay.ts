import * as THREE from "three";
import { mulberry32, range } from "./rand";
import type { CityData, Spot, Tower } from "./city";
import type { Palette } from "./palette";
import type { Quality } from "./quality";

// Digital twin layer. Every element encodes a relationship:
//   sensor nodes (parking, HVAC/energy, environment) -> nearest gateway -> operations hub tower.
// Pulses travel sensor -> gateway -> hub along those links. Selected buildings carry a BIM-style
// wireframe that builds up floor by floor and fades. The building nearest the mask centre is
// highlighted together with the sensors around it.

const KIND_COLORS = ["accent", "sky", "teal", "accent"] as const;

const BEZ = /* glsl */ `
vec3 arc(vec3 a, vec3 b, float h, float t){ vec3 p = mix(a, b, t); p.y += h * 4.0 * t * (1.0 - t); return p; }
`;

type Edge = { a: THREE.Vector3; b: THREE.Vector3; h: number; kind: number; backbone: boolean };

export class Overlay {
  group = new THREE.Group();
  private disposables: { dispose(): void }[] = [];
  private U: Record<string, { value: unknown }>;
  private wireMat: THREE.ShaderMaterial; private nodeMat: THREE.ShaderMaterial; private pulseMat: THREE.ShaderMaterial; private lineMat: THREE.LineBasicMaterial;
  private wired: { id: number; cx: number; cy: number; cz: number }[] = [];
  gatewayPositions: THREE.Vector3[] = [];

  constructor(city: CityData, q: Quality, pal: Palette) {
    const rng = mulberry32(512);
    this.U = {
      uTime: { value: 0 }, uScale: { value: 1000 }, uFocus: { value: new THREE.Vector4(0, 0, 0, 0) }, uFocusId: { value: -1 }, uFocusAmt: { value: 0 },
      uC0: { value: new THREE.Color() }, uC1: { value: new THREE.Color() }, uC2: { value: new THREE.Color() }, uAdd: { value: 0 },
    };
    const track = <T extends { dispose(): void }>(o: T) => (this.disposables.push(o), o);

    // ------------------------------------------------ gateways, sensors, links
    const gwCand = city.spots.filter((s) => s.kind === 3).sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z));
    const gateways: Spot[] = [];
    for (const g of gwCand) if (gateways.every((o) => Math.hypot(o.x - g.x, o.z - g.z) > 250)) gateways.push(g);
    this.gatewayPositions = gateways.map((g) => new THREE.Vector3(g.x, g.y, g.z));
    const hub = city.hub;
    const near = (s: { x: number; z: number }) => {
      let best: Spot | null = null, bd = 1e9;
      for (const g of gateways) { const d = Math.hypot(g.x - s.x, g.z - s.z); if (d < bd) { bd = d; best = g; } }
      return { g: best!, d: bd };
    };
    const sensorPool = city.spots.filter((s) => s.kind < 3).sort(() => rng() - 0.5);
    const sensors: Spot[] = [];
    for (const s of sensorPool) { if (sensors.length >= q.sensors) break; if (Math.hypot(s.x, s.z) < 560 && near(s).d < 230) sensors.push(s); }
    for (const s of city.spots) if (s.kind === 0 && !sensors.includes(s)) sensors.push(s); // every parking lot reports
    const edges: Edge[] = [];
    for (const s of sensors) { const { g, d } = near(s); edges.push({ a: new THREE.Vector3(s.x, s.y, s.z), b: new THREE.Vector3(g.x, g.y, g.z), h: Math.min(30, d * 0.2), kind: s.kind, backbone: false }); }
    for (const g of gateways) if (Math.hypot(g.x - hub.x, g.z - hub.z) > 5) { const d = Math.hypot(g.x - hub.x, g.z - hub.z); edges.push({ a: new THREE.Vector3(g.x, g.y, g.z), b: hub.clone(), h: Math.min(110, d * 0.28), kind: 3, backbone: true }); }

    // static link lines (10 segments per link)
    const SEG = 10;
    const lp = new Float32Array(edges.length * SEG * 6);
    edges.forEach((e, i) => {
      for (let k = 0; k < SEG; k++) for (let c = 0; c < 2; c++) {
        const t = (k + c) / SEG; const o = i * SEG * 6 + k * 6 + c * 3;
        lp[o] = e.a.x + (e.b.x - e.a.x) * t; lp[o + 1] = e.a.y + (e.b.y - e.a.y) * t + e.h * 4 * t * (1 - t); lp[o + 2] = e.a.z + (e.b.z - e.a.z) * t;
      }
    });
    const lg = track(new THREE.BufferGeometry()); lg.setAttribute("position", new THREE.BufferAttribute(lp, 3));
    this.lineMat = track(new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.3, depthWrite: false }));
    const lines = new THREE.LineSegments(lg, this.lineMat); lines.frustumCulled = false; this.group.add(lines);

    // ------------------------------------------------ pulses (sensor -> gateway -> hub)
    const pulses: { e: Edge; speed: number; phase: number; size: number }[] = [];
    for (const e of edges) {
      const n = e.backbone ? 3 : 1 + (rng() < 0.5 ? 1 : 0);
      for (let k = 0; k < n; k++) pulses.push({ e, speed: e.backbone ? range(rng, 0.07, 0.11) : range(rng, 0.12, 0.2), phase: rng(), size: e.backbone ? 6 : 4.2 });
    }
    const pg = track(new THREE.BufferGeometry());
    const pPos = new Float32Array(pulses.length * 3), pA = new Float32Array(pulses.length * 3), pB = new Float32Array(pulses.length * 3), pP = new Float32Array(pulses.length * 4), pK = new Float32Array(pulses.length);
    pulses.forEach((p, i) => { pA.set([p.e.a.x, p.e.a.y, p.e.a.z], i * 3); pB.set([p.e.b.x, p.e.b.y, p.e.b.z], i * 3); pP.set([p.e.h, p.speed, p.phase, p.size], i * 4); pK[i] = p.e.kind; });
    pg.setAttribute("position", new THREE.BufferAttribute(pPos, 3)); pg.setAttribute("aA", new THREE.BufferAttribute(pA, 3)); pg.setAttribute("aB", new THREE.BufferAttribute(pB, 3));
    pg.setAttribute("aP", new THREE.BufferAttribute(pP, 4)); pg.setAttribute("aKind", new THREE.BufferAttribute(pK, 1));
    this.pulseMat = track(new THREE.ShaderMaterial({
      uniforms: this.U, transparent: true, depthWrite: false,
      vertexShader: /* glsl */ `
        attribute vec3 aA; attribute vec3 aB; attribute vec4 aP; attribute float aKind;
        uniform float uTime; uniform float uScale; uniform vec4 uFocus;
        varying float vA; varying float vKind; varying float vBoost;
        ${BEZ}
        void main(){
          float t = fract(uTime * aP.y + aP.z);
          vec3 p = arc(aA, aB, aP.x, t);
          vBoost = smoothstep(80.0, 20.0, distance(p.xz, uFocus.xz)) * uFocus.w;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = max(2.5, aP.w * (1.0 + 0.7 * vBoost) * uScale / -mv.z);
          vA = smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.86, 1.0, t)); vKind = aKind;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform float uAdd;
        varying float vA; varying float vKind; varying float vBoost;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float core = 1.0 - smoothstep(0.18, 0.42, d);
          float glow = pow(max(0.0, 1.0 - d), 2.2);
          float a = (core * 0.95 + glow * 0.5) * vA * (1.0 + 0.5 * vBoost);
          vec3 c = vKind < 0.5 ? uC0 : vKind < 1.5 ? uC1 : vKind < 2.5 ? uC2 : uC0;
          gl_FragColor = vec4(mix(c, vec3(1.0), core * 0.35 * uAdd), clamp(a, 0.0, 1.0));
          #include <colorspace_fragment>
        }`,
    }));
    const pulsePts = new THREE.Points(pg, this.pulseMat); pulsePts.frustumCulled = false; this.group.add(pulsePts);

    // ------------------------------------------------ sensor + gateway nodes
    const nodes = [...sensors.map((s) => ({ s, size: 9 })), ...gateways.map((g) => ({ s: g, size: 16 }))];
    const ng = track(new THREE.BufferGeometry());
    const nPos = new Float32Array(nodes.length * 3), nS = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => { nPos.set([n.s.x, n.s.y, n.s.z], i * 3); nS.set([rng(), n.size, n.s.kind], i * 3); });
    ng.setAttribute("position", new THREE.BufferAttribute(nPos, 3)); ng.setAttribute("aS", new THREE.BufferAttribute(nS, 3));
    this.nodeMat = track(new THREE.ShaderMaterial({
      uniforms: this.U, transparent: true, depthWrite: false,
      vertexShader: /* glsl */ `
        attribute vec3 aS; uniform float uTime; uniform float uScale; uniform vec4 uFocus;
        varying float vCyc; varying float vKind; varying float vBoost; varying float vPh;
        void main(){
          vCyc = fract(uTime * 0.15 + aS.x); vKind = aS.z; vPh = aS.x;
          vBoost = smoothstep(90.0, 20.0, distance(position.xz, uFocus.xz)) * uFocus.w;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = max(6.0, aS.y * 2.4 * (1.0 + 0.45 * vBoost) * uScale / -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform float uAdd;
        varying float vCyc; varying float vKind; varying float vBoost; varying float vPh;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float lit = smoothstep(0.0, 0.08, vCyc) * (1.0 - smoothstep(0.08, 0.5, vCyc));
          float core = 1.0 - smoothstep(0.11, 0.17, d);
          float glow = exp(-d * d * 10.0) * (0.22 + 0.7 * lit + 0.5 * vBoost);
          float rr = 0.18 + 0.82 * vCyc;
          float ring = exp(-pow((d - rr) * 9.0, 2.0)) * pow(1.0 - vCyc, 2.0);
          float gate = step(2.5, vKind);
          float hex = gate * exp(-pow((d - 0.42) * 14.0, 2.0)) * 0.8;
          float a = clamp(core + glow * 0.8 + ring * 0.85 + hex, 0.0, 1.0);
          vec3 c = vKind < 0.5 ? uC0 : vKind < 1.5 ? uC1 : vKind < 2.5 ? uC2 : uC0;
          gl_FragColor = vec4(mix(c, vec3(1.0), core * 0.55 * uAdd), a);
          #include <colorspace_fragment>
        }`,
    }));
    const nodePts = new THREE.Points(ng, this.nodeMat); nodePts.frustumCulled = false; this.group.add(nodePts);

    // ------------------------------------------------ building wireframes
    const byId = new Map<number, Tower[]>();
    city.towers.forEach((t) => { (byId.get(t.id) ?? byId.set(t.id, []).get(t.id)!).push(t); });
    const verts: number[] = [], wattr: number[] = [];
    const seg = (a: number[], b: number[], phase: number, h01a: number, h01b: number, id: number) => { verts.push(...a, ...b); wattr.push(phase, h01a, id, phase, h01b, id); };
    byId.forEach((parts, id) => {
      const top = Math.max(...parts.map((p) => p.h));
      if (!(parts[0].hub || (top >= 55 && Math.hypot(parts[0].x, parts[0].z) < 640 && rng() < 0.3))) return;
      const phase = rng();
      this.wired.push({ id, cx: parts[0].x, cy: top * 0.5, cz: parts[0].z });
      for (const p of parts) {
        const e = 0.3, x0 = p.x - p.w / 2 - e, x1 = p.x + p.w / 2 + e, z0 = p.z - p.d / 2 - e, z1 = p.z + p.d / 2 + e, y0 = p.base, y1 = p.h + e;
        const c = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
        for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4]; seg([a[0], y0, a[1]], [a[0], y1, a[1]], phase, y0 / top, y1 / top, id); seg([a[0], y1, a[1]], [b[0], y1, b[1]], phase, y1 / top, y1 / top, id); seg([a[0], y0, a[1]], [b[0], y0, b[1]], phase, y0 / top, y0 / top, id); }
        for (let y = y0 + 15.6; y < y1 - 1; y += 15.6) for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4]; seg([a[0], y, a[1]], [b[0], y, b[1]], phase, y / top, y / top, id); }
      }
    });
    const wg = track(new THREE.BufferGeometry());
    wg.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3)); wg.setAttribute("aW", new THREE.Float32BufferAttribute(wattr, 3));
    this.wireMat = track(new THREE.ShaderMaterial({
      uniforms: this.U, transparent: true, depthWrite: false,
      vertexShader: /* glsl */ `
        attribute vec3 aW; uniform float uTime; uniform float uFocusId; uniform float uFocusAmt;
        varying float vA;
        void main(){
          float cyc = fract(uTime * 0.045 + aW.x);
          float grow = smoothstep(0.0, 0.2, cyc) * 1.12;
          float built = smoothstep(aW.y - 0.06, aW.y, grow);
          float fade = 1.0 - smoothstep(0.55, 0.78, cyc);
          float focus = (1.0 - step(0.5, abs(aW.z - uFocusId))) * uFocusAmt;
          vA = clamp(built * fade * 0.8 + focus * 0.9, 0.0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uC0; uniform vec3 uC1; varying float vA;
        void main(){
          gl_FragColor = vec4(mix(uC0, uC1, 0.35), vA * 0.85);
          #include <colorspace_fragment>
        }`,
    }));
    const wires = new THREE.LineSegments(wg, this.wireMat); wires.frustumCulled = false; this.group.add(wires);
    this.setPalette(pal, new THREE.Color("#2563eb"), new THREE.Color("#0ea5e9"));
  }

  setPalette(p: Palette, accent: THREE.Color, sky: THREE.Color) {
    (this.U.uC0.value as THREE.Color).copy(accent); (this.U.uC1.value as THREE.Color).copy(sky);
    (this.U.uC2.value as THREE.Color).set(p.dark ? "#34d3bd" : "#0d9488");
    this.U.uAdd.value = p.dark ? 1 : 0;
    const bl = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    for (const m of [this.wireMat, this.nodeMat, this.pulseMat]) { m.blending = bl; m.needsUpdate = true; }
    this.lineMat.color.copy(accent); this.lineMat.opacity = p.dark ? 0.32 : 0.3; this.lineMat.blending = bl; this.lineMat.needsUpdate = true;
  }

  /** Pick the wired building closest (on screen) to the mask centre; ease the highlight in and out. */
  updateFocus(camera: THREE.Camera, w: number, h: number, mx: number, my: number, dt: number) {
    let best = -1, bd = 210, bp: THREE.Vector3 | null = null;
    const v = new THREE.Vector3();
    for (const b of this.wired) {
      v.set(b.cx, b.cy, b.cz).project(camera);
      const sx = (v.x * 0.5 + 0.5) * w, sy = (-v.y * 0.5 + 0.5) * h;
      const d = Math.hypot(sx - mx, sy - my);
      if (d < bd) { bd = d; best = b.id; bp = new THREE.Vector3(b.cx, b.cy, b.cz); }
    }
    const cur = this.U.uFocusId.value as number;
    let amt = this.U.uFocusAmt.value as number;
    if (best !== cur) { amt = Math.max(0, amt - dt * 3); if (amt <= 0.01) { this.U.uFocusId.value = best; if (bp) (this.U.uFocus.value as THREE.Vector4).set(bp.x, bp.y, bp.z, 0); } }
    else amt = Math.min(1, amt + dt * 1.6);
    if (best === -1) amt = Math.max(0, amt - dt * 2);
    this.U.uFocusAmt.value = amt;
    (this.U.uFocus.value as THREE.Vector4).w = best === (this.U.uFocusId.value as number) ? amt : 0;
  }

  update(time: number, pxScale: number) { this.U.uTime.value = time; this.U.uScale.value = pxScale; }

  dispose() { this.disposables.forEach((d) => d.dispose()); }
}
