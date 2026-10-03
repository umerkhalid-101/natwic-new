import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import type { UniverseScene } from './universe/scene';
import { PROJECTS as WORKS, Project as Work, pad } from './work/projects';
import { Magnetic } from './Magnetic';

type View = 'home' | 'contact' | 'studio' | 'work';

const ease = [0.16, 1, 0.3, 1] as const;

/* Chapter windows on the section's 0–1 scroll progress */
const CH = {
  intro: [0, 0.075],
  manifesto: [0.08, 0.22],
  audiences: [0.24, 0.44],
  process: [0.43, 0.66],
  work: [0.67, 0.905],
  close: [0.905, 1],
} as const;

/* Section is 1090vh; chapters were timed against a 950vh scroll, so they keep their pace */
const STRETCH = 990 / 950;

const isSmall = () => typeof window !== 'undefined' && window.innerWidth < 768;

/** Fade in over the first `edge` of a window and out over the last. */
const useWindow = (p: MotionValue<number>, [a, b]: readonly [number, number], edge = 0.02) => {
  const opacity = useTransform(p, [a, a + edge, b - edge, b], [0, 1, 1, 0]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? 'auto' : 'none'));
  const visibility = useTransform(opacity, (o) => (o > 0.001 ? 'visible' : 'hidden'));
  return { opacity, pointerEvents, visibility };
};

/* Site-consistent building blocks ----------------------------------- */

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-white/60 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_8px_rgba(112,63,236,0.6)]" />
    {children}
  </p>
);

/** A line of type that rises out of a mask as its chapter begins. */
const MaskLine: React.FC<{ p: MotionValue<number>; at: number; children: React.ReactNode; className?: string }> = ({ p, at, children, className = '' }) => {
  const y = useTransform(p, [at, at + 0.025], ['105%', '0%']);
  return (
    <span className={`block overflow-hidden pb-[0.14em] -mb-[0.06em] ${className}`}>
      <motion.span style={{ y }} className="block">{children}</motion.span>
    </span>
  );
};

const Rings: React.FC<{ tone?: 'dark' | 'light' }> = ({ tone = 'dark' }) => (
  <div aria-hidden className="pointer-events-none absolute -top-24 -right-24">
    {[360, 240, 140].map((s) => (
      <div
        key={s}
        className={`absolute rounded-full border ${tone === 'dark' ? 'border-white/[0.05]' : 'border-black/[0.06]'}`}
        style={{ width: s, height: s, top: -s / 2 + 180, left: -s / 2 + 180 }}
      />
    ))}
  </div>
);

