import React, { useEffect, useRef } from 'react';

/**
 * The footer wordmark drawn with the same stars as the space section: soft points,
 * mostly white and grey with rare violet and ember, that drift down and gather into
 * "NATWIC STUDIO", keep twinkling, and part gently around the cursor.
 */

const WORD = 'NATWIC STUDIO';
const FALL_ZONE = 0.9; // how far above the word (as a share of its height) the stars start, drawn over the footer's empty space

// Same palette and proportions as the universe scene
const COLORS = [
  { c: '244,242,255', w: 0.48 }, // white
  { c: '155,152,168', w: 0.445 }, // grey
  { c: '140,99,255', w: 0.06 }, // violet
  { c: '243,53,12', w: 0.015 }, // ember
];

type Star = {
  sx: number; sy: number; tx: number; ty: number; x: number; y: number;
  ox: number; oy: number; vx: number; vy: number;
  size: number; color: number; seed: number; delay: number; dur: number; dust: boolean; glow: number;
};

const pickColor = () => {
  let r = Math.random();
  for (let i = 0; i < COLORS.length; i++) { r -= COLORS[i].w; if (r <= 0) return i; }
  return 0;
};

/** One soft round sprite per colour, like the scene's point shader (bright core, smooth falloff). */
const sprite = (rgb: string, px: number) => {
  const c = document.createElement('canvas');
  c.width = c.height = px;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(0.3, `rgba(${rgb},0.85)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, px, px);
  }
  return c;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

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
    const sprites = COLORS.map((c) => sprite(c.c, 32));
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let started = false;
    let startTime = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      w = wrap.clientWidth;
      // Probe the text size so the word runs edge to edge
      const probe = document.createElement('canvas').getContext('2d');
      if (!probe) return;
      probe.font = '800 100px Inter, sans-serif';
      // Wider than the screen, so it bleeds off the sides; the bottom of the letters runs off the page
      const fontSize = (100 * w * 1.12) / probe.measureText(WORD).width;
      const wordH = Math.round(fontSize * 0.72);
      const top = Math.round(wordH * FALL_ZONE);
      h = wordH + top;
      wrap.style.height = `${wordH}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const o = off.getContext('2d');
      if (!o) return;
      o.font = `800 ${fontSize}px Inter, sans-serif`;
      o.textAlign = 'center';
      o.textBaseline = 'alphabetic';
      o.fillStyle = '#fff';
      o.fillText(WORD, w / 2, h + fontSize * 0.04);
      const data = o.getImageData(0, 0, w, h).data;
      const inside = (x: number, y: number) => data[((y | 0) * w + (x | 0)) * 4 + 3] > 140;

      // Scatter stars randomly through the letter shapes (no grid), plus loose dust around them
      const target = Math.round(Math.min(5200, w * 3.6));
      const next: Star[] = [];
      let guard = 0;
      while (next.length < target && guard++ < target * 40) {
        const x = Math.random() * w;
        const y = top * 0.15 + Math.random() * (h - top * 0.15);
        const dust = next.length % 6 === 0;
        if (!dust && !inside(x, y)) continue;
        const seed = Math.random();
        next.push({
          tx: x, ty: dust ? Math.random() * h : y,
          sx: x + (Math.random() - 0.5) * w * 0.25,
          sy: -Math.random() * top - 10,
          x: 0, y: 0, ox: 0, oy: 0, vx: 0, vy: 0,
          size: (0.5 + seed) * Math.max(1.4, w / 900) * (dust ? 0.7 : 1),
          color: pickColor(),
          seed,
          delay: (x / w) * 600 + Math.random() * 1400,
          dur: 1600 + Math.random() * 1400,
          dust,
          glow: 0,
        });
      }
      stars = next;
      if (reduced) startTime = -1e9;
    };

    const frame = (now: number) => {
      const t = started ? now - startTime : -1;
      const time = now / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const r = Math.max(70, w * 0.06);

      for (const s of stars) {
        const p = t < 0 ? 0 : Math.min(1, Math.max(0, (t - s.delay) / s.dur));
        if (p <= 0) continue;
        const e = easeOut(p);
        // Drift down along a soft curve into place, then sway the way the scene's stars do
        const bx = s.sx + (s.tx - s.sx) * e + Math.sin(e * Math.PI) * (s.seed - 0.5) * 40;
        const by = s.sy + (s.ty - s.sy) * e;
        const sway = p >= 1 ? 1 : e;
        s.x = bx + Math.sin(time * 0.5 + s.seed * 40) * 0.8 * sway;
        s.y = by + Math.cos(time * 0.4 + s.seed * 23) * 0.8 * sway;

        // Part around the cursor and brighten a little, then ease back
        if (pointer.active && p >= 1) {
          const dx = s.x + s.ox - pointer.x;
          const dy = s.y + s.oy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / r) * 0.9;
            s.vx += (dx / d) * f;
            s.vy += (dy / d) * f;
            s.glow = Math.min(1, s.glow + 0.08);
          }
        }
        s.vx += -s.ox * 0.05;
        s.vy += -s.oy * 0.05;
        s.vx *= 0.86;
        s.vy *= 0.86;
        s.ox += s.vx;
        s.oy += s.vy;
        s.glow *= 0.95;

        const twinkle = 0.75 + 0.25 * Math.sin(time * (1.2 + s.seed * 2) + s.seed * 60);
        const alpha = ((0.35 + 0.55 * s.seed) * twinkle * (s.dust ? 0.35 : 1) * Math.min(1, p * 1.5)) * 0.5 + s.glow * 0.3;
        const size = s.size * (2.2 + s.glow * 1.2);
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(sprites[s.glow > 0.3 ? 2 : s.color], s.x + s.ox - size / 2, s.y + s.oy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (!visible) return;
      if (!started) { started = true; startTime = reduced ? -1e9 : performance.now(); }
      raf = requestAnimationFrame(frame);
    }, { threshold: 0.4 });

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
    <div ref={wrapRef} className="relative w-full select-none">
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute left-0 bottom-0 w-full" />
      <span className="sr-only">Natwic Studio</span>
    </div>
  );
};
