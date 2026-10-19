/**
 * Interactive demos for the service pages, one per service, plus the hub's constellation. Illustrative UI only: no real client data or numbers.
 * Every demo renders a fixed first state, so the pre-rendered HTML hydrates cleanly.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Reorder, useReducedMotion, useInView } from 'framer-motion';
import { Link } from '../nav';

const ease = [0.16, 1, 0.3, 1] as const;
const V = '#703FEC';

/** Glass panel the demos sit in */
export const DemoShell: React.FC<{ title: string; hint: string; children: React.ReactNode; className?: string }> = ({ title, hint, children, className = '' }) => (
  <div className={`relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 md:p-4 shadow-[0_40px_120px_rgba(0,0,0,0.5)] ${className}`}>
    <div className="flex items-center justify-between gap-3 px-2 pb-3">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
        <span className="relative flex w-1.5 h-1.5"><span className="absolute inset-0 rounded-full bg-[#b9a1ff] animate-ping opacity-60" /><span className="relative w-1.5 h-1.5 rounded-full bg-[#b9a1ff]" /></span>
        {title}
      </span>
      <span className="hidden sm:block text-[11px] text-white/40">{hint}</span>
    </div>
    <div className="relative overflow-hidden rounded-[1.25rem] bg-[#07070c]">{children}</div>
  </div>
);

/** Cycles through `count` steps until the visitor takes over */
const useAutoStep = (count: number, ms: number, active: boolean) => {
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (manual || reduce || !active) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => clearInterval(id);
  }, [manual, reduce, active, count, ms]);
  return [step, (s: number) => { setManual(true); setStep(s); }] as const;
};

