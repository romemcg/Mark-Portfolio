import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { INK_R0, REVEAL_RADIUS, SCRIM_R1, type RevealState } from "./reveal";
import { pickQuality, FrameGovernor, type Quality } from "./quality";
import { DARK, LIGHT, isDark, readVar, type Palette } from "./palette";
import { applyPalette, createUniforms, type Uniforms } from "./materials";
import { buildCity, type CityData } from "./city";
import { Traffic } from "./traffic";
import { Overlay } from "./overlay";

export type Twin = {
  render(m: RevealState, tMs: number): void;
  setScrim(rects: number[][]): void; // viewport CSS px [x, y, w, h] of hero text lines
  fade(): number; // 0..1 reveal fade-in, shared with the CSS text layer
  resize(w: number, h: number): void;
  setTheme(): void;
  stats(): { pr: number; frameMs: number; calls: number; triangles: number; geometries: number; textures: number; active: boolean };
  dispose(): void;
};

// Screen-space reveal mask. The scene is drawn only inside a scissor box around the pointer and
// then multiplied by the same falloff the original glyph layer used (alpha = min(1, 1.3 * (1 - d/R))).
const MASK_FRAG = /* glsl */ `
uniform vec2 uC; uniform float uR; uniform float uFade;
void main(){
  float d = length(gl_FragCoord.xy - uC) / uR;
  float a = clamp(1.3 * (1.0 - d), 0.0, 1.0) * uFade;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}`;

// Text scrim: a restrained deep-navy darkening behind the hero text lines, inside the reveal only. Same
// radial ramp as the white text layer (INK_R0..SCRIM_R1): full strength where the text is white, fading out behind the dark text.
const MAX_RECTS = 6;
const SCRIM_FRAG = /* glsl */ `
uniform vec2 uC; uniform float uR; uniform float uK; uniform float uS; uniform vec2 uEdge; uniform vec3 uCol;
uniform vec4 uRect[${MAX_RECTS}];
void main(){
  vec2 p = gl_FragCoord.xy;
  float d = length(p - uC) / uR;
  float g = clamp((${SCRIM_R1.toFixed(3)} - d) / ${(SCRIM_R1 - INK_R0).toFixed(3)}, 0.0, 1.0);
  float m = 0.0;
  for (int i = 0; i < ${MAX_RECTS}; i++) {
    vec2 q = abs(p - uRect[i].xy) - uRect[i].zw + uEdge.y;
    float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uEdge.y;
    m = max(m, 1.0 - smoothstep(-uEdge.x, uEdge.x, sd));
  }
  float a = uS * m * g * uK;
  gl_FragColor = vec4(uCol * a, a);
}`;

