// Shared reveal ("mask") controller.
//
// This is the existing TechBackground pointer logic, extracted so the 2D dot layer and the
// 3D digital twin layer are driven by exactly one mask: same position, same easing (0.14 per
// frame), same radius, same instant reset.
//
// Mobile fix: the original listened to `pointermove` only. On touch devices the browser fires
// pointercancel as soon as it takes over for scrolling, and there was no pointerdown/up
// handling, so the reveal never really worked on phones. Touch now uses the same Pointer
// Events: pointerdown starts the reveal, pointermove drags it, and touch end/cancel leave it
// anchored at the last touch point (a mouse leaving the window still resets it). Listeners are passive and never call
// preventDefault, so vertical scrolling stays with the browser. See DIGITAL_TWIN.md.

export const REVEAL_RADIUS = 260;
export const OFF = -9999;
// Adaptive text contrast, all fractions of REVEAL_RADIUS from the same eased pointer position:
//  - white text flips on between INK_R1 (gone) and INK_R0 (fully white): a narrow ramp, so letters switch colour
//    exactly along one boundary;
//  - the city scrim is at full strength inside INK_R0 and fades to nothing by SCRIM_R1, so the flip happens
//    while the background behind the text is still dark enough for either colour to be readable.
export const INK_R0 = 0.5;
export const INK_R1 = 0.56;
export const SCRIM_R1 = 0.8;

export type RevealState = {
  x: number; y: number; // eased position (what both layers draw)
  tx: number; ty: number; // target position (latest pointer)
  touch: boolean;
  k: number; // visibility multiplier, 1 while active; ramps to 0 when a touch ends
  leaving: boolean;
};

export type RevealController = {
  state: RevealState;
  step(): void; // call once per frame
  isOn(): boolean;
  dispose(): void;
};

// The one live mask. TechBackground owns the controller (pointer listeners, easing, step()); other layers, such as the
// case study building, read its state instead of adding a second mask. null while no controller exists (reduced motion).
let active: RevealController | null = null;
export const getActiveReveal = (): RevealController | null => active;

export function createReveal(opts: { onActivate?: () => void } = {}): RevealController {
  const m: RevealState = { x: OFF, y: OFF, tx: OFF, ty: OFF, touch: false, k: 1, leaving: false };
  const isOn = () => m.x > -999;
  const reset = () => { m.tx = OFF; m.ty = OFF; m.x = OFF; m.y = OFF; m.k = 1; m.leaving = false; };
  const move = (e: PointerEvent) => {
    m.tx = e.clientX; m.ty = e.clientY; m.touch = e.pointerType === "touch"; m.k = 1; m.leaving = false;
    if (!isOn()) { m.x = e.clientX; m.y = e.clientY; opts.onActivate?.(); }
  };
  // Touch end / cancel (including the browser taking over to scroll) intentionally does nothing: the reveal stays
  // anchored at the last touch point (viewport coordinates, so page scrolling cannot move it) until a new touch.
  // Only a mouse leaving the window, or the window losing focus, resets it.
  const leave = (e?: Event) => { if ((e as PointerEvent | undefined)?.pointerType === "touch") return; reset(); };

  const optsPassive = { passive: true } as const;
  window.addEventListener("pointermove", move, optsPassive);
  window.addEventListener("pointerdown", move, optsPassive); // touch: a touch starts the reveal
  document.addEventListener("pointerleave", leave);
  window.addEventListener("blur", leave);

  const controller: RevealController = {
    state: m,
    isOn,
    step() {
      m.x += (m.tx - m.x) * 0.14; m.y += (m.ty - m.y) * 0.14;
      if (m.leaving) { m.k -= 1 / 10; if (m.k <= 0) reset(); } // ~10 frames, about 160 ms
    },
    dispose() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      if (active === controller) active = null;
    },
  };
  active = controller;
  return controller;
}
