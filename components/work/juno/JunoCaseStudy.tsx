import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Magnetic } from '../../Magnetic';
import { Link } from '../../nav';
import { scrollToY } from '../../smoothScroll';
import { useTilt, Spotlight } from '../../interactions';
import { QuickBrief } from '../../QuickBrief';
import { sendBrief } from '../../Pricing';
import { BASE_URL, caseUrl } from '../../../seo';
import { projectBySlug, creativeWorkSchema } from '../projects';
import { MoreWork, NextProject } from '../WorkPages';
import {
  HERO, HERO_SIDES, TASKS, HEADLINES, SHIFT, CHALLENGE, GOALS, APPROACH, STORY_INTRO, BEATS, CAPABILITY_STILLS, PAGES, DETAILS,
  DESIGN_SYSTEM, RESULTS, CLOSING, Media, srcSet, sizeOf,
} from './juno';

const ease = [0.16, 1, 0.3, 1] as const;
const project = projectBySlug('juno')!;
const pad2 = (n: number) => String(n).padStart(2, '0');
const sendFromJuno = sendBrief('Juno case study');

/** Desktop-only layouts (sticky story, scroll-driven gallery) switch on after hydration */
const useIsDesktop = () => {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const Label: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light'; className?: string }> = ({ children, tone = 'dark', className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] ${tone === 'light' ? 'text-white/50' : 'text-zinc-500'} ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.8)]" />
    {children}
  </p>
);

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** Eyebrow, short headline ending in a period, optional supporting line */
const SectionHead: React.FC<{ eyebrow: string; title: string; tone?: 'dark' | 'light'; children?: React.ReactNode }> = ({ eyebrow, title, tone = 'dark', children }) => (
  <FadeUp>
    <Label tone={tone}>{eyebrow}</Label>
    <h2 className={`mt-5 text-[13vw] md:text-7xl lg:text-8xl font-bold tracking-[-0.055em] leading-[0.95] max-w-5xl ${tone === 'light' ? 'text-white' : 'text-black'}`}>{title}</h2>
    {children && <div className={`mt-6 max-w-2xl text-lg md:text-xl leading-relaxed ${tone === 'light' ? 'text-white/60' : 'text-zinc-600'}`}>{children}</div>}
  </FadeUp>
);

/** A box naming the asset still to come, at the right aspect ratio */
const Placeholder: React.FC<{ file: string; ratio?: string; tone?: 'dark' | 'light' }> = ({ file, ratio = 'aspect-[16/10]', tone = 'light' }) => (
  <div role="img" aria-label={`Placeholder for ${file}`} className={`${ratio} w-full rounded-[1.25rem] grid place-items-center border border-dashed ${tone === 'light' ? 'border-white/15 bg-white/[0.04] text-white/45' : 'border-zinc-300 bg-zinc-100 text-zinc-500'}`}>
    <span className="px-4 text-center font-mono text-xs leading-relaxed">Asset to come<br />{file}</span>
  </div>
);

/** Muted looping clip that only plays while on screen, and never for reduced motion */
const InViewVideo: React.FC<{ src: string; poster: string | null; label: string }> = ({ src, poster, label }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return <video ref={ref} src={src} poster={poster ?? undefined} muted loop playsInline preload="none" aria-label={label} className="block w-full h-auto" />;
};

const Still: React.FC<{ src: string; alt: string; eager?: boolean; sizes?: string; className?: string }> = ({ src, alt, eager = false, sizes = '(min-width: 1024px) 60vw, 100vw', className = '' }) => (
  <img
    src={src}
    srcSet={srcSet(src)}
    sizes={srcSet(src) ? sizes : undefined}
    alt={alt}
    width={sizeOf(src)[0]}
    height={sizeOf(src)[1]}
    loading={eager ? 'eager' : 'lazy'}
    {...(eager ? { fetchpriority: 'high' } : {})}
    decoding="async"
    className={`block w-full h-auto ${className}`}
  />
);