const Tabs: React.FC<{ items: string[]; value: number; onChange: (i: number) => void }> = ({ items, value, onChange }) => (
  <div role="tablist" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
    {items.map((it, i) => (
      <button key={it} role="tab" aria-selected={value === i} onClick={() => onChange(i)} className={`relative rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${value === i ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
        {value === i && <motion.span layoutId={`tab-${items.join('')}`} className="absolute inset-0 rounded-full bg-[#703FEC]" transition={{ duration: 0.4, ease }} />}
        <span className="relative">{it}</span>
      </button>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Web design: a page builder. Wireframe, design, live; drag sections   */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: 'hero', label: 'Hero', h: 'h-24' },
  { id: 'proof', label: 'Proof', h: 'h-10' },
  { id: 'features', label: 'Features', h: 'h-20' },
  { id: 'cta', label: 'Call to action', h: 'h-12' },
];

const Block: React.FC<{ id: string; stage: number }> = ({ id, stage }) => {
  const wire = stage === 0;
  const box = wire ? 'border border-dashed border-white/20 bg-transparent' : 'border border-white/5';
  if (id === 'hero') return (
    <div className={`rounded-xl p-4 transition-all duration-700 ${box} ${wire ? '' : 'bg-gradient-to-br from-[#703FEC]/40 via-[#1a1030] to-transparent'}`}>
      <div className={`h-3 w-2/3 rounded-full transition-colors duration-700 ${wire ? 'bg-white/15' : 'bg-white'}`} />
      <div className={`mt-2 h-3 w-1/2 rounded-full transition-colors duration-700 ${wire ? 'bg-white/15' : 'bg-[#b9a1ff]'}`} />
      <div className={`mt-4 h-6 w-24 rounded-full transition-all duration-700 ${wire ? 'bg-white/10' : 'bg-[#703FEC] shadow-[0_0_24px_rgba(112,63,236,0.7)]'}`} />
    </div>
  );
  if (id === 'proof') return (
    <div className={`flex items-center justify-around rounded-xl px-3 py-3 transition-all duration-700 ${box} ${wire ? '' : 'bg-white/[0.04]'}`}>
      {[0, 1, 2, 3].map((i) => <span key={i} className={`h-2.5 w-10 rounded-full transition-colors duration-700 ${wire ? 'bg-white/10' : 'bg-white/40'}`} />)}
    </div>
  );
  if (id === 'features') return (
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`rounded-xl p-3 transition-all duration-700 ${box} ${wire ? '' : 'bg-white/[0.05]'}`} style={{ transitionDelay: `${i * 80}ms` }}>
          <span className={`block w-5 h-5 rounded-md transition-colors duration-700 ${wire ? 'bg-white/10' : 'bg-[#703FEC]/80'}`} />
          <span className={`mt-3 block h-2 w-4/5 rounded-full transition-colors duration-700 ${wire ? 'bg-white/10' : 'bg-white/60'}`} />
          <span className={`mt-1.5 block h-2 w-3/5 rounded-full transition-colors duration-700 ${wire ? 'bg-white/10' : 'bg-white/25'}`} />
        </div>
      ))}
    </div>
  );
  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-700 ${box} ${wire ? '' : 'bg-white text-black'}`}>
      <span className={`h-3 w-1/3 rounded-full transition-colors duration-700 ${wire ? 'bg-white/15' : 'bg-black/80'}`} />
      <span className={`h-6 w-20 rounded-full transition-colors duration-700 ${wire ? 'bg-white/10' : 'bg-[#703FEC]'}`} />
    </div>
  );
};

export const WebDesignDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [stage, setStage] = useAutoStep(3, 2600, inView);
  const [order, setOrder] = useState(SECTIONS.map((s) => s.id));
  return (
    <DemoShell title="Page builder" hint="Drag sections to reorder">
      <div ref={ref} className="p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs items={['Wireframe', 'Design', 'Live']} value={stage} onChange={setStage} />
          <span className="font-mono text-[10px] text-white/40">{['Plan the story', 'Design the system', 'Ship it'][stage]}</span>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
          <div className="mb-3 flex items-center gap-1.5">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
            <span className="ml-2 h-4 flex-1 rounded-full bg-white/[0.05]" />
            {stage === 2 && <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[9px] text-emerald-300">LIVE</motion.span>}
          </div>
          <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-2">
            {order.map((id) => (
              <Reorder.Item key={id} value={id} className="group relative cursor-grab active:cursor-grabbing" whileDrag={{ scale: 1.03, zIndex: 5 }}>
                <span className="pointer-events-none absolute -left-1 top-1/2 -translate-x-full -translate-y-1/2 pr-2 font-mono text-[9px] text-white/0 group-hover:text-white/50 transition-colors hidden md:block">{SECTIONS.find((s) => s.id === id)!.label}</span>
                <Block id={id} stage={stage} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </DemoShell>
  );
};

/* ------------------------------------------------------------------ */
/* Branding: an identity lab                                           */
/* ------------------------------------------------------------------ */

const PALETTES = [
  { name: 'Violet', a: '#703FEC', b: '#b9a1ff', bg: '#120a24' },
  { name: 'Ember', a: '#F3350C', b: '#ffb08f', bg: '#1f0c06' },
  { name: 'Ocean', a: '#0EA5E9', b: '#7dd3fc', bg: '#06141f' },
  { name: 'Forest', a: '#16A34A', b: '#86efac', bg: '#071a0e' },
];
const TYPES = [
  { name: 'Geometric', css: { fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '-0.04em' } },
  { name: 'Editorial', css: { fontFamily: 'Georgia, serif', fontWeight: 700, fontStyle: 'italic' as const, letterSpacing: '-0.02em' } },
  { name: 'Technical', css: { fontFamily: 'ui-monospace, monospace', fontWeight: 700, letterSpacing: '0.02em' } },
];
const SHAPES = [
  { name: 'Circle', r: '9999px' },
  { name: 'Squircle', r: '30%' },
  { name: 'Square', r: '12%' },
];

export const BrandingDemo: React.FC = () => {
  const [name, setName] = useState('Lumen');
  const [p, setP] = useState(0);
  const [t, setT] = useState(0);
  const [s, setS] = useState(1);
  const pal = PALETTES[p];
  const type = TYPES[t].css;
  const shape = SHAPES[s].r;
  const initial = (name.trim()[0] || 'L').toUpperCase();
  const Mark: React.FC<{ size: string; text?: string }> = ({ size, text = 'text-[1em]' }) => (
    <motion.span layout className={`grid place-items-center shrink-0 ${size} ${text}`} style={{ background: `linear-gradient(135deg, ${pal.a}, ${pal.b})`, borderRadius: shape, color: '#fff', ...type }}>{initial}</motion.span>
  );
  return (
    <DemoShell title="Identity lab" hint="Type a name, pick a direction">
      <div className="grid md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 p-4 md:p-5 border-b md:border-b-0 md:border-r border-white/10">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value.slice(0, 14))} aria-label="Brand name" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white outline-none focus:border-[#703FEC]" />
          </label>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Color</span>
            <div className="mt-2 flex gap-2">
              {PALETTES.map((x, i) => (
                <button key={x.name} onClick={() => setP(i)} aria-label={`${x.name} palette`} aria-pressed={p === i} className={`w-8 h-8 rounded-full transition-transform ${p === i ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#07070c]' : 'hover:scale-105'}`} style={{ background: `linear-gradient(135deg, ${x.a}, ${x.b})` }} />
              ))}
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Type</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TYPES.map((x, i) => <button key={x.name} onClick={() => setT(i)} aria-pressed={t === i} className={`rounded-full px-3 py-1.5 text-xs transition-colors ${t === i ? 'bg-white text-black' : 'border border-white/10 text-white/60 hover:text-white'}`} style={x.css}>{x.name}</button>)}
            </div>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Shape</span>
            <div className="mt-2 flex gap-2">
              {SHAPES.map((x, i) => <button key={x.name} onClick={() => setS(i)} aria-label={`${x.name} mark`} aria-pressed={s === i} className={`w-8 h-8 border transition-colors ${s === i ? 'border-white bg-white/20' : 'border-white/20 hover:border-white/50'}`} style={{ borderRadius: x.r }} />)}
            </div>
          </div>
        </div>
        <div className="p-4 md:p-5 grid grid-cols-2 gap-3 transition-colors duration-700" style={{ background: pal.bg }}>
          <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4">
            <Mark size="w-12 h-12" text="text-2xl" />
            <span className="truncate text-3xl text-white" style={type}>{name || 'Lumen'}</span>
          </div>
          <div className="rounded-2xl bg-white p-3 flex flex-col justify-between aspect-[1.6]">
            <Mark size="w-7 h-7" text="text-sm" />
            <span className="text-[10px] text-black/70" style={{ fontFamily: type.fontFamily }}>hello@{(name || 'lumen').toLowerCase().replace(/[^a-z0-9]/g, '') || 'lumen'}.com</span>
          </div>
          <div className="rounded-2xl bg-black/40 grid place-items-center aspect-[1.6]">
            <Mark size="w-14 h-14" text="text-2xl" />
          </div>
          <div className="col-span-2 rounded-2xl p-4 text-white" style={{ background: `linear-gradient(120deg, ${pal.a}, ${pal.bg})` }}>
            <span className="text-xl leading-tight block" style={type}>Made for the long run.</span>
            <span className="mt-2 block font-mono text-[10px] opacity-70">@{(name || 'lumen').toLowerCase().replace(/\s+/g, '')}</span>
          </div>
        </div>
      </div>
    </DemoShell>
  );
};

/* ------------------------------------------------------------------ */
/* SaaS: a product tour with auto-advancing feature tabs                */
/* ------------------------------------------------------------------ */

const FEATURES = ['Dashboard', 'Reports', 'Integrations'];
const BARS = [38, 52, 44, 66, 58, 74, 70, 88];

const SaasScene: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {[0, 1, 2].map((k) => (
        <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.08 }} className="rounded-xl bg-white/[0.05] p-3">
          <span className="block h-2 w-12 rounded-full bg-white/30" />
          <span className="mt-3 block h-4 w-16 rounded-full bg-white" />
        </motion.div>
      ))}
      <div className="col-span-3 flex h-28 items-end gap-2 rounded-xl bg-white/[0.04] p-3">
        {BARS.map((h, k) => <motion.span key={k} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, ease, delay: 0.1 + k * 0.05 }} className="flex-1 rounded-t-md bg-gradient-to-t from-[#703FEC] to-[#b9a1ff]" />)}
      </div>
    </div>
  );
  if (i === 1) return (
    <div className="space-y-2 p-4">
      {['Weekly summary', 'Revenue by plan', 'Churn signals', 'Top accounts', 'Usage trends'].map((r, k) => (
        <motion.div key={r} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.09, ease }} className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3 py-2.5">
          <span className="flex items-center gap-2 text-xs text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-[#b9a1ff]" />{r}</span>
          <motion.span initial={{ width: 0 }} animate={{ width: `${30 + k * 12}%` }} transition={{ delay: 0.3 + k * 0.09, duration: 0.7, ease }} className="h-1.5 max-w-[45%] rounded-full bg-[#703FEC]" />
        </motion.div>
      ))}
    </div>
  );
  const nodes = ['Slack', 'Stripe', 'HubSpot', 'Notion', 'GitHub', 'Gmail'];
  return (
    <div className="relative h-56">
      <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full" aria-hidden>
        {nodes.map((_, k) => {
          const a = (k / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + Math.cos(a) * 140, y = 110 + Math.sin(a) * 80;
          return <motion.line key={k} x1="200" y1="110" x2={x} y2={y} stroke={V} strokeWidth="1.5" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ delay: k * 0.12, duration: 0.6 }} />;
        })}
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-14 h-14 rounded-2xl bg-[#703FEC] text-white font-bold shadow-[0_0_40px_rgba(112,63,236,0.8)]">App</span>
      {nodes.map((n, k) => {
        const a = (k / nodes.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span key={n} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + k * 0.12 }} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[#12121a] px-2.5 py-1 text-[10px] text-white/80" style={{ left: `${50 + Math.cos(a) * 35}%`, top: `${50 + Math.sin(a) * 36}%` }}>{n}</motion.span>
        );
      })}
    </div>
  );
};