export function createTwin(canvas: HTMLCanvasElement, quality?: Quality): Twin {
  const q = quality ?? pickQuality();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: q.antialias, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  renderer.autoClear = false;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // the sun is static: shadows are rendered once
  renderer.setClearColor(0x000000, 0);

  let pal: Palette = isDark() ? DARK : LIGHT;
  const U: Uniforms = createUniforms();
  applyPalette(U, pal);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(pal.fog, 900, 2300);
  let envTex: THREE.Texture | null = null;
  if (q.env) {
    const pm = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    envTex = pm.fromScene(room, 0.04).texture;
    scene.environment = envTex;
    room.dispose(); pm.dispose();
  }

  const hemi = new THREE.HemisphereLight(pal.hemiSky, pal.hemiGround, pal.hemiI);
  const sun = new THREE.DirectionalLight(pal.sun, pal.sunI);
  const sunDir = new THREE.Vector3(-0.55, 0.78, -0.3).normalize(); // from the south-east, low enough to read facades
  sun.position.copy(sunDir).multiplyScalar(900);
  sun.castShadow = true;
  const sc = sun.shadow.camera; const ext = (q.extent + 0.7) * 92;
  sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 100; sc.far = 2200; sc.updateProjectionMatrix();
  sun.shadow.mapSize.set(q.shadowSize, q.shadowSize); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6; sun.shadow.radius = 3;
  scene.add(hemi, sun, sun.target);

  const city: CityData = buildCity(q, U, pal);
  scene.add(city.group);
  const traffic = new Traffic(q, U, pal);
  scene.add(traffic.cars.group);
  const overlay = new Overlay(city, q, pal);
  scene.add(overlay.group);

  // ---- mask quad
  const maskScene = new THREE.Scene();
  const maskCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const maskMat = new THREE.ShaderMaterial({
    uniforms: { uC: { value: new THREE.Vector2() }, uR: { value: 1 }, uFade: { value: 0 } },
    vertexShader: "void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: MASK_FRAG,
    depthTest: false, depthWrite: false, transparent: true,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.ZeroFactor, blendDst: THREE.SrcAlphaFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.SrcAlphaFactor,
  });
  const maskGeo = new THREE.PlaneGeometry(2, 2);
  maskScene.add(new THREE.Mesh(maskGeo, maskMat));

  // ---- text scrim quad (drawn after the mask, premultiplied-over, alpha channel composited normally)
  const scrimScene = new THREE.Scene();
  const rectU = Array.from({ length: MAX_RECTS }, () => new THREE.Vector4(-1e5, -1e5, 0, 0));
  const scrimMat = new THREE.ShaderMaterial({
    uniforms: {
      uC: { value: new THREE.Vector2() }, uR: { value: 1 }, uK: { value: 0 }, uS: { value: 0.8 },
      uEdge: { value: new THREE.Vector2(18, 10) }, uCol: { value: new THREE.Vector3(10 / 255, 22 / 255, 46 / 255) }, uRect: { value: rectU },
    },
    vertexShader: "void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: SCRIM_FRAG,
    depthTest: false, depthWrite: false, transparent: true,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
  scrimScene.add(new THREE.Mesh(maskGeo, scrimMat));
  let scrimRects: number[][] = [];
  const setScrim = (r: number[][]) => { scrimRects = r; };

  // ---- camera: elevated three-quarter view, narrow FOV for gentle perspective
  const FOV = 18, PITCH0 = 46, YAW0 = 36;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 6000);
  const target = new THREE.Vector3(0, 16, 0);
  let camDist = 900;
  const par = { x: 0, y: 0 }; // damped parallax
  let W = 1, H = 1, pr = Math.min(window.devicePixelRatio || 1, q.maxPR);

  const frame = () => {
    camDist = (H / q.ppu) / (2 * Math.tan((FOV * Math.PI) / 360));
    camera.aspect = W / H; camera.near = camDist * 0.3; camera.far = camDist * 3.4; camera.updateProjectionMatrix();
    (scene.fog as THREE.Fog).near = camDist * 0.95; (scene.fog as THREE.Fog).far = camDist * 2.1;
  };
  const resize = (w: number, h: number) => {
    W = Math.max(1, w); H = Math.max(1, h);
    renderer.setPixelRatio(pr); renderer.setSize(W, H, false);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    frame();
  };
  resize(window.innerWidth, window.innerHeight);

  const setTheme = () => {
    pal = isDark() ? DARK : LIGHT;
    applyPalette(U, pal);
    const acc = readVar("--accent", [37, 99, 235]), sky = readVar("--blue", [14, 165, 233]);
    const accent = new THREE.Color(`rgb(${acc[0]},${acc[1]},${acc[2]})`), skyC = new THREE.Color(`rgb(${sky[0]},${sky[1]},${sky[2]})`);
    (U.uAccent.value as THREE.Color).copy(accent); (U.uSky.value as THREE.Color).copy(skyC);
    (scene.fog as THREE.Fog).color.set(pal.fog);
    hemi.color.set(pal.hemiSky); hemi.groundColor.set(pal.hemiGround); hemi.intensity = pal.hemiI;
    sun.color.set(pal.sun); sun.intensity = pal.sunI;
    scene.environmentIntensity = pal.envI;
    city.recolor(pal); traffic.cars.recolor(pal); overlay.setPalette(pal, accent, skyC);
    renderer.shadowMap.needsUpdate = true; // shadows are static; re-render them once
  };
  setTheme();

  // ---- loop state
  let on = false, last = 0, time = 0, fade = 0, frames = 0, ema = 16;
  let slowSteps = 0;
  const gov = new FrameGovernor(() => {
    if (pr > q.minPR + 0.01 && slowSteps < 4) { slowSteps++; pr = Math.max(q.minPR, pr - 0.2); resize(W, H); }
  });
  const scanCycle = 24;

  const clearAll = () => { renderer.setScissorTest(false); renderer.clear(true, true, true); };

  const render = (m: RevealState, tMs: number) => {
    if (!(m.x > -999)) { if (on) { clearAll(); on = false; } return; }
    if (!on) { on = true; fade = 0; last = tMs; gov.reset(); }
    const dt = Math.min(0.05, Math.max(0.001, (tMs - last) / 1000)); last = tMs; time += dt; frames++;
    ema += (dt * 1000 - ema) * 0.1;
    gov.tick(dt);
    fade = Math.min(1, fade + dt / 0.16);

    // camera: parallax is secondary; the reveal position never changes what part of the city is shown
    const nx = THREE.MathUtils.clamp((m.x / W - 0.5) * 2, -1, 1), ny = THREE.MathUtils.clamp((m.y / H - 0.5) * 2, -1, 1);
    const k = 1 - Math.pow(0.001, dt / 0.9); // ~0.9 s settle
    par.x += (nx - par.x) * k; par.y += (ny - par.y) * k;
    const yaw = THREE.MathUtils.degToRad(YAW0 + par.x * 3.2), pitch = THREE.MathUtils.degToRad(PITCH0 - par.y * 1.8);
    camera.position.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(camDist).add(target);
    camera.lookAt(target);
    camera.translateX(par.x * 9); camera.translateY(-par.y * 5); // small lateral drift gives depth-aware motion
    camera.updateMatrixWorld();

    // animation
    U.uTime.value = time;
    sun.intensity = pal.sunI * (1 + 0.035 * Math.sin(time * 0.17)); // soft lighting variation
    const ph = time % scanCycle, sp = ph / 16; // 16 s sweep, 8 s rest
    U.uScan.value = sp < 1 ? -760 + 1520 * (sp * sp * (3 - 2 * sp)) : -5000;
    traffic.update(dt, time);
    city.parking.update(time);
    const pxScale = renderer.domElement.height / (2 * Math.tan((FOV * Math.PI) / 360));
    overlay.update(time, pxScale);
    overlay.updateFocus(camera, W, H, m.x, m.y, dt);

    // render only the pixels inside the reveal window
    const R = REVEAL_RADIUS, pad = 3;
    const bx = Math.max(0, Math.floor(m.x - R - pad)), bw = Math.min(W - bx, Math.ceil(2 * R + 2 * pad));
    const by = Math.max(0, Math.floor(H - (m.y + R + pad))), bh = Math.min(H - by, Math.ceil(2 * R + 2 * pad));
    clearAll();
    renderer.setScissorTest(true); renderer.setScissor(bx, by, bw, bh);
    renderer.render(scene, camera);
    const u = maskMat.uniforms;
    u.uC.value.set(m.x * pr, (H - m.y) * pr); u.uR.value = R * pr; u.uFade.value = fade * Math.max(0, m.k);
    renderer.render(maskScene, maskCam);
    // hero text scrim (CSS px, y down -> device px, y up)
    const su = scrimMat.uniforms, n = Math.min(MAX_RECTS, scrimRects.length);
    for (let i = 0; i < MAX_RECTS; i++) {
      if (i < n) { const [x, y, w, h] = scrimRects[i]; rectU[i].set((x + w / 2) * pr, (H - (y + h / 2)) * pr, (w / 2) * pr, (h / 2) * pr); }
      else rectU[i].set(-1e5, -1e5, 0, 0);
    }
    su.uC.value.copy(u.uC.value); su.uR.value = R * pr; su.uK.value = fade * Math.max(0, m.k); su.uEdge.value.set(18 * pr, 10 * pr);
    if (n > 0) renderer.render(scrimScene, maskCam);
    renderer.setScissorTest(false);
  };

  // first frame builds the static shadow map
  renderer.shadowMap.needsUpdate = true;

  const onLost = (e: Event) => e.preventDefault();
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    render, resize, setTheme, setScrim, fade: () => fade,
    stats: () => ({ pr, frameMs: ema, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, active: on }),
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      city.dispose(); traffic.dispose(); overlay.dispose(); maskGeo.dispose(); maskMat.dispose(); scrimMat.dispose();
      envTex?.dispose(); sun.shadow.map?.dispose();
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