/** A still or clip framed as a browser window. Missing assets render as labeled placeholders. */
const Frame: React.FC<{ media: Media; eager?: boolean; sizes?: string; className?: string }> = ({ media, eager = false, sizes, className = '' }) => (
  <figure className={`overflow-hidden rounded-xl md:rounded-2xl bg-[#07090d] border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.5)] ${className}`}>
    <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
      <span className="ml-3 rounded-full bg-white/[0.06] px-3 py-1 text-[9px] md:text-[11px] text-white/45">{project.domain}</span>
    </div>
    <div className="relative">
      {media.video ? <InViewVideo src={media.video} poster={media.image} label={media.alt} />
        : media.image ? <Still src={media.image} alt={media.alt} eager={eager} sizes={sizes} />
        : <Placeholder file={media.file} />}
    </div>
  </figure>
);

const DarkBand: React.FC<{ children: React.ReactNode; className?: string; id?: string; glow?: boolean }> = ({ children, className = '', id, glow = true }) => (
  <section id={id} className={`relative mx-2 md:mx-6 rounded-[2rem] md:rounded-[3rem] bg-[#0A0A0A] text-white overflow-clip ${className}`}>
    {glow && <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(circle_at_50%_0%,rgba(112,63,236,0.35),transparent_60%)]" />}
    <div className="relative">{children}</div>
  </section>
);

const Counter: React.FC<{ n: number; total: number; tone?: 'dark' | 'light' }> = ({ n, total, tone = 'dark' }) => (
  <span className={`font-mono text-xs ${tone === 'light' ? 'text-white/45' : 'text-zinc-400'}`}>
    <span className="text-[#703FEC]">{pad2(n)}</span> / {pad2(total)}
  </span>
);