export const SaasDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [i, setI] = useAutoStep(FEATURES.length, 3200, inView);
  return (
    <DemoShell title="Product tour" hint="Show the product working">
      <div ref={ref} className="grid md:grid-cols-[0.8fr_1.4fr]">
        <ul className="p-3 md:p-4 space-y-2 border-b md:border-b-0 md:border-r border-white/10">
          {FEATURES.map((f, k) => (
            <li key={f}>
              <button onClick={() => setI(k)} aria-pressed={i === k} className={`relative w-full overflow-hidden rounded-xl px-4 py-3 text-left transition-colors ${i === k ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:text-white/80'}`}>
                <span className="text-sm font-semibold">{f}</span>
                <span className="block text-[11px] text-white/40">{['See everything at a glance', 'Answers, written for you', 'Connects to your stack'][k]}</span>
                {i === k && <motion.span key={`bar-${k}`} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3.2, ease: 'linear' }} className="absolute bottom-0 left-0 h-[2px] bg-[#703FEC]" />}
              </button>
            </li>
          ))}
        </ul>
        <div className="min-h-[15rem]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
              <SaasScene i={i} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DemoShell>
  );
};

/* ------------------------------------------------------------------ */
/* Webflow & Next.js: code to canvas                                   */
/* ------------------------------------------------------------------ */

