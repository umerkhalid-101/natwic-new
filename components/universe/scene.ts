import * as THREE from 'three';

/**
 * The particle universe behind the About → Work journey.
 * One set of particles morphs through five formations as `progress` (0–1) advances:
 * 0 galaxy · 1 two clusters · 2 open sky · 3 tunnel · 4 a calm field,
 * which then falls into the Services sheet as it rises (uFall / uEdge).
 */

const VERT = /* glsl */ `
  attribute vec3 p0;
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute vec3 p4;
  attribute float aSeed;
  attribute vec3 aColor;

  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uFocus;
  uniform float uPixelRatio;
  uniform float uDim;
  uniform float uFall;
  uniform float uEdge;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  void main() {
    float m = clamp(uMorph, 0.0, 4.0);
    vec3 g = rotY(p0, uTime * 0.035);
    vec3 a; vec3 b; float t;
    if (m < 1.0) { a = g; b = p1; t = m; }
    else if (m < 2.0) { a = p1; b = p2; t = m - 1.0; }
    else if (m < 3.0) { a = p2; b = p3; t = m - 2.0; }
    else { a = p3; b = p4; t = m - 3.0; }

    // Stagger each particle a little so morphs feel organic, not linear
    t = clamp(t * 1.25 - aSeed * 0.25, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(a, b, t);
    pos += vec3(sin(uTime * 0.5 + aSeed * 40.0), cos(uTime * 0.4 + aSeed * 23.0), 0.0) * 0.05;

    // Falling into the next section: each star drops at its own pace
    float fall = uFall * uFall;
    pos.y -= fall * (14.0 + aSeed * 34.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // In the two-cluster formation, the hovered side brightens
    float inCluster = 1.0 - clamp(abs(m - 1.0), 0.0, 1.0);
    float side = sign(p1.x);
    float focus = step(0.5, abs(uFocus)) * inCluster;
    float boost = 1.0 + focus * (side * uFocus > 0.0 ? 0.7 : -0.5);

    gl_Position = projectionMatrix * mv;

    // Stars just above the sheet's top edge flare violet as they touch it, then pass behind
    float dy = gl_Position.y / gl_Position.w - uEdge;
    float rim = (1.0 - smoothstep(0.0, 0.2, dy)) * step(0.0, dy) * step(0.001, uFall);

    // Capped so stars that pass right by the camera don't flood the screen with overdraw
    gl_PointSize = min(uSize * (0.5 + aSeed) * boost * uPixelRatio * (10.0 / max(0.5, -mv.z)), 48.0 * uPixelRatio) * (1.0 + rim * 1.2);

    vColor = mix(aColor, vec3(0.62, 0.48, 1.0), rim * 0.7);
    vAlpha = (0.5 + 0.5 * aSeed) * clamp(boost, 0.35, 1.5) * uDim * (1.0 + rim * 4.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const rand = (min = 0, max = 1) => min + Math.random() * (max - min);
const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export class UniverseScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);
  private material: THREE.ShaderMaterial;
  private points: THREE.Points;
  private raf = 0;
  private running = false;
  private progress = 0;
  private pointer = { x: 0, y: 0 };
  private smooth = { x: 0, y: 0, z: 27, focus: 0 };
  private focusTarget = 0;
  private edge = 2; // top of the next section, as a fraction of viewport height
  private clock = new THREE.Clock();
  private reduced: boolean;
  private count: number;
  private maxRatio: number;
  // Adaptive quality: if frames run long, drop resolution, then particle count
  private frames = 0;
  private slowTime = 0;
  private sampleStart = 0;
  private tier = 0;
  private strikes = 0;

  constructor(private canvas: HTMLCanvasElement, count: number, private compact = false) {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.count = count;
    // Low-core machines start at 1x; everyone else is capped at 1.5x, which is indistinguishable for soft points
    const weak = (navigator.hardwareConcurrency || 8) <= 4;
    this.maxRatio = Math.min(window.devicePixelRatio || 1, weak ? 1 : 1.5);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(this.maxRatio);
    this.renderer.setClearColor(0x000000, 0);

    const geo = new THREE.BufferGeometry();
    const f = Array.from({ length: 5 }, () => new Float32Array(count * 3));
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const white = new THREE.Color('#f4f2ff');
    const grey = new THREE.Color('#9b98a8');
    const violet = new THREE.Color('#8c63ff');
    const ember = new THREE.Color('#F3350C');

    for (let i = 0; i < count; i++) {
      const k = i * 3;
      const isBg = i % 4 === 0; // a quarter of particles are distant stars that stay put early on
      seeds[i] = Math.random();

      // Stars are mostly white/grey; purple and ember are rare accents
      const c = Math.random();
      const col = c < 0.06 ? violet : c < 0.075 ? ember : c < 0.55 ? white : grey;
      colors[k] = col.r; colors[k + 1] = col.g; colors[k + 2] = col.b;

      // Distant star sphere (shared by formations 0–2)
      const th = rand(0, Math.PI * 2);
      const ph = Math.acos(rand(-1, 1));
      const R = rand(45, 90);
      const star = [R * Math.sin(ph) * Math.cos(th), R * Math.sin(ph) * Math.sin(th), R * Math.cos(ph)];

      // 0 — a three-armed spiral galaxy, tilted towards the viewer
      if (isBg) {
        f[0].set(star, k);
      } else {
        const r = Math.pow(Math.random(), 0.75) * 19;
        const arm = (i % 3) * ((Math.PI * 2) / 3);
        const ang = arm + r * 0.42 + gauss() * 0.28;
        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;
        const y = gauss() * 0.5 * (1 - r / 22);
        const tilt = -1.05;
        f[0][k] = x;
        f[0][k + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
        f[0][k + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
      }

      // 1 — two clusters, left and right
      if (isBg) {
        f[1].set(star, k);
      } else {
        // The clusters frame the cards rather than sitting behind any text
        const side = i % 2 === 0 ? -1 : 1;
        const rr = Math.abs(gauss()) * 2.2;
        const t2 = rand(0, Math.PI * 2);
        const p2 = Math.acos(rand(-1, 1));
        const cx = compact ? 0 : side * 14;
        const cy = compact ? side * 8.5 : 0;
        f[1][k] = cx + rr * Math.sin(p2) * Math.cos(t2);
        f[1][k + 1] = cy + rr * Math.sin(p2) * Math.sin(t2);
        f[1][k + 2] = -2 + rr * Math.cos(p2);
      }

      // 2 — open sky: a wide, shallow field behind the constellation
      if (isBg) {
        f[2].set(star, k);
      } else {
        // A deep field the camera walks through
        f[2][k] = rand(-30, 30);
        f[2][k + 1] = rand(-18, 18);
        f[2][k + 2] = rand(-120, 4);
      }

      // 3 — a tunnel to fly through
      const ta = rand(0, Math.PI * 2);
      const tr = rand(7.5, 15);
      f[3][k] = Math.cos(ta) * tr;
      f[3][k + 1] = Math.sin(ta) * tr;
      f[3][k + 2] = rand(-175, -40);

      // 4 — the tunnel loosens into a calm, open field ahead of the camera
      f[4][k] = rand(-34, 34);
      f[4][k + 1] = rand(-20, 22);
      f[4][k + 2] = rand(-150, -112);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(f[0], 3));
    f.forEach((arr, i) => geo.setAttribute(`p${i}`, new THREE.BufferAttribute(arr, 3)));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    // Particles move far from their initial positions; skip culling
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 500);

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 3.6 },
        uFocus: { value: 0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uDim: { value: 1 },
        uFall: { value: 0 },
        uEdge: { value: -3 },
      },
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
    this.resize();
  }

  setProgress(p: number) { this.progress = p; if (!this.running) this.renderOnce(); }
  setPointer(x: number, y: number) { this.pointer.x = x; this.pointer.y = y; }
  setFocus(side: -1 | 0 | 1) { this.focusTarget = side; }
  /** Where the next section's top edge sits, 0 (top) – 1 (bottom) of the viewport. */
  setEdge(edge: number) { this.edge = edge; if (!this.running) this.renderOnce(); }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Keep the clusters on screen on narrow, tall viewports
    this.camera.fov = w / h < 0.8 ? 82 : 60;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this.frames = 0;
    this.slowTime = 0;
    this.sampleStart = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.renderOnce();
      this.adapt();
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    this.points.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }

  /** Every ~2s, if the frame rate has been poor, step quality down a notch. */
  private adapt() {
    if (this.tier >= 2) return;
    const now = performance.now();
    this.frames++;
    const elapsed = now - this.sampleStart;
    if (elapsed < 2000) return;
    const fps = (this.frames * 1000) / elapsed;
    this.frames = 0;
    this.sampleStart = now;
    // Two poor samples in a row before stepping down, so a one-off hitch doesn't cost quality
    if (document.hidden || fps >= 40) { this.strikes = 0; return; }
    if (++this.strikes < 2) return;
    this.strikes = 0;
    this.tier++;
    if (this.tier === 1 && this.maxRatio > 1) {
      this.renderer.setPixelRatio(1);
    } else {
      // Draw fewer particles; roles are assigned by index modulo, so any prefix stays evenly spread
      this.points.geometry.setDrawRange(0, Math.floor(this.count * 0.7));
      this.renderer.setPixelRatio(1);
    }
    this.material.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
    this.resize();
  }

  private morphFor(p: number) {
    const seg = (a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    return seg(0.17, 0.26) + seg(0.41, 0.45) + seg(0.64, 0.7) + seg(0.9, 0.97);
  }

  /** Stars step back while there's a block of copy to read. */
  private dimFor(p: number) {
    const win = (a: number, b: number, edge: number, low: number) => {
      if (p <= a || p >= b) return 1;
      const t = Math.min((p - a) / edge, (b - p) / edge, 1);
      return 1 - (1 - low) * t;
    };
    return Math.min(
      win(0.075, 0.225, 0.02, 0.32), // the statement
      win(0.43, 0.66, 0.02, 0.6),    // the walk-through cards
      win(0.9, 1.07, 0.015, 0.85),   // the closing line and call to action
    );
  }

  private cameraZFor(p: number) {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
    if (p < 0.22) return lerp(27, 12, p / 0.22);
    if (p < 0.425) return lerp(12, 10.8, (p - 0.22) / 0.205); // slow push-in while the cards are up
    if (p < 0.66) return lerp(10.8, -62, (p - 0.425) / 0.235); // the walk-through
    if (p < 0.91) return lerp(-62, -104, (p - 0.66) / 0.25); // the tunnel
    return -104;
  }

  private renderOnce() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const u = this.material.uniforms;
    if (!this.reduced) u.uTime.value += dt;
    u.uMorph.value = this.morphFor(this.progress);
    // Starts just before the sheet shows and completes as it reaches the top third
    u.uFall.value = Math.min(1, Math.max(0, (1.12 - this.edge) / 0.82));
    u.uEdge.value = 1 - 2 * this.edge;
    u.uDim.value += (this.dimFor(this.progress) - u.uDim.value) * (this.reduced ? 1 : 1 - Math.pow(0.002, dt));

    // Ease camera and focus so scroll jumps never snap
    const k = this.reduced ? 1 : 1 - Math.pow(0.001, dt);
    this.smooth.z += (this.cameraZFor(this.progress) - this.smooth.z) * k;
    this.smooth.x += (this.pointer.x * 1.4 - this.smooth.x) * k * 0.6;
    this.smooth.y += (this.pointer.y * 0.9 - this.smooth.y) * k * 0.6;
    this.smooth.focus += (this.focusTarget - this.smooth.focus) * k;
    u.uFocus.value = this.smooth.focus;

    this.camera.position.set(this.smooth.x, this.smooth.y, this.smooth.z);
    this.camera.lookAt(this.smooth.x * 0.2, this.smooth.y * 0.2, this.smooth.z - 30);
    this.renderer.render(this.scene, this.camera);
  }
}
