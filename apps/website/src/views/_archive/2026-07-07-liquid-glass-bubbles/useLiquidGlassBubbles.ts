import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  type Ref,
} from 'vue';
import * as THREE from 'three';

const MAX_DROPLETS = 40;
const FIXED_DT_MS = 8;
const MAX_FRAME_DT_MS = 100;
const MAX_CATCHUP = 6;
const MAX_ENTRIES = MAX_DROPLETS * 2;
const RESIZE_DEBOUNCE_MS = 200;

const DAMP = 0.993;
const MOUSE_R = 0.18;
const MOUSE_F = 0.004;
const TENSION_RANGE = 0.12;
const TENSION_F = 0.0004;
const MERGE_RATIO = 0.62;
const SPLIT_SPEED = 0.013;
const SPLIT_MIN_R = 0.04;
const MAX_SPEED = 0.015;
const BOUNCE = 0.4;
const WANDER_F = 0.00004;
const CENTER_PULL = 0.000008;
const SOFT_STIFFNESS = 0.22;
const SOFT_DAMPING = 0.6;

const CURSOR_BUBBLE_R = 0.1;
const CURSOR_SPRING = 0.32;
const CURSOR_DAMP = 0.68;
const CURSOR_MAX_SPEED = 0.045;

const TITLE_FONT =
  '"EDS Text", "PingFang SC", "SourceHanSansSC", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
const SUBTITLE_FONT = "'Space Grotesk', sans-serif";

type Droplet = {
  id: number;
  x: number;
  y: number;
  r: number;
  area: number;
  vx: number;
  vy: number;
  alive: boolean;
  wanderAngle: number;
  wanderSpeed: number;
  softPrevX: number;
  softPrevY: number;
  softOffX: number;
  softOffY: number;
  softVelX: number;
  softVelY: number;
  followsCursor?: boolean;
};

export type LiquidGlassBubblesOptions = {
  title?: string;
  subtitle?: string;
};

const DEFAULT_OPTIONS: Required<LiquidGlassBubblesOptions> = {
  title: 'EDS.',
  subtitle: 'EverGreen Ecosystem Builder',
};

const TITLE_SUBTITLE_GAP = 0;
const SUBTITLE_SIZE = 56;

function buildFragmentShader(maxEntries: number) {
  return /* glsl */ `
precision highp float;
#define MAX_N ${maxEntries}

uniform vec2 uRes;
uniform sampler2D uData;
uniform sampler2D uBg;
uniform int uCount;
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);

  float field = 0.0;
  vec2 grad = vec2(0.0);
  vec2 lens = vec2(0.0);
  float lensW = 0.0;

  for (int i = 0; i < MAX_N; i++) {
    if (i >= uCount) break;
    vec4 d = texture2D(uData, vec2((float(i) + 0.5) / float(MAX_N), 0.5));
    vec2 c = d.xy;
    float r = d.z;
    if (r < 0.001) continue;
    vec2 delta = p - c;
    float dSq = dot(delta, delta) + 1e-5;
    float contrib = r * r / dSq;
    field += contrib;
    grad += -2.0 * contrib / dSq * delta;
    float w = r * r / (dSq + r * r);
    lens += (c - p) * w;
    lensW += w;
  }

  lens /= (lensW + 0.001);
  float lensLen = length(lens);

  float thr = 1.0;
  float edge = smoothstep(thr - 0.08, thr + 0.03, field);

  float mappedLens = atan(lensLen * 6.0) * 0.035;
  vec2 refractDir = (lensLen > 1e-5) ? lens / lensLen : vec2(0.0);
  float refractMask = smoothstep(thr - 0.2, thr + 1.5, field);
  vec2 refractedUV = clamp(uv + refractDir * mappedLens * refractMask, 0.001, 0.999);

  vec3 bgClean = texture2D(uBg, uv).rgb;

  float gradLen = length(grad);
  float nScale = atan(gradLen * 0.5) * 0.3;
  vec2 nGrad = (gradLen > 1e-4) ? (grad / gradLen) * nScale : vec2(0.0);
  vec3 N = normalize(vec3(-nGrad, 1.0));
  vec3 L = normalize(vec3(0.3, 0.6, 1.0));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, H), 0.0), 180.0);
  float cosTheta = max(dot(N, V), 0.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 4.0);
  float rim = smoothstep(thr + 0.6, thr, field) * edge;

  float caStr = 0.0018 * edge;
  vec3 bgCA;
  bgCA.r = texture2D(uBg, refractedUV + vec2(caStr, caStr * 0.5)).r;
  bgCA.g = texture2D(uBg, refractedUV).g;
  bgCA.b = texture2D(uBg, refractedUV - vec2(caStr, caStr * 0.5)).b;

  float depth = smoothstep(thr, thr + 3.0, field);
  vec3 tint = mix(vec3(1.0), vec3(0.93, 0.96, 1.0), depth * 0.45);
  vec3 glassColor = bgCA * tint * (0.92 + 0.08 * diff)
    + vec3(1.0) * spec * 0.85
    + vec3(0.9, 0.95, 1.0) * rim * 0.22
    + vec3(1.0) * fresnel * 0.10;

  float shadowField = smoothstep(thr - 0.35, thr - 0.05, field);
  vec3 bg = bgClean * (1.0 - shadowField * 0.06);

  float borderOuter = smoothstep(thr - 0.10, thr - 0.01, field);
  float borderInner = smoothstep(thr + 0.0, thr + 0.06, field);
  float border = borderOuter * (1.0 - borderInner) * 0.28;

  vec3 col = mix(bg, glassColor, edge);
  col += vec3(1.0) * border;

  gl_FragColor = vec4(col, 1.0);
}
`;
}

