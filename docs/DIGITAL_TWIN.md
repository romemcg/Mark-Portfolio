# Digital-twin reveal

## What changed
The cursor/touch mask that used to reveal an acronym-glyph field now reveals a real-time 3D smart-city digital twin. The default page is unchanged (white, minimal); the city exists only inside the mask.

## Architecture
- `components/TechBackground.tsx` – owns the 2D dot canvas and a second fixed, pointer-events-none WebGL canvas (`-z-10`). Lazy-loads the twin via dynamic `import()`.
- `lib/twin/reveal.ts` – shared reveal controller (pointer tracking, easing 0.14, radius 260, reset). Used by both the 2D layer and the 3D layer so the mask behaves identically.
- `lib/twin/scene.ts` – renderer, camera (fixed, damped parallax only), scissor-limited render around the pointer, final mask quad that multiplies the framebuffer by the original falloff `clamp(1.3*(1-d/R))`.
- `city.ts`, `materials.ts`, `cars.ts`, `traffic.ts`, `overlay.ts` – procedural city (InstancedMesh everywhere), facade shader, vehicles (3 draw calls), traffic, twin overlays (wireframes, links, pulses, sensor nodes, scan sweep).
- `palette.ts`, `quality.ts`, `rand.ts` – theme palette, adaptive quality (FrameGovernor, adaptive DPR), seeded RNG.
- All geometry/textures are procedural. No third-party assets. Three.js 0.170 (MIT) is the only new dependency.

## Mobile touch fix (necessary interaction fix, not a redesign)
The original effect was mouse-only. Touch now uses the same mechanism:
- Pointer Events with passive listeners; no `preventDefault()`.
- `html { touch-action: pan-y pinch-zoom }` so vertical scrolling, links and navigation keep working.
- Touch end/cancel does nothing: the reveal stays where the last touch was (as in the original effect) and the next touch glides it to the new spot. Mouse leave still resets instantly.

## Fallbacks
Original glyph reveal is used if WebGL2 is unavailable, saveData is on, deviceMemory < 2, or the context is lost/fails. Reduced motion: no reveal and no twin (original behavior).

## Performance design
Scissor-limited rendering, static shadow map, instancing, adaptive pixel ratio, lazy load (desktop on idle, touch on first touch), pause when hidden, full disposal on unmount.
