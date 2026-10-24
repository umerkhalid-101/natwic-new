/**
 * A visual theme per service, so each page looks like the craft it sells:
 * a blueprint canvas for web design, a brand book for branding, product UI for SaaS,
 * a terminal for development, a before-to-after transformation for redesigns and a social feed for social media.
 * Colors come in as CSS variables (--page, --ink, --muted, --accent ...) set on the page.
 */

import React, { useRef } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { pad2, ease } from '../work/rich/blocks';
import { Typewriter } from './micro';

export type ThemeKey = 'blueprint' | 'editorial' | 'product' | 'terminal' | 'transform' | 'feed';

export type Theme = {
  key: ThemeKey;
  /** Name shown on the page, e.g. "Blueprint" */
  name: string;
  /** Page and stage colors as CSS variables */
  vars: Record<string, string>;
  /** Dark page (light text) or light page */
  dark: boolean;
  /** Classes for the big headings */
  display: string;
  /** Prefix for section labels */
  label: (n: number, text: string) => string;
};

const mono = 'font-mono';

export const THEMES: Record<string, Theme> = {
  'web-design': {
    key: 'blueprint',
    name: 'Blueprint',
    dark: false,
    vars: { '--page': '#ffffff', '--ink': '#0b0b14', '--muted': '#5d6175', '--line': 'rgba(37,99,235,0.10)', '--card': '#ffffff', '--border': '#e3e6f0', '--accent': '#703FEC', '--accent-2': '#2563EB', '--on-accent': '#ffffff', '--stage': '#0a1330', '--stage-ink': '#ffffff' },
    display: 'font-bold tracking-[-0.055em]',
    label: (n, t) => `Frame ${pad2(n)} · ${t}`,
  },
  branding: {
    key: 'editorial',
    name: 'Brand book',
    dark: false,
    vars: { '--page': '#f4eee4', '--ink': '#1d1712', '--muted': '#6d6157', '--line': 'rgba(29,23,18,0.08)', '--card': '#fbf7f0', '--border': '#e4d9c8', '--accent': '#F3350C', '--accent-2': '#703FEC', '--on-accent': '#ffffff', '--stage': '#1d1712', '--stage-ink': '#f4eee4' },
    // The site sets Inter on every element, so the serif has to reach the inner spans too
    display: '[font-family:Georgia,"Times_New_Roman",serif] [&_*]:[font-family:Georgia,"Times_New_Roman",serif] font-normal tracking-[-0.03em]',
    label: (n, t) => `Chapter ${pad2(n)} · ${t}`,
  },
  'saas-website-design': {
    key: 'product',
    name: 'Product UI',
    dark: true,
    vars: { '--page': '#0a0c14', '--ink': '#f3f5fb', '--muted': '#98a1b8', '--line': 'rgba(124,92,255,0.12)', '--card': 'rgba(255,255,255,0.035)', '--border': 'rgba(255,255,255,0.09)', '--accent': '#7C5CFF', '--accent-2': '#22D3EE', '--on-accent': '#ffffff', '--stage': '#0f1222', '--stage-ink': '#f3f5fb' },
    display: 'font-bold tracking-[-0.055em]',
    label: (n, t) => `Module ${pad2(n)} · ${t}`,
  },
  'webflow-nextjs-development': {
    key: 'terminal',
    name: 'Terminal',
    dark: true,
    vars: { '--page': '#050806', '--ink': '#e6f2ec', '--muted': '#86a394', '--line': 'rgba(52,211,153,0.10)', '--card': '#0a120d', '--border': 'rgba(52,211,153,0.16)', '--accent': '#34D399', '--accent-2': '#703FEC', '--on-accent': '#04140c', '--stage': '#08110c', '--stage-ink': '#e6f2ec' },
    display: 'font-bold tracking-[-0.05em]',
    label: (n, t) => `// ${pad2(n)} ${t.toLowerCase()}`,
  },
  'website-redesign': {
    key: 'transform',
    name: 'Transformation',
    dark: false,
    vars: { '--page': '#f1f0ec', '--ink': '#111114', '--muted': '#62615c', '--line': 'rgba(17,17,20,0.07)', '--card': '#ffffff', '--border': '#e0ded7', '--accent': '#703FEC', '--accent-2': '#F59E0B', '--on-accent': '#ffffff', '--stage': '#111114', '--stage-ink': '#ffffff' },
    display: 'font-bold tracking-[-0.055em]',
    label: (n, t) => `Step ${pad2(n)} · ${t}`,
  },
  'social-media': {
    key: 'feed',
    name: 'Social feed',
    dark: false,
    vars: { '--page': '#f6f5fa', '--ink': '#0f0c1a', '--muted': '#5f5b70', '--line': 'rgba(112,63,236,0.08)', '--card': '#ffffff', '--border': '#e4e1ee', '--accent': '#703FEC', '--accent-2': '#b9a1ff', '--on-accent': '#ffffff', '--stage': '#100c1c', '--stage-ink': '#ffffff' },
    display: 'font-bold tracking-[-0.055em]',
    label: (n, t) => `#${pad2(n)} · ${t}`,
  },
};

