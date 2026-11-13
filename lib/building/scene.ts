import * as THREE from "three";
import { REVEAL_RADIUS, getActiveReveal } from "../twin/reveal";
import { FrameGovernor } from "../twin/quality";
import type { BuildingState, Health } from "./model";

// One persistent digital twin of a five floor commercial building. The narrative stages move the camera and fade
// layers in; the "hidden operational layer" (zones, sensors, ducts, chilled water) is ALSO revealed inside the shared
// global mask (lib/twin/reveal.ts), using the same radius and falloff as the city reveal. Everything is conceptual.

export type Building = {
  render(stage: number, st: BuildingState, tMs: number, o: { reduce: boolean; xray: boolean }): boolean; // true while still animating
  resize(w: number, h: number): void;
  project(id: string): { x: number; y: number; ok: boolean } | null;
  nudge(dx: number, dy: number): void;
  maskCenter(): { x: number; y: number; r: number; k: number } | null; // canvas-local CSS px, for DOM labels
  dispose(): void;
};

const FOV = 28;
const FLOORS = 5, FH = 2.4, BW = 12, BD = 8;
const COL: Record<Health, number> = { ok: 0x60a5fa, warn: 0xfbbf24, fault: 0xf87171, recover: 0x34d399 };

// camera: yaw, pitch, dist, target xyz. L: layer strengths shell, slabs, equip, sens, duct, zone, sun
type Pre = { cam: [number, number, number, number, number, number]; L: number[] };
const PRE: Pre[] = [
  { cam: [38, 22, 41, 2, 5.5, 0], L: [0.9, 0.5, 0.9, 0, 0, 0, 0] },
  { cam: [28, 17, 40, 2, 5.5, 0], L: [0.6, 0.35, 1, 0, 0, 0, 0] },
  { cam: [52, 24, 40, 1, 7, 0], L: [0.45, 0.2, 0.7, 1, 0, 0.5, 0] },
  { cam: [-38, 24, 42, 1, 7, 0], L: [0.4, 0.2, 0.7, 0.7, 1, 0.4, 0] },
  { cam: [-52, 22, 36, 1, 8, 0], L: [0.35, 0.2, 0.8, 0.9, 0.7, 0.7, 1] },
  { cam: [-22, 21, 36, 1, 8, 0], L: [0.35, 0.2, 0.8, 0.6, 1, 0.55, 0.3] },
  { cam: [26, 21, 36, 1, 8, 0], L: [0.4, 0.2, 0.9, 0.9, 0.8, 0.5, 0] },
  { cam: [36, 23, 37, 1, 7.6, 0], L: [0.4, 0.2, 0.9, 1, 0.9, 0.6, 0.2] },
];

const VERT = /* glsl */ `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform vec3 uCol; uniform float uA; uniform float uB; uniform float uStage; uniform float uX; uniform vec4 uM;
void main(){
  float d = length(gl_FragCoord.xy - uM.xy) / max(uM.z, 1.0);
  float m = clamp(1.3 * (1.0 - d), 0.0, 1.0) * uM.w;
  float ma = max(m, uX);
  gl_FragColor = vec4(uCol, max(uA * uStage, min(1.0, uA * uB) * ma));
}`;
const PVERT = /* glsl */ `attribute vec3 aCol; attribute float aSize; uniform float uPx; varying vec3 vC;
void main(){ vC = aCol; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(2.0, aSize * uPx / -mv.z); }`;
const PFRAG = /* glsl */ `varying vec3 vC; uniform float uStage; uniform float uX; uniform vec4 uM;
void main(){
  vec2 c = gl_PointCoord - 0.5; float r = length(c); if (r > 0.5) discard;
  float d = length(gl_FragCoord.xy - uM.xy) / max(uM.z, 1.0);
  float m = clamp(1.3 * (1.0 - d), 0.0, 1.0) * uM.w;
  float core = smoothstep(0.5, 0.1, r);
  gl_FragColor = vec4(vC, core * max(uStage, max(m, uX)));
}`;

