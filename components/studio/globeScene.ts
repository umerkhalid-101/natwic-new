import * as THREE from 'three';

/**
 * A dotted globe in the space section's style, with Dubai at home and arcs out to
 * client cities. Drag to spin; it drifts on its own when left alone.
 */

export type City = { name: string; clients: string; lat: number; lon: number; home?: boolean };

const toVec = (lat: number, lon: number, r = 1) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

const DOT_VERT = /* glsl */ `
  uniform float uSize;
  uniform float uPR;
  varying float vFace;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFace = normalize(normalMatrix * position).z;
    gl_PointSize = uSize * uPR / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const DOT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFace;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, d) * mix(0.06, 1.0, smoothstep(-0.25, 0.75, vFace)) * uAlpha;
    gl_FragColor = vec4(uColor, a);
  }
`;

const dotMaterial = (color: string, size: number, alpha: number, pr: number) =>
  new THREE.ShaderMaterial({
    vertexShader: DOT_VERT,
    fragmentShader: DOT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uSize: { value: size }, uPR: { value: pr }, uAlpha: { value: alpha } },
  });

export class GlobeScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  private globe = new THREE.Group();
  private arcs: { line: THREE.Line; comet: THREE.Points; curve: THREE.QuadraticBezierCurve3; offset: number }[] = [];
  private markers: THREE.ShaderMaterial[] = [];
  private cityVecs: THREE.Vector3[];
  private raf = 0;
  private running = false;
  private clock = new THREE.Clock();
  private rot = { y: 0, x: 0.35, vy: 0, targetY: null as number | null };
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private idle = 0;
  private intro = 0;
  private reduced: boolean;
  onFrame?: (positions: { x: number; y: number; visible: boolean }[]) => void;

  constructor(private canvas: HTMLCanvasElement, private cities: City[]) {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    const pr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(pr);
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 4.4);

    // Globe surface: evenly spread dots (a Fibonacci sphere)
    const n = 3200;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      pos.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.globe.add(new THREE.Points(dotsGeo, dotMaterial('#f4f2ff', 9, 0.55, pr)));

    this.cityVecs = cities.map((c) => toVec(c.lat, c.lon, 1.012));
    const home = cities.findIndex((c) => c.home);

    // City markers
    cities.forEach((c, i) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.cityVecs[i].toArray()), 3));
      const m = dotMaterial(c.home ? '#F3350C' : '#9c7bff', c.home ? 90 : 60, 1, pr);
      this.markers.push(m);
      this.globe.add(new THREE.Points(g, m));
    });

    // Arcs from home to every other city, with a light travelling along each
    cities.forEach((_, i) => {
      if (i === home) return;
      const a = this.cityVecs[home];
      const b = this.cityVecs[i];
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const lift = 1 + a.distanceTo(b) * 0.45;
      mid.normalize().multiplyScalar(lift);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const pts = curve.getPoints(80);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      lineGeo.setDrawRange(0, 0);
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: '#8c63ff', transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
      const cg = new THREE.BufferGeometry();
      cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
      const comet = new THREE.Points(cg, dotMaterial('#ffffff', 70, 1, pr));
      this.globe.add(line, comet);
      this.arcs.push({ line, comet, curve, offset: Math.random() });
    });

    this.scene.add(this.globe);

    // Start facing home
    const hv = this.cityVecs[home];
    this.rot.y = Math.atan2(-hv.x, hv.z);

    canvas.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    this.resize();
  }

  private onDown = (e: PointerEvent) => {
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.rot.targetY = null;
    this.canvas.setPointerCapture?.(e.pointerId);
  };
  private onMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.rot.vy = dx * 0.006;
    this.rot.y += dx * 0.006;
    this.rot.x = Math.max(-0.6, Math.min(0.9, this.rot.x + dy * 0.004));
    this.idle = 0;
  };
  private onUp = () => { this.dragging = false; };

  /** Turn the globe so a city faces the viewer. */
  focus(i: number) {
    const v = this.cityVecs[i];
    let target = Math.atan2(-v.x, v.z);
    // Take the short way round
    while (target - this.rot.y > Math.PI) target -= Math.PI * 2;
    while (target - this.rot.y < -Math.PI) target += Math.PI * 2;
    this.rot.targetY = target;
    this.idle = 0;
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    const loop = () => {
      if (!this.running) return;
      this.tick();
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
    this.canvas.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (m.material as THREE.Material | undefined)?.dispose?.();
    });
    this.renderer.dispose();
  }

  private tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;
    this.idle += dt;
    this.intro = Math.min(1, this.intro + dt / 2.2);

    if (!this.dragging) {
      if (this.rot.targetY !== null) {
        this.rot.y += (this.rot.targetY - this.rot.y) * (1 - Math.pow(0.02, dt));
        if (Math.abs(this.rot.targetY - this.rot.y) < 0.001) this.rot.targetY = null;
      } else {
        this.rot.vy *= Math.pow(0.08, dt);
        // Drift slowly once nobody has touched it for a moment
        const drift = !this.reduced && this.idle > 2.5 ? 0.06 : 0;
        this.rot.y += this.rot.vy + drift * dt;
      }
    }
    this.globe.rotation.set(this.rot.x, this.rot.y, 0, 'XYZ');

    // Arcs draw in on arrival, then lights travel along them
    const ease = 1 - Math.pow(1 - this.intro, 3);
    this.arcs.forEach((a, i) => {
      const local = Math.min(1, Math.max(0, ease * 1.6 - i * 0.12));
      a.line.geometry.setDrawRange(0, Math.floor(81 * local));
      const p = (t * 0.25 + a.offset) % 1;
      const v = a.curve.getPoint(p);
      (a.comet.geometry.getAttribute('position') as THREE.BufferAttribute).set(v.toArray());
      a.comet.geometry.getAttribute('position').needsUpdate = true;
      (a.comet.material as THREE.ShaderMaterial).uniforms.uAlpha.value = local * Math.sin(p * Math.PI);
    });
    this.markers.forEach((m, i) => {
      m.uniforms.uAlpha.value = 0.75 + 0.25 * Math.sin(t * 2 + i);
    });

    this.renderer.render(this.scene, this.camera);

    // Screen positions for HTML labels
    if (this.onFrame) {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      const out = this.cityVecs.map((v) => {
        const world = v.clone().applyMatrix4(this.globe.matrixWorld);
        const facing = world.clone().normalize().dot(this.camera.position.clone().normalize()) > 0.15;
        const s = world.project(this.camera);
        return { x: ((s.x + 1) / 2) * w, y: ((1 - s.y) / 2) * h, visible: facing };
      });
      this.onFrame(out);
    }
  }
}
