import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

/**
 * Interactive illustrations for the four service cards, drawn in code so they
 * stay crisp, load instantly and use the site's palette.
 */

const VIOLET = '#703FEC';
const EMBER = '#F3350C';
const spring = { type: 'spring', stiffness: 260, damping: 26 } as const;
const ease = [0.16, 1, 0.3, 1] as const;

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pointer position inside an element (-0.5…0.5) and a matching spring tilt. */
const usePointerTilt = (max = 8) => {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 150, damping: 18 });
  const bind = {
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== 'mouse' || reduced()) return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    onPointerLeave: () => { px.set(0); py.set(0); },
  };
  return { px, py, rotateX, rotateY, bind };
};

const Hint: React.FC<{ children: React.ReactNode; tone?: 'light' | 'dark' }> = ({ children, tone = 'light' }) => (
  <span className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-3 md:bottom-4 z-30 rounded-full px-3 py-1 text-[9px] md:text-[10px] font-semibold tracking-wide whitespace-nowrap ${tone === 'light' ? 'bg-white/10 text-white/60 border border-white/10' : 'bg-black/[0.05] text-black/50 border border-black/[0.06]'}`}>
    {children}
  </span>
);

/* ===================================================================== */
/* 01 Web design: inspect the layers, switch devices, watch it reflow      */
/* ===================================================================== */

type LayerId = 'nav' | 'h1' | 'body' | 'cta' | 'cards';
const LAYER_NAMES: Record<LayerId, string> = {
  nav: 'Nav / Sticky',
  h1: 'H1 / Display',
  body: 'Body / 18',
  cta: 'Button / Primary',
  cards: 'Cards / Auto grid',
};

const Layer: React.FC<{
  id: LayerId; depth: number; selected: LayerId | null; exploded: boolean;
  onSelect: (id: LayerId | null) => void; className?: string; children: React.ReactNode;
}> = ({ id, depth, selected, exploded, onSelect, className = '', children }) => (
  <motion.div
    layout
    onPointerEnter={() => onSelect(id)}
    onPointerLeave={() => onSelect(null)}
    animate={{ z: exploded ? depth : 0 }}
    transition={spring}
    className={`relative ${className}`}
  >
    {children}
    <AnimatePresence>
      {selected === id && (
        <motion.span
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute -inset-1.5 rounded-md border-[1.5px] border-[#703FEC] z-10"
        >
          <span className="absolute -top-[18px] left-[-1.5px] rounded-t rounded-br bg-[#703FEC] px-1.5 py-0.5 text-[8px] md:text-[9px] font-semibold text-white whitespace-nowrap">{LAYER_NAMES[id]}</span>
          {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((p) => (
            <span key={p} className={`absolute ${p} w-1.5 h-1.5 bg-white border border-[#703FEC]`} />
          ))}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
);