export function createBuilding(canvas: HTMLCanvasElement): Building {
  const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  const maxPR = mobile ? 1.5 : 2;
  let pr = Math.min(window.devicePixelRatio || 1, maxPR);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x0a162e, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-14, 22, 16); scene.add(sun);

  // shared uniforms: mask (centre px, radius px, fade), global x-ray, one stage strength per layer
  const UM = { value: new THREE.Vector4(-1e5, -1e5, 1, 0) };
  const UX = { value: 0 };
  const G = { shell: { value: 0 }, slabs: { value: 0 }, sens: { value: 0 }, duct: { value: 0 }, zone: { value: 0 }, sun: { value: 0 }, always: { value: 1 } };
  type Grp = keyof typeof G;
  const mats: THREE.ShaderMaterial[] = [];
  const mat = (hex: number, a: number, g: Grp, boost = 1) => {
    const m = new THREE.ShaderMaterial({
      uniforms: { uCol: { value: new THREE.Color(hex) }, uA: { value: a }, uB: { value: boost }, uStage: G[g], uX: UX, uM: UM },
      vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
    });
    mats.push(m); return m;
  };
  const geos: THREE.BufferGeometry[] = [];
  const keep = <T extends THREE.BufferGeometry>(g: T) => { geos.push(g); return g; };
  const root = new THREE.Group(); scene.add(root);

  // ground grid
  const grid = new THREE.GridHelper(44, 44, 0x2a4a85, 0x16294d);
  (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.35; (grid.material as THREE.Material).depthWrite = false;
  root.add(grid);

  // shell, slabs
  const boxG = keep(new THREE.BoxGeometry(BW, FH, BD));
  const boxE = keep(new THREE.EdgesGeometry(boxG));
  const shellFace = mat(0x60a5fa, 0.055, "shell"), shellEdge = mat(0x7db4ff, 0.55, "shell", 1.4);
  const slabG = keep(new THREE.PlaneGeometry(BW, BD).rotateX(-Math.PI / 2));
  const slabM = mat(0x60a5fa, 0.16, "slabs");
  for (let f = 0; f < FLOORS; f++) {
    const y = f * FH + FH / 2;
    const b = new THREE.Mesh(boxG, shellFace); b.position.y = y; b.renderOrder = 1; root.add(b);
    const e = new THREE.LineSegments(boxE, shellEdge); e.position.y = y; e.renderOrder = 2; root.add(e);
    const s = new THREE.Mesh(slabG, slabM); s.position.y = f * FH + 0.02; s.renderOrder = 1; root.add(s);
  }
  const roof = new THREE.Mesh(slabG, slabM); roof.position.y = FLOORS * FH + 0.02; root.add(roof);

  // west facade solar exposure (context layer)
  const sunPlane = new THREE.Mesh(keep(new THREE.PlaneGeometry(BD + 1.5, FLOORS * FH + 1).rotateY(-Math.PI / 2)), mat(0xfbbf24, 0.2, "sun"));
  sunPlane.position.set(-BW / 2 - 0.15, FLOORS * FH / 2, 0); sunPlane.renderOrder = 3; root.add(sunPlane);

  // equipment (solid)
  const eq = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = new THREE.MeshStandardMaterial({ color: 0x9fb2d0, roughness: 0.55, metalness: 0.15, emissive: new THREE.Color(0x000000), emissiveIntensity: 0.9 });
    const g = keep(new THREE.BoxGeometry(w, h, d));
    const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z); root.add(mesh);
    const ed = new THREE.LineSegments(keep(new THREE.EdgesGeometry(g)), new THREE.LineBasicMaterial({ color: 0xdbe7ff, transparent: true, opacity: 0.55 })); ed.position.copy(mesh.position); root.add(ed);
    return { m, ed };
  };
  const roofY = FLOORS * FH;
  const ahus = [eq(2.4, 1.3, 1.8, -3.6, roofY + 0.7, 0), eq(2.4, 1.3, 1.8, 0, roofY + 0.7, 0), eq(2.4, 1.3, 1.8, 3.6, roofY + 0.7, 0)];
  const chiller = eq(3.2, 1.7, 2.2, 9.2, 0.9, 0);
  const pump = eq(1.2, 0.9, 1.2, 9.2, 0.5, -2.8);
  void pump;

  // ducts and chilled water (relationships). 'chain' = chiller -> AHU 03 -> floor 3 zones
  const cyl = (a: THREE.Vector3, b: THREE.Vector3, r: number, m: THREE.ShaderMaterial, order = 4) => {
    const len = a.distanceTo(b);
    const mesh = new THREE.Mesh(keep(new THREE.CylinderGeometry(r, r, len, 8, 1, true)), m);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    mesh.renderOrder = order; root.add(mesh); return mesh;
  };
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const dimDuct = mat(0x7db4ff, 0.4, "duct", 2), chainDuct = mat(0x60a5fa, 0.95, "duct", 1.2), water = mat(0x2dd4bf, 0.8, "duct", 1.3), chainWater = mat(0x5eead4, 1, "duct");
  const risers: [number, number, number, number][] = [[-3.6, 0, 2, 3.2], [0, 3, 4, 3.2], [3.6, 2, 2, -3.2]]; // x, firstFloor, lastFloor, z
  const ductMats: THREE.ShaderMaterial[] = [];
  risers.forEach(([x, f0, f1, z], i) => {
    const chain = i === 2, m = chain ? chainDuct : dimDuct; ductMats.push(m);
    cyl(V(x, roofY + 0.1, z), V(x, f0 * FH + 1.2, z), 0.1, m);
    for (let f = f0; f <= f1; f++) cyl(V(x, f * FH + 1.2, z), V(x + (chain ? -8 : x > 0 ? -8 : 8) * 0.5, f * FH + 1.2, z), 0.07, m);
    cyl(V(x, roofY + 0.1, z), V(x, roofY + 0.7, 0), 0.08, m);
  });
  cyl(V(9.2, 1.7, 0), V(9.2, roofY + 1.6, 0), 0.1, chainWater);
  cyl(V(9.2, roofY + 1.6, 0), V(3.6, roofY + 1.6, 0), 0.1, chainWater);
  cyl(V(3.6, roofY + 1.6, 0), V(3.6, roofY + 1.3, 0), 0.1, chainWater);
  cyl(V(3.6, roofY + 1.6, 0), V(-3.6, roofY + 1.6, 0), 0.08, water);
  cyl(V(0, roofY + 1.6, 0), V(0, roofY + 1.3, 0), 0.08, water);
  cyl(V(-3.6, roofY + 1.6, 0), V(-3.6, roofY + 1.3, 0), 0.08, water);

  // zones (3 per floor along x; west is -x)
  const ZX = [0, 4, -4]; // A, C(east), B(west) -> index: A=0 centre, C=+4, B=-4
  const zoneG = keep(new THREE.BoxGeometry(3.7, 2.05, 7.5)), zoneE = keep(new THREE.EdgesGeometry(zoneG));
  const zoneBase = mat(0x38bdf8, 0.07, "zone", 1.2), zoneBaseE = mat(0x38bdf8, 0.38, "zone", 1.6);
  const z3b = mat(0x60a5fa, 0.2, "zone", 1.2), z3bE = mat(0x60a5fa, 0.9, "zone");
  for (let f = 0; f < FLOORS; f++) ZX.forEach((x, zi) => {
    const hero = f === 2 && zi === 2;
    const m = new THREE.Mesh(zoneG, hero ? z3b : zoneBase); m.position.set(x, f * FH + 1.2, 0); m.renderOrder = 2; root.add(m);
    const e = new THREE.LineSegments(zoneE, hero ? z3bE : zoneBaseE); e.position.copy(m.position); e.renderOrder = 3; root.add(e);
  });

  // sensors (one Points draw)
  const sp: number[] = [], sc: number[] = [], ss: number[] = [];
  const sensorIdx3b: number[] = [];
  const base = new THREE.Color(0x7dd3fc);
  for (let f = 0; f < FLOORS; f++) ZX.forEach((x, zi) => [-1, 1].forEach((s, k) => {
    if (f === 2 && zi === 2) sensorIdx3b.push(sp.length / 3);
    sp.push(x + s * 1.1, f * FH + (k ? 0.6 : 1.7), s * 2.2); sc.push(base.r, base.g, base.b); ss.push(0.32);
  }));
  const ahuSensor = sp.length / 3; sp.push(3.6, roofY + 0.1, 0.9); sc.push(base.r, base.g, base.b); ss.push(0.4);
  const chSensor = sp.length / 3; sp.push(9.2, 1.9, 1.2); sc.push(base.r, base.g, base.b); ss.push(0.4);
  const pg = keep(new THREE.BufferGeometry());
  pg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
  const colAttr = new THREE.Float32BufferAttribute(sc, 3); pg.setAttribute("aCol", colAttr);
  pg.setAttribute("aSize", new THREE.Float32BufferAttribute(ss, 1));
  const UPX = { value: 1 };
  const pm = new THREE.ShaderMaterial({ uniforms: { uPx: UPX, uStage: G.sens, uX: UX, uM: UM }, vertexShader: PVERT, fragmentShader: PFRAG, transparent: true, depthWrite: false });
  const points = new THREE.Points(pg, pm); points.renderOrder = 6; points.frustumCulled = false; root.add(points);

  // camera
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 400);
  let W = 1, H = 1, aspect = 1;
  const resize = (w: number, h: number) => {
    W = Math.max(1, Math.floor(w)); H = Math.max(1, Math.floor(h)); aspect = W / H;
    renderer.setPixelRatio(pr); renderer.setSize(W, H, false);
    camera.aspect = aspect; camera.updateProjectionMatrix();
    UPX.value = (H * pr) / (2 * Math.tan((FOV * Math.PI) / 360));
  };
  const gov = new FrameGovernor(() => { if (pr > 0.8) { pr = Math.max(0.8, pr - 0.25); resize(W, H); } });

  // state
  let s = 0, last = 0, time = 0, maskFade = 0, xr = 0, curSig = "", yawU = 0, pitchU = 0, anim = true;
  const tmp = new THREE.Vector3();
  const setHealth = (st: BuildingState) => {
    const sig = st.ahu3 + st.zone3b + st.chiller;
    if (sig === curSig) return; curSig = sig;
    const paint = (e: { m: THREE.MeshStandardMaterial; ed: THREE.LineSegments }, h: Health) => {
      e.m.emissive.setHex(h === "ok" ? 0x000000 : COL[h]); e.m.emissiveIntensity = h === "ok" ? 0 : 0.55;
      (e.ed.material as THREE.LineBasicMaterial).color.setHex(h === "ok" ? 0xdbe7ff : COL[h]);
    };
    paint(ahus[2], st.ahu3); paint(chiller, st.chiller);
    z3b.uniforms.uCol.value.setHex(COL[st.zone3b]); z3bE.uniforms.uCol.value.setHex(COL[st.zone3b]);
    const set = (i: number, h: Health) => { const c = new THREE.Color(h === "ok" ? 0x7dd3fc : COL[h]); colAttr.setXYZ(i, c.r, c.g, c.b); };
    sensorIdx3b.forEach((i) => set(i, st.zone3b)); set(ahuSensor, st.ahu3); set(chSensor, st.chiller);
    colAttr.needsUpdate = true;
  };

  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
  const ease = (f: number) => f * f * (3 - 2 * f);

  const render: Building["render"] = (target, st, tMs, o) => {
    const dt = last ? Math.min(0.05, Math.max(0.001, (tMs - last) / 1000)) : 0.016; last = tMs; time += dt; gov.tick(dt);
    const prev = s;
    s = o.reduce ? target : s + (target - s) * (1 - Math.pow(0.0015, dt));
    if (Math.abs(target - s) < 0.002) s = target;
    const sc0 = Math.min(PRE.length - 1, Math.max(0, s)), i0 = Math.min(PRE.length - 2, Math.floor(sc0)), f = ease(sc0 - i0);
    const a = PRE[i0], b = PRE[i0 + 1];
    for (const [k, idx] of [["shell", 0], ["slabs", 1], ["sens", 3], ["duct", 4], ["zone", 5], ["sun", 6]] as [Grp, number][]) G[k].value = lerp(a.L[idx], b.L[idx], f);
    const eqA = lerp(a.L[2], b.L[2], f);
    for (const e of [...ahus, chiller]) { e.m.opacity = 1; (e.ed.material as THREE.LineBasicMaterial).opacity = 0.25 + 0.4 * eqA; }
    setHealth(st);

    // camera
    const fit = aspect < 1.05 ? 1.05 / aspect : 1;
    const yaw = THREE.MathUtils.degToRad(lerp(a.cam[0], b.cam[0], f) + yawU + (o.reduce ? 0 : Math.sin(time * 0.15) * 1.6));
    const pitch = THREE.MathUtils.degToRad(lerp(a.cam[1], b.cam[1], f) + pitchU);
    const dist = lerp(a.cam[2], b.cam[2], f) * Math.min(fit, 1.6);
    const tx = lerp(a.cam[3], b.cam[3], f), ty = lerp(a.cam[4], b.cam[4], f), tz = lerp(a.cam[5], b.cam[5], f);
    camera.position.set(tx + Math.sin(yaw) * Math.cos(pitch) * dist, ty + Math.sin(pitch) * dist, tz + Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(tx, ty, tz); camera.near = dist * 0.3; camera.far = dist * 3; camera.updateProjectionMatrix();

    // shared mask -> local device pixels
    const rv = getActiveReveal(); let masked = false;
    if (rv && rv.state.x > -999) {
      const r = canvas.getBoundingClientRect(), m = rv.state;
      UM.value.set((m.x - r.left) * pr, (r.height - (m.y - r.top)) * pr, REVEAL_RADIUS * pr, 0);
      masked = true; UM.value.w = Math.max(0, m.k);
    }
    maskFade = Math.min(1, Math.max(0, maskFade + (masked ? dt / 0.16 : -dt / 0.16)));
    UM.value.w *= maskFade; if (!masked) UM.value.w = 0;
    xr += ((o.xray ? 1 : 0) - xr) * (o.reduce ? 1 : 1 - Math.pow(0.002, dt)); UX.value = xr;

    // fault pulse
    const pulse = o.reduce ? 1 : 0.85 + 0.15 * Math.sin(time * 4);
    z3bE.uniforms.uA.value = st.zone3b === "ok" ? 0.9 : 0.9 * pulse;
    chainDuct.uniforms.uA.value = 0.8 + 0.15 * Math.sin(time * 2.2);

    // user view offsets relax back
    if (!o.reduce) { yawU *= Math.pow(0.5, dt / 2.5); pitchU *= Math.pow(0.5, dt / 2.5); }

    renderer.render(scene, camera);
    anim = Math.abs(target - s) > 0.002 || Math.abs(yawU) > 0.05 || Math.abs(pitchU) > 0.05 || maskFade > 0.001 || Math.abs((o.xray ? 1 : 0) - xr) > 0.01 || prev !== s;
    return anim;
  };

  const anchors: Record<string, THREE.Vector3> = { ahu3: V(3.6, roofY + 1.7, 0), zone3b: V(-4, 2 * FH + 2.3, 0), chiller: V(9.2, 2.3, 0), asset: V(3.6, roofY + 1.7, 0), spatial: V(-4, 2 * FH + 2.3, 3.8) };
  const project: Building["project"] = (id) => {
    const p = anchors[id]; if (!p) return null;
    tmp.copy(p).project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * (canvas.clientWidth || W), y: (-tmp.y * 0.5 + 0.5) * (canvas.clientHeight || H), ok: tmp.z > -1 && tmp.z < 1 };
  };
  const maskCenter: Building["maskCenter"] = () => {
    const rv = getActiveReveal(); if (!rv || !(rv.state.x > -999)) return null;
    const r = canvas.getBoundingClientRect();
    return { x: rv.state.x - r.left, y: rv.state.y - r.top, r: REVEAL_RADIUS, k: Math.max(0, rv.state.k) * maskFade };
  };
  const onLost = (e: Event) => e.preventDefault();
  canvas.addEventListener("webglcontextlost", onLost);
  return {
    render, resize, project, maskCenter,
    nudge(dx, dy) { yawU = THREE.MathUtils.clamp(yawU + dx * 0.25, -38, 38); pitchU = THREE.MathUtils.clamp(pitchU + dy * 0.12, -8, 10); },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); pm.dispose(); grid.geometry.dispose(); (grid.material as THREE.Material).dispose();
      for (const e of [...ahus, chiller]) { e.m.dispose(); (e.ed.material as THREE.Material).dispose(); }
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