/** Card that tilts toward the cursor with a soft light under it */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; light?: string }> = ({ children, className = '', light }) => {
  const t = useTilt(5);
  return (
    <motion.div
      {...t.handlers}
      style={{ rotateX: t.rotateX, rotateY: t.rotateY, transformPerspective: 1200 }}
      className={`relative overflow-hidden will-change-transform ${className}`}
    >
      <Spotlight x={t.px} y={t.py} color={light} />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero stage: the homepage rises into place, flanked by its details    */
/* ------------------------------------------------------------------ */

// Around the edges of the stage, so they never cover the screenshot itself
const CHIP_SPOTS = [
  'left-[7%] top-6', 'right-[9%] top-9', 'left-[2%] top-[46%]', 'right-[2%] top-[58%]', 'left-[20%] bottom-7', 'right-[16%] bottom-5',
];

const HeroStage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5], [18, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.9, 1]);
  const leftY = useTransform(scrollYProgress, [0, 1], ['18%', '-28%']);
  const rightY = useTransform(scrollYProgress, [0, 1], ['34%', '-18%']);
  const t = useTilt(2);

  return (
    <DarkBand className="mt-14 md:mt-20">
      <div ref={ref} {...t.handlers} className="relative px-3 md:px-14 pt-10 md:pt-24 pb-10 md:pb-28" style={{ perspective: 1600 }}>
        <Spotlight x={t.px} y={t.py} size={700} />
        {/* Side details, drifting at their own pace */}
        <motion.div style={reduce ? undefined : { y: leftY }} className="hidden xl:block absolute left-[1.5%] top-[22%] w-[19%] z-[2] -rotate-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"><Still src={HERO_SIDES.left.image} alt={HERO_SIDES.left.alt} /></div>
        </motion.div>
        <motion.div style={reduce ? undefined : { y: rightY }} className="hidden xl:block absolute right-[1.5%] top-[40%] w-[19%] z-[2] rotate-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"><Still src={HERO_SIDES.right.image} alt={HERO_SIDES.right.alt} /></div>
        </motion.div>

        {/* The homepage, tilting up into place */}
        <motion.div style={reduce ? undefined : { rotateX, scale, transformOrigin: '50% 100%' }} className="relative z-[1] max-w-5xl mx-auto">
          <Frame media={HERO.media} eager sizes="(min-width: 1024px) 64rem, 100vw" />
        </motion.div>

        {/* Juno's own tasks, floating around the stage */}
        <ul aria-hidden className="hidden lg:block pointer-events-none absolute inset-0 z-[3]">
          {TASKS.map((task, i) => (
            <motion.li
              key={task}
              className={`absolute ${CHIP_SPOTS[i]} flex items-center gap-2 rounded-full border border-white/10 bg-[#0e1218]/85 backdrop-blur px-4 py-2 text-xs md:text-sm text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.4)]`}
              initial={{ opacity: 0, y: 12 }}
              animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
              transition={reduce ? { duration: 0.6, delay: 0.6 + i * 0.1 } : { opacity: { duration: 0.6, delay: 0.6 + i * 0.1 }, y: { duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-[#3dd68c]' : i % 3 === 1 ? 'bg-[#ffb547]' : 'bg-[#8f7cff]'}`} />
              {task}
            </motion.li>
          ))}
        </ul>
      </div>
    </DarkBand>
  );
};

/* ------------------------------------------------------------------ */
/* Marquee of Juno's real headlines                                    */
/* ------------------------------------------------------------------ */

const MARQUEE_CSS = `
@keyframes juno-marquee { to { transform: translateX(-50%); } }
.juno-marquee { animation: juno-marquee var(--d, 60s) linear infinite; }
.juno-marquee.rev { animation-direction: reverse; }
@media (prefers-reduced-motion: reduce) { .juno-marquee { animation: none; } }
`;

const HeadlineMarquee: React.FC = () => {
  const rows = [HEADLINES.slice(0, 6), HEADLINES.slice(6)];
  return (
    <section aria-label="Headlines from the new Juno site" className="mt-20 md:mt-28 overflow-hidden select-none">
      <style>{MARQUEE_CSS}</style>
      {rows.map((row, r) => (
        <div key={r} className="flex whitespace-nowrap py-2 md:py-3">
          <div className={`juno-marquee ${r ? 'rev' : ''} flex shrink-0`} style={{ ['--d' as string]: `${70 + r * 12}s` }}>
            {[...row, ...row].map((h, i) => (
              <span key={i} aria-hidden={i >= row.length} className={`flex items-center gap-6 md:gap-10 pr-6 md:pr-10 text-5xl md:text-8xl font-bold tracking-[-0.05em] ${(i + r) % 2 ? 'text-zinc-300' : 'text-black'}`}>
                {h}
                <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#703FEC] shadow-[0_0_20px_rgba(112,63,236,0.7)]" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* The shift: drag between the old homepage and ours                    */
/* ------------------------------------------------------------------ */

const BeforeAfter: React.FC = () => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const moveTo = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative select-none overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.5)] cursor-ew-resize touch-pan-y"
      onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); moveTo(e.clientX); }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => { dragging.current = false; }}
    >
      <Still src={SHIFT.after.image} alt={SHIFT.after.alt} sizes="(min-width: 1024px) 72rem, 100vw" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Still src={SHIFT.before.image} alt={SHIFT.before.alt} sizes="(min-width: 1024px) 72rem, 100vw" />
      </div>
      <span className="pointer-events-none absolute left-3 top-3 md:left-5 md:top-5 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 md:right-5 md:top-5 rounded-full bg-[#703FEC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-black grid place-items-center text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.4)]">↔</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare the old and new Juno homepage"
        className="absolute inset-x-0 bottom-0 h-10 w-full opacity-0 cursor-ew-resize focus-visible:opacity-100"
      />
    </div>
  );
};

const Shift: React.FC = () => (
  <DarkBand className="mt-20 md:mt-28 py-20 md:py-28">
    <div className="px-5 md:px-12 max-w-7xl mx-auto">
      <SectionHead eyebrow="The shift" title="Same promise. A whole new story." tone="light">
        <p>{SHIFT.intro}</p>
      </SectionHead>
      <FadeUp className="mt-12 md:mt-16"><BeforeAfter /></FadeUp>
      <p className="mt-4 text-sm text-white/45">Drag to compare the old runjuno.ai homepage with ours.</p>
      <ol className="mt-12 md:mt-16 grid md:grid-cols-3 gap-4">
        {SHIFT.changes.map((c, i) => (
          <li key={c.title}>
            <FadeUp delay={i * 0.08} className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 md:p-8">
              <span className="font-mono text-xs text-[#b9a1ff]">{pad2(i + 1)}</span>
              <h3 className="mt-6 text-2xl md:text-3xl font-bold tracking-[-0.03em]">{c.title}</h3>
              <p className="mt-3 text-base text-white/60 leading-relaxed">{c.text}</p>
            </FadeUp>
          </li>
        ))}
      </ol>
    </div>
  </DarkBand>
);

/* ------------------------------------------------------------------ */
/* The homepage story                                                  */
/* ------------------------------------------------------------------ */

/** Desktop: the text stays put while the screens change as you scroll */
const StorySticky: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(BEATS.length - 1, Math.max(0, Math.floor(v * BEATS.length)))));
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((i + 0.5) / BEATS.length) * (el.offsetHeight - window.innerHeight));
  };
  const beat = BEATS[active];

  return (
    <div ref={ref} className="relative" style={{ height: `${BEATS.length * 80}vh` }}>
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-12 grid grid-cols-[1fr_1.75fr] gap-14 items-center">
          <div>
            <Counter n={active + 1} total={BEATS.length} tone="light" />
            <div className="mt-4 h-[2px] w-40 bg-white/10 rounded-full overflow-hidden"><motion.div style={{ width: bar }} className="h-full bg-[#703FEC]" /></div>
            <ol className="mt-8 space-y-1">
              {BEATS.map((b, i) => (
                <li key={b.title}>
                  <button onClick={() => jump(i)} className={`text-left text-2xl xl:text-3xl font-bold tracking-[-0.035em] leading-tight transition-colors duration-500 ${i === active ? 'text-white' : 'text-white/20 hover:text-white/50'}`}>
                    {b.title}
                  </button>
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="mt-8 max-w-md">
                <p className="text-sm text-white/40"><span className="mr-2 font-bold uppercase tracking-[0.2em] text-[10px] text-white/50">Before</span>{beat.before}</p>
                <p className="mt-3 text-lg text-white/75 leading-relaxed"><span className="mr-2 font-bold uppercase tracking-[0.2em] text-[10px] text-[#b9a1ff]">Now</span>{beat.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(112,63,236,0.35),transparent)]" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={active} initial={reduce ? false : { opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, scale: 1.02, y: -30 }} transition={{ duration: 0.6, ease }} className="relative">
                <Frame media={beat.media} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Phones, tablets and the pre-rendered HTML: one beat after another */
const StoryList: React.FC = () => (
  <ol className="space-y-20 md:space-y-28">
    {BEATS.map((b, i) => (
      <li key={b.title} className="px-5 md:px-12 max-w-7xl mx-auto">
        <FadeUp>
          <Counter n={i + 1} total={BEATS.length} tone="light" />
          <h3 className="mt-4 text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.05]">{b.title}</h3>
          <p className="mt-4 text-sm text-white/40 max-w-xl"><span className="mr-2 font-bold uppercase tracking-[0.2em] text-[10px] text-white/50">Before</span>{b.before}</p>
          <p className="mt-2 text-lg text-white/75 leading-relaxed max-w-xl"><span className="mr-2 font-bold uppercase tracking-[0.2em] text-[10px] text-[#b9a1ff]">Now</span>{b.text}</p>
        </FadeUp>
        <FadeUp delay={0.1} className="mt-8"><Frame media={b.media} /></FadeUp>
      </li>
    ))}
  </ol>
);

/* ------------------------------------------------------------------ */
/* Nine pages: a gallery that slides sideways as you scroll             */
/* ------------------------------------------------------------------ */

const PageCard: React.FC<{ pg: typeof PAGES[number] }> = ({ pg }) => (
  <>
    <TiltCard className="rounded-[1.5rem] bg-[#0A0A0A] p-2.5">
      <Still src={pg.image} alt={`The Juno ${pg.name} page: ${pg.headline}`} sizes="(min-width: 1024px) 40vw, 82vw" className="rounded-[1rem]" />
    </TiltCard>
    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{pg.name}</p>
    <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-[-0.03em]">“{pg.headline}”</h3>
    <p className="mt-2 text-base text-zinc-600 leading-relaxed max-w-md">{pg.line}</p>
  </>
);

const GalleryTrack: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.08, 0.95], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0.08, 0.95], ['0%', '100%']);
  useEffect(() => {
    const measure = () => { const t = trackRef.current; if (t) setDistance(Math.max(0, t.scrollWidth - window.innerWidth + 96)); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return (
    <section ref={ref} className="relative mt-28 md:mt-40 h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-12 max-w-7xl w-full mx-auto mb-12 flex items-end justify-between gap-6">
          <div>
            <Label>The full site</Label>
            <h2 className="mt-5 text-6xl xl:text-8xl font-bold tracking-[-0.055em] leading-[0.95]">Nine pages. One system.</h2>
          </div>
          <div className="w-48 h-[2px] bg-zinc-200 rounded-full overflow-hidden"><motion.div style={{ width: bar }} className="h-full bg-[#703FEC]" /></div>
        </div>
        <motion.ul ref={trackRef} style={{ x }} className="flex gap-8 pl-12 pr-12 will-change-transform">
          {PAGES.map((pg) => <li key={pg.name} className="shrink-0 w-[40vw] max-w-[620px]"><PageCard pg={pg} /></li>)}
        </motion.ul>
      </div>
    </section>
  );
};

const GalleryScroller: React.FC = () => (
  <section className="mt-28 md:mt-40">
    <div className="px-5 md:px-12 max-w-7xl mx-auto"><SectionHead eyebrow="The full site" title="Nine pages. One system." /></div>
    <ul className="mt-12 md:mt-16 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-12 px-5 md:px-12 pb-4 [scrollbar-width:none]">
      {PAGES.map((pg) => <li key={pg.name} className="snap-start shrink-0 w-[82vw] sm:w-[60vw] md:w-[46vw]"><PageCard pg={pg} /></li>)}
    </ul>
  </section>
);

/* ------------------------------------------------------------------ */
/* Design system demos                                                 */
/* ------------------------------------------------------------------ */

const Swatch: React.FC<{ name: string; value: string }> = ({ name, value }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } catch { /* clipboard blocked */ }
  };
  return (
    <li>
      <button onClick={copy} aria-label={`Copy ${name} ${value}`} className="group block w-full text-left">
        <span className="relative block aspect-square rounded-xl border border-white/10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04]" style={{ background: value }}>
          <span className={`absolute inset-x-1.5 bottom-1.5 rounded-md bg-black/70 py-1 text-center font-mono text-[9px] text-white transition-opacity ${copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{copied ? 'Copied' : 'Copy'}</span>
        </span>
        <span className="mt-2 block text-xs font-semibold">{name}</span>
        <span className="block font-mono text-[10px] text-white/45 uppercase">{value}</span>
      </button>
    </li>
  );
};

const MotionRow: React.FC<{ name: string; curve: string; use: string; play: number }> = ({ name, curve, use, play }) => {
  const [on, setOn] = useState(false);
  useEffect(() => { if (play) setOn((o) => !o); }, [play]);
  return (
    <li onMouseEnter={() => setOn((o) => !o)} className="border-t border-white/10 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold">{name} <span className="ml-2 text-sm font-normal text-white/60">{use}</span></span>
        <span className="hidden sm:inline font-mono text-[10px] text-white/40">{curve}</span>
      </div>
      <div className="mt-3 relative h-3 rounded-full bg-white/[0.06]">
        <span className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#703FEC] shadow-[0_0_14px_rgba(112,63,236,0.8)]" style={{ left: on ? 'calc(100% - 1.25rem)' : '0%', transition: `left 1.1s ${curve}` }} />
      </div>
    </li>
  );
};

/* ------------------------------------------------------------------ */
/* The page                                                             */
/* ------------------------------------------------------------------ */

export const JunoCaseStudy: React.FC = () => {
  const desktop = useIsDesktop();
  const [play, setPlay] = useState(0);
  const url = caseUrl('juno');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      { '@type': 'ListItem', position: 3, name: 'Juno', item: url },
    ],
  };
  const crumb = 'text-zinc-500 hover:text-black transition-colors';
  const toStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('start');
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 80);
  };

  return (
    <article className="bg-white min-h-screen pt-28 md:pt-36 overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, creativeWorkSchema(project, BASE_URL)]) }} />

      {/* 1. Hero */}
      <header className="px-5 md:px-12 max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <li><Link href="/" className={crumb}>Home</Link></li>
            <li aria-hidden className="text-zinc-300">/</li>
            <li><Link href="/work" className={crumb}>Work</Link></li>
            <li aria-hidden className="text-zinc-300">/</li>
            <li aria-current="page" className="text-black">Juno</li>
          </ol>
        </nav>
        <Label className="mt-10 md:mt-14">{HERO.eyebrow}</Label>
        <h1 className="mt-6 text-[10.5vw] md:text-[6vw] font-bold leading-[0.95] tracking-[-0.055em] text-black max-w-6xl">
          {HERO.title.split(' ').map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className={`inline-block ${w === 'Juno:' ? 'text-[#703FEC]' : ''}`} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.05 * i }}>
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.5 }} className="mt-8 md:mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-end">
          <p className="text-xl md:text-3xl font-medium tracking-[-0.03em] leading-[1.25] text-zinc-800">{HERO.subtitle}</p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Magnetic strength={0.3}>
              <a href={project.url} target="_blank" rel="noopener" className="group inline-flex items-center gap-3 rounded-full bg-[#703FEC] text-white pl-6 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-black transition-colors">
                View live site
                <span className="w-10 h-10 rounded-full bg-white text-black grid place-items-center transition-transform duration-500 group-hover:-rotate-45">↗</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a href="#start" onClick={toStart} className="group inline-flex items-center gap-3 rounded-full border border-zinc-200 text-black pl-6 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:border-black transition-colors">
                Start a project
                <span className="w-10 h-10 rounded-full bg-black text-white grid place-items-center transition-transform duration-500 group-hover:rotate-90">↓</span>
              </a>
            </Magnetic>
          </div>
        </motion.div>
        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 border-t border-zinc-200 pt-6">
          {HERO.meta.map((m) => (
            <div key={m.k}>
              <dt className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{m.k}</dt>
              <dd className={`mt-2 text-sm md:text-base font-semibold ${m.v.startsWith('[TODO') ? 'font-mono text-zinc-400' : 'text-black'}`}>{m.v}</dd>
            </div>
          ))}
        </motion.dl>
      </header>

      <HeroStage />
      <HeadlineMarquee />

      {/* 2. The challenge */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-20 md:mt-32">
        <SectionHead eyebrow="The challenge" title="Powerful product. Unclear story.">
          <p>{CHALLENGE.text}</p>
        </SectionHead>
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-4 md:gap-6">
          {CHALLENGE.before.map((m, i) => (
            <FadeUp key={m.file} delay={i * 0.08}>
              <figure className={i ? 'md:rotate-1' : 'md:-rotate-1'}>
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl border border-zinc-200 bg-zinc-100 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                  {m.image ? <Still src={m.image} alt={m.alt} sizes="(min-width: 768px) 45vw, 100vw" className="grayscale-[35%]" /> : <Placeholder file={m.file} tone="dark" />}
                  <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Before</span>
                </div>
                <figcaption className="mt-3 text-sm text-zinc-500">{i ? 'The old features page' : 'The old homepage'}, runjuno.ai</figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </section>

      <Shift />

      {/* 3. What we set out to do */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="The goals" title="Clear. Trusted. Premium." />
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOALS.map((g, i) => (
            <FadeUp key={g} delay={i * 0.08}>
              <TiltCard className={`rounded-[2rem] p-8 md:p-10 min-h-[260px] ${['bg-zinc-100 text-black', 'bg-[#0A0A0A] text-white', 'bg-[#703FEC] text-white'][i]}`} light={i === 2 ? 'rgba(255,255,255,0.25)' : undefined}>
                <span className="font-mono text-xs opacity-60">{pad2(i + 1)}</span>
                <h3 className="mt-20 text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight">{g}</h3>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 4. Our approach */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
        <SectionHead eyebrow="Our approach" title="Rules first. Pages second.">
          <p>{APPROACH.text}</p>
        </SectionHead>
        <FadeUp delay={0.1}>
          <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">Key decisions</h3>
          <ol className="mt-4">
            {APPROACH.decisions.map((d, i) => (
              <li key={d} className="group flex items-baseline gap-5 border-t border-zinc-200 last:border-b py-5">
                <span className="font-mono text-xs text-[#703FEC]">{pad2(i + 1)}</span>
                <span className="text-lg md:text-2xl font-semibold tracking-[-0.02em] leading-snug transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">{d}</span>
              </li>
            ))}
          </ol>
        </FadeUp>
      </section>

      {/* 5. The homepage story */}
      <DarkBand className="mt-28 md:mt-40 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionHead eyebrow="The homepage" title="A story, not a feature list." tone="light">
            <p>{STORY_INTRO}</p>
          </SectionHead>
        </div>
        <div className="mt-12 md:mt-20">{desktop ? <StorySticky /> : <StoryList />}</div>
        <div className="px-5 md:px-12 max-w-7xl mx-auto mt-16 md:mt-20">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Capabilities, up close</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CAPABILITY_STILLS.map((c) => (
              <FadeUp key={c.caption}>
                <TiltCard className="rounded-xl border border-white/[0.08] bg-[#07090d]">
                  <Still src={c.image} alt={c.alt} sizes="(min-width: 640px) 33vw, 100vw" />
                  <p className="px-4 py-3 text-sm text-white/60">{c.caption}</p>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </DarkBand>

      {/* 6. Nine pages, one system */}
      {desktop ? <GalleryTrack /> : <GalleryScroller />}

      {/* 7. The details */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="The details" title="Small things. Big trust." />
        <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-4 md:gap-6">
          {DETAILS.map((d, i) => (
            <FadeUp key={d.title} delay={(i % 2) * 0.08} className={[0, 3].includes(i) ? 'lg:col-span-7' : 'lg:col-span-5'}>
              <TiltCard className="h-full rounded-[2rem] bg-[#0A0A0A] text-white p-3 md:p-4">
                <div className="overflow-hidden rounded-[1.4rem] bg-[#07090d]">
                  {d.media.image ? <Still src={d.media.image} alt={d.media.alt} sizes="(min-width: 1024px) 50vw, 100vw" /> : <Placeholder file={d.media.file} />}
                </div>
                <div className="px-3 md:px-4 pt-6 pb-3">
                  <Counter n={i + 1} total={DETAILS.length} tone="light" />
                  <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-[-0.03em]">{d.title}</h3>
                  <p className="mt-2 text-base text-white/60 leading-relaxed max-w-lg">{d.text}</p>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 8. Design system */}
      <DarkBand className="mt-28 md:mt-40 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionHead eyebrow="Design system" title="Built to scale." tone="light">
            <p>Color tokens, type scale, spacing and motion principles, plus core components: {DESIGN_SYSTEM.components.join(', ').toLowerCase()}. Try it: copy a color, type over a line, or play the motion curves.</p>
          </SectionHead>

          <div className="mt-14 md:mt-20 grid lg:grid-cols-2 gap-12 lg:gap-16 [&>*]:min-w-0">
            <FadeUp>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Color</h3>
              <ul className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {DESIGN_SYSTEM.colors.map((c) => <Swatch key={c.name} name={c.name} value={c.value} />)}
              </ul>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Type · {DESIGN_SYSTEM.font}</h3>
              <ul className="mt-5">
                {DESIGN_SYSTEM.type.map((t, i) => (
                  <li key={t.name} className="flex items-baseline justify-between gap-4 border-t border-white/10 py-3">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      aria-label={`${t.name} sample, editable`}
                      className="min-w-0 truncate outline-none focus:text-[#b9a1ff] font-semibold tracking-[-0.03em] cursor-text"
                      style={{ fontSize: ['2.4rem', '2rem', '1.6rem', '1.25rem', '1.05rem', '0.8rem'][i], letterSpacing: i === 5 ? '0.08em' : undefined }}
                    >
                      {t.sample}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-white/45">{t.name} · {t.size}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Radius</h3>
              <ul className="mt-5 flex flex-wrap gap-5">
                {DESIGN_SYSTEM.radii.map((r) => (
                  <li key={r} className="group text-center">
                    <span className="block w-20 h-20 border border-white/25 bg-white/[0.04] transition-colors duration-300 group-hover:bg-[#703FEC]/40 group-hover:border-[#703FEC]" style={{ borderRadius: r }} />
                    <span className="mt-2 block font-mono text-[10px] text-white/45">{r}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.08}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Motion</h3>
                <button onClick={() => setPlay((p) => p + 1)} className="rounded-full border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 hover:text-white hover:border-[#703FEC] transition-colors">Play all</button>
              </div>
              <ul className="mt-3">
                {DESIGN_SYSTEM.motion.map((m) => <MotionRow key={m.name} {...m} play={play} />)}
              </ul>
            </FadeUp>
          </div>
          <div className="mt-14 md:mt-20">
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Core components</h3>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DESIGN_SYSTEM.shots.map((c) => (
                <li key={c.name}>
                  <TiltCard className="rounded-xl border border-white/[0.08] bg-[#07090d]">
                    <Still src={c.image} alt={c.alt} sizes="(min-width: 640px) 33vw, 100vw" />
                    <p className="px-4 py-3 text-sm text-white/60">{c.name}</p>
                  </TiltCard>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DarkBand>

      {/* 9. Results */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="Results" title="The client loved it.">
          <p>{RESULTS.line}</p>
        </SectionHead>
        <FadeUp className="mt-10 grid md:grid-cols-[1.4fr_1fr] gap-4">
          <figure className="rounded-[2rem] bg-zinc-100 p-8 md:p-12 flex flex-col justify-between gap-10">
            <blockquote>
              <span aria-hidden className="block text-7xl leading-none font-bold text-[#703FEC]">“</span>
              <p className="mt-2 text-2xl md:text-4xl font-medium tracking-[-0.03em] leading-[1.25] text-zinc-900">{RESULTS.quote}</p>
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <span aria-hidden className="w-12 h-12 rounded-full bg-[#0A0A0A] grid place-items-center text-white font-bold">Z</span>
              <span>
                <span className="block font-semibold text-black">{RESULTS.author}</span>
                <span className="block text-sm text-zinc-500">{RESULTS.role}</span>
              </span>
            </figcaption>
          </figure>
          <div className="rounded-[2rem] bg-[#703FEC] text-white p-8 md:p-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">Impact</span>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
              {RESULTS.stats.map((st) => (
                <div key={st.label}>
                  <dt className="sr-only">{st.label}</dt>
                  <dd>
                    <span className="block text-5xl md:text-6xl font-bold tracking-[-0.05em] leading-none">{st.value}<span className="ml-1.5 text-lg md:text-xl font-semibold tracking-normal text-white/70">{st.unit}</span></span>
                    <span className="mt-2 block text-sm text-white/75 leading-snug" aria-hidden>{st.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeUp>
      </section>

      {/* 10. Closing CTA, with the site's New message brief */}
      <DarkBand id="start" className="mt-28 md:mt-40 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
          <div>
            <Label tone="light">Your turn</Label>
            <h2 className="mt-5 text-5xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.98]">{CLOSING.headline}</h2>
            <p className="mt-6 max-w-xl text-lg md:text-xl text-white/60 leading-relaxed">{CLOSING.line}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.3}>
                <Link href="/contact" className="group inline-flex items-center gap-4 rounded-full bg-white text-black pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] hover:text-white transition-colors">
                  Start a project
                  <span className="w-11 h-11 rounded-full bg-[#703FEC] text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
                </Link>
              </Magnetic>
              <a href="mailto:hello@natwic.com" className="text-base md:text-lg font-semibold text-[#b9a1ff] hover:text-white transition-colors">hello@natwic.com</a>
            </div>
          </div>
          <QuickBrief send={sendFromJuno} tone="dark" initial={{ message: 'We saw the Juno case study. Our product is hard to explain too.' }} />
        </div>
      </DarkBand>

      {/* 11. More work and the next project */}
      <MoreWork slug="juno" />
      <NextProject slug="juno" />
      <div className="h-16 md:h-24" />
    </article>
  );
};
