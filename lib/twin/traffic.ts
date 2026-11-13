import * as THREE from "three";
import { PITCH } from "./materials";
import { CarSet, VKind } from "./cars";
import { mulberry32, range } from "./rand";
import type { Palette } from "./palette";
import type { Quality } from "./quality";
import type { Uniforms } from "./materials";

// Vehicles follow lanes along the road grid. Each lane is a ring (cars wrap at the edge of the
// district); cars keep a gap to their leader and stop at red signals, which cycle in a green wave.
// All vehicles are instanced (see CarSet), so traffic is 3 draw calls however many cars there are.

type Car = { p: number; v: number; vmax: number; idx: number; len: number };
type Lane = { axis: 0 | 1; road: number; off: number; dir: 1 | -1; cars: Car[] };

const CYCLE = 26;
// axis 0 = travelling along z (on a road at x = (road+.5)P); axis 1 = along x
function signal(axis: 0 | 1, ia: number, ib: number, t: number): 0 | 1 | 2 { // 0 green, 1 yellow, 2 red
  const ph = (t + ((ia + ib) & 1) * (CYCLE / 2)) % CYCLE;
  if (axis === 0) return ph < 11 ? 0 : ph < 13 ? 1 : 2;
  return ph >= 13 && ph < 24 ? 0 : ph >= 24 ? 1 : 2;
}

export class Traffic {
  cars: CarSet;
  private lanes: Lane[] = [];
  private ER: number;
  private period: number;

  constructor(q: Quality, u: Uniforms, pal: Palette) {
    const rng = mulberry32(77);
    const P = PITCH, EXT = q.extent;
    this.ER = (EXT + 0.5) * P; this.period = 2 * this.ER;
    const offs = [-5.25, -1.75, 1.75, 5.25];
    let total = 0;
    for (let road = -EXT - 1; road <= EXT; road++) {
      for (const axis of [0, 1] as const) {
        for (const off of offs) {
          const dir: 1 | -1 = off > 0 ? 1 : -1;
          const n = Math.max(2, Math.round(this.period / range(rng, q.carSpacing[0], q.carSpacing[1])));
          const lane: Lane = { axis, road, off, dir, cars: [] };
          for (let k = 0; k < n; k++) lane.cars.push({ p: -this.ER + (k + rng() * 0.5) * (this.period / n), v: 0, vmax: range(rng, 6.5, 9.5), idx: total++, len: 4.4 });
          this.lanes.push(lane);
        }
      }
    }
    this.cars = new CarSet(total, u, pal, rng);
    for (const lane of this.lanes) for (const c of lane.cars) {
      const r = rng();
      const kind = r < 0.035 ? VKind.Bus : r < 0.12 ? VKind.Van : VKind.Car;
      this.cars.setKind(c.idx, kind); c.len = kind === VKind.Bus ? 11.5 : kind === VKind.Van ? 5.4 : 4.4;
      if (kind === VKind.Bus) c.vmax *= 0.8;
      c.v = c.vmax * 0.6;
    }
    this.write();
  }

  update(dt: number, t: number) {
    const P = PITCH;
    for (const lane of this.lanes) {
      const cs = lane.cars, n = cs.length, d = lane.dir;
      // lane axis coordinate s = d * p ; stop lines sit 11.2 m before each intersection centre
      for (let i = 0; i < n; i++) {
        const c = cs[i], lead = cs[(i + 1) % n];
        let target = c.vmax;
        // leader gap
        let gap = lead.p - c.p; if (gap <= 0) gap += this.period;
        gap -= (c.len + lead.len) / 2;
        target = Math.min(target, Math.max(0, (gap - 3.5) / 7) * c.vmax);
        // next signal
        const s = d * c.p, front = s + d * (c.len / 2);
        const k = d > 0 ? Math.ceil((front + 10.7) / P - 0.5) : Math.floor((front - 10.7) / P - 0.5);
        const centre = (k + 0.5) * P, stop = centre - d * 11.2;
        const dist = (stop - front) * d;
        if (dist > -0.5 && dist < 22) {
          const sig = lane.axis === 0 ? signal(0, lane.road, k, t) : signal(1, k, lane.road, t);
          if (sig === 2 || (sig === 1 && dist > 8)) target = Math.min(target, Math.max(0, (dist - 0.8) / 18) * c.vmax);
        }
        c.v += (target - c.v) * Math.min(1, dt * 2.4);
        if (c.v < 0.02) c.v = 0;
      }
      for (let i = 0; i < n; i++) cs[i].p += cs[i].v * dt;
      // wrap: last car crossing the end re-enters at the start of the ring
      while (cs[n - 1].p > this.ER) { const c = cs.pop()!; c.p -= this.period; cs.unshift(c); }
    }
    this.write();
  }

  private write() {
    const P = PITCH; void P;
    for (const lane of this.lanes) {
      const lc = (lane.road + 0.5) * PITCH + lane.off;
      for (const c of lane.cars) {
        const s = lane.dir * c.p;
        let x: number, z: number, yaw: number;
        if (lane.axis === 0) { x = lc; z = s; yaw = lane.dir > 0 ? -Math.PI / 2 : Math.PI / 2; }
        else { z = lc; x = s; yaw = lane.dir > 0 ? 0 : Math.PI; }
        this.cars.place(c.idx, x, z, yaw);
      }
    }
    this.cars.flush();
  }

  dispose() { this.cars.dispose(); }
}
