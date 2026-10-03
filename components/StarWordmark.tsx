import React, { useEffect, useRef } from 'react';

/**
 * Footer finale. A giant NATWIC STUDIO, edge to edge: the space section's stars fall
 * onto it and the letters materialise as they land. A violet light follows the cursor
 * across the letters, and nearby stars glow and part around it.
 */

const COLORS = [
  { c: '244,242,255', w: 0.5 },
  { c: '175,170,195', w: 0.42 },
  { c: '150,112,255', w: 0.065 },
  { c: '243,53,12', w: 0.015 },
];

type Star = {
  sx: number; sy: number; tx: number; ty: number;
  ox: number; oy: number; vx: number; vy: number;
  size: number; color: number; seed: number; delay: number; dur: number; glow: number;
};

const pickColor = () => {
  let r = Math.random();
  for (let i = 0; i < COLORS.length; i++) { r -= COLORS[i].w; if (r <= 0) return i; }
  return 0;
};

const sprite = (rgb: string) => {
  const px = 32;
  const c = document.createElement('canvas');
  c.width = c.height = px;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(0.28, `rgba(${rgb},0.85)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, px, px);
  }
  return c;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const StarWordmark: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites = COLORS.map((c) => sprite(c.c));

    let w = 0;
    let h = 0;
    let top = 0;
    let stars: Star[] = [];
    let base: HTMLCanvasElement | null = null; // the letters, white with a downward fade
    let violet: HTMLCanvasElement | null = null; // the letters in violet, revealed by the cursor light
    const light = document.createElement('canvas');
    const lctx = light.getContext('2d');

    let raf = 0;
    let visible = false;
    let started = false;
    let startTime = 0;
    let lastDraw = 0;
    let lightAmt = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const layer = (fill: (g: CanvasRenderingContext2D) => void) => {
      const c = document.createElement('canvas');
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      const g = c.getContext('2d');
      if (g) { g.setTransform(dpr, 0, 0, dpr, 0, 0); fill(g); }
      return c;
    };

    const build = () => {
      w = wrap.clientWidth;
      if (!w) return;
      const stacked = w < 640;
      const lines = stacked ? ['NATWIC', 'STUDIO'] : ['NATWIC STUDIO'];
      const tracking = -0.045;

      const probe = document.createElement('canvas').getContext('2d');
      if (!probe) return;
      probe.font = '800 100px Inter, sans-serif';
      (probe as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${tracking * 100}px`;
      const widest = Math.max(...lines.map((l) => probe.measureText(l).width));
      // Bigger than the screen: cropped at both sides, and the bottom of the letters runs off the page
      const fontSize = (100 * w * (stacked ? 1.15 : 1.32)) / widest;
      const cap = fontSize * 0.73;
      const gap = fontSize * 0.1;
      const wordH = Math.round(lines.length * cap + (lines.length - 1) * gap + fontSize * 0.04 - cap * 0.24);
      top = Math.round(Math.max(wordH * 0.9, 160)); // stars fall in from here, over the footer's empty space
      h = wordH + top;

      wrap.style.height = `${wordH}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      light.width = canvas.width;
      light.height = canvas.height;

      const drawText = (g: CanvasRenderingContext2D) => {
        g.font = `800 ${fontSize}px Inter, sans-serif`;
        (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${tracking * fontSize}px`;
        g.textAlign = 'center';
        g.textBaseline = 'alphabetic';
        lines.forEach((line, i) => {
          const baseline = top + fontSize * 0.04 + cap * (i + 1) + gap * i;
          g.fillText(line, w / 2, baseline);
        });
      };

      base = layer((g) => {
        const grad = g.createLinearGradient(0, top, 0, h);
        grad.addColorStop(0, 'rgba(255,255,255,0.16)');
        grad.addColorStop(1, 'rgba(255,255,255,0.025)');
        g.fillStyle = grad;
        drawText(g);
      });
      violet = layer((g) => { g.fillStyle = 'rgba(150,112,255,1)'; drawText(g); });

      // Sample the letters for star targets (random, not a grid)
      const mask = document.createElement('canvas');
      mask.width = w;
      mask.height = h;
      const m = mask.getContext('2d');
      if (!m) return;
      m.fillStyle = '#fff';
      drawText(m);
      const data = m.getImageData(0, 0, w, h).data;
      const inside = (x: number, y: number) => data[((y | 0) * w + (x | 0)) * 4 + 3] > 150;
      const target = Math.round(Math.min(3800, w * 2.4));
      const starSize = Math.max(1.3, Math.min(2.4, w / 750));
      const next: Star[] = [];
      let guard = 0;
      while (next.length < target && guard++ < target * 60) {
        const x = Math.random() * w;
        const y = top + Math.random() * wordH;
        if (!inside(x, y)) continue;
        const seed = Math.random();
        next.push({
          tx: x, ty: y,
          sx: x + (Math.random() - 0.5) * w * 0.15,
          sy: Math.random() * top * 0.7 - top * 0.25,
          ox: 0, oy: 0, vx: 0, vy: 0,
          size: (0.5 + seed) * starSize,
          color: pickColor(),
          seed,
          delay: (x / w) * 700 + Math.random() * 1000,
          dur: 1500 + Math.random() * 1300,
          glow: 0,
        });
      }
      stars = next;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = started ? (reduced ? 1e9 : now - startTime) : -1;
      const settled = t > 4000;
      // Once settled, twinkle at ~30fps unless the cursor is over it
      if (settled && !pointer.active && lightAmt < 0.01 && now - lastDraw < 33) return;
      lastDraw = now;
      if (!base || !violet) return;

      const time = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // The letters fade in as the stars land
      const reveal = easeOut(clamp01((t - 900) / 2600));
      if (reveal > 0) {
        ctx.globalAlpha = reveal;
        ctx.drawImage(base, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      // Violet light that follows the cursor across the letters
      lightAmt += ((pointer.active ? 1 : 0) - lightAmt) * 0.12;
      if (lctx && lightAmt > 0.01 && reveal > 0) {
        const r = Math.max(180, w * 0.16);
        lctx.setTransform(1, 0, 0, 1, 0, 0);
        lctx.globalCompositeOperation = 'source-over';
        lctx.clearRect(0, 0, light.width, light.height);
        lctx.drawImage(violet, 0, 0);
        lctx.globalCompositeOperation = 'destination-in';
        const g = lctx.createRadialGradient(pointer.x * dpr, pointer.y * dpr, 0, pointer.x * dpr, pointer.y * dpr, r * dpr);
        g.addColorStop(0, `rgba(0,0,0,${0.85 * lightAmt * reveal})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        lctx.fillStyle = g;
        lctx.fillRect(0, 0, light.width, light.height);
        ctx.drawImage(light, 0, 0, w, h);
      }

      // Stars
      ctx.globalCompositeOperation = 'lighter';
      const pr = Math.max(60, w * 0.05);
      for (const s of stars) {
        const p = t < 0 ? 0 : clamp01((t - s.delay) / s.dur);
        if (p <= 0) continue;
        const e = easeOut(p);
        const x = s.sx + (s.tx - s.sx) * e + Math.sin(e * Math.PI) * (s.seed - 0.5) * 40 + Math.sin(time * 0.5 + s.seed * 40) * 0.7 * e;
        const y = s.sy + (s.ty - s.sy) * e + Math.cos(time * 0.4 + s.seed * 23) * 0.7 * e;

        if (pointer.active && p >= 1) {
          const dx = x + s.ox - pointer.x;
          const dy = y + s.oy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < pr * pr) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / pr) * 0.7;
            s.vx += (dx / d) * f;
            s.vy += (dy / d) * f;
            s.glow = Math.min(1, s.glow + 0.1);
          }
        }
        if (s.ox || s.oy || s.vx || s.vy || s.glow > 0.01) {
          s.vx = (s.vx - s.ox * 0.05) * 0.86;
          s.vy = (s.vy - s.oy * 0.05) * 0.86;
          s.ox += s.vx;
          s.oy += s.vy;
          s.glow *= 0.94;
          if (Math.abs(s.ox) + Math.abs(s.oy) + Math.abs(s.vx) + Math.abs(s.vy) < 0.02) s.ox = s.oy = s.vx = s.vy = 0;
        }

        const twinkle = 0.7 + 0.3 * Math.sin(time * (1.1 + s.seed * 2.2) + s.seed * 60);
        // Bright while falling, settling to a quieter sparkle on the letters
        const settle = 1 - 0.45 * e;
        ctx.globalAlpha = Math.min(1, (0.35 + 0.6 * s.seed) * twinkle * settle * Math.min(1, p * 2) + s.glow * 0.5);
        const size = s.size * (2.4 + s.glow * 1.4);
        ctx.drawImage(sprites[s.glow > 0.35 ? 2 : s.color], x + s.ox - size / 2, y + s.oy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (!visible) return;
      if (!started) { started = true; startTime = performance.now(); }
      raf = requestAnimationFrame(frame);
    }, { threshold: 0.5 });

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    });

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      build();
      io.observe(wrap);
      ro.observe(wrap);
    });
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="group/wm relative w-full select-none">
      {/* Kept quiet at ~20%, lifting a little under the cursor. Extends upward over the footer's
          empty space and ignores the pointer, so links above stay clickable */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute left-0 bottom-0 w-full opacity-20 transition-opacity duration-700 group-hover/wm:opacity-50" />
      <span className="sr-only">Natwic Studio</span>
    </div>
  );
};