export const themeFor = (slug: string) => THEMES[slug] ?? THEMES['web-design'];

const THEME_CSS = `
@keyframes th-drift { to { transform: translateY(-50%); } }
.th-drift { animation: th-drift 40s linear infinite; }
@keyframes th-blink { 50% { opacity: 0; } }
.th-blink { animation: th-blink 1.1s steps(1) infinite; }
@keyframes th-float { 50% { transform: translateY(-10px); } }
.th-float { animation: th-float 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .th-drift, .th-blink, .th-float { animation: none; } }
`;
export const ThemeStyles: React.FC = () => <style>{THEME_CSS}</style>;

/* ------------------------------------------------------------------ */
/* Backdrops for the theme's dark bands                                */
/* ------------------------------------------------------------------ */

const CODE_LINES = [
  'export default function Page() {', '  const posts = await getPosts()', '  return <Layout>', '    <Hero title="Ship faster" />', '    <Features items={features} />', '  </Layout>', '}',
  'const config = { images: { formats: ["avif", "webp"] } }', 'cms.collection("posts").publish()', 'redirects: [{ source: "/old", destination: "/new" }]',
];

export const StageBackdrop: React.FC<{ theme: Theme }> = ({ theme }) => {
  switch (theme.key) {
    case 'blueprint':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(96,165,250,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(96,165,250,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.22)_1px,transparent_1px)] [background-size:200px_200px]" />
          <div className="absolute inset-x-0 top-0 h-6 border-b border-sky-300/20 [background-image:linear-gradient(90deg,rgba(125,211,252,0.4)_1px,transparent_1px)] [background-size:20px_100%]" />
        </div>
      );
    case 'editorial':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 flex h-3">{['#F3350C', '#703FEC', '#E8B04B', '#2F6B4F', '#f4eee4'].map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}</div>
          <span className="absolute -right-10 bottom-0 text-[22rem] leading-none text-white/[0.03] [font-family:Georgia,serif] italic">Aa</span>
        </div>
      );
    case 'product':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 w-[40rem] h-[40rem] rounded-full bg-[#7C5CFF]/20 blur-[120px]" />
          <div className="absolute -right-40 bottom-0 w-[36rem] h-[36rem] rounded-full bg-[#22D3EE]/12 blur-[120px]" />
          <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      );
    case 'terminal':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="th-drift absolute inset-x-0 top-0 px-8 font-mono text-[11px] leading-7 text-emerald-300/[0.07]">
            {[...CODE_LINES, ...CODE_LINES, ...CODE_LINES, ...CODE_LINES].map((l, i) => <div key={i}>{l}</div>)}
          </div>
          <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_3px)]" />
        </div>
      );
    case 'transform':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,#3a342a_0%,#25221d_32%,#111114_58%)]" />
          <div className="absolute inset-y-0 left-[38%] w-px bg-gradient-to-b from-transparent via-[#F59E0B]/50 to-transparent rotate-[14deg] origin-top" />
        </div>
      );
    case 'feed':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 w-[34rem] h-[34rem] rounded-full bg-[#703FEC]/25 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 w-[30rem] h-[30rem] rounded-full bg-[#b9a1ff]/10 blur-[120px]" />
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:120px_120px]" />
        </div>
      );
  }
};