const WebDesign: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [selected, setSelected] = useState<LayerId | null>(null);
  const [hover, setHover] = useState(false);
  const { rotateX, rotateY, bind } = usePointerTilt(7);
  const mobile = device === 'mobile';
  const exploded = hover && !reduced();
  const L = { selected, exploded, onSelect: setSelected };

  return (
    <div
      className="absolute inset-0 bg-[#0A0A0A] overflow-hidden"
      {...bind}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={(e) => { bind.onPointerLeave(); setHover(false); setSelected(null); void e; }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(112,63,236,0.5),transparent_60%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Device switch */}
      <div className="absolute left-[6%] top-[5%] z-30 flex rounded-full bg-white/10 border border-white/10 p-0.5">
        {(['desktop', 'mobile'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`relative rounded-full px-3 py-1 text-[9px] md:text-[10px] font-semibold capitalize transition-colors ${device === d ? 'text-black' : 'text-white/60 hover:text-white'}`}
          >
            {device === d && <motion.span layoutId="device-pill" className="absolute inset-0 rounded-full bg-white" transition={spring} />}
            <span className="relative">{d}</span>
          </button>
        ))}
      </div>
      <span className="absolute right-[6%] top-[5%] z-30 hidden sm:block rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[9px] md:text-[10px] font-semibold text-white/75">
        Responsive · Fast · SEO-ready
      </span>

      {/* The browser: tilts with the cursor, layers lift apart on hover */}
      <div className="absolute inset-x-0 top-[17%] bottom-0 flex justify-center" style={{ perspective: 1100 }}>
        <motion.div
          animate={{ width: mobile ? '38%' : '82%' }}
          transition={spring}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className={`relative bg-white shadow-[0_40px_90px_rgba(0,0,0,0.55)] ${mobile ? 'rounded-t-[1.4rem] border-[5px] border-b-0 border-[#1a1a1a]' : 'rounded-t-xl md:rounded-t-2xl'}`}
        >
          {!mobile && (
            <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border-b border-black/[0.06] bg-zinc-50 rounded-t-xl md:rounded-t-2xl">
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
              <span className="ml-3 flex-1 max-w-[55%] rounded-full bg-black/[0.05] px-3 py-1 text-[8px] md:text-[10px] text-black/45 truncate">yourstartup.com</span>
            </div>
          )}

          <div className={`${mobile ? 'p-3' : 'p-4 md:p-7'}`} style={{ transformStyle: 'preserve-3d' }}>
            <Layer id="nav" depth={18} {...L} className="flex items-center justify-between mb-4 md:mb-7">
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-md" style={{ background: VIOLET }} />
              {!mobile && <div className="hidden sm:flex gap-3">{[30, 42, 36].map((w) => <span key={w} className="h-1.5 rounded-full bg-black/15" style={{ width: w }} />)}</div>}
              {mobile ? <span className="flex flex-col gap-[3px]">{[0, 1, 2].map((i) => <span key={i} className="w-3.5 h-[2px] bg-black rounded" />)}</span> : <span className="h-4 md:h-5 w-12 md:w-16 rounded-full bg-black" />}
            </Layer>

            <Layer id="h1" depth={60} {...L} className={`space-y-1.5 md:space-y-2.5 ${mobile ? '' : 'max-w-[80%]'}`}>
              <span className="block h-3 md:h-5 w-full rounded bg-black" />
              <span className="block h-3 md:h-5 w-3/4 rounded bg-black" />
              {mobile && <span className="block h-3 w-1/2 rounded bg-black" />}
            </Layer>

            <Layer id="body" depth={34} {...L} className={`space-y-1.5 mt-3 md:mt-4 ${mobile ? '' : 'max-w-[60%]'}`}>
              <span className="block h-1.5 md:h-2 w-full rounded bg-black/20" />
              <span className="block h-1.5 md:h-2 w-4/5 rounded bg-black/20" />
            </Layer>

            <Layer id="cta" depth={90} {...L} className={`flex gap-2 mt-4 md:mt-6 ${mobile ? 'flex-col' : ''}`}>
              <span className={`h-6 md:h-8 rounded-full ${mobile ? 'w-full' : 'w-20 md:w-28'}`} style={{ background: VIOLET }} />
              <span className={`h-6 md:h-8 rounded-full border border-black/15 ${mobile ? 'w-full' : 'w-16 md:w-24'}`} />
            </Layer>

            <Layer id="cards" depth={46} {...L} className={`grid gap-2 md:gap-3 mt-5 md:mt-8 ${mobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              {[0.55, 0.85, 0.4].slice(0, mobile ? 2 : 3).map((h, i) => (
                <motion.div layout key={i} className="rounded-lg md:rounded-xl border border-black/[0.06] p-2 md:p-3 h-12 md:h-20 flex items-end gap-1">
                  {[h, h * 0.6, h * 1.1, h * 0.8, 1].map((v, j) => (
                    <span key={j} className="flex-1 rounded-sm" style={{ height: `${Math.min(1, v) * 100}%`, background: j === 4 ? VIOLET : 'rgba(0,0,0,0.12)' }} />
                  ))}
                </motion.div>
              ))}
            </Layer>
          </div>
        </motion.div>
      </div>

      <Hint>Hover the page to inspect it</Hint>
    </div>
  );
};

/* ===================================================================== */
/* 02 Branding: recolour the identity, cycle the type, see it constructed  */
/* ===================================================================== */

const PALETTE = [
  { c: VIOLET, n: 'Natwic Violet' },
  { c: EMBER, n: 'Ember' },
  { c: '#FFC24B', n: 'Amber' },
  { c: '#F4F2FF', n: 'Mist' },
];
const TYPEFACES = [
  { cls: 'font-serif italic font-normal', n: 'Serif · Display' },
  { cls: 'font-sans font-black tracking-tighter', n: 'Inter · Black' },
  { cls: 'font-mono font-medium tracking-tight', n: 'Mono · Code' },
];

const Branding: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [color, setColor] = useState(0);
  const [face, setFace] = useState(0);
  const [hoverType, setHoverType] = useState(false);
  const { px, py, bind } = usePointerTilt(0);
  const markX = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 16 });
  const markY = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 16 });
  const gridX = useTransform(markX, (v) => -v * 0.6);
  const gridY = useTransform(markY, (v) => -v * 0.6);
  const rot = useTransform(markX, [-10, 10], [-6, 6]);
  const c = PALETTE[color].c;

  // The type specimen cycles on its own until someone takes over
  useEffect(() => {
    if (!inView || hoverType || reduced()) return;
    const t = setInterval(() => setFace((f) => (f + 1) % TYPEFACES.length), 2400);
    return () => clearInterval(t);
  }, [inView, hoverType]);

  return (
    <div ref={ref} className="absolute inset-0 bg-[#141414] overflow-hidden" {...bind}>
      <motion.div className="absolute inset-0" animate={{ background: `radial-gradient(circle at 30% 50%, ${c}40, transparent 60%)` }} transition={{ duration: 0.6 }} />
      <motion.div style={{ x: gridX, y: gridY }} className="absolute -inset-6 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <svg viewBox="0 0 200 200" className="absolute left-[4%] md:left-[6%] top-1/2 -translate-y-1/2 h-[80%] aspect-square overflow-visible">
        {/* Construction geometry draws itself in */}
        <motion.g style={{ x: gridX, y: gridY }} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6">
          {[
            <motion.circle key="a" cx="100" cy="100" r="92" />,
            <motion.circle key="b" cx="100" cy="100" r="62" strokeDasharray="3 4" />,
            <motion.circle key="c" cx="68" cy="68" r="32" />,
            <motion.circle key="d" cx="132" cy="68" r="32" />,
            <motion.line key="e" x1="0" y1="100" x2="200" y2="100" />,
            <motion.line key="f" x1="100" y1="0" x2="100" y2="200" />,
            <motion.line key="g" x1="20" y1="20" x2="180" y2="180" strokeDasharray="2 3" />,
          ].map((el, i) =>
            React.cloneElement(el, {
              initial: { pathLength: 0, opacity: 0 },
              animate: inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
              transition: { duration: 1.4, delay: i * 0.12, ease },
            }),
          )}
        </motion.g>

        {[[36, 36], [164, 36], [36, 164], [164, 164]].map(([x, y], i) => (
          <motion.circle key={`${x}${y}`} cx={x} cy={y} r="2.4" fill={EMBER} initial={{ scale: 0 }} animate={{ scale: inView ? 1 : 0 }} transition={{ delay: 1 + i * 0.08, ...spring }} />
        ))}
      </svg>

      {/* The real mark, recoloured with the chosen swatch and following the cursor */}
      <div className="absolute left-[4%] md:left-[6%] top-1/2 -translate-y-1/2 h-[80%] aspect-square grid place-items-center pointer-events-none">
        <motion.div
          style={{ x: markX, y: markY, rotate: rot, WebkitMaskImage: 'url(/brand/icon-512.png)', maskImage: 'url(/brand/icon-512.png)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ backgroundColor: c, scale: inView ? 1 : 0.7, opacity: inView ? 1 : 0 }}
          transition={{ backgroundColor: { duration: 0.5 }, default: { duration: 0.9, ease } }}
          className="w-[64%] h-[64%] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Type specimen: click to change typeface */}
      <button
        onClick={() => setFace((f) => (f + 1) % TYPEFACES.length)}
        onPointerEnter={() => setHoverType(true)}
        onPointerLeave={() => setHoverType(false)}
        className="absolute right-[6%] top-[9%] text-right group/type"
        aria-label="Change typeface"
      >
        <div className="h-14 md:h-20 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={face}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className={`text-5xl md:text-7xl leading-none ${TYPEFACES[face].cls}`}
              style={{ color: c === '#F4F2FF' ? '#fff' : c }}
            >
              Aa
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-white/45 group-hover/type:text-white/80 transition-colors">{TYPEFACES[face].n} ↻</p>
      </button>

      {/* Palette: click a colour to apply it everywhere */}
      <div className="absolute right-[6%] bottom-[14%] flex flex-col items-end gap-2">
        <div className="flex gap-1.5 md:gap-2">
          {PALETTE.map((p, i) => (
            <motion.button
              key={p.c}
              onClick={() => setColor(i)}
              aria-label={`Use ${p.n}`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.92 }}
              animate={{ height: color === i ? 64 : 48 }}
              transition={spring}
              className={`w-9 md:w-12 rounded-lg md:rounded-xl border shadow-[0_10px_30px_rgba(0,0,0,0.4)] ${color === i ? 'border-white' : 'border-white/10'}`}
              style={{ background: p.c }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={color} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-mono text-[9px] md:text-[10px] text-white/55">
            {PALETTE[color].c.toUpperCase()} · {PALETTE[color].n}
          </motion.p>
        </AnimatePresence>
      </div>

      <Hint>Pick a colour · tap the type</Hint>
    </div>
  );
};

/* ===================================================================== */
/* 03 Content: a deck you can flip, and a post that writes itself          */
/* ===================================================================== */

const SlideProblem: React.FC = () => (
  <>
    <p className="text-[11px] md:text-xl font-bold tracking-tight text-black leading-tight">The problem</p>
    <div className="mt-2 md:mt-4 space-y-2 md:space-y-3">
      {[92, 74, 84].map((w, i) => (
        <div key={w} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0" style={{ background: i === 0 ? EMBER : 'rgba(0,0,0,0.2)' }} />
          <span className="h-1 md:h-1.5 rounded bg-black/15" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  </>
);

const SlideWhyNow: React.FC<{ active: boolean }> = ({ active }) => (
  <>
    <p className="text-[11px] md:text-xl font-bold tracking-tight text-black leading-tight">Why now</p>
    <svg viewBox="0 0 160 60" className="w-full mt-2 md:mt-4 overflow-visible">
      <path d="M0 54 L25 48 L50 50 L75 36 L100 30 L125 16 L160 6" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" strokeLinecap="round" />
      <motion.path
        d="M0 54 L25 48 L50 50 L75 36 L100 30 L125 16 L160 6"
        fill="none" stroke={VIOLET} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 1.2, ease }}
      />
      <motion.circle cx="160" cy="6" r="4.5" fill={EMBER} initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }} transition={{ delay: active ? 1 : 0, ...spring }} />
    </svg>
  </>
);

const SlidePlan: React.FC = () => (
  <>
    <p className="text-[11px] md:text-xl font-bold tracking-tight text-black leading-tight">The plan</p>
    <div className="mt-2 md:mt-4 grid grid-cols-3 gap-1.5 md:gap-2.5">
      {['Discover', 'Design', 'Launch'].map((s, i) => (
        <div key={s} className={`rounded-md md:rounded-lg p-1.5 md:p-2.5 ${i === 2 ? 'text-white' : 'bg-black/[0.05] text-black'}`} style={i === 2 ? { background: VIOLET } : undefined}>
          <p className="font-mono text-[7px] md:text-[9px] opacity-60">0{i + 1}</p>
          <p className="text-[8px] md:text-[11px] font-semibold">{s}</p>
        </div>
      ))}
    </div>
  </>
);

const DRAFT = ['Today we’re launching', 'something we’ve been', 'building all year.'];

const TypedDraft: React.FC<{ run: boolean }> = ({ run }) => {
  const [n, setN] = useState(0);
  const total = DRAFT.join('').length;
  useEffect(() => {
    if (!run) return;
    if (reduced()) { setN(total); return; }
    const t = setInterval(() => setN((v) => (v >= total + 30 ? 0 : v + 1)), 55);
    return () => clearInterval(t);
  }, [run, total]);
  let left = Math.min(n, total);
  return (
    <div className="mt-2 text-[8px] md:text-[11px] leading-snug text-white/85 font-medium min-h-[3.6em]">
      {DRAFT.map((line, i) => {
        const shown = line.slice(0, Math.max(0, left));
        const typing = left > 0 && left <= line.length;
        left -= line.length;
        return (
          <p key={i}>
            {shown}
            {typing && <span className="inline-block w-[1.5px] h-[1em] -mb-[2px] ml-px bg-[#F3350C] animate-pulse" />}
          </p>
        );
      })}
    </div>
  );
};

const Content: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [order, setOrder] = useState([0, 1, 2]);
  const next = () => setOrder((o) => [...o.slice(1), o[0]]);
  const slides = [
    { label: 'Pitch deck · 02', body: () => <SlideProblem /> },
    { label: 'Pitch deck · 03', body: (active: boolean) => <SlideWhyNow active={active} /> },
    { label: 'Pitch deck · 04', body: () => <SlidePlan /> },
  ];

  return (
    <div ref={ref} className="absolute inset-0 bg-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.2),transparent_60%)]" />

      <div className="absolute left-[6%] right-[40%] top-[16%] bottom-[22%]">
        {[...order].reverse().map((id) => {
          const depth = order.indexOf(id);
          const top = depth === 0;
          return (
            <motion.div
              key={id}
              drag={top ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) next(); }}
              onTap={() => top && next()}
              whileDrag={{ scale: 1.03, rotate: 4, cursor: 'grabbing' }}
              animate={{ scale: 1 - depth * 0.07, y: depth * -16, rotate: depth * -3.5, opacity: 1 - depth * 0.28 }}
              transition={spring}
              className={`absolute inset-0 rounded-xl md:rounded-2xl bg-white p-3 md:p-6 shadow-[0_30px_60px_rgba(40,0,110,0.35)] touch-pan-y ${top ? 'cursor-grab' : 'pointer-events-none'}`}
              style={{ zIndex: 3 - depth }}
            >
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: VIOLET }}>{slides[id].label}</span>
                <span className="flex gap-1">
                  {order.map((o) => <span key={o} className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${o === id ? 'bg-[#703FEC]' : 'bg-black/15'}`} />)}
                </span>
              </div>
              {slides[id].body(top && inView)}
            </motion.div>
          );
        })}
      </div>

      {/* Launch post, typing itself */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.3 }}
        className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[30%] rounded-xl bg-[#0A0A0A] text-white p-3 md:p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">Launch post</p>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <TypedDraft run={inView} />
      </motion.div>

      <Hint>Drag or tap the deck</Hint>
    </div>
  );
};

