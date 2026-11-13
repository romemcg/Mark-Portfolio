// Mask-synchronized adaptive hero text contrast.
//
// The hero renders its text twice: the real, accessible layer (dark, unchanged) and an aria-hidden
// white duplicate ([data-twin-ink]) laid out identically. The duplicate is clipped by a CSS radial
// mask driven by the SAME eased pointer state as the 3D reveal, so letters change colour exactly along
// the mask boundary. Per frame this writes three CSS variables and an opacity (no React renders), and
// hands the text line rectangles to the 3D layer for a restrained scrim.
import { REVEAL_RADIUS, SCRIM_R1 } from "./reveal";
import type { RevealState } from "./reveal";
import type { Twin } from "./scene";

export type Ink = { update(m: RevealState, twin: Twin | null): void; dispose(): void };

export function createInk(): Ink {
  let el: HTMLElement | null = null, shown = false, scrimOn = false;
  const range = document.createRange();
  const hide = (twin: Twin | null) => {
    if (shown && el) { el.style.opacity = "0"; shown = false; }
    if (scrimOn) { twin?.setScrim([]); scrimOn = false; }
  };
  const lines = (): number[][] => {
    const out: number[][] = [];
    document.querySelectorAll<HTMLElement>("[data-twin-line]").forEach((n) => {
      const t = n.firstChild && n.firstChild.nodeType === 3 ? n.firstChild : n;
      range.selectNodeContents(t);
      for (const r of Array.from(range.getClientRects())) {
        if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight) continue;
        // font boxes are taller than the glyphs: trim large text to the visible glyph band, pad sideways
        const big = r.height > 40, y = r.top + (big ? r.height * 0.14 : 0), h = big ? r.height * 0.72 : r.height;
        out.push([r.left - 10, y - 5, r.width + 20, h + 10]);
      }
    });
    return out;
  };
  return {
    update(m, twin) {
      const active = !!twin && m.x > -999;
      if (!active) { hide(twin); return; }
      if (!el || !el.isConnected) el = document.querySelector<HTMLElement>("[data-twin-ink]");
      if (!el) { hide(twin); return; }
      const dark = document.documentElement.dataset.theme === "dark"; // dark theme text is already light
      const b = el.getBoundingClientRect();
      const a = dark ? 0 : twin!.fade() * Math.max(0, m.k);
      const s = el.style;
      s.setProperty("--mx", (m.x - b.left).toFixed(1) + "px");
      s.setProperty("--my", (m.y - b.top).toFixed(1) + "px");
      s.setProperty("--mr", REVEAL_RADIUS + "px");
      s.opacity = a.toFixed(3); shown = true;
      // only text the reveal can reach needs a scrim
      const reach = REVEAL_RADIUS * SCRIM_R1 + 30;
      twin!.setScrim(lines().filter(([x, y, w, h]) => x < m.x + reach && x + w > m.x - reach && y < m.y + reach && y + h > m.y - reach));
      scrimOn = true;
    },
    dispose() { if (el) el.style.opacity = "0"; },
  };
}