/** The theme's dark band */
export const Stage: React.FC<{ theme: Theme; children: React.ReactNode; className?: string }> = ({ theme, children, className = '' }) => (
  <section className={`relative mx-2 md:mx-6 overflow-clip rounded-[2rem] md:rounded-[3rem] ${className}`} style={{ background: 'var(--stage)', color: 'var(--stage-ink)' }}>
    <StageBackdrop theme={theme} />
    <div className="relative z-[1]">{children}</div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section label and card details                                       */
/* ------------------------------------------------------------------ */

export const SectionLabel: React.FC<{ theme: Theme; n: number; text: string; onStage?: boolean }> = ({ theme, n, text, onStage }) => (
  <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${mono} text-[10px] uppercase tracking-[0.25em] ${onStage ? 'border-white/15 bg-white/[0.05] text-white/60' : 'border-[color:var(--border)] bg-[var(--card)] text-[color:var(--muted)]'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
    {theme.key === 'terminal' ? <Typewriter text={theme.label(n, text)} /> : theme.label(n, text)}
  </p>
);

const Spark: React.FC = () => (
  <span className="flex items-center gap-2">
    <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="w-1 h-1 rounded-full bg-emerald-300 animate-pulse" />live
    </span>
    <svg viewBox="0 0 80 24" className="w-20 h-6" aria-hidden>
      <polyline className="mi-spark" points="0,20 12,16 24,18 36,10 48,12 60,5 80,3" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="140" strokeDashoffset="0" />
    </svg>
  </span>
);

/** Small theme-specific detail at the top of a card */
export const CardTop: React.FC<{ theme: Theme; i: number; title: string }> = ({ theme, i, title }) => {
  switch (theme.key) {
    case 'blueprint':
      return <span className="flex items-center justify-between font-mono text-[10px] text-[color:var(--accent-2)]"><span>Frame {pad2(i + 1)}</span><span className="text-[color:var(--muted)]">{title.length * 12} × 320</span></span>;
    case 'editorial':
      return <span className="block text-6xl leading-none text-[color:var(--accent)] [font-family:Georgia,serif] italic">{['i', 'ii', 'iii', 'iv', 'v', 'vi'][i]}.</span>;
    case 'product':
      return <span className="flex items-center justify-between"><span className="rounded-full border border-[color:var(--border)] px-2.5 py-1 font-mono text-[10px] text-[color:var(--accent-2)]">module_{pad2(i + 1)}</span><Spark /></span>;
    case 'terminal':
      return <span className="block font-mono text-xs text-[color:var(--accent)]">{'>'} {title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}</span>;
    case 'transform':
      return (
        <span className="flex items-center gap-2 font-mono text-[10px]">
          <span className="relative rounded bg-zinc-200 px-1.5 py-0.5 text-zinc-500">old<span className="absolute left-1 right-1 top-1/2 h-px origin-left scale-x-0 bg-zinc-600 transition-transform duration-500 group-hover:scale-x-100" /></span>
          <span className="text-[color:var(--accent-2)] transition-transform duration-500 group-hover:translate-x-1">→</span>
          <span className="rounded bg-[var(--accent)] px-1.5 py-0.5 text-white transition-shadow duration-500 group-hover:shadow-[0_0_16px_var(--accent)]">new</span>
          <span className="ml-auto text-[color:var(--muted)]">{pad2(i + 1)}</span>
        </span>
      );
    case 'feed':
      return (
        <span className="flex items-center gap-2.5">
          <StoryRing size="w-8 h-8" />
          <span className="text-xs font-semibold">@yourbrand</span>
          <span className="text-[11px] text-[color:var(--muted)]">· Post {pad2(i + 1)}</span>
          <span aria-hidden className="ml-auto text-lg leading-none text-[color:var(--border)] transition-[color,transform] duration-300 group-hover:scale-125 group-hover:text-[color:var(--accent)]">♥</span>
        </span>
      );
  }
};

/** An avatar inside a story ring, for the social feed theme */
export const StoryRing: React.FC<{ size: string; children?: React.ReactNode }> = ({ size, children }) => (
  <span className={`grid shrink-0 place-items-center rounded-full bg-[conic-gradient(from_200deg,#703FEC,#b9a1ff,#703FEC)] p-[2px] ${size}`}>
    <span className="grid h-full w-full place-items-center rounded-full border-2 border-white bg-[#703FEC] text-[10px] font-bold text-white">{children}</span>
  </span>
);

/* ------------------------------------------------------------------ */
/* Process, told the theme's way                                       */
/* ------------------------------------------------------------------ */

type Step = { title: string; text: string };

const FillLine: React.FC<{ children: (fill: MotionValue<string> | string) => React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return <div ref={ref}>{children(reduce ? '100%' : fill)}</div>;
};

export const ProcessView: React.FC<{ theme: Theme; steps: Step[] }> = ({ theme, steps }) => {
  if (theme.key === 'terminal') {
    return (
      <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-black/60">
        <div className="flex items-center gap-1.5 border-b border-[color:var(--border)] px-4 py-3">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
          <span className="ml-3 font-mono text-[11px] text-[color:var(--muted)]">~/project $ natwic build</span>
        </div>
        <ol className="p-5 md:p-7 font-mono text-sm space-y-5">
          {steps.map((s, i) => (
            <motion.li key={s.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, ease }}>
              <div className="flex items-center gap-3">
                <span className="text-[color:var(--muted)]">[{i + 1}/{steps.length}]</span>
                <span className="text-[color:var(--ink)] font-semibold">{s.title}</span>
                <span className="flex-1 overflow-hidden whitespace-nowrap text-[color:var(--muted)] opacity-40">{'.'.repeat(80)}</span>
                <span className="text-[color:var(--accent)]">done ✓</span>
              </div>
              <p className="mt-1.5 pl-12 font-sans text-[15px] text-[color:var(--muted)] leading-relaxed">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    );
  }
  if (theme.key === 'feed') {
    // Stories: segments fill as you scroll, one card per step
    return (
      <FillLine>
        {(fill) => (
          <div className="mt-12">
            <div aria-hidden className="relative h-1 rounded-full bg-[color:var(--border)] overflow-hidden">
              <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent)]" style={{ width: fill }} />
              {steps.slice(1).map((_, i) => <span key={i} className="absolute inset-y-0 w-1 bg-[var(--page)]" style={{ left: `${((i + 1) / steps.length) * 100}%` }} />)}
            </div>
            <ol className="mt-6 grid gap-4 md:grid-cols-4">
              {steps.map((s, i) => (
                <motion.li key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: i * 0.08 }} className="group svc-glow-border rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-6">
                  <span className="flex items-center gap-3">
                    <StoryRing size="w-11 h-11">{i + 1}</StoryRing>
                    <span className="text-xs text-[color:var(--muted)]">Story {i + 1} of {steps.length}</span>
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.03em]">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-[color:var(--muted)] leading-relaxed">{s.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        )}
      </FillLine>
    );
  }
  if (theme.key === 'editorial') {
    return (
      <ol className="mt-12 border-t border-[color:var(--border)]">
        {steps.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease, delay: i * 0.06 }} className="group grid md:grid-cols-[8rem_1fr_1.4fr] items-baseline gap-4 md:gap-10 border-b border-[color:var(--border)] py-8">
            <span className="text-7xl leading-none text-[color:var(--accent)] [font-family:Georgia,serif] italic transition-transform duration-500 group-hover:-translate-y-1">{i + 1}</span>
            <h3 className="text-3xl md:text-4xl [font-family:Georgia,serif] tracking-[-0.02em]">{s.title}</h3>
            <p className="text-base md:text-lg text-[color:var(--muted)] leading-relaxed">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    );
  }
  if (theme.key === 'product') {
    return (
      <FillLine>
        {(fill) => (
          <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
            <span aria-hidden className="absolute hidden md:block left-0 right-0 top-[1.15rem] h-[2px] rounded-full bg-white/10" />
            <motion.span aria-hidden className="absolute hidden md:block left-0 top-[1.15rem] h-[2px] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" style={{ width: fill }} />
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative z-[1] inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[#141833] px-3 py-1.5 text-xs font-semibold">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-[10px] text-white">{i + 1}</span>
                  Step {i + 1}
                </span>
                <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-6 backdrop-blur">
                  <h3 className="text-xl font-bold tracking-[-0.03em]">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-[color:var(--muted)] leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </FillLine>
    );
  }
  if (theme.key === 'transform') {
    return (
      <ol className="mt-12 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: i * 0.08 }} className="relative">
            <div className="svc-glow-border h-full rounded-[1.5rem] border border-[color:var(--border)] p-6" style={{ background: i === steps.length - 1 ? 'var(--ink)' : 'var(--card)', color: i === steps.length - 1 ? '#fff' : 'inherit' }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: i === steps.length - 1 ? 'var(--accent-2)' : 'var(--muted)' }}>{i === 0 ? 'Where you are' : i === steps.length - 1 ? 'Where you land' : `Step ${i + 1}`}</span>
              <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed opacity-70">{s.text}</p>
            </div>
            {i < steps.length - 1 && <span aria-hidden className="absolute -right-3 top-1/2 z-[2] hidden md:grid place-items-center w-6 h-6 -translate-y-1/2 rounded-full bg-[var(--accent-2)] text-[11px] font-bold text-black">→</span>}
          </motion.li>
        ))}
      </ol>
    );
  }
  // Blueprint: artboards joined by a dashed connector that draws itself
  return (
    <FillLine>
      {(fill) => (
        <ol className="relative mt-12 grid gap-6 md:grid-cols-4">
          <span aria-hidden className="absolute hidden md:block left-0 right-0 top-6 border-t-2 border-dashed border-[color:var(--border)]" />
          <motion.span aria-hidden className="absolute hidden md:block left-0 top-6 border-t-2 border-dashed border-[color:var(--accent-2)]" style={{ width: fill }} />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="relative z-[1] mx-auto md:mx-0 grid place-items-center w-12 h-12 rounded-xl border-2 border-[color:var(--accent-2)] bg-white font-mono text-sm font-bold text-[color:var(--accent-2)]">{pad2(i + 1)}</span>
              <div className="mt-5 relative rounded-xl border border-dashed border-[color:var(--accent-2)]/40 bg-white p-6">
                <span className="absolute -top-2.5 left-4 bg-white px-1.5 font-mono text-[9px] text-[color:var(--accent-2)]">step-{i + 1}</span>
                <h3 className="text-xl font-bold tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-2 text-[15px] text-[color:var(--muted)] leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </FillLine>
  );
};

/* ------------------------------------------------------------------ */
/* Hero headline treatments                                             */
/* ------------------------------------------------------------------ */

/** Words that rise into place, styled per theme */
export const ThemeTitle: React.FC<{ theme: Theme; text: string; className?: string }> = ({ theme, text, className = '' }) => {
  const words = text.split(' ');
  const lastStyle = theme.key === 'feed' ? { color: 'var(--accent)' } : theme.key === 'product'
    ? { backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
    : theme.key === 'editorial' ? { fontStyle: 'italic' as const, color: 'var(--accent)' } : undefined;
  const h1 = (
    <h1 className={`${theme.display} leading-[0.95] ${className}`}>
      {/* The prompt is drawn by CSS so it stays out of the heading's text */}
      {theme.key === 'terminal' && <span aria-hidden className="mr-3 font-mono text-[color:var(--accent)] before:content-['>']" />}
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span className="inline-block" style={i >= words.length - 2 ? lastStyle : undefined} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.05 * i }}>{w}&nbsp;</motion.span>
        </span>
      ))}
      {theme.key === 'terminal' && <span aria-hidden className="th-blink inline-block w-[0.45em] h-[0.8em] translate-y-[0.08em] bg-[var(--accent)]" />}
    </h1>
  );
  if (theme.key !== 'blueprint') return h1;
  // A Figma-style selection box around the headline
  return (
    <div className="relative inline-block">
      <motion.span aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="pointer-events-none absolute -inset-3 border border-[color:var(--accent-2)]">
        {['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'].map((p) => <span key={p} className={`absolute ${p} w-2 h-2 border border-[color:var(--accent-2)] bg-white`} />)}
        <span className="absolute -top-7 left-0 rounded bg-[var(--accent-2)] px-1.5 py-0.5 font-mono text-[10px] text-white">H1 · Display</span>
      </motion.span>
      {h1}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero decorations                                                     */
/* ------------------------------------------------------------------ */

export const HeroBackdrop: React.FC<{ theme: Theme }> = ({ theme }) => {
  switch (theme.key) {
    case 'blueprint':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(#000,transparent_95%)]" />
          <div className="absolute left-0 right-0 top-0 h-5 border-b border-[color:var(--border)] bg-white/70 [background-image:linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] [background-size:16px_40%] bg-no-repeat bg-bottom" />
          <div className="absolute left-0 top-0 bottom-0 w-5 border-r border-[color:var(--border)] bg-white/70 [background-image:linear-gradient(#cbd5e1_1px,transparent_1px)] [background-size:40%_16px] bg-no-repeat bg-right" />
        </div>
      );
    case 'editorial':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -left-6 bottom-[-4rem] text-[16rem] leading-none text-black/[0.04] [font-family:Georgia,serif] italic">Aa</span>
        </div>
      );
    case 'product':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 w-[40rem] h-[40rem] rounded-full bg-[#7C5CFF]/25 blur-[120px]" />
          <div className="absolute right-0 top-20 w-[30rem] h-[30rem] rounded-full bg-[#22D3EE]/15 blur-[120px]" />
          <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
        </div>
      );
    case 'terminal':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="th-drift absolute inset-x-0 top-0 px-6 font-mono text-[11px] leading-7 text-emerald-300/[0.06]">
            {[...CODE_LINES, ...CODE_LINES, ...CODE_LINES, ...CODE_LINES, ...CODE_LINES].map((l, i) => <div key={i}>{l}</div>)}
          </div>
          <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_30%_0%,rgba(52,211,153,0.18),transparent_60%)]" />
        </div>
      );
    case 'transform':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[45%] bg-[linear-gradient(90deg,#e6dfcf,transparent)] opacity-70" />
          <div className="absolute inset-0 [background-image:linear-gradient(var(--line)_1px,transparent_1px)] [background-size:100%_44px]" />
        </div>
      );
    case 'feed':
      return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 w-[30rem] h-[30rem] rounded-full bg-[#703FEC]/10 blur-[110px]" />
          <div className="absolute left-1/4 bottom-[-10rem] w-[30rem] h-[30rem] rounded-full bg-[#b9a1ff]/15 blur-[110px]" />
          <div className="absolute inset-0 [background-image:radial-gradient(var(--line)_1.5px,transparent_1.5px)] [background-size:28px_28px] [mask-image:linear-gradient(#000,transparent_90%)]" />
        </div>
      );
  }
};

