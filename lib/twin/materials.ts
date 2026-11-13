import * as THREE from "three";
import type { Palette } from "./palette";

export const PITCH = 92; // block pitch (m)
export const ROAD_HALF = 7; // half carriageway
export const WALK_HALF = 11; // road centre to block edge

type U = { value: unknown };
export type Uniforms = Record<string, U>;

export function createUniforms(): Uniforms {
  const c = (h: string) => ({ value: new THREE.Color(h) });
  return {
    uTime: { value: 0 }, uScan: { value: -5000 }, uScanStrength: { value: 0.5 }, uLitStrength: { value: 0.3 },
    uAccent: { value: new THREE.Color("#2563eb") }, uSky: { value: new THREE.Color("#0ea5e9") },
    uWall: c("#fff"), uGlassA: c("#fff"), uGlassB: c("#fff"), uMetal: c("#fff"), uRoof: c("#fff"),
    uLitWarm: c("#fff"), uLitCool: c("#fff"), uAsphalt: c("#fff"), uWalk: c("#fff"), uPlaza: c("#fff"), uMark: c("#fff"),
  };
}

export function applyPalette(u: Uniforms, p: Palette) {
  const set = (k: string, hex: string) => (u[k].value as THREE.Color).set(hex);
  set("uWall", p.wall); set("uGlassA", p.glassA); set("uGlassB", p.glassB); set("uMetal", p.metal); set("uRoof", p.roof);
  set("uLitWarm", p.litWarm); set("uLitCool", p.litCool); set("uAsphalt", p.asphalt); set("uWalk", p.walk);
  set("uPlaza", p.plaza); set("uMark", p.mark);
  u.uLitStrength.value = p.litStrength; u.uScanStrength.value = p.scan;
}

const WORLD_POS_VERT = /* glsl */ `
varying vec3 vWP; varying vec3 vWN; varying vec4 vFac;
#ifdef FACADE
attribute vec4 aFacade;
#endif
`;