const PillButton: React.FC<{ tone?: 'dark' | 'light'; onClick: () => void; children: React.ReactNode }> = ({ tone = 'dark', onClick, children }) => (
  <button
    onClick={onClick}
    className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.03] ${
      tone === 'dark' ? 'bg-white text-black hover:bg-[#703FEC] hover:text-white' : 'bg-black text-white hover:bg-[#703FEC]'
    }`}
  >
    {children}
    <span className="w-1.5 h-1.5 rounded-full bg-[#F3350C] animate-pulse" />
  </button>
);

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

// Words wrapped in * are highlighted.
const MANIFESTO =
  "We’re a hands-on digital studio for *startups,* *SaaS* *teams* and *local* *businesses.* We design brands, websites and products that look sharp, load fast and actually move the numbers.";

const Word: React.FC<{ word: string; p: MotionValue<number>; range: [number, number] }> = ({ word, p, range }) => {
  const opacity = useTransform(p, range, [0.14, 1]);
  const accent = word.startsWith('*');
  return (
    <motion.span style={{ opacity }} className={accent ? 'text-[#b9a1ff]' : undefined}>
      {word.replace(/\*/g, '')}
    </motion.span>
  );
};

const Intro: React.FC<{ p: MotionValue<number> }> = ({ p }) => {
  const [small] = useState(isSmall);
  const end = CH.intro[1];

  // A window onto the universe opens until it fills the screen.
  // The white page around it is a box-shadow, so the corners stay round.
  const width = useTransform(p, [0, end], small ? ['70vw', '100vw'] : ['22vw', '100vw']);
  const height = useTransform(p, [0, end], small ? ['34vh', '100vh'] : ['44vh', '100vh']);
  const radius = useTransform(p, [0, end * 0.85, end], ['2.5rem', '1.5rem', '0rem']);
  const shade = useTransform(p, [end * 0.9, end], [1, 0]);
  const boxShadow = useTransform(shade, (o) => `0 0 0 200vmax rgba(255,255,255,${o})`);
  const visibility = useTransform(p, (v) => (v < end ? 'visible' : 'hidden'));

  // The two words part to make room, then fade
  const spread = useTransform(p, [0, end * 0.75], [0, 1]);
  const leftX = useTransform(spread, (t) => (small ? '0vw' : `${-t * 40}vw`));
  const rightX = useTransform(spread, (t) => (small ? '0vw' : `${t * 40}vw`));
  const upY = useTransform(spread, (t) => (small ? `${-t * 30}vh` : '0vh'));
  const downY = useTransform(spread, (t) => (small ? `${t * 30}vh` : '0vh'));
  const wordsOpacity = useTransform(p, [end * 0.35, end * 0.75], [1, 0]);
  const hintOpacity = useTransform(p, [0, end * 0.2], [1, 0]);

  return (
    <motion.div style={{ visibility }} className="absolute inset-0 z-20 pointer-events-none">
      <motion.div
        style={{ width, height, borderRadius: radius, boxShadow }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div
        style={{ opacity: wordsOpacity }}
        className="absolute inset-0 flex flex-col md:flex-row items-center justify-between py-[22vh] md:py-0 px-5 md:px-10"
      >
        <motion.span style={{ x: leftX, y: upY }} className="text-[18vw] md:text-[10.5vw] font-bold tracking-[-0.05em] leading-[1.05] text-black">
          Inside
        </motion.span>
        <motion.span style={{ x: rightX, y: downY }} className="text-[18vw] md:text-[10.5vw] font-bold tracking-[-0.05em] leading-[1.05] text-black">
          Natwic<span className="text-[#703FEC]">.</span>
        </motion.span>
      </motion.div>

      <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
        Scroll
        <motion.span animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-px h-10 bg-zinc-400 origin-top" />
      </motion.div>
    </motion.div>
  );
};

const Manifesto: React.FC<{ p: MotionValue<number> }> = ({ p }) => {
  const w = useWindow(p, CH.manifesto, 0.02);
  const words = MANIFESTO.split(' ');
  const [a, b] = [CH.manifesto[0] + 0.015, CH.manifesto[1] - 0.04];
  return (
    <motion.div style={w} className="absolute inset-0 flex items-center px-6 md:px-12">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">
        <Label>About us</Label>
        <p className="text-[clamp(1.9rem,5vw,4.4rem)] leading-[1.1] font-bold tracking-[-0.035em] text-white">
          {words.map((word, i) => (
            <React.Fragment key={i}>
              <Word word={word} p={p} range={[a + ((b - a) * i) / words.length, a + ((b - a) * (i + 1)) / words.length]} />
              {i < words.length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
        </p>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Who we build for — two site cards, framed by two star clusters      */
/* ------------------------------------------------------------------ */

const AUDIENCES = [
  {
    kicker: 'For startups & SaaS',
    title: 'Startups & SaaS',
    text: 'You’re building something new. We make it look ready: for users, for investors, for launch day.',
    gets: ['Launch-ready marketing site', 'Product & dashboard UI', 'Brand identity and pitch deck'],
    tone: 'dark' as const,
  },
  {
    kicker: 'For local businesses',
    title: 'Local businesses',
    text: 'People look you up every day. We make sure they pick you, online and on the street.',
    gets: ['A site that brings in bookings', 'Signage, menus and print', 'Social templates that stay on-brand'],
    tone: 'light' as const,
  },
];

const AudienceCard: React.FC<{ a: typeof AUDIENCES[number]; index: number; onEnter: () => void; onStart: () => void }> = ({ a, index, onEnter, onStart }) => {
  const dark = a.tone === 'dark';
  return (
    <motion.article
      onMouseEnter={onEnter}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease }}
      className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-11 flex flex-col gap-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] ${
        dark ? 'bg-[#0F0F0F] text-white border border-white/[0.07]' : 'bg-[#E5E4E0] text-black border border-black/[0.04]'
      }`}
    >
      <Rings tone={a.tone} />
      <div className="relative flex items-center justify-between gap-4">
        <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${dark ? 'text-white/50' : 'text-black/45'}`}>{a.kicker}</span>
        <span className={`font-mono text-xs rounded-full border px-3 py-1 ${dark ? 'border-white/15 text-white/60' : 'border-black/15 text-black/55'}`}>{pad(index + 1)}</span>
      </div>

      <div className="relative flex flex-col gap-4">
        <h3 className="text-[clamp(1.9rem,3vw,2.75rem)] font-bold tracking-[-0.035em] leading-[1.05]">{a.title}</h3>
        <p className={`text-[15px] md:text-base leading-relaxed max-w-md ${dark ? 'text-white/60' : 'text-black/60'}`}>{a.text}</p>
      </div>

      <ul className="relative flex flex-wrap gap-2">
        {a.gets.map((g) => (
          <li key={g} className={`rounded-full px-4 py-2 text-[12px] font-semibold ${dark ? 'bg-white/[0.06] border border-white/10 text-white/85' : 'bg-black/[0.05] border border-black/[0.06] text-black/80'}`}>
            {g}
          </li>
        ))}
      </ul>

      <div className="relative">
        <PillButton tone={a.tone} onClick={onStart}>Start a project</PillButton>
      </div>
    </motion.article>
  );
};

const Audiences: React.FC<{ p: MotionValue<number>; onFocus: (s: -1 | 0 | 1) => void; onStart: () => void }> = ({ p, onFocus, onStart }) => {
  // Enter normally; exit by rushing past the camera into the walk-through
  const opacity = useTransform(p, [0.24, 0.26, 0.415, 0.44], [0, 1, 1, 0]);
  const scale = useTransform(p, [0.24, 0.415, 0.44], [0.96, 1.02, 1.35]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? 'auto' : 'none'));
  const visibility = useTransform(opacity, (o) => (o > 0.001 ? 'visible' : 'hidden'));
  const w = { opacity, scale, pointerEvents, visibility };
  const [tab, setTab] = useState<0 | 1>(0);
  // Cards rise in, then keep drifting so the scroll never feels parked
  const cardsY = useTransform(p, [0.24, 0.275, 0.42], [90, 20, -40]);
  const leftY = useTransform(p, [0.26, 0.42], [0, -18]);
  const rightY = useTransform(p, [0.26, 0.42], [18, -30]);
  const start = CH.audiences[0] + 0.005;

  return (
    <motion.div style={w} className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 pt-20 pb-8">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-5 items-center text-center">
          <Label>Who we build for</Label>
          <h2 className="text-[clamp(2.4rem,6vw,5.25rem)] font-bold tracking-[-0.04em] leading-[1.05] text-white">
            <MaskLine p={p} at={start}>
              Two kinds of <span className="font-serif italic font-normal tracking-[-0.02em] text-[#b9a1ff]">ambitious.</span>
            </MaskLine>
          </h2>
        </div>

        {/* Phones: one card at a time */}
        <div className="md:hidden flex self-center gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
          {AUDIENCES.map((a, i) => (
            <button
              key={a.kicker}
              onClick={() => { setTab(i as 0 | 1); onFocus(i === 0 ? -1 : 1); }}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-colors ${tab === i ? 'bg-white text-black' : 'text-white/70'}`}
            >
              {a.title}
            </button>
          ))}
        </div>

        <motion.div style={{ y: cardsY }} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" onMouseLeave={() => onFocus(0)}>
          {AUDIENCES.map((a, i) => (
            <motion.div key={a.kicker} style={{ y: i === 0 ? leftY : rightY }} className={tab === i ? 'block' : 'hidden md:block'}>
              <AudienceCard a={a} index={i} onEnter={() => onFocus(i === 0 ? -1 : 1)} onStart={onStart} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* How we work — a 3D walk-through past four stations                  */
/* ------------------------------------------------------------------ */

const STEPS = [
  { t: 'Discover', d: 'A call and a short brief: your goals, your audience and what success looks like for this project.', out: 'Project brief' },
  { t: 'Design', d: 'We set a direction first, then design the full thing, reviewed with you at every milestone.', out: 'Design files' },
  { t: 'Build', d: 'We build what we design: responsive, fast and easy for your team to update.', out: 'Live site or final assets' },
  { t: 'Grow', d: 'After launch we keep improving: new pages, campaigns and content as you grow.', out: 'Ongoing support' },
];

const DEPTH = 1500; // px between stations

const Station: React.FC<{ cam: MotionValue<number>; index: number; small: boolean }> = ({ cam, index, small }) => {
  const s = STEPS[index];
  const side = index % 2 === 0 ? -1 : 1;
  const x = small ? side * 3 : side * 21; // vw
  const y = small ? 0 : (index % 2 === 0 ? -3 : 3); // vh
  const z = useTransform(cam, (c) => c - (index + 1) * DEPTH);
  const transform = useTransform(z, (zz) => `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), ${zz}px)`);
  // Faint in the distance, solid as it reaches you, gone once it passes
  const opacity = useTransform(z, [-DEPTH * 2.4, -DEPTH * 1.5, -DEPTH * 0.85, -80, 220, 480], [0, 0.18, 1, 1, 0.08, 0]);
  const visibility = useTransform(opacity, (o) => (o > 0.01 ? 'visible' : 'hidden'));
  // Siblings don't depth-sort in CSS 3D, so nearer stations sit on top
  const zIndex = useTransform(z, (zz) => Math.round(zz + 10000));

  return (
    <motion.article
      style={{ transform, opacity, visibility, zIndex }}
      className="absolute left-1/2 top-1/2 w-[min(520px,86vw)] rounded-[2.5rem] md:rounded-[3rem] bg-[#0F0F0F] border border-white/[0.07] p-8 md:p-11 flex flex-col gap-7 overflow-hidden shadow-[0_40px_140px_rgba(0,0,0,0.7)] will-change-transform"
    >
      <Rings />
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          Step {pad(index + 1)}
          <span className="w-1.5 h-1.5 rounded-full bg-[#F3350C] animate-pulse" />
        </span>
        <span className="font-mono text-xs text-white/40">{pad(index + 1)} / {pad(STEPS.length)}</span>
      </div>
      <div className="relative flex flex-col gap-4">
        <h3 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-[-0.04em] leading-[1.05] text-white">{s.t}</h3>
        <p className="text-[15px] md:text-base leading-relaxed text-white/60">{s.d}</p>
      </div>
      <div className="relative flex items-center gap-3 border-t border-white/[0.08] pt-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">You get</span>
        <span className="rounded-full bg-white/[0.06] border border-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/85">{s.out}</span>
      </div>
    </motion.article>
  );
};

const Process: React.FC<{ p: MotionValue<number> }> = ({ p }) => {
  const w = useWindow(p, CH.process, 0.015);
  const [small] = useState(isSmall);
  const total = STEPS.length * DEPTH + 700;
  const cam = useTransform(p, [CH.process[0] + 0.005, CH.process[1] - 0.01], [-3200, total], { clamp: true });
  const [step, setStep] = useState(0);
  useMotionValueEvent(cam, 'change', (c) => setStep(Math.max(0, Math.min(STEPS.length - 1, Math.round(c / DEPTH) - 1))));
  // The title emerges from the depth as the audience cards rush past, then clears before the first station
  // The title holds for a good stretch of scroll, then clears before the first station
  const intro = useTransform(cam, [-3200, -2850, -1250, -800], [0, 1, 1, 0]);
  const introScale = useTransform(cam, [-3200, -2850, -800], [0.88, 1, 1.06]);
  const hud = useTransform(cam, [-800, -400], [0, 1]);

  return (
    <motion.div style={w} className="absolute inset-0">
      {/* World */}
      <div className="absolute inset-0" style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}>
        {STEPS.map((_, i) => (
          <Station key={i} cam={cam} index={i} small={small} />
        ))}
      </div>

      {/* Chapter title, before the first station arrives */}
      <motion.div style={{ opacity: intro, scale: introScale }} className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center px-6 pointer-events-none">
        <h2 className="text-[clamp(2.4rem,6vw,5.25rem)] font-bold tracking-[-0.04em] leading-[1.05] text-white">
          How we <span className="font-serif italic font-normal tracking-[-0.02em] text-[#b9a1ff]">work.</span>
        </h2>
      </motion.div>

      {/* Step rail */}
      <motion.div style={{ opacity: hud }} className="absolute left-5 right-5 md:left-12 md:right-12 bottom-6 md:bottom-10 flex items-end justify-between gap-6 pointer-events-none">
        <div className="flex gap-1.5 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mx-auto">
          {STEPS.map((s, i) => (
            <span
              key={s.t}
              className={`inline-flex items-center gap-2 rounded-full pl-1.5 pr-3 md:pr-4 py-1.5 text-[11px] md:text-[12px] font-semibold transition-colors duration-500 ${step === i ? 'bg-white text-black' : 'text-white/50'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] ${step === i ? 'bg-[#703FEC] text-white' : 'bg-white/10'}`}>{i + 1}</span>
              <span className={step === i ? 'inline' : 'hidden sm:inline'}>{s.t}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Selected work — site cards drifting through space                   */
/* ------------------------------------------------------------------ */

// Alternating sides, so cards that share the screen never overlap
const LAYOUT = [
  { x: '-21vw', mx: '-3vw', rotate: -2.5 },
  { x: '21vw', mx: '3vw', rotate: 2 },
  { x: '-20vw', mx: '-2vw', rotate: -1.5 },
  { x: '22vw', mx: '2vw', rotate: 2.5 },
  { x: '-21vw', mx: '-3vw', rotate: -2 },
];
// Five cards share the work chapter: each rises through in WORK_TRAVEL, WORK_GAP apart
const WORK_START = 0.73;
const WORK_GAP = 0.0225;
const WORK_TRAVEL = 0.075;

const FloatingProject: React.FC<{ p: MotionValue<number>; work: Work; index: number }> = ({ p, work, index }) => {
  const start = WORK_START + index * WORK_GAP;
  const end = start + WORK_TRAVEL;
  const y = useTransform(p, [start, end], ['95vh', '-95vh']);
  const l = LAYOUT[index % LAYOUT.length];
  const [small] = useState(isSmall);

  return (
    <motion.div
      style={{ y, x: small ? l.mx : l.x, rotate: l.rotate }}
      className="absolute left-1/2 top-1/2 -ml-[41vw] md:-ml-[15vw] -mt-[30vw] md:-mt-[13vw] w-[82vw] md:w-[30vw] md:min-w-[380px] will-change-transform"
    >
      <a
        href={work.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${work.title} (opens in a new tab)`}
        className="group block w-full text-left rounded-[2.5rem] bg-[#0F0F0F] border border-white/[0.07] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-zinc-900">
          <img src={work.image} alt={`${work.title} website`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">{work.category}</span>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 pt-5 pb-3">
          <div>
            <p className="text-2xl font-bold tracking-[-0.03em] text-white">{work.title}</p>
            <p className="text-xs text-white/45 mt-1">{work.domain} ↗</p>
          </div>
          <span className="w-12 h-12 shrink-0 rounded-full bg-white text-black flex items-center justify-center transition-[background-color,color,transform] duration-300 group-hover:bg-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
        </div>
      </a>
    </motion.div>
  );
};

const WorkChapter: React.FC<{ p: MotionValue<number>; onAll: () => void }> = ({ p, onAll }) => {
  const w = useWindow(p, CH.work, 0.015);
  const titleOpacity = useTransform(p, [0.67, 0.68, 0.72, 0.74], [0, 1, 1, 0]);
  const titleScale = useTransform(p, [0.67, 0.68, 0.74], [0.94, 1, 1.04]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setActive(Math.max(0, Math.min(WORKS.length - 1, Math.floor((v - WORK_START - WORK_TRAVEL / 3) / WORK_GAP)))));

  return (
    <motion.div style={w} className="absolute inset-0">
      <motion.div style={{ opacity: titleOpacity, scale: titleScale }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-6 pointer-events-none">
        <Label>Selected archive</Label>
        <h2 className="text-[clamp(3rem,10vw,9rem)] font-bold tracking-[-0.045em] leading-[1] text-white">
          Bolder <span className="font-serif italic font-normal tracking-[-0.02em] text-[#b9a1ff]">thinking.</span>
        </h2>
      </motion.div>

      {WORKS.map((work, i) => (
        <FloatingProject key={work.id} p={p} work={work} index={i} />
      ))}

      <div className="absolute left-5 right-5 md:left-12 md:right-12 bottom-6 md:bottom-10 flex items-center justify-between gap-4">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-white/55">
          <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
          <span className="hidden sm:inline">Selected archive</span>
          <span className="font-mono tracking-normal text-white">{pad(active + 1)}</span>
          <span className="font-mono tracking-normal">/ {pad(WORKS.length)}</span>
        </p>
        <PillButton onClick={onAll}>See all projects</PillButton>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Close out — the stars settle, then fall into the Services sheet     */
/* ------------------------------------------------------------------ */

// Runs past 1: the section's last 40vh of scroll is held for the call to action
const Close: React.FC<{ p: MotionValue<number>; onStart: () => void }> = ({ p, onStart }) => {
  // Both clear before the Services sheet climbs past the lower third
  const textOpacity = useTransform(p, [0.905, 0.915, 0.99, 1.005], [0, 1, 1, 0]);
  const textScale = useTransform(p, [0.905, 0.915, 1.005], [0.92, 1, 1.04]);
  const ctaOpacity = useTransform(p, [0.925, 0.94, 0.99, 1.005], [0, 1, 1, 0]);
  const ctaScale = useTransform(p, [0.925, 0.95], [0.55, 1]);
  const ctaEvents = useTransform(ctaOpacity, (o) => (o > 0.6 ? 'auto' : 'none'));

  return (
    <>
      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="absolute inset-x-0 bottom-[calc(50%+5.5rem)] md:bottom-[calc(50%+7rem)] flex justify-center text-center px-6 pointer-events-none"
      >
        <p className="max-w-6xl text-[clamp(2.75rem,min(8vw,13vh),7.5rem)] font-bold tracking-[-0.045em] leading-[1.02] text-white">
          Your project could be <span className="font-serif italic font-normal tracking-[-0.02em] text-[#b9a1ff]">next.</span>
        </p>
      </motion.div>

      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.div style={{ opacity: ctaOpacity, scale: ctaScale, pointerEvents: ctaEvents }}>
          <Magnetic strength={0.3}>
            <button
              onClick={onStart}
              aria-label="Start a project"
              className="group relative grid place-items-center w-[8.5rem] h-[8.5rem] md:w-44 md:h-44 rounded-full text-white"
            >
              <span className="absolute inset-0 rounded-full border border-white/15 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:border-[#703FEC] group-hover:bg-[#703FEC] group-hover:scale-110 group-hover:shadow-[0_0_80px_rgba(112,63,236,0.55)]" />
              <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 w-full h-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none">
                <defs>
                  <path id="cta-ring" d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" />
                </defs>
                <text className="fill-current text-[6.4px] font-bold uppercase" textLength="244" lengthAdjust="spacing">
                  <textPath href="#cta-ring">Start a project · Start a project · </textPath>
                </text>
              </svg>
              <span className="relative grid place-items-center w-9 h-9">
                <span className="absolute w-1.5 h-1.5 rounded-full bg-[#F3350C] shadow-[0_0_12px_#F3350C] transition-all duration-300 group-hover:scale-0 group-hover:opacity-0" />
                <svg viewBox="0 0 24 24" aria-hidden className="w-6 h-6 opacity-0 -translate-x-1 translate-y-1 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                  <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */

export const Universe: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<UniverseScene | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // The journey runs on the first 950vh of the 990vh scroll; past 1 is the CTA hold
  const p = useTransform(scrollYProgress, (v) => v * STRETCH);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let cancelled = false;
    let cleanup = () => {};

    // three.js loads as its own chunk so it never delays first paint
    import('./universe/scene').then(({ UniverseScene }) => {
      if (cancelled) return;
      let scene: UniverseScene;
      try {
        const small = isSmall();
        scene = new UniverseScene(canvas, small ? 4000 : 9000, small);
      } catch {
        return; // WebGL unavailable: the copy still works on the dark background
      }
      sceneRef.current = scene;
      scene.setProgress(p.get());

      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? scene.start() : scene.stop()), { rootMargin: '200px' });
      io.observe(section);
      const ro = new ResizeObserver(() => scene.resize());
      ro.observe(canvas);
      const onMove = (e: PointerEvent) => scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      window.addEventListener('pointermove', onMove);

      cleanup = () => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
        scene.dispose();
        sceneRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [p]);

  useMotionValueEvent(p, 'change', (v) => {
    const scene = sceneRef.current;
    if (scene) {
      scene.setProgress(v);
      // Track the Services sheet so the stars can fall into its edge
      const next = sectionRef.current?.nextElementSibling;
      if (v > 0.95 && next) scene.setEdge(next.getBoundingClientRect().top / window.innerHeight);
      else scene.setEdge(2);
    }
    // The nav returns as the Services sheet starts to rise
    const immersive = v > 0.05 && v < 0.975;
    const root = document.documentElement;
    if (immersive && !root.dataset.immersive) root.dataset.immersive = '1';
    else if (!immersive && root.dataset.immersive) delete root.dataset.immersive;
  });
  useEffect(() => () => { delete document.documentElement.dataset.immersive; }, []);

  const focus = useCallback((s: -1 | 0 | 1) => sceneRef.current?.setFocus(s), []);

  return (
    <section ref={sectionRef} id="work" className="relative h-[1090vh] bg-[#050505]" style={{ marginBottom: '-70vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden text-white">
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full" />

        <Intro p={p} />
        <Manifesto p={p} />
        <Audiences p={p} onFocus={focus} onStart={() => setView('contact')} />
        <Process p={p} />
        <WorkChapter p={p} onAll={() => setView('work')} />
        <Close p={p} onStart={() => setView('contact')} />
      </div>

    </section>
  );
};