/** Floating UI widgets around the SaaS demo */
export const ProductWidgets: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] hidden lg:block">
    <div className="th-float absolute -left-10 top-10 rounded-2xl border border-white/10 bg-[#141833]/90 backdrop-blur px-4 py-3 shadow-2xl">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Sign ups</p>
      <svg viewBox="0 0 90 28" className="mt-1 w-24 h-7"><polyline points="0,24 15,20 30,22 45,12 60,14 75,6 90,4" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" /></svg>
    </div>
    <div className="th-float absolute -right-6 -top-6 flex items-center gap-2 rounded-full border border-white/10 bg-[#141833]/90 backdrop-blur px-3 py-2 shadow-2xl [animation-delay:-2s]">
      <span className="relative inline-flex w-9 h-5 rounded-full bg-[#7C5CFF]"><span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" /></span>
      <span className="text-[11px] text-white/70">Yearly</span>
    </div>
    <div className="th-float absolute -right-8 bottom-16 rounded-2xl border border-white/10 bg-[#141833]/90 backdrop-blur px-4 py-3 shadow-2xl [animation-delay:-4s]">
      <p className="text-[11px] text-white/80">New trial started</p>
      <div className="mt-2 h-1.5 w-28 rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]" /></div>
    </div>
  </div>
);

/** The old headline, crossed out, above the redesign hero */
export const StruckHeadline: React.FC = () => (
  <p className="relative inline-block text-lg md:text-2xl text-[#8a7d5a] [font-family:'Times_New_Roman',serif]">
    Welcome to our website!!!
    <motion.span aria-hidden className="absolute left-0 top-1/2 h-[3px] bg-[var(--accent-2)]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.6, duration: 0.7, ease }} />
  </p>
);