function inject(mat: THREE.MeshStandardMaterial, u: Uniforms, opts: { vertDecl?: string; vertMain?: string; fragDecl: string; afterColor?: string; afterRough?: string; afterMetal?: string; afterEmissive?: string; defines?: Record<string, string> }) {
  mat.defines = { ...(mat.defines || {}), ...(opts.defines || {}) };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", `#include <common>\n${WORLD_POS_VERT}${opts.vertDecl || ""}`)
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec4 wpI = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        #else
          vec4 wpI = modelMatrix * vec4(transformed, 1.0);
        #endif
        vWP = wpI.xyz; vWN = normal;
        #ifdef FACADE
          vFac = aFacade;
        #else
          vFac = vec4(0.0);
        #endif
        ${opts.vertMain || ""}`
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nuniform float uTime; uniform float uScan; uniform float uScanStrength; uniform float uLitStrength;\nuniform vec3 uAccent; uniform vec3 uWall; uniform vec3 uGlassA; uniform vec3 uGlassB; uniform vec3 uMetal; uniform vec3 uRoof;\nuniform vec3 uLitWarm; uniform vec3 uLitCool; uniform vec3 uAsphalt; uniform vec3 uWalk; uniform vec3 uPlaza; uniform vec3 uMark;\nvarying vec3 vWP; varying vec3 vWN; varying vec4 vFac;\n${opts.fragDecl}`)
      .replace("#include <color_fragment>", `#include <color_fragment>\n${opts.afterColor || ""}`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>\n${opts.afterRough || ""}`)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>\n${opts.afterMetal || ""}`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>\n${opts.afterEmissive || ""}`);
  };
  mat.customProgramCacheKey = () => (opts.defines ? "f" : "g") + (opts.fragDecl.length);
  return mat;
}

const HELPERS = /* glsl */ `
float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float aa(float e, float x, float w){ return smoothstep(e-w, e+w, x); }
float rect(vec2 f, vec2 lo, vec2 hi, vec2 w){ return aa(lo.x,f.x,w.x)*(1.0-aa(hi.x,f.x,w.x))*aa(lo.y,f.y,w.y)*(1.0-aa(hi.y,f.y,w.y)); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float scanBand(vec3 wp){ float sd = (wp.x + wp.z)*0.70710678 - uScan; return exp(-sd*sd/60.0) + 0.35*exp(-(sd+16.0)*(sd+16.0)/260.0); }
`;

// ---------------------------------------------------------------- facades
export function createFacadeMaterial(u: Uniforms) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0 });
  return inject(mat, u, {
    defines: { FACADE: "1" },
    fragDecl: HELPERS,
    afterColor: /* glsl */ `
      vec3 nW = normalize(vWN);
      float isTop = step(0.5, nW.y);
      float sideF = 1.0 - isTop;
      float alongX = step(abs(nW.z), abs(nW.x));
      float uCoord = mix(vWP.x, vWP.z, alongX);
      float style = vFac.x; float bay = vFac.y; float fh = vFac.z; float seed = vFac.w;
      vec2 cell = vec2(uCoord / bay, vWP.y / fh);
      vec2 id = floor(cell); vec2 f = fract(cell); vec2 fw = fwidth(cell) * 0.9 + 1e-4;
      float rnd = h21(id + seed*31.7 + alongX*7.0);
      float rnd2 = h21(id.yx*1.37 + seed*13.1 + 5.0);
      float glass = 0.0, spand = 0.0, fin = 0.0, slab = 0.0, rail = 0.0, shop = 0.0;
      if (style < 0.5) {
        float mull = aa(0.04,f.x,fw.x)*(1.0-aa(0.96,f.x,fw.x));
        glass = mull * aa(0.17,f.y,fw.y) * (1.0-aa(0.95,f.y,fw.y));
        spand = (1.0-aa(0.17,f.y,fw.y)) + aa(0.95,f.y,fw.y);
      } else if (style < 1.5) {
        glass = rect(f, vec2(0.18,0.30), vec2(0.82,0.90), fw);
        slab = 1.0 - aa(0.15, f.y, fw.y);
        rail = rect(f, vec2(0.04,0.15), vec2(0.96,0.42), fw) * (1.0-glass);
      } else if (style < 2.5) {
        float finm = aa(0.2,f.x,fw.x)*(1.0-aa(0.8,f.x,fw.x));
        glass = finm * aa(0.15,f.y,fw.y) * (1.0-aa(0.94,f.y,fw.y));
        fin = 1.0 - finm;
        spand = (1.0-aa(0.15,f.y,fw.y));
      } else {
        if (vWP.y < 5.6) {
          shop = rect(vec2(f.x, vWP.y), vec2(0.04,0.5), vec2(0.96,4.9), vec2(fw.x, fwidth(vWP.y)));
          glass = shop;
        } else {
          glass = rect(f, vec2(0.03,0.30), vec2(0.97,0.84), fw);
          spand = 0.0;
        }
      }
      glass *= sideF; shop *= sideF;
      vec3 wallC = uWall * vColor;
      vec3 glassC = mix(uGlassA, uGlassB, rnd*0.75 + 0.1) * (0.92 + 0.16*fract(seed*5.7));
      vec3 col = wallC;
      col = mix(col, uMetal, clamp(max(fin, spand), 0.0, 1.0) * sideF);
      col = mix(col, uMetal * 0.85, slab * sideF);
      col = mix(col, mix(wallC, glassC, 0.5), rail * sideF);
      col = mix(col, glassC, glass);
      col = mix(col, uRoof * vColor, isTop);
      diffuseColor.rgb = col;
    `,
    afterRough: `roughnessFactor = mix(0.78, 0.14, glass); roughnessFactor = mix(roughnessFactor, 0.55, fin);`,
    afterMetal: `metalnessFactor = mix(0.0, 0.55, glass) + 0.35 * clamp(max(fin, slab), 0.0, 1.0);`,
    afterEmissive: /* glsl */ `
      float litP = 0.05 + 0.30 * fract(seed*7.13);
      float flick = 0.5 + 0.5*sin(uTime*0.12 + rnd*40.0);
      float lit = glass * step(rnd2, litP * (0.85 + 0.3*flick));
      vec3 litC = mix(uLitWarm, uLitCool, step(0.62, fract(seed*3.3 + rnd)));
      totalEmissiveRadiance += litC * lit * uLitStrength * (0.55 + 0.45*rnd);
      totalEmissiveRadiance += uLitWarm * shop * uLitStrength * 0.55;
      totalEmissiveRadiance += uAccent * scanBand(vWP) * uScanStrength * (0.30 + 0.9*glass + 0.4*isTop);
    `,
  });
}

// plain instanced props (roof equipment, canopies, trees, lamps, cars): standard material + scan band
export function createPropMaterial(u: Uniforms, opts: { roughness?: number; metalness?: number; scan?: boolean } = {}) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: opts.roughness ?? 0.7, metalness: opts.metalness ?? 0.1 });
  if (opts.scan === false) return mat;
  return inject(mat, u, {
    fragDecl: HELPERS,
    afterEmissive: `totalEmissiveRadiance += uAccent * scanBand(vWP) * uScanStrength * 0.35;`,
  });
}

// ---------------------------------------------------------------- ground
export function createGroundMaterial(u: Uniforms) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 });
  return inject(mat, u, {
    fragDecl: HELPERS + `
      float line(float d, float w, float a){ return 1.0 - smoothstep(w - a, w + a, abs(d)); }
    `,
    afterColor: /* glsl */ `
      const float P = ${PITCH.toFixed(1)};
      vec2 q = vWP.xz / P;
      vec2 g = abs(fract(q) - 0.5) * P;
      float dx = g.x, dz = g.y;
      vec2 fwp = fwidth(vWP.xz) * 1.1 + 1e-4;
      float aw = max(fwp.x, fwp.y);
      float rx = 1.0 - step(${ROAD_HALF.toFixed(1)}, dx);
      float rz = 1.0 - step(${ROAD_HALF.toFixed(1)}, dz);
      float road = max(rx, rz);
      float inter = rx * rz;
      float walk = (1.0 - road) * (1.0 - step(${WALK_HALF.toFixed(1)}, min(dx, dz)));
      vec3 col = uPlaza;
      col = mix(col, uWalk, walk);
      col *= 0.97 + 0.05 * vnoise(vWP.xz * 0.35) * (1.0 - road);
      // curb highlight
      float curb = max(line(dx - ${ROAD_HALF.toFixed(2)}, 0.14, aw) * (1.0 - rz), line(dz - ${ROAD_HALF.toFixed(2)}, 0.14, aw) * (1.0 - rx));
      // asphalt
      float grain = vnoise(vWP.xz * 0.9) * 0.5 + vnoise(vWP.xz * 3.1) * 0.5;
      vec3 asph = uAsphalt * (0.94 + 0.1 * grain);
      col = mix(col, asph, road);
      col = mix(col, uWalk * 1.04, curb * 0.9 * (1.0 - inter));
      // markings: only on arms, never inside intersections or crossing zones
      float armX = rx * step(11.6, dz);   // arm of the road running along z
      float armZ = rz * step(11.6, dx);   // arm of the road running along x
      float dashZ = step(0.5, fract(vWP.z / 8.0));
      float dashX = step(0.5, fract(vWP.x / 8.0));
      float mk = 0.0;
      mk += armX * (line(dx - 0.2, 0.07, aw) + line(dx - 3.5, 0.08, aw) * dashZ + line(dx - 6.6, 0.07, aw));
      mk += armZ * (line(dz - 0.2, 0.07, aw) + line(dz - 3.5, 0.08, aw) * dashX + line(dz - 6.6, 0.07, aw));
      // zebra crossings
      float zebX = rx * (1.0 - rz) * step(7.6, dz) * (1.0 - step(10.6, dz)) * (1.0 - step(6.6, dx)) * step(0.5, fract(vWP.x / 1.5));
      float zebZ = rz * (1.0 - rx) * step(7.6, dx) * (1.0 - step(10.6, dx)) * (1.0 - step(6.6, dz)) * step(0.5, fract(vWP.z / 1.5));
      // stop lines
      float stopX = rx * (1.0 - rz) * (1.0 - step(0.45, abs(dz - 11.2))) * (1.0 - step(6.6, dx));
      float stopZ = rz * (1.0 - rx) * (1.0 - step(0.45, abs(dx - 11.2))) * (1.0 - step(6.6, dz));
      mk += zebX + zebZ + stopX + stopZ;
      col = mix(col, uMark, clamp(mk, 0.0, 1.0) * 0.85);
      // very soft drifting cloud shade
      float cloud = vnoise(vWP.xz * 0.0045 + vec2(uTime * 0.012, uTime * 0.006));
      col *= 0.93 + 0.07 * smoothstep(0.25, 0.75, cloud);
      diffuseColor.rgb = col;
    `,
    afterRough: `roughnessFactor = mix(0.9, 0.82, road);`,
    afterEmissive: `totalEmissiveRadiance += uAccent * scanBand(vWP) * uScanStrength * 0.5;`,
  });
}