/* ===================================================================== */
/* 04 Social media: a 3D carousel of posts, live notifications, likes      */
/* ===================================================================== */

const HEART = 'M12 21s-7.5-4.6-9.3-9.4C1.4 8 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.6 0 5.8 3.5 4.5 7.1C19.5 16.4 12 21 12 21z';
const STEP = 60; // six posts around the ring

const POSTS = [
  { handle: 'yourbrand', likes: 1204, bg: `linear-gradient(150deg, ${VIOLET}, #2A1270)`, art: 'drop' },
  { handle: 'yourbrand', likes: 868, bg: '#F4F1EA', art: 'quote' },
  { handle: 'yourbrand', likes: 2310, bg: `linear-gradient(160deg, ${EMBER}, #FF9A5C)`, art: 'arch' },
  { handle: 'yourbrand', likes: 1532, bg: '#0E0E12', art: 'ring' },
  { handle: 'yourbrand', likes: 974, bg: '#E9E3FF', art: 'tips' },
  { handle: 'yourbrand', likes: 3108, bg: `linear-gradient(180deg, #13132B, ${VIOLET})`, art: 'late' },
];

const NOTES = [
  { c: VIOLET, t: 'mila.design liked your post' },
  { c: EMBER, t: 'northside.cafe started following you' },
  { c: '#27C2A0', t: 'jay.creates: “This is so good”' },
  { c: '#FFC24B', t: '12 people shared your post' },
  { c: VIOLET, t: 'studio.kai saved your post' },
];

