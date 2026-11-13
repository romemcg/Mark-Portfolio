export type Quality = {
  mobile: boolean;
  maxPR: number; minPR: number;
  antialias: boolean;
  shadowSize: number;
  env: boolean;
  carSpacing: [number, number]; // metres between cars per lane
  treeSpacing: number; lampSpacing: number;
  sensors: number;
  extent: number; // blocks each side of the centre
  ppu: number; // screen pixels per metre at the focus point
};

export function pickQuality(): Quality {
  const mobile = typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
  return mobile
    ? { mobile, maxPR: 1.25, minPR: 0.7, antialias: false, shadowSize: 2048, env: false, carSpacing: [80, 130], treeSpacing: 30, lampSpacing: 44, sensors: 70, extent: 6, ppu: 2.0 }
    : { mobile, maxPR: 1.5, minPR: 0.7, antialias: true, shadowSize: 3072, env: true, carSpacing: [56, 90], treeSpacing: 18, lampSpacing: 26, sensors: 130, extent: 7, ppu: 2.3 };
}

// Adaptive pixel ratio: if frames get slow while the reveal is active, drop resolution a step.
export class FrameGovernor {
  private acc = 0; private n = 0;
  constructor(private onSlow: () => void, private slowMs = 26, private window = 45) {}
  tick(dtSec: number) {
    this.acc += dtSec; this.n++;
    if (this.n >= this.window) {
      if (this.acc / this.n > this.slowMs / 1000) this.onSlow();
      this.acc = 0; this.n = 0;
    }
  }
  reset() { this.acc = 0; this.n = 0; }
}
