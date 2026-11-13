import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { mulberry32, range, pick, type Rng } from "./rand";
import { PITCH, createFacadeMaterial, createGroundMaterial, createPropMaterial, type Uniforms } from "./materials";
import type { Palette } from "./palette";
import type { Quality } from "./quality";
import { CarSet, VKind } from "./cars";

export type Tower = { id: number; x: number; z: number; w: number; d: number; h: number; base: number; seed: number; hub: boolean };
// kind: 0 parking, 1 HVAC / energy, 2 environment, 3 gateway
export type Spot = { x: number; y: number; z: number; kind: number };
export type Bay = { x: number; z: number; occupied: boolean; car: number; sensor: number };

type Kind = "office" | "resi" | "mixed" | "low" | "mid" | "park" | "lot";
type Box = { x: number; y: number; z: number; sx: number; sy: number; sz: number; tone: THREE.Color; fac?: [number, number, number, number] };

export type CityData = {
  group: THREE.Group;
  towers: Tower[];
  spots: Spot[];
  hub: THREE.Vector3;
  parking: { update(t: number): void };
  recolor(p: Palette): void;
  dispose(): void;
};

const BLOCK = 70; // buildable block edge (PITCH - 2 * WALK_HALF)

export function buildCity(q: Quality, u: Uniforms, pal: Palette): CityData {
  const rng = mulberry32(2035);
  const group = new THREE.Group();
  const P = PITCH, EXT = q.extent;
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(o: T) => (disposables.push(o), o);

  const towers: Tower[] = [];
  let towerId = 0;
  const spots: Spot[] = [];
  const gateways: Spot[] = [];
  const fac: Box[] = []; // facade boxes
  const eq: Box[] = []; // roof equipment boxes
  const eqCyl: Box[] = []; // cooling towers, masts, antennas
  const canopy: Box[] = [];
  const parkPads: Box[] = [];
  const lotPads: Box[] = [];
  const paths: Box[] = [];
  const ponds: Box[] = [];
  const trees: { x: number; z: number; s: number; tone: number }[] = [];
  const lamps: { x: number; z: number; yaw: number }[] = [];
  const bayLines: Box[] = [];
  const bays: Bay[] = [];
  const lotCenters: { x: number; z: number }[] = [];
  const white = new THREE.Color(1, 1, 1);
  const tone = (t: number, warm = 0) => new THREE.Color(t, t * (1 - warm * 0.015), t * (1 - warm * 0.045));

  const addFacade = (x: number, y: number, z: number, w: number, h: number, d: number, style: number, bay: number, fh: number, seed: number, t: THREE.Color) =>
    fac.push({ x, y, z, sx: w, sy: h, sz: d, tone: t, fac: [style, bay, fh, seed] });

  const roofKit = (x: number, y: number, z: number, w: number, d: number, big: boolean, mast: boolean) => {
    const n = big ? 4 : 2;
    for (let k = 0; k < n; k++) {
      const ew = range(rng, 2.2, 6), ed = range(rng, 2.2, 6), eh = range(rng, 1.4, 3.4);
      const ex = x + range(rng, -(w / 2 - ew / 2 - 1.2), w / 2 - ew / 2 - 1.2), ez = z + range(rng, -(d / 2 - ed / 2 - 1.2), d / 2 - ed / 2 - 1.2);
      if (rng() < 0.3) eqCyl.push({ x: ex, y, z: ez, sx: range(rng, 1.3, 2.3), sy: range(rng, 2, 3.2), sz: 0, tone: tone(range(rng, 0.9, 1.1)) });
      else eq.push({ x: ex, y, z: ez, sx: ew, sy: eh, sz: ed, tone: tone(range(rng, 0.88, 1.08)) });
      if (rng() < 0.45) spots.push({ x: ex, y: y + eh + 1.4, z: ez, kind: 1 });
    }
    if (mast) {
      const mx = x + w * 0.3, mz = z - d * 0.3;
      eqCyl.push({ x: mx, y, z: mz, sx: 0.25, sy: 6.5, sz: 0, tone: tone(1) });
      spots.push({ x: mx, y: y + 7.3, z: mz, kind: 2 });
    }
  };

  const buildPlot = (px: number, pz: number, W: number, D: number, kind: Kind, dd: number, hub: boolean) => {
    const podiumH = kind === "low" || kind === "mid" ? 0 : range(rng, 7, 13);
    const podW = W - range(rng, 0, 4), podD = D - range(rng, 0, 4);
    const seedP = rng() * 100;
    if (podiumH > 0) {
      addFacade(px, 0, pz, podW, podiumH, podD, 3, 5.4, 3.6, seedP, tone(range(rng, 0.97, 1.03)));
      roofKit(px, podiumH, pz, podW, podD, false, false);
      // entrance canopy on a random street side
      const side = Math.floor(rng() * 4);
      const cw = range(rng, 8, 12), cd = 4.6;
      const cx = side < 2 ? px + range(rng, -podW / 4, podW / 4) : px + (side === 2 ? 1 : -1) * (podW / 2 + cd / 2 - 0.2);
      const cz = side < 2 ? pz + (side === 0 ? 1 : -1) * (podD / 2 + cd / 2 - 0.2) : pz + range(rng, -podD / 4, podD / 4);
      canopy.push({ x: cx, y: 4.5, z: cz, sx: side < 2 ? cw : cd, sy: 0.45, sz: side < 2 ? cd : cw, tone: tone(0.8) });
    }
    let floors: number, floorH: number, style: number, bay: number;
    switch (kind) {
      case "office": floors = Math.round(range(rng, 14, 28) * (1 + Math.max(0, 1.7 - dd) * 0.35)); floorH = 3.9; style = rng() < 0.6 ? 0 : 2; bay = style === 0 ? 3.0 : 3.2; break;
      case "resi": floors = Math.round(range(rng, 14, 30)); floorH = 3.4; style = 1; bay = 3.6; break;
      case "mixed": floors = Math.round(range(rng, 9, 20)); floorH = 3.5; style = pick(rng, [0, 1, 2]); bay = style === 1 ? 3.6 : style === 2 ? 3.2 : 3.0; break;
      case "mid": floors = Math.round(range(rng, 6, 10)); floorH = 3.5; style = pick(rng, [0, 1, 2]); bay = style === 1 ? 3.6 : style === 2 ? 3.2 : 3.0; break;
      default: floors = Math.round(range(rng, 3, 6)); floorH = 3.6; style = pick(rng, [0, 1, 3]); bay = style === 1 ? 3.6 : style === 3 ? 5.4 : 2.6;
    }
    if (hub) { floors = 40; floorH = 3.9; style = 0; bay = 3.0; }
    const total = floors * floorH;
    const small = kind === "low" || kind === "mid";
    const tw = small ? W * range(rng, 0.8, 0.95) : W * range(rng, 0.5, 0.74), td = small ? D * range(rng, 0.8, 0.95) : D * range(rng, 0.5, 0.74);
    const ox = small ? 0 : range(rng, -(podW - tw) / 2, (podW - tw) / 2) * 0.8, oz = small ? 0 : range(rng, -(podD - td) / 2, (podD - td) / 2) * 0.8;
    const tx = px + ox, tz = pz + oz;
    const seedT = rng() * 100;
    const t = style === 1 ? tone(range(rng, 0.94, 1.04), 1) : tone(range(rng, 0.96, 1.04));
    const tier2 = !small && floors > 16 && (hub || rng() < 0.65);
    const h1 = tier2 ? total * 0.74 : total;
    addFacade(tx, podiumH, tz, tw, h1, td, style, bay, floorH, seedT, t);
    const id = towerId++;
    towers.push({ id, x: tx, z: tz, w: tw, d: td, base: 0, h: podiumH + h1, seed: seedT, hub });
    let top = podiumH + h1, topW = tw, topD = td, tx2 = tx, tz2 = tz;
    if (tier2) {
      topW = tw * 0.72; topD = td * 0.72; tx2 = tx + range(rng, -tw * 0.1, tw * 0.1); tz2 = tz + range(rng, -td * 0.1, td * 0.1);
      const h2 = total * 0.26;
      addFacade(tx2, top, tz2, topW, h2, topD, style, bay, floorH, seedT + 3.1, t);
      towers.push({ id, x: tx2, z: tz2, w: topW, d: topD, base: top, h: top + h2, seed: seedT + 3.1, hub });
      roofKit(tx, top, tz, tw, td, false, false); // setback terrace equipment
      top += h2;
    }
    roofKit(tx2, top, tz2, topW, topD, true, !small);
    if (!small && top > 100) {
      eqCyl.push({ x: tx2, y: top, z: tz2, sx: 0.4, sy: hub ? 26 : 16, sz: 0, tone: tone(1) });
      const g = { x: tx2, y: top + (hub ? 27 : 17), z: tz2, kind: 3 };
      spots.push(g); gateways.push(g);
    }
    if (!small && top > 60 && !hub && rng() < 0.4) spots.push({ x: tx2, y: top + 3, z: tz2, kind: 3 });
  };

  // ------------------------------------------------------------- blocks
  const overrides = new Map<string, Kind>([
    ["2,-1", "lot"], ["-2,1", "lot"], ["1,3", "lot"], ["-3,-2", "lot"],
    ["2,1", "park"], ["-2,-2", "park"], ["0,-3", "park"], ["-1,2", "park"], ["3,0", "park"],
  ]);
  for (let i = -EXT; i <= EXT; i++) {
    for (let j = -EXT; j <= EXT; j++) {
      const cx = i * P, cz = j * P, dd = Math.hypot(i, j), d8 = Math.max(Math.abs(i), Math.abs(j));
      let kind: Kind;
      const r = rng();
      if (overrides.has(`${i},${j}`)) kind = overrides.get(`${i},${j}`)!;
      else if (d8 <= 1) kind = "office";
      else if (d8 <= 3) kind = r < 0.42 ? "resi" : r < 0.78 ? "mixed" : r < 0.92 ? "office" : "mid";
      else kind = r < 0.28 ? "low" : r < 0.5 ? "resi" : r < 0.66 ? "mixed" : r < 0.78 ? "mid" : r < 0.88 ? "park" : r < 0.94 ? "lot" : "office";

      if (kind === "park") {
        parkPads.push({ x: cx, y: 0, z: cz, sx: BLOCK, sy: 0.3, sz: BLOCK, tone: white });
        paths.push({ x: cx, y: 0.3, z: cz, sx: 5, sy: 0.04, sz: BLOCK, tone: white }, { x: cx, y: 0.3, z: cz, sx: BLOCK, sy: 0.04, sz: 5, tone: white });
        if (rng() < 0.7) ponds.push({ x: cx + range(rng, -14, 14), y: 0.31, z: cz + range(rng, -14, 14), sx: range(rng, 8, 13), sy: 0.02, sz: range(rng, 6, 10), tone: white });
        for (let k = 0; k < 34; k++) {
          const tx = cx + range(rng, -32, 32), tz = cz + range(rng, -32, 32);
          if (Math.abs(tx - cx) < 4 || Math.abs(tz - cz) < 4) continue;
          trees.push({ x: tx, z: tz, s: range(rng, 0.8, 1.35), tone: rng() });
        }
        continue;
      }
      if (kind === "lot") {
        lotPads.push({ x: cx, y: 0, z: cz, sx: BLOCK - 2, sy: 0.12, sz: BLOCK - 2, tone: white });
        lotCenters.push({ x: cx, z: cz });
        spots.push({ x: cx, y: 7, z: cz, kind: 0 });
        const rows = [-24, -18.8, 18.8, 24];
        const nb = 22, bw = 2.6;
        rows.forEach((rz, ri) => {
          for (let b = 0; b <= nb; b++) bayLines.push({ x: cx + (b - nb / 2) * bw, y: 0.13, z: cz + rz, sx: 0.14, sy: 0.02, sz: 5.2, tone: white });
          for (let b = 0; b < nb; b++) bays.push({ x: cx + (b - nb / 2 + 0.5) * bw, z: cz + rz + (ri % 2 === 0 ? 0 : 0), occupied: rng() < 0.62, car: -1, sensor: -1 });
        });
        for (let k = 0; k < 6; k++) trees.push({ x: cx + range(rng, -30, 30), z: cz + (rng() < 0.5 ? -1 : 1) * range(rng, 29.5, 33), s: range(rng, 0.8, 1.1), tone: rng() });
        continue;
      }
      // developed block
      const split = (kind === "office" || kind === "resi" || kind === "mixed") && d8 > 1 && rng() < 0.45;
      const inner = BLOCK - 6;
      if (i === 0 && j === 0) buildPlot(cx, cz, inner - 8, inner - 8, "office", 0, true);
      else if (split) {
        if (rng() < 0.5) { buildPlot(cx - 16, cz, 29, inner, kind, dd, false); buildPlot(cx + 16, cz, 29, inner, kind, dd, false); }
        else { buildPlot(cx, cz - 16, inner, 29, kind, dd, false); buildPlot(cx, cz + 16, inner, 29, kind, dd, false); }
      } else if (kind === "low" && rng() < 0.6) {
        for (const [ox, oz] of [[-16, -16], [16, -16], [-16, 16], [16, 16]]) if (rng() < 0.85) buildPlot(cx + ox, cz + oz, 28, 28, "low", dd, false);
      } else buildPlot(cx, cz, inner, inner, kind, dd, false);
    }
  }

  // ------------------------------------------------------------- street trees and lamps
  const lim = (EXT + 0.5) * P;
  const nearInter = (t: number) => { const k = Math.round(t / P - 0.5); return Math.abs(t - (k + 0.5) * P); };
  for (let r = -EXT - 1; r <= EXT; r++) {
    const rc = (r + 0.5) * P;
    for (let axis = 0; axis < 2; axis++) {
      for (let side = -1; side <= 1; side += 2) {
        for (let t = -lim; t <= lim; t += q.treeSpacing) {
          const tt = t + range(rng, -3, 3);
          if (nearInter(tt) < 14) continue;
          const off = rc + side * 9;
          trees.push(axis === 0 ? { x: off, z: tt, s: range(rng, 0.75, 1.15), tone: rng() } : { x: tt, z: off, s: range(rng, 0.75, 1.15), tone: rng() });
        }
        for (let t = -lim + 6; t <= lim; t += q.lampSpacing) {
          if (nearInter(t) < 13) continue;
          const off = rc + side * 7.7;
          lamps.push(axis === 0 ? { x: off, z: t, yaw: side > 0 ? Math.PI : 0 } : { x: t, z: off, yaw: side > 0 ? Math.PI / 2 : -Math.PI / 2 });
          if (Math.abs(rc) < 4 * P && Math.abs(t) < 4 * P && rng() < 0.07) spots.push({ x: axis === 0 ? off : t, y: 8.2, z: axis === 0 ? t : off, kind: 2 });
        }
      }
    }
  }

  // ------------------------------------------------------------- meshes
  const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(6000, 6000).rotateX(-Math.PI / 2)), track(createGroundMaterial(u)));
  ground.receiveShadow = true; group.add(ground);

  const unitBox = track(new THREE.BoxGeometry(1, 1, 1)); unitBox.translate(0, 0.5, 0);
  const dummy = new THREE.Object3D();
  const fill = (mesh: THREE.InstancedMesh, items: Box[], withColor = true) => {
    items.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z); dummy.scale.set(b.sx, b.sy, b.sz); dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (withColor) mesh.setColorAt(i, b.tone);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  // facades
  const facGeo = track(new THREE.BoxGeometry(1, 1, 1)); facGeo.translate(0, 0.5, 0);
  const facAttr = new THREE.InstancedBufferAttribute(new Float32Array(fac.length * 4), 4);
  fac.forEach((b, i) => facAttr.set(b.fac!, i * 4));
  facGeo.setAttribute("aFacade", facAttr);
  const facMesh = new THREE.InstancedMesh(facGeo, track(createFacadeMaterial(u)), fac.length);
  fill(facMesh, fac); facMesh.castShadow = true; facMesh.receiveShadow = true; group.add(facMesh);

  const propMat = track(createPropMaterial(u, { roughness: 0.65, metalness: 0.25 }));
  const eqMesh = new THREE.InstancedMesh(unitBox, propMat, eq.length); fill(eqMesh, eq); eqMesh.castShadow = true; eqMesh.receiveShadow = true; group.add(eqMesh);
  const cylGeo = track(new THREE.CylinderGeometry(1, 1, 1, 14).translate(0, 0.5, 0));
  const cylMesh = new THREE.InstancedMesh(cylGeo, propMat, eqCyl.length);
  eqCyl.forEach((b, i) => { dummy.position.set(b.x, b.y, b.z); dummy.scale.set(b.sx, b.sy, b.sx); dummy.updateMatrix(); cylMesh.setMatrixAt(i, dummy.matrix); cylMesh.setColorAt(i, b.tone); });
  cylMesh.castShadow = true; group.add(cylMesh);
  const canMesh = new THREE.InstancedMesh(unitBox, track(createPropMaterial(u, { roughness: 0.4, metalness: 0.6 })), canopy.length); fill(canMesh, canopy); canMesh.castShadow = true; group.add(canMesh);

  // park, lot, path, pond, bay lines: flat pads
  const mk = (items: Box[], color: string, rough = 0.95, metal = 0) => {
    const m = new THREE.InstancedMesh(unitBox, track(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })), Math.max(1, items.length));
    items.forEach((b, i) => { dummy.position.set(b.x, b.y, b.z); dummy.scale.set(b.sx, b.sy, b.sz); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); });
    m.count = items.length; m.receiveShadow = true; group.add(m); return m;
  };
  const parkMesh = mk(parkPads, pal.grass), lotMesh = mk(lotPads, pal.asphalt), pathMesh = mk(paths, pal.walk), pondMesh = mk(ponds, pal.water, 0.15, 0.3), lineMesh = mk(bayLines, pal.mark);
  pondMesh.receiveShadow = false;

  // trees
  const canopyGeo = track(new THREE.IcosahedronGeometry(1, 1)); canopyGeo.translate(0, 1, 0);
  const trunkGeo = track(new THREE.CylinderGeometry(0.22, 0.32, 1, 6).translate(0, 0.5, 0));
  const treeMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: false }));
  const trunkMat = track(new THREE.MeshStandardMaterial({ color: pal.trunk, roughness: 1 }));
  const canMeshT = new THREE.InstancedMesh(canopyGeo, treeMat, trees.length), trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, trees.length);
  const tcol = new THREE.Color(), cA = new THREE.Color(pal.treeA), cB = new THREE.Color(pal.treeB);
  const paintTrees = (p: Palette) => {
    cA.set(p.treeA); cB.set(p.treeB);
    trees.forEach((t, i) => { tcol.copy(cA).lerp(cB, t.tone); canMeshT.setColorAt(i, tcol); });
    if (canMeshT.instanceColor) canMeshT.instanceColor.needsUpdate = true;
    trunkMat.color.set(p.trunk);
  };
  trees.forEach((t, i) => {
    const h = 4.2 * t.s;
    dummy.position.set(t.x, 0, t.z); dummy.rotation.set(0, t.tone * 6, 0); dummy.scale.set(1, h, 1); dummy.updateMatrix(); trunkMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.set(t.x, h * 0.62, t.z); dummy.scale.set(2.5 * t.s, 2.7 * t.s, 2.5 * t.s); dummy.updateMatrix(); canMeshT.setMatrixAt(i, dummy.matrix);
  });
  dummy.rotation.set(0, 0, 0);
  canMeshT.castShadow = true; canMeshT.receiveShadow = true; trunkMesh.castShadow = true;
  group.add(canMeshT, trunkMesh);

  // lamps (pole + arm + head merged into one geometry)
  const pole = new THREE.CylinderGeometry(0.1, 0.14, 8, 6).translate(0, 4, 0);
  const arm = new THREE.BoxGeometry(2.0, 0.12, 0.12).translate(1.0, 8, 0);
  const head = new THREE.BoxGeometry(0.9, 0.16, 0.4).translate(2.0, 7.92, 0);
  const lampGeo = track(mergeGeometries([pole, arm, head])!);
  pole.dispose(); arm.dispose(); head.dispose();
  const lampMat = track(new THREE.MeshStandardMaterial({ color: pal.dark ? 0x40557a : 0x5d6b80, roughness: 0.5, metalness: 0.6 }));
  const lampMesh = new THREE.InstancedMesh(lampGeo, lampMat, lamps.length);
  lamps.forEach((l, i) => { dummy.position.set(l.x, 0, l.z); dummy.rotation.set(0, l.yaw, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); lampMesh.setMatrixAt(i, dummy.matrix); });
  dummy.rotation.set(0, 0, 0);
  group.add(lampMesh);

  // ------------------------------------------------------------- smart parking
  const parked = track(new CarSet(Math.max(1, bays.length), u, pal, rng)); group.add(parked.group);
  const sensorGeo = track(new THREE.CircleGeometry(0.62, 14).rotateX(-Math.PI / 2));
  const sensorMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const sensors = new THREE.InstancedMesh(sensorGeo, sensorMat, Math.max(1, bays.length)); sensors.frustumCulled = false;
  group.add(sensors);
  const free = new THREE.Color("#34d399"), busy = new THREE.Color(pal.dark ? "#60a5fa" : "#2563eb");
  const setBay = (i: number, occ: boolean) => {
    const b = bays[i]; b.occupied = occ;
    if (occ) parked.place(i, b.x, b.z, Math.PI / 2 * (b.z > 0 ? 1 : -1) + (rng() - 0.5) * 0.04); else parked.hide(i);
    dummy.position.set(b.x, 0.16, b.z - (b.z > 0 ? 0 : 0)); dummy.scale.setScalar(occ ? 0.001 : 1); dummy.updateMatrix(); sensors.setMatrixAt(i, dummy.matrix);
    sensors.setColorAt(i, occ ? busy : free);
  };
  bays.forEach((b, i) => { parked.setKind(i, rng() < 0.12 ? VKind.Van : VKind.Car); setBay(i, b.occupied); });
  // sensors under occupied cars are hidden (scale ~0); free bays show a small status disc
  parked.flush(); sensors.instanceMatrix.needsUpdate = true; if (sensors.instanceColor) sensors.instanceColor.needsUpdate = true;
  let nextToggle = 4;
  const parking = {
    update(t: number) {
      if (t < nextToggle || !bays.length) return;
      nextToggle = t + range(rng, 0.5, 1.4);
      setBay(Math.floor(rng() * bays.length), rng() < 0.5);
      parked.flush(); sensors.instanceMatrix.needsUpdate = true; if (sensors.instanceColor) sensors.instanceColor.needsUpdate = true;
    },
  };

  const recolor = (p: Palette) => {
    (parkMesh.material as THREE.MeshStandardMaterial).color.set(p.grass);
    (lotMesh.material as THREE.MeshStandardMaterial).color.set(p.asphalt).multiplyScalar(0.92);
    (pathMesh.material as THREE.MeshStandardMaterial).color.set(p.walk);
    (pondMesh.material as THREE.MeshStandardMaterial).color.set(p.water);
    (lineMesh.material as THREE.MeshStandardMaterial).color.set(p.mark);
    lampMat.color.set(p.dark ? 0x40557a : 0x5d6b80);
    busy.set(p.dark ? "#60a5fa" : "#2563eb");
    bays.forEach((b, i) => sensors.setColorAt(i, b.occupied ? busy : free));
    if (sensors.instanceColor) sensors.instanceColor.needsUpdate = true;
    parked.recolor(p);
    paintTrees(p);
  };
  recolor(pal);
  shadowCasters(group);

  const hubT = towers.filter((t) => t.hub).sort((a, b) => b.h - a.h)[0];
  return {
    group, towers, spots, hub: new THREE.Vector3(hubT.x, hubT.h + 27, hubT.z), parking, recolor,
    dispose() { disposables.forEach((d) => d.dispose()); [facMesh, eqMesh, cylMesh, canMesh, parkMesh, lotMesh, pathMesh, pondMesh, lineMesh, canMeshT, trunkMesh, lampMesh, sensors].forEach((m) => m.dispose()); },
  };
}

function shadowCasters(g: THREE.Group) { g.traverse((o) => { o.matrixAutoUpdate = false; o.updateMatrix(); }); }