const PostArt: React.FC<{ art: string }> = ({ art }) => {
  switch (art) {
    case 'drop':
      return (
        <div className="relative w-full h-full grid place-items-center">
          <div className="w-[52%] aspect-square rounded-full bg-white/90 shadow-[0_0_60px_rgba(255,255,255,0.55)]" />
          <p className="absolute bottom-[9%] left-[9%] text-white font-black text-[clamp(10px,2.2vw,22px)] leading-none tracking-tighter">NEW<br />DROP</p>
        </div>
      );
    case 'quote':
      return (
        <div className="w-full h-full p-[11%] flex flex-col justify-between">
          <span className="font-serif text-[clamp(22px,4vw,44px)] leading-none" style={{ color: VIOLET }}>“</span>
          <p className="font-serif italic text-black text-[clamp(10px,1.6vw,17px)] leading-tight">Good design is good business.</p>
          <span className="h-1 w-1/3 rounded-full" style={{ background: EMBER }} />
        </div>
      );
    case 'arch':
      return (
        <div className="w-full h-full flex items-end justify-center">
          <div className="w-[46%] h-[70%] rounded-t-full bg-white/90" />
        </div>
      );
    case 'ring':
      return (
        <div className="w-full h-full grid place-items-center">
          <div className="w-[56%] aspect-square rounded-full border-[6px] shadow-[0_0_40px_rgba(112,63,236,0.8),inset_0_0_30px_rgba(112,63,236,0.6)]" style={{ borderColor: VIOLET }} />
        </div>
      );
    case 'tips':
      return (
        <div className="w-full h-full p-[11%] flex flex-col justify-between">
          <p className="font-black text-[clamp(26px,5vw,56px)] leading-none tracking-tighter" style={{ color: VIOLET }}>05</p>
          <p className="text-black font-bold text-[clamp(9px,1.4vw,15px)] leading-tight">tips for a launch that actually lands</p>
        </div>
      );
    default:
      return (
        <div className="w-full h-full p-[11%] flex flex-col justify-end">
          <p className="text-white font-black text-[clamp(14px,2.8vw,30px)] leading-[0.9] tracking-tighter">OPEN<br />LATE<span style={{ color: EMBER }}>.</span></p>
        </div>
      );
  }
};

