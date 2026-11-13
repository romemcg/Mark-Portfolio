import * as THREE from "three";
import { createPropMaterial, type Uniforms } from "./materials";
import type { Palette } from "./palette";
import type { Rng } from "./rand";

// Cars, vans and buses as three instanced meshes (body, cabin glass, soft contact shadow).
// 3 draw calls for every vehicle in the city, moving or parked.
export const VKind = { Car: 0, Van: 1, Bus: 2 } as const;
export type VKind = (typeof VKind)[keyof typeof VKind];

const DIMS = [
  { l: 4.4, h: 0.95, w: 1.8, cl: 2.3, ch: 0.78, cw: 1.62, co: -0.25 }, // car
  { l: 5.4, h: 1.75, w: 2.0, cl: 0, ch: 0, cw: 0, co: 0 }, // van
  { l: 11.5, h: 3.1, w: 2.55, cl: 0, ch: 0, cw: 0, co: 0 }, // bus
];

export class CarSet {
  group = new THREE.Group();
  body: THREE.InstancedMesh; cabin: THREE.InstancedMesh; shade: THREE.InstancedMesh;
  private kinds: Uint8Array;
  private cabinMat: THREE.MeshStandardMaterial;
  private unit = new THREE.BoxGeometry(1, 1, 1);
  private plane = new THREE.PlaneGeometry(1, 1);

  constructor(public count: number, u: Uniforms, private pal: Palette, rng: Rng) {
    this.unit.translate(0, 0.5, 0);
    this.plane.rotateX(-Math.PI / 2);
    this.kinds = new Uint8Array(count);
    this.body = new THREE.InstancedMesh(this.unit, createPropMaterial(u, { roughness: 0.38, metalness: 0.5 }), count);
    this.cabinMat = createPropMaterial(u, { roughness: 0.12, metalness: 0.75 });
    this.cabin = new THREE.InstancedMesh(this.unit, this.cabinMat, count);
    this.shade = new THREE.InstancedMesh(
      this.plane,
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26, depthWrite: false }),
      count
    );
    this.body.castShadow = false;
    for (const m of [this.body, this.cabin, this.shade]) { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.group.add(m); }
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      c.set(pal.car[Math.floor(rng() * pal.car.length)]);
      this.body.setColorAt(i, c);
      this.hide(i);
    }
    this.recolor(pal);
  }

  recolor(p: Palette) {
    this.pal = p;
    this.cabinMat.color.set(p.dark ? "#0c1830" : "#26334a");
    (this.shade.material as THREE.MeshBasicMaterial).opacity = p.dark ? 0.5 : 0.26;
  }

  setKind(i: number, kind: VKind) { this.kinds[i] = kind; }

  private write(mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, c: number, s: number, sx: number, sy: number, sz: number) {
    const a = mesh.instanceMatrix.array as Float32Array; const o = i * 16;
    a[o] = c * sx; a[o + 1] = 0; a[o + 2] = -s * sx; a[o + 3] = 0;
    a[o + 4] = 0; a[o + 5] = sy; a[o + 6] = 0; a[o + 7] = 0;
    a[o + 8] = s * sz; a[o + 9] = 0; a[o + 10] = c * sz; a[o + 11] = 0;
    a[o + 12] = x; a[o + 13] = y; a[o + 14] = z; a[o + 15] = 1;
  }

  place(i: number, x: number, z: number, yaw: number) {
    const d = DIMS[this.kinds[i]]; const c = Math.cos(yaw), s = Math.sin(yaw);
    const lift = this.kinds[i] === VKind.Car ? 0.34 : 0.45;
    this.write(this.body, i, x, lift, z, c, s, d.l, d.h, d.w);
    if (d.cl > 0) this.write(this.cabin, i, x + c * d.co, lift + d.h * 0.95, z - s * d.co, c, s, d.cl, d.ch, d.cw);
    else this.write(this.cabin, i, x, -50, z, c, s, 0.0001, 0.0001, 0.0001);
    this.write(this.shade, i, x, 0.07, z, c, s, d.l * 1.12, 1, d.w * 1.2);
  }

  hide(i: number) { for (const m of [this.body, this.cabin, this.shade]) this.write(m, i, 0, -80, 0, 1, 0, 0.0001, 0.0001, 0.0001); }
  flush() { this.body.instanceMatrix.needsUpdate = true; this.cabin.instanceMatrix.needsUpdate = true; this.shade.instanceMatrix.needsUpdate = true; if (this.body.instanceColor) this.body.instanceColor.needsUpdate = true; }

  dispose() { this.unit.dispose(); this.plane.dispose(); for (const m of [this.body, this.cabin, this.shade]) { (m.material as THREE.Material).dispose(); m.dispose(); } }
}