function readContainerSize(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  return {
    width: Math.max(1, rect.width, container.clientWidth),
    height: Math.max(1, rect.height, container.clientHeight),
  };
}

export function useLiquidGlassBubbles(
  containerRef: Ref<HTMLElement | null>,
  options: LiquidGlassBubblesOptions = {},
) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  let disposed = false;
  let rafId = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let intersectionObserver: IntersectionObserver | undefined;

  let renderer: THREE.WebGLRenderer | undefined;
  let scene: THREE.Scene | undefined;
  let camera: THREE.OrthographicCamera | undefined;
  let mat: THREE.ShaderMaterial | undefined;
  let bgCanvas: HTMLCanvasElement | undefined;
  let bgCtx: CanvasRenderingContext2D | null = null;
  let bgTexture: THREE.CanvasTexture | undefined;
  let dropletBuf = new Float32Array(MAX_ENTRIES * 4);
  let dropletTex: THREE.DataTexture | undefined;
  let drops: Droplet[] = [];
  let uid = 0;
  let aspect = 1;
  let paused = false;
  let inView = true;
  let last = performance.now();
  let acc = 0;
  let spawnCD = 0;
  let autoTimer = 0;
  let simTime = 0;

  const mouse = { x: 999, y: 999, active: false, down: false };

  function regularDrops() {
    return drops.filter((d) => !d.followsCursor && d.alive);
  }

  function spawn(x: number, y: number, r: number, vx = 0, vy = 0) {
    if (regularDrops().length >= MAX_DROPLETS) return null;
    const area = Math.PI * r * r;
    const angle = Math.random() * Math.PI * 2;
    const spd = 0.0003 + Math.random() * 0.0008;
    const d: Droplet = {
      id: uid++,
      x,
      y,
      r,
      area,
      vx: vx || Math.cos(angle) * spd,
      vy: vy || Math.sin(angle) * spd,
      alive: true,
      wanderAngle: Math.random() * Math.PI * 2,
      wanderSpeed: 0.3 + Math.random() * 0.5,
      softPrevX: x,
      softPrevY: y,
      softOffX: 0,
      softOffY: 0,
      softVelX: 0,
      softVelY: 0,
    };
    drops.push(d);
    return d;
  }

  function spawnCursorBubble() {
    const r = CURSOR_BUBBLE_R;
    const area = Math.PI * r * r;
    const d: Droplet = {
      id: uid++,
      x: 0,
      y: 0,
      r,
      area,
      vx: 0,
      vy: 0,
      alive: true,
      wanderAngle: 0,
      wanderSpeed: 0,
      softPrevX: 0,
      softPrevY: 0,
      softOffX: 0,
      softOffY: 0,
      softVelX: 0,
      softVelY: 0,
      followsCursor: true,
    };
    drops.unshift(d);
    return d;
  }

  function drawBackground() {
    if (!bgCtx || !renderer || !bgCanvas || !bgTexture) return;

    const w = renderer.domElement.width;
    const h = renderer.domElement.height;
    bgCanvas.width = w;
    bgCanvas.height = h;

    bgCtx.fillStyle = '#106B45';
    bgCtx.fillRect(0, 0, w, h);

    bgCtx.fillStyle = '#ffffff';
    bgCtx.textAlign = 'center';
    bgCtx.textBaseline = 'middle';

    const pixelRatio = renderer.getPixelRatio();
    const titleSize = Math.round(w * 0.13);
    const subSize = Math.round(SUBTITLE_SIZE * pixelRatio);
    const titleY = h * 0.38;

    bgCtx.font = `900 ${titleSize}px ${TITLE_FONT}`;
    bgCtx.fillText(config.title, w * 0.5, titleY);

    const subtitleY =
      titleY + titleSize * 0.5 + TITLE_SUBTITLE_GAP * pixelRatio + subSize * 0.5;
    bgCtx.font = `500 ${subSize}px ${SUBTITLE_FONT}`;
    bgCtx.globalAlpha = 0.85;
    bgCtx.fillText(config.subtitle, w * 0.5, subtitleY);
    bgCtx.globalAlpha = 1;

    bgTexture.needsUpdate = true;
  }

  function applyForces(time: number) {
    for (const d of drops) {
      if (d.followsCursor) {
        const tx = mouse.active ? mouse.x : 0;
        const ty = mouse.active ? mouse.y : 0;
        d.vx += (tx - d.x) * CURSOR_SPRING;
        d.vy += (ty - d.y) * CURSOR_SPRING;
        d.vx *= CURSOR_DAMP;
        d.vy *= CURSOR_DAMP;
        continue;
      }

      d.wanderAngle += (Math.random() - 0.5) * d.wanderSpeed;
      d.vx += Math.cos(d.wanderAngle) * WANDER_F;
      d.vy += Math.sin(d.wanderAngle) * WANDER_F;
      d.vx -= d.x * CENTER_PULL;
      d.vy -= d.y * CENTER_PULL;

      if (mouse.active) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dSq = dx * dx + dy * dy;
        const rr = MOUSE_R + d.r;
        if (dSq < rr * rr && dSq > 1e-5) {
          const dist = Math.sqrt(dSq);
          const s = 1 - dist / rr;
          const f = s * s * MOUSE_F;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
      }
    }

    for (let i = 0; i < drops.length; i++) {
      const a = drops[i];
      if (a.followsCursor) continue;
      for (let j = i + 1; j < drops.length; j++) {
        const b = drops[j];
        if (b.followsCursor) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dSq = dx * dx + dy * dy;
        const rng = TENSION_RANGE + a.r + b.r;
        if (dSq < rng * rng && dSq > 1e-5) {
          const dist = Math.sqrt(dSq);
          const s = 1 - dist / rng;
          const f = s * TENSION_F;
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
    }
    void time;
  }

  function integrate() {
    for (const d of drops) {
      const maxSpeed = d.followsCursor ? CURSOR_MAX_SPEED : MAX_SPEED;
      const sp = Math.hypot(d.vx, d.vy);
      if (sp > maxSpeed) {
        const s = maxSpeed / sp;
        d.vx *= s;
        d.vy *= s;
      }
      d.x += d.vx;
      d.y += d.vy;
      if (!d.followsCursor) {
        d.vx *= DAMP;
        d.vy *= DAMP;
      }

      const wx = aspect * 0.5;
      const wy = 0.5;
      if (d.x - d.r < -wx) {
        d.x = -wx + d.r;
        d.vx = Math.abs(d.vx) * BOUNCE;
      }
      if (d.x + d.r > wx) {
        d.x = wx - d.r;
        d.vx = -Math.abs(d.vx) * BOUNCE;
      }
      if (d.y - d.r < -wy) {
        d.y = -wy + d.r;
        d.vy = Math.abs(d.vy) * BOUNCE;
      }
      if (d.y + d.r > wy) {
        d.y = wy - d.r;
        d.vy = -Math.abs(d.vy) * BOUNCE;
      }
    }
  }

  function mergeDroplets() {
    for (let i = 0; i < drops.length; i++) {
      const a = drops[i];
      if (!a.alive || a.followsCursor) continue;
      for (let j = i + 1; j < drops.length; j++) {
        const b = drops[j];
        if (!b.alive || b.followsCursor) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist < (a.r + b.r) * MERGE_RATIO) {
          const na = a.area + b.area;
          a.x = (a.x * a.area + b.x * b.area) / na;
          a.y = (a.y * a.area + b.y * b.area) / na;
          a.vx = (a.vx * a.area + b.vx * b.area) / na;
          a.vy = (a.vy * a.area + b.vy * b.area) / na;
          a.r = Math.sqrt(na / Math.PI);
          a.area = na;
          b.alive = false;
        }
      }
    }
    drops = drops.filter((d) => d.alive);
  }

  function splitDroplets() {
    const add: Droplet[] = [];
    for (const d of drops) {
      if (d.followsCursor) continue;
      if (d.r < SPLIT_MIN_R) continue;
      const sp = Math.hypot(d.vx, d.vy);
      if (sp < SPLIT_SPEED) continue;

      const ha = d.area * 0.5;
      const nr = Math.sqrt(ha / Math.PI);
      const nx = -d.vy / sp;
      const ny = d.vx / sp;
      const off = nr * 0.7;

      d.r = nr;
      d.area = ha;
      d.x -= nx * off;
      d.y -= ny * off;

      add.push({
        id: uid++,
        x: d.x + nx * off * 2,
        y: d.y + ny * off * 2,
        r: nr,
        area: ha,
        vx: d.vx + nx * sp * 0.35,
        vy: d.vy + ny * sp * 0.35,
        alive: true,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: 0.3 + Math.random() * 0.5,
        softPrevX: d.x + nx * off * 2,
        softPrevY: d.y + ny * off * 2,
        softOffX: 0,
        softOffY: 0,
        softVelX: 0,
        softVelY: 0,
      });
    }
    for (const d of add) {
      if (regularDrops().length < MAX_DROPLETS) drops.push(d);
    }
  }

  function updateSoftBodies() {
    for (const d of drops) {
      const dx = d.x - d.softPrevX;
      const dy = d.y - d.softPrevY;
      d.softVelX += (dx - d.softOffX) * SOFT_STIFFNESS;
      d.softVelY += (dy - d.softOffY) * SOFT_STIFFNESS;
      d.softVelX *= SOFT_DAMPING;
      d.softVelY *= SOFT_DAMPING;
      d.softOffX += d.softVelX;
      d.softOffY += d.softVelY;
      d.softPrevX = d.x;
      d.softPrevY = d.y;
    }
  }

  function autoSpawn() {
    autoTimer += FIXED_DT_MS;
    if (autoTimer > 2000 && regularDrops().length < 10) {
      autoTimer = 0;
      spawn(
        (Math.random() - 0.5) * aspect * 0.6,
        (Math.random() - 0.5) * 0.6,
        0.025 + Math.random() * 0.03,
      );
    }
  }

  function mouseSpawn() {
    if (!mouse.down || !mouse.active) return;
    spawnCD -= FIXED_DT_MS;
    if (spawnCD <= 0 && regularDrops().length < MAX_DROPLETS) {
      spawnCD = 120;
      spawn(
        mouse.x + (Math.random() - 0.5) * 0.02,
        mouse.y + (Math.random() - 0.5) * 0.02,
        0.02 + Math.random() * 0.015,
      );
    }
  }

  function fixedUpdate() {
    simTime += FIXED_DT_MS;
    applyForces(simTime);
    integrate();
    mergeDroplets();
    splitDroplets();
    updateSoftBodies();
    autoSpawn();
    mouseSpawn();
  }

  function writeDroplet(index: number, d: Droplet, radiusScale = 1) {
    const i = index * 4;
    dropletBuf[i] = d.x;
    dropletBuf[i + 1] = d.y;
    dropletBuf[i + 2] = d.r * radiusScale;
    dropletBuf[i + 3] = 1;
  }

  function syncDroplets() {
    if (!dropletTex || !mat) return;
    dropletBuf.fill(0);

    const cursor = drops.find((d) => d.followsCursor && d.alive);
    const regular = regularDrops();
    const maxRegular = cursor ? MAX_DROPLETS - 1 : MAX_DROPLETS;
    const n = Math.min(regular.length, maxRegular);
    const mainCount = n + (cursor ? 1 : 0);

    let mainIndex = 0;
    if (cursor) {
      writeDroplet(mainIndex, cursor);
      mainIndex++;
    }
    for (let i = 0; i < n; i++) {
      writeDroplet(mainIndex, regular[i]);
      mainIndex++;
    }

    let ghostIndex = mainCount;
    if (cursor) {
      dropletBuf[ghostIndex * 4] = cursor.x - cursor.softOffX * 4.5;
      dropletBuf[ghostIndex * 4 + 1] = cursor.y - cursor.softOffY * 4.5;
      dropletBuf[ghostIndex * 4 + 2] = cursor.r * 0.75;
      dropletBuf[ghostIndex * 4 + 3] = 1;
      ghostIndex++;
    }
    for (let i = 0; i < n; i++) {
      const d = regular[i];
      dropletBuf[ghostIndex * 4] = d.x - d.softOffX * 3.5;
      dropletBuf[ghostIndex * 4 + 1] = d.y - d.softOffY * 3.5;
      dropletBuf[ghostIndex * 4 + 2] = d.r * 0.7;
      dropletBuf[ghostIndex * 4 + 3] = 1;
      ghostIndex++;
    }

    dropletTex.needsUpdate = true;
    mat.uniforms.uCount.value = mainCount * 2;
  }

  function loop() {
    if (disposed) return;
    rafId = requestAnimationFrame(loop);

    if (paused || !renderer || !mat) return;

    const now = performance.now();
    const dt = Math.min(now - last, MAX_FRAME_DT_MS);
    last = now;
    acc += dt;

    let steps = 0;
    while (acc >= FIXED_DT_MS && steps < MAX_CATCHUP) {
      fixedUpdate();
      acc -= FIXED_DT_MS;
      steps++;
    }
    if (steps >= MAX_CATCHUP) acc = 0;

    mat.uniforms.uTime.value = now * 0.001;
    syncDroplets();
    renderer.render(scene!, camera!);
  }

  function onPointerMove(event: PointerEvent) {
    if (!renderer) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width - 0.5) * aspect;
    mouse.y = 0.5 - (event.clientY - rect.top) / rect.height;
    mouse.active = true;
  }

  function onPointerDown() {
    mouse.down = true;
  }

  function onPointerUp() {
    mouse.down = false;
  }

  function onPointerLeave() {
    mouse.active = false;
    mouse.down = false;
  }

  function updatePausedState() {
    paused = document.hidden || !inView;
    if (!paused) {
      last = performance.now();
      acc = 0;
    }
  }

  function onVisibilityChange() {
    updatePausedState();
  }

  function resize(width: number, height: number) {
    if (!renderer || !mat) return;
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    aspect = width / height;
    mat.uniforms.uRes.value.set(renderer.domElement.width, renderer.domElement.height);
    drawBackground();
  }

  function scheduleResize(width: number, height: number) {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize(width, height);
      resizeTimer = undefined;
    }, RESIZE_DEBOUNCE_MS);
  }

  function init(container: HTMLElement) {
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    bgCanvas = document.createElement('canvas');
    bgCtx = bgCanvas.getContext('2d');
    bgTexture = new THREE.CanvasTexture(bgCanvas);
    bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.magFilter = THREE.LinearFilter;
    bgTexture.colorSpace = THREE.SRGBColorSpace;

    dropletTex = new THREE.DataTexture(
      dropletBuf,
      MAX_ENTRIES,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    dropletTex.minFilter = THREE.NearestFilter;
    dropletTex.magFilter = THREE.NearestFilter;
    dropletTex.needsUpdate = true;

    mat = new THREE.ShaderMaterial({
      vertexShader: 'void main(){ gl_Position = vec4(position, 1.0); }',
      fragmentShader: buildFragmentShader(MAX_ENTRIES),
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uData: { value: dropletTex },
        uBg: { value: bgTexture },
        uCount: { value: 0 },
        uTime: { value: 0 },
      },
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    spawnCursorBubble();

    for (let i = 0; i < 12; i++) {
      spawn(
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.5,
        0.03 + Math.random() * 0.05,
      );
    }

    const { width, height } = readContainerSize(container);
    resize(width, height);

    drawBackground();
    void Promise.all([
      document.fonts.load(`900 ${Math.round(renderer.domElement.width * 0.13)}px ${TITLE_FONT}`),
      document.fonts.load(`500 ${Math.round(SUBTITLE_SIZE * renderer.getPixelRatio())}px ${SUBTITLE_FONT}`),
      document.fonts.ready,
    ]).then(() => {
      if (!disposed) drawBackground();
    });

    const canvas = renderer.domElement;
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
        updatePausedState();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      scheduleResize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(container);

    paused = document.hidden;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function dispose() {
    disposed = true;
    cancelAnimationFrame(rafId);
    if (resizeTimer) clearTimeout(resizeTimer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();

    const canvas = renderer?.domElement;
    canvas?.removeEventListener('pointermove', onPointerMove);
    canvas?.removeEventListener('pointerdown', onPointerDown);
    canvas?.removeEventListener('pointerup', onPointerUp);
    canvas?.removeEventListener('pointerleave', onPointerLeave);

    mat?.dispose();
    dropletTex?.dispose();
    bgTexture?.dispose();
    renderer?.dispose();
    canvas?.remove();
  }

  onMounted(() => {
    void nextTick(() => {
      if (containerRef.value) init(containerRef.value);
    });
  });

  onBeforeUnmount(dispose);
}