const RingCard: React.FC<{
  i: number; rot: MotionValue<number>; radius: number; width: number;
  liked: boolean; front: boolean; onLike: () => void;
}> = ({ i, rot, radius, width, liked, front, onLike }) => {
  const angle = useTransform(rot, (r) => ((i * STEP + r) * Math.PI) / 180);
  const opacity = useTransform(angle, (a) => 0.25 + 0.75 * Math.max(0, Math.cos(a)));
  const p = POSTS[i];
  return (
    // Plain wrapper places the card on the ring (Framer would overwrite a transform on a motion element)
    <div
      className="absolute left-1/2 top-1/2"
      style={{ width, marginLeft: -width / 2, marginTop: -(width + 52) / 2, transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`, backfaceVisibility: 'hidden' }}
    >
    <motion.div
      onDoubleClick={() => front && onLike()}
      className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-[0_30px_60px_rgba(0,0,0,0.45)] select-none"
      style={{ opacity }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white">
        <span className="w-4 h-4 rounded-full grid place-items-center border border-black/10">
          <img src="/brand/mark-128.png" alt="" className="w-2.5 h-2.5" draggable={false} />
        </span>
        <span className="text-[8px] md:text-[9px] font-semibold text-black">{p.handle}</span>
      </div>
      <div className="aspect-square" style={{ background: p.bg }}>
        <PostArt art={p.art} />
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white">
        <svg viewBox="0 0 24 24" className="w-3 h-3 md:w-3.5 md:h-3.5"><path d={HEART} fill={liked ? EMBER : 'none'} stroke={liked ? EMBER : 'black'} strokeWidth="2" /></svg>
        <span className="text-[8px] md:text-[9px] font-semibold text-black tabular-nums">{(p.likes + (liked ? 1 : 0)).toLocaleString('en-US')}</span>
      </div>
    </motion.div>
    </div>
  );
};

const Social: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [width, setWidth] = useState(0);
  const [front, setFront] = useState(0);
  const [liked, setLiked] = useState<boolean[]>(POSTS.map(() => false));
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [note, setNote] = useState(0);
  const rot = useMotionValue(0);
  const dragging = useRef(false);
  const heartId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slow drift while on screen and not being dragged
  useEffect(() => {
    if (!inView || reduced()) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!dragging.current) rot.set(rot.get() - dt * 9);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, rot]);

  // Which post faces the viewer
  useEffect(() => rot.on('change', (r) => {
    const f = (((Math.round(-r / STEP) % POSTS.length) + POSTS.length) % POSTS.length);
    setFront((prev) => (prev === f ? prev : f));
  }), [rot]);

  // Notifications drop in one at a time
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setNote((n) => (n + 1) % NOTES.length), 2600);
    return () => clearInterval(t);
  }, [inView]);

  const like = () => {
    setLiked((l) => l.map((v, k) => (k === front ? true : v)));
    const burst = Array.from({ length: 6 }, () => ({ id: heartId.current++, x: (Math.random() - 0.5) * 120 }));
    setHearts((h) => [...h, ...burst]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => !burst.includes(x))), 1400);
  };

  const cardW = Math.max(96, Math.min(220, width * 0.3));
  const radius = cardW * 1.05;

  return (
    <div ref={ref} className="absolute inset-0 bg-[#0B0B10] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(112,63,236,0.45),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(243,53,12,0.18),transparent_40%)]" />
      <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[60%] h-6 rounded-[50%] bg-black/60 blur-xl" />

      {/* Notification */}
      <div className="absolute inset-x-0 top-[6%] z-20 flex justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={note}
            initial={{ y: -16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 pl-1.5 pr-3.5 py-1.5 max-w-full"
          >
            <span className="w-5 h-5 rounded-full shrink-0" style={{ background: NOTES[note].c }} />
            <span className="text-[9px] md:text-[11px] font-medium text-white/85 truncate">{NOTES[note].t}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The ring of posts: drag to spin, double-tap the front one to like it */}
      <motion.div
        className="absolute inset-0 top-[10%] cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ perspective: 900 }}
        onPanStart={() => { dragging.current = true; }}
        onPan={(_, info) => rot.set(rot.get() + info.delta.x * 0.35)}
        onPanEnd={() => {
          dragging.current = false;
          rot.set(Math.round(rot.get() / STEP) * STEP);
        }}
      >
        {width > 0 && (
          <motion.div className="absolute inset-0" style={{ rotateY: rot, transformStyle: 'preserve-3d', z: -radius }}>
            {POSTS.map((_, i) => (
              <RingCard key={i} i={i} rot={rot} radius={radius} width={cardW} liked={liked[i]} front={front === i} onLike={like} />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Hearts */}
      <div className="pointer-events-none absolute left-1/2 top-[55%] z-20">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.svg
              key={h.id}
              viewBox="0 0 24 24"
              initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
              animate={{ x: h.x, y: -140 - Math.random() * 60, scale: 1, opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              className="absolute -ml-3 w-6 h-6"
            >
              <path d={HEART} fill={h.id % 2 ? EMBER : '#ffffff'} />
            </motion.svg>
          ))}
        </AnimatePresence>
      </div>

      <Hint>Drag to spin · double-tap to like</Hint>
    </div>
  );
};

/* ===================================================================== */

const VISUALS = [WebDesign, Branding, Content, Social];

export const ServiceVisual: React.FC<{ index: number }> = ({ index }) => {
  const Visual = VISUALS[index % VISUALS.length];
  return <Visual />;
};

export type { MotionValue };