const CODE = {
  'Next.js': [
    ['<', 'Hero', '>'],
    ['  <', 'h1', '>Ship faster</', 'h1', '>'],
    ['  <', 'p', '>Built to load fast.</', 'p', '>'],
    ['  <', 'Button', ' href', '="/start"', '>Start</', 'Button', '>'],
    ['</', 'Hero', '>'],
  ],
  Webflow: [
    ['Section', ' · ', 'Hero'],
    ['  Heading', ' · ', 'H1 "Ship faster"'],
    ['  Paragraph', ' · ', '"Built to load fast."'],
    ['  Button', ' · ', 'Link /start'],
    ['CMS', ' · ', 'Editable by your team'],
  ],
} as const;

export const DevDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [stack, setStack] = useState<'Next.js' | 'Webflow'>('Next.js');
  const [lines, setLines] = useState(5);
  useEffect(() => {
    if (!inView || reduce) { setLines(5); return; }
    setLines(0);
    let n = 0;
    const id = window.setInterval(() => { n += 1; setLines(n); if (n >= 5) clearInterval(id); }, 520);
    return () => clearInterval(id);
  }, [inView, stack, reduce]);
  const code = CODE[stack];
  const score = lines / 5;
  return (
    <DemoShell title="Code to canvas" hint="Switch the stack">
      <div ref={ref} className="p-4 md:p-5">
        <Tabs items={['Next.js', 'Webflow']} value={stack === 'Next.js' ? 0 : 1} onChange={(i) => setStack(i ? 'Webflow' : 'Next.js')} />
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <pre className="min-h-[11rem] overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] leading-6 text-white/80">
            {code.map((ln, k) => (
              <div key={`${stack}-${k}`} className={`transition-opacity duration-300 ${k < lines ? 'opacity-100' : 'opacity-0'}`}>
                {ln.map((tok, j) => <span key={j} className={j % 2 === 1 ? 'text-[#b9a1ff]' : tok.startsWith('=') || tok.startsWith('"') || tok.startsWith('H1') || tok.startsWith('Link') ? 'text-emerald-300' : ''}>{tok}</span>)}
                {k === lines - 1 && lines < 5 && <span className="ml-0.5 inline-block w-1.5 h-3.5 align-middle bg-white/70 animate-pulse" />}
              </div>
            ))}
          </pre>
          <div className="min-h-[11rem] rounded-2xl border border-white/10 bg-gradient-to-br from-[#703FEC]/30 to-transparent p-4">
            <AnimatePresence>
              {lines >= 2 && <motion.p key="h" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold tracking-[-0.03em] text-white">Ship faster</motion.p>}
              {lines >= 3 && <motion.p key="p" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-white/60">Built to load fast.</motion.p>}
              {lines >= 4 && <motion.span key="b" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black">Start</motion.span>}
              {lines >= 5 && <motion.p key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-mono text-[10px] text-emerald-300">{stack === 'Webflow' ? 'Published · editable in the CMS' : 'Deployed · static and fast'}</motion.p>}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeDasharray="94.2" strokeDashoffset={94.2 * (1 - score)} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
          </svg>
          <span className="text-sm text-white/70">Performance, accessibility and SEO basics, checked before launch</span>
        </div>
      </div>
    </DemoShell>
  );
};

/* ------------------------------------------------------------------ */
/* Redesign: before and after, plus the redirect map                    */
/* ------------------------------------------------------------------ */

const OldPage: React.FC = () => (
  <div className="h-full bg-[#e9e6dc] p-3 text-[#333]" style={{ fontFamily: 'Times New Roman, serif' }}>
    <div className="flex items-center justify-between border-b-2 border-[#8a7d5a] pb-1">
      <span className="text-sm font-bold text-[#5a3d1e]">COMPANY NAME</span>
      <span className="flex gap-1">{['Home', 'About Us', 'Services', 'Contact'].map((x) => <span key={x} className="bg-[#c9c0a6] px-1 text-[8px]">{x}</span>)}</span>
    </div>
    <div className="mt-2 grid grid-cols-[1fr_2fr] gap-2">
      <div className="space-y-1">{[0, 1, 2, 3].map((i) => <span key={i} className="block h-3 bg-[#d5cdb5]" />)}</div>
      <div>
        <p className="text-[10px] font-bold underline text-[#1a3a8a]">Welcome to our website!!!</p>
        <p className="mt-1 text-[8px] leading-tight">We are a leading provider of solutions. Click here to learn more about our services and products.</p>
        <span className="mt-2 inline-block border border-[#666] bg-[#ddd] px-2 text-[8px]">Click Here</span>
      </div>
    </div>
  </div>
);

const NewPage: React.FC = () => (
  <div className="h-full bg-[#0b0b12] p-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-white">company</span>
      <span className="h-5 w-16 rounded-full bg-white" />
    </div>
    <p className="mt-5 text-xl font-bold leading-tight tracking-[-0.03em] text-white">Clear words.<br /><span className="text-[#b9a1ff]">Real results.</span></p>
    <span className="mt-3 inline-block rounded-full bg-[#703FEC] px-3 py-1 text-[10px] font-semibold text-white shadow-[0_0_20px_rgba(112,63,236,0.7)]">Get started</span>
  </div>
);

const REDIRECTS = [['/about-us.php', '/about'], ['/our-services.html', '/services'], ['/contact_form.asp', '/contact']];

export const RedesignDemo: React.FC = () => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapIn = useInView(mapRef, { amount: 0.5 });
  const moveTo = (x: number) => { const r = ref.current?.getBoundingClientRect(); if (r) setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100))); };
  return (
    <DemoShell title="Before and after" hint="Drag to compare">
      <div className="p-4 md:p-5">
        <div
          ref={ref}
          className="relative h-56 select-none overflow-hidden rounded-2xl border border-white/10 cursor-ew-resize touch-pan-y"
          onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); moveTo(e.clientX); }}
          onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
          onPointerUp={() => { dragging.current = false; }}
        >
          <div className="absolute inset-0"><NewPage /></div>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><OldPage /></div>
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[9px] text-white">BEFORE</span>
          <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-[#703FEC] px-2 py-0.5 font-mono text-[9px] text-white">AFTER</span>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${pos}%` }}>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white text-xs text-black shadow-lg">↔</span>
          </div>
          <input type="range" min={0} max={100} value={Math.round(pos)} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare an outdated page with a redesigned one" className="absolute inset-x-0 bottom-0 h-8 w-full opacity-0" />
        </div>
        <div ref={mapRef} className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-black/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Old URLs, mapped</p>
          {REDIRECTS.map(([from, to], i) => (
            <div key={from} className="flex items-center gap-2 font-mono text-[11px]">
              <span className="truncate text-white/40 line-through decoration-white/20">{from}</span>
              <span className="relative h-px flex-1 bg-white/10 overflow-hidden">
                <motion.span className="absolute inset-y-0 left-0 bg-[#703FEC]" initial={{ width: 0 }} animate={{ width: mapIn ? '100%' : 0 }} transition={{ delay: 0.2 + i * 0.35, duration: 0.6, ease }} />
              </span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: mapIn ? 1 : 0 }} transition={{ delay: 0.6 + i * 0.35 }} className="rounded bg-emerald-400/15 px-1.5 text-emerald-300">301</motion.span>
              <span className="text-white/80">{to}</span>
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
};

export const DEMOS: Record<string, { Demo: React.FC; label: string }> = {
  'web-design': { Demo: WebDesignDemo, label: 'Page builder' },
  branding: { Demo: BrandingDemo, label: 'Identity lab' },
  'saas-website-design': { Demo: SaasDemo, label: 'Product tour' },
  'webflow-nextjs-development': { Demo: DevDemo, label: 'Code to canvas' },
  'website-redesign': { Demo: RedesignDemo, label: 'Before and after' },
};

/* ------------------------------------------------------------------ */
/* Hub: the five services orbiting the studio                          */
/* ------------------------------------------------------------------ */

const ORBIT_CSS = `
@keyframes svc-orbit { to { transform: rotate(360deg); } }
@keyframes svc-counter { to { transform: rotate(-360deg); } }
.svc-orbit { animation: svc-orbit 60s linear infinite; }
.svc-counter { animation: svc-counter 60s linear infinite; }
.svc-orbit:hover, .svc-orbit:hover .svc-counter { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .svc-orbit, .svc-counter { animation: none; } }
`;

export const Constellation: React.FC<{ services: { slug: string; name: string; teaser: string }[]; href: (slug: string) => string }> = ({ services, href }) => {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? 0;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <style>{ORBIT_CSS}</style>
      {[1, 0.72, 0.44].map((s) => <span key={s} aria-hidden className="absolute rounded-full border border-white/10" style={{ inset: `${(1 - s) * 50}%` }} />)}
      <span aria-hidden className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(112,63,236,0.55),transparent)] blur-xl" />
      <div className="absolute inset-[34%] grid place-items-center rounded-full border border-white/15 bg-[#0b0b12]/80 backdrop-blur text-center p-3">
        <AnimatePresence mode="wait">
          <motion.div key={shown} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#b9a1ff]">0{shown + 1} / 0{services.length}</p>
            <p className="mt-1 text-sm md:text-base font-bold leading-tight text-white">{services[shown].name}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <ul className="svc-orbit absolute inset-0">
        {services.map((s, i) => {
          const a = (i / services.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <li key={s.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(a) * 43}%`, top: `${50 + Math.sin(a) * 43}%` }}>
              <span className="svc-counter block">
                <Link
                  href={href(s.slug)}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  className={`group flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] md:text-xs font-semibold whitespace-nowrap backdrop-blur transition-all duration-300 ${hover === i ? 'border-[#703FEC] bg-[#703FEC] text-white shadow-[0_0_30px_rgba(112,63,236,0.8)]' : 'border-white/15 bg-[#0e0e16]/80 text-white/80 hover:text-white'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${hover === i ? 'bg-white' : 'bg-[#b9a1ff]'}`} />
                  {s.name}
                </Link>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Working together: a shared workspace where updates stream in         */
/* ------------------------------------------------------------------ */

/** kind matches the three working-together points: 0 shared space, 1 calls, 2 written updates */
const FEED = [
  { kind: 0, text: 'Staging link shared', meta: 'Workspace' },
  { kind: 2, text: 'Written update: homepage design done', meta: 'Update' },
  { kind: 0, text: 'Design v2 ready for review', meta: 'Workspace' },
  { kind: 1, text: 'Weekly call booked in your hours', meta: 'Calendar' },
  { kind: 2, text: 'Feedback answered in the thread', meta: 'Update' },
  { kind: 0, text: 'Launch checklist added', meta: 'Workspace' },
  { kind: 1, text: 'Call notes and next steps posted', meta: 'Calendar' },
];
const KIND_STYLE = ['bg-[#703FEC] text-white', 'bg-[#b9a1ff] text-black', 'bg-white text-black'];
const FEED_ROWS = 4;
const FEED_ROW = 72; // row height plus gap, in px
const KIND_ICON = ['◆', '◷', '✎'];

export const RemoteFeed: React.FC<{ highlight: number | null }> = ({ highlight }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [head, setHead] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setHead((h) => h + 1), 2200);
    return () => clearInterval(id);
  }, [inView, reduce]);
  // The newest four items, newest on top
  const items = Array.from({ length: FEED_ROWS }, (_, k) => ({ ...FEED[(head + FEED_ROWS - 1 - k) % FEED.length], key: head + FEED_ROWS - 1 - k }));
  return (
    <div ref={ref} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 md:p-4 shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-2 pb-3">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
          <span className="relative flex w-1.5 h-1.5"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" /><span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" /></span>
          Shared workspace
        </span>
        <span className="flex -space-x-2">
          {['N', 'You'].map((a, i) => <span key={a} className={`grid place-items-center h-7 min-w-7 px-1.5 rounded-full border-2 border-[#0b0b12] text-[10px] font-bold ${i ? 'bg-white text-black' : 'bg-[#703FEC] text-white'}`}>{a}</span>)}
        </span>
      </div>
      {/* Rows sit in fixed slots and slide between them, so nothing reflows while one leaves */}
      <ul className="relative overflow-hidden rounded-[1.25rem] bg-[#07070c]" style={{ height: FEED_ROWS * FEED_ROW + 16 }}>
        <AnimatePresence initial={false}>
          {items.map((it, k) => (
            <motion.li
              key={it.key}
              initial={{ opacity: 0, y: -FEED_ROW + 8 }}
              animate={{ opacity: highlight === null || highlight === it.kind ? 1 : 0.25, y: k * FEED_ROW + 8 }}
              exit={{ opacity: 0, y: FEED_ROWS * FEED_ROW + 8 }}
              transition={{ duration: 0.6, ease }}
              style={{ height: FEED_ROW - 8 }}
              className={`absolute inset-x-3 top-0 flex items-center gap-3 rounded-xl border px-3 transition-colors duration-500 ${k === 0 ? 'border-[#703FEC]/50 bg-[#703FEC]/10' : 'border-white/5 bg-white/[0.03]'}`}
            >
              <span className={`grid place-items-center w-8 h-8 shrink-0 rounded-lg text-sm ${KIND_STYLE[it.kind]}`}>{KIND_ICON[it.kind]}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-white/90">{it.text}</span>
                <span className="block font-mono text-[10px] text-white/40">{it.meta}</span>
              </span>
              <span className="font-mono text-[10px] text-white/30">{k === 0 ? 'now' : `${k * 2}m`}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};
