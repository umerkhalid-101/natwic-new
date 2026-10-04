import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, animate } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const VALUES = [
  { number: '01', title: 'Transparency', description: 'We believe in open dialogue. No hidden fees, no surprise clauses. Just honest work and clear communication from day one.' },
  { number: '02', title: 'Passion', description: 'We don’t just build digital products; we craft experiences. Every pixel is placed with intent and every line of code is written with pride.' },
  { number: '03', title: 'Empathy', description: 'User-centric isn’t just a buzzword. We dive deep into the psychology of your audience to build solutions that truly resonate.' },
];

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

/* ------------------------------------------------------------------ */
/* 01 Transparency: a proposal whose fine print you can read           */
/* ------------------------------------------------------------------ */

const Proposal: React.FC<{ big?: boolean }> = ({ big }) => (
  <div className="absolute inset-0 p-5 md:p-6 flex flex-col text-black">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Proposal</span>
      <span className="w-5 h-5 rounded-md bg-[#703FEC]" />
    </div>
    <p className="mt-4 text-lg font-bold tracking-tight leading-tight">Your new website</p>
    <div className="mt-4 space-y-2.5">
      {['Discovery', 'Design', 'Build', 'Launch'].map((s, i) => (
        <div key={s} className="flex items-center gap-3 text-xs">
          <span className="w-16 text-zinc-500">{s}</span>
          <span className="h-1.5 flex-1 rounded-full bg-zinc-100">
            <span className="block h-full rounded-full bg-zinc-300" style={{ width: `${[40, 85, 70, 30][i]}%` }} />
          </span>
        </div>
      ))}
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 text-xs font-semibold">
      <span>Total</span>
      <span className="h-2 w-14 rounded-full bg-black" />
    </div>
    {/* Small enough that you need the glass */}
    <div className="absolute left-1/2 top-[84%] w-[70px] -translate-x-1/2 -translate-y-1/2 text-[4px] leading-[1.45]" style={{ color: big ? '#27272a' : '#a1a1aa' }}>
      <p className="font-bold">*Terms and conditions</p>
      <p>1. There are no hidden fees.</p>
      <p>That’s the whole clause.</p>
      <p>2. No surprise clauses either.</p>
      <p>3. See clause 1.</p>
    </div>
  </div>
);

const FinePrint: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 220, damping: 26 });
  const sy = useSpring(y, { stiffness: 220, damping: 26 });
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [on, setOn] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const a = sx.on('change', (v) => setPos((p) => ({ ...p, x: v })));
    const b = sy.on('change', (v) => setPos((p) => ({ ...p, y: v })));
    return () => { a(); b(); };
  }, [sx, sy]);

  // Phones, or nobody pointing: the glass drifts down and settles on the fine print
  useEffect(() => {
    if (hovering || !inView) return;
    setOn(true);
    x.set(0.3); y.set(0.45);
    const t = window.setTimeout(() => { x.set(0.5); y.set(0.84); }, 700);
    return () => clearTimeout(t);
  }, [hovering, inView, x, y]);

  const K = 2.1; // magnification
  const R = 84; // lens radius on screen, px
  const px = `${pos.x * 100}%`, py = `${pos.y * 100}%`;

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse' && canHover()) { setHovering(true); setOn(true); } }}
      onPointerLeave={() => setHovering(false)}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] cursor-none"
    >
      <Proposal />
      {/* The magnifying glass: the same page, scaled up around the cursor and clipped to a circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white transition-opacity duration-300"
        style={{ opacity: on ? 1 : 0, transform: `scale(${K})`, transformOrigin: `${px} ${py}`, clipPath: `circle(${R / K}px at ${px} ${py})` }}
      >
        <Proposal big />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-black shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-opacity duration-300"
        style={{ left: px, top: py, width: R * 2, height: R * 2, opacity: on ? 1 : 0 }}
      >
        <span className="absolute -bottom-7 -right-5 h-9 w-2.5 -rotate-45 rounded-full bg-black" />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 02 Passion: one pixel off, until it isn't                           */
/* ------------------------------------------------------------------ */

const PixelPerfect: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [fixed, setFixed] = useState(false);
  const [measuring, setMeasuring] = useState(false);

  const fix = () => {
    if (fixed || measuring) return;
    setMeasuring(true);
    window.setTimeout(() => { setFixed(true); setMeasuring(false); }, 900);
  };
  // Phones: fix itself shortly after it scrolls into view
  useEffect(() => {
    if (!inView || canHover()) return;
    const t = window.setTimeout(fix, 900);
    return () => clearTimeout(t);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Let it drift back out of line a while after, so it can be fixed again
  useEffect(() => {
    if (!fixed) return;
    const t = window.setTimeout(() => setFixed(false), 6000);
    return () => clearTimeout(t);
  }, [fixed]);

  const spring = { type: 'spring', stiffness: 380, damping: 18 } as const;
  return (
    <div
      ref={ref}
      onPointerEnter={(e) => e.pointerType === 'mouse' && fix()}
      onClick={fix}
      className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-[#0f0a1f] cursor-pointer"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:12px_12px]" />
      <div className="absolute inset-0 p-6 flex flex-col justify-center">
        <motion.div animate={{ x: fixed ? 0 : 14, rotate: fixed ? 0 : -6 }} transition={spring} className="w-10 h-10 rounded-xl bg-[#703FEC]" />
        <motion.p animate={{ x: fixed ? 0 : -8, letterSpacing: fixed ? '-0.03em' : '0.06em' }} transition={spring} className="mt-5 text-2xl font-bold leading-tight text-white">
          Launch day
        </motion.p>
        <motion.p animate={{ x: fixed ? 0 : 18, opacity: fixed ? 0.6 : 0.35 }} transition={spring} className="mt-1.5 text-sm text-white">
          Everything in its place.
        </motion.p>
        <motion.span
          animate={{ x: fixed ? 0 : 10, y: fixed ? 0 : 4, rotate: fixed ? 0 : 2, backgroundColor: fixed ? '#ffffff' : '#d9d9d9' }}
          transition={spring}
          className="mt-5 self-start rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-black"
        >
          Get started
        </motion.span>
      </div>

      {/* The guides that find the problem */}
      <AnimatePresence>
        {measuring && (
          <motion.div key="guides" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0">
            <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, ease }} className="absolute top-0 bottom-0 left-6 w-px origin-top bg-[#F3350C]" />
            {[0.32, 0.5, 0.63, 0.78].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="absolute left-7 rounded bg-[#F3350C] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white"
                style={{ top: `${t * 100}%` }}
              >
                {['+14px', '−8px', '+18px', '+10px'][i]}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between font-mono text-[10px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={fixed ? 'fixed' : measuring ? 'measuring' : 'off'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={fixed ? 'text-emerald-400' : measuring ? 'text-[#F3350C]' : 'text-white/40'}
          >
            {fixed ? '✓ Fixed. Nobody asked us to.' : measuring ? 'Measuring…' : 'Something’s off. Hover to look.'}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 03 Empathy: a heatmap of where you looked                           */
/* ------------------------------------------------------------------ */

const Heatmap: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heat = useRef<HTMLCanvasElement>(null);
  const shown = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, { amount: 0.6 });
  const [points, setPoints] = useState(0);
  const last = useRef(0);

  // Grey intensity on one canvas, coloured on the other
  const draw = (fx: number, fy: number, strength = 0.08) => {
    const h = heat.current, s = shown.current;
    if (!h || !s) return;
    const ctx = h.getContext('2d')!;
    const x = fx * h.width, y = fy * h.height, r = h.width * 0.09;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(0,0,0,${strength})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    colourise();
  };
  const colourise = () => {
    const h = heat.current, s = shown.current;
    if (!h || !s) return;
    const src = h.getContext('2d')!.getImageData(0, 0, h.width, h.height).data;
    const out = s.getContext('2d')!.createImageData(h.width, h.height);
    for (let i = 0; i < src.length; i += 4) {
      const a = src[i + 3] / 255;
      if (a < 0.02) continue;
      // violet, then pink, then orange as it gets hotter
      const t = Math.min(1, a * 1.6);
      out.data[i] = t < 0.5 ? 112 + (230 - 112) * t * 2 : 230 + (243 - 230) * (t - 0.5) * 2;
      out.data[i + 1] = t < 0.5 ? 63 + (60 - 63) * t * 2 : 60 + (140 - 60) * (t - 0.5) * 2;
      out.data[i + 2] = t < 0.5 ? 236 + (160 - 236) * t * 2 : 160 + (40 - 160) * (t - 0.5) * 2;
      out.data[i + 3] = Math.min(220, a * 400);
    }
    s.getContext('2d')!.putImageData(out, 0, 0);
  };
  const clear = () => {
    [heat.current, shown.current].forEach((c) => c?.getContext('2d')!.clearRect(0, 0, c.width, c.height));
    setPoints(0);
  };

  // Phones: a reader's gaze across the page (headline, then down the left, then the button)
  useEffect(() => {
    if (!inView || canHover()) return;
    const path = [[0.2, 0.3], [0.5, 0.3], [0.75, 0.32], [0.2, 0.45], [0.45, 0.47], [0.2, 0.6], [0.3, 0.75], [0.32, 0.76], [0.3, 0.74]];
    let k = 0;
    const id = window.setInterval(() => {
      const [a, b] = path[k % path.length];
      for (let j = 0; j < 6; j++) draw(a + (Math.random() - 0.5) * 0.06, b + (Math.random() - 0.5) * 0.05, 0.1);
      setPoints((p) => p + 6);
      if (++k >= path.length * 2) clearInterval(id);
    }, 160);
    return () => clearInterval(id);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={wrapRef}
      onPointerMove={(e) => {
        const now = performance.now();
        if (now - last.current < 24) return;
        last.current = now;
        const r = e.currentTarget.getBoundingClientRect();
        draw((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
        setPoints((p) => p + 1);
      }}
      className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-white cursor-crosshair"
    >
      {/* A small landing page */}
      <div className="absolute inset-0 p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="h-2 w-10 rounded-full bg-black" />
          <span className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-6 rounded-full bg-zinc-200" />)}</span>
        </div>
        <div className="mt-7 space-y-2">
          <span className="block h-4 w-[85%] rounded bg-zinc-800" />
          <span className="block h-4 w-[60%] rounded bg-zinc-800" />
        </div>
        <div className="mt-4 space-y-1.5">
          <span className="block h-1.5 w-[70%] rounded-full bg-zinc-200" />
          <span className="block h-1.5 w-[55%] rounded-full bg-zinc-200" />
        </div>
        <span className="mt-5 h-7 w-24 rounded-full bg-[#703FEC]" />
        <div className="mt-auto grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => <span key={i} className="h-10 rounded-lg bg-zinc-100" />)}
        </div>
      </div>
      <canvas ref={heat} width={160} height={200} className="hidden" />
      <canvas ref={shown} width={160} height={200} className="pointer-events-none absolute inset-0 w-full h-full mix-blend-multiply blur-[6px]" />

      <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between rounded-full bg-black/80 px-3 py-1.5 font-mono text-[10px] text-white backdrop-blur">
        <span>{points === 0 ? 'Move around the page' : 'Where your eyes went'}</span>
        {points > 0 && <button onClick={clear} className="text-white/50 hover:text-white">Reset</button>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const DEMOS = [FinePrint, PixelPerfect, Heatmap];
const CARD = ['bg-zinc-100', 'bg-[#703FEC] text-white', 'bg-[#0A0A0A] text-white'];
const MUTED = ['text-zinc-600', 'text-white/75', 'text-white/60'];

export const Values: React.FC = () => (
  <section className="px-5 md:px-12 pb-28 md:pb-40">
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 md:mb-14">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
          Our values
        </p>
        <h2 className="mt-5 text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02]">Don’t take our word for it.</h2>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {VALUES.map((v, i) => {
          const Demo = DEMOS[i];
          return (
            <motion.li
              key={v.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, ease, delay: i * 0.08 }}
              className={`flex flex-col rounded-[2rem] p-3 md:p-4 ${CARD[i]}`}
            >
              <div className="relative aspect-[4/5] md:aspect-[4/4.6]">
                <Demo />
              </div>
              <div className="px-3 md:px-4 pt-6 pb-4 md:pb-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs opacity-60">{v.number}</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.03em]">{v.title}</h3>
                </div>
                <p className={`mt-3 text-sm md:text-base leading-relaxed ${MUTED[i]}`}>{v.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  </section>
);
