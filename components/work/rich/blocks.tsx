/** Building blocks shared by the rich case studies (Juno and the sites we built from scratch). */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Magnetic } from '../../Magnetic';
import { Link } from '../../nav';
import { scrollToY } from '../../smoothScroll';
import { useTilt, Spotlight } from '../../interactions';
import { QuickBrief, Brief } from '../../QuickBrief';

export const ease = [0.16, 1, 0.3, 1] as const;
export const pad2 = (n: number) => String(n).padStart(2, '0');

export type Media = {
  /** Still image (also the video poster). null shows a labeled placeholder. */
  image: string | null;
  /** Optional looping clip; the still stays as the poster */
  video?: string | null;
  /** File name to supply, shown on placeholders */
  file?: string;
  alt: string;
};

/* Image helpers: stills named *-hero, *-beat-*, *-page-*, *-before-* also exist at 2x as name@2x.webp */
const SIZES: Record<string, [number, number]> = { '/work/juno/juno-detail-live-ui.webp': [1968, 1176] };
export const sizeOf = (src: string): [number, number] => SIZES[src] ?? [1600, 1000];
const has2x = (src: string) => /^\/work\//.test(src) && /-(hero|beat-|page-|before-)/.test(src) && !/-detail-/.test(src);
export const srcSet = (src: string) => (has2x(src) ? `${src} 1600w, ${src.replace('.webp', '@2x.webp')} 3200w` : undefined);

/** Desktop-only layouts (sticky story, scroll-driven gallery) switch on after hydration */
export const useIsDesktop = () => {
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

export const Label: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light'; className?: string }> = ({ children, tone = 'dark', className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] ${tone === 'light' ? 'text-white/50' : 'text-zinc-500'} ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.8)]" />
    {children}
  </p>
);

export const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
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
export const SectionHead: React.FC<{ eyebrow: string; title: string; tone?: 'dark' | 'light'; children?: React.ReactNode }> = ({ eyebrow, title, tone = 'dark', children }) => (
  <FadeUp>
    <Label tone={tone}>{eyebrow}</Label>
    <h2 className={`mt-5 text-[13vw] md:text-7xl lg:text-8xl font-bold tracking-[-0.055em] leading-[0.95] max-w-5xl ${tone === 'light' ? 'text-white' : 'text-black'}`}>{title}</h2>
    {children && <div className={`mt-6 max-w-2xl text-lg md:text-xl leading-relaxed ${tone === 'light' ? 'text-white/60' : 'text-zinc-600'}`}>{children}</div>}
  </FadeUp>
);

/** A box naming the asset still to come, at the right aspect ratio */
export const Placeholder: React.FC<{ file: string; ratio?: string; tone?: 'dark' | 'light' }> = ({ file, ratio = 'aspect-[16/10]', tone = 'light' }) => (
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

export const Still: React.FC<{ src: string; alt: string; eager?: boolean; sizes?: string; className?: string }> = ({ src, alt, eager = false, sizes = '(min-width: 1024px) 60vw, 100vw', className = '' }) => (
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
export const Frame: React.FC<{ media: Media; domain: string; eager?: boolean; sizes?: string; className?: string }> = ({ media, domain, eager = false, sizes, className = '' }) => (
  <figure className={`overflow-hidden rounded-xl md:rounded-2xl bg-[#07090d] border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.5)] ${className}`}>
    <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
      <span className="ml-3 rounded-full bg-white/[0.06] px-3 py-1 text-[9px] md:text-[11px] text-white/45">{domain}</span>
    </div>
    <div className="relative">
      {media.video ? <InViewVideo src={media.video} poster={media.image} label={media.alt} />
        : media.image ? <Still src={media.image} alt={media.alt} eager={eager} sizes={sizes} />
        : <Placeholder file={media.file ?? 'image'} />}
    </div>
  </figure>
);

export const DarkBand: React.FC<{ children: React.ReactNode; className?: string; id?: string; glow?: boolean }> = ({ children, className = '', id, glow = true }) => (
  <section id={id} className={`relative mx-2 md:mx-6 rounded-[2rem] md:rounded-[3rem] bg-[#0A0A0A] text-white overflow-clip ${className}`}>
    {glow && <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(circle_at_50%_0%,rgba(112,63,236,0.35),transparent_60%)]" />}
    <div className="relative">{children}</div>
  </section>
);

export const Counter: React.FC<{ n: number; total: number; tone?: 'dark' | 'light' }> = ({ n, total, tone = 'dark' }) => (
  <span className={`font-mono text-xs ${tone === 'light' ? 'text-white/45' : 'text-zinc-400'}`}>
    <span className="text-[#703FEC]">{pad2(n)}</span> / {pad2(total)}
  </span>
);

/** Card that tilts toward the cursor with a soft light under it */
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string; light?: string }> = ({ children, className = '', light }) => {
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
/* Header: breadcrumb, eyebrow, headline, subtitle, buttons, facts      */
/* ------------------------------------------------------------------ */

export const CaseHeader: React.FC<{
  name: string; eyebrow: string; title: string; accent: string; subtitle: string; liveUrl: string; meta: { k: string; v: string }[];
}> = ({ name, eyebrow, title, accent, subtitle, liveUrl, meta }) => {
  const crumb = 'text-zinc-500 hover:text-black transition-colors';
  const toStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('start');
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 80);
  };
  return (
    <header className="px-5 md:px-12 max-w-7xl mx-auto">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <li><Link href="/" className={crumb}>Home</Link></li>
          <li aria-hidden className="text-zinc-300">/</li>
          <li><Link href="/work" className={crumb}>Work</Link></li>
          <li aria-hidden className="text-zinc-300">/</li>
          <li aria-current="page" className="text-black">{name}</li>
        </ol>
      </nav>
      <Label className="mt-10 md:mt-14">{eyebrow}</Label>
      <h1 className="mt-6 text-[10.5vw] md:text-[6vw] font-bold leading-[0.95] tracking-[-0.055em] text-black max-w-6xl">
        {title.split(' ').map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span className={`inline-block ${w === accent ? 'text-[#703FEC]' : ''}`} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.05 * i }}>
              {w}&nbsp;
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.5 }} className="mt-8 md:mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-end">
        <p className="text-xl md:text-3xl font-medium tracking-[-0.03em] leading-[1.25] text-zinc-800">{subtitle}</p>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Magnetic strength={0.3}>
            <a href={liveUrl} target="_blank" rel="noopener" className="group inline-flex items-center gap-3 rounded-full bg-[#703FEC] text-white pl-6 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-black transition-colors">
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
      <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} className={`mt-12 md:mt-16 grid grid-cols-2 ${meta.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-x-6 gap-y-6 border-t border-zinc-200 pt-6`}>
        {meta.map((m) => (
          <div key={m.k}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{m.k}</dt>
            <dd className="mt-2 text-sm md:text-base font-semibold text-black">{m.v}</dd>
          </div>
        ))}
      </motion.dl>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Hero stage: the homepage rises into place, flanked by its details    */
/* ------------------------------------------------------------------ */

// Around the edges of the stage, so they never cover the screenshot itself
const CHIP_SPOTS = ['left-[7%] top-6', 'right-[9%] top-9', 'left-[2%] top-[46%]', 'right-[2%] top-[58%]', 'left-[20%] bottom-7', 'right-[16%] bottom-5'];
const CHIP_DOTS = ['bg-[#3dd68c]', 'bg-[#ffb547]', 'bg-[#8f7cff]'];

export const HeroStage: React.FC<{
  media: Media; domain: string; sides: { image: string; alt: string }[]; chips: string[];
}> = ({ media, domain, sides, chips }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5], [18, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.9, 1]);
  const leftY = useTransform(scrollYProgress, [0, 1], ['18%', '-28%']);
  const rightY = useTransform(scrollYProgress, [0, 1], ['34%', '-18%']);
  const t = useTilt(2);
  const [left, right] = sides;

  return (
    <DarkBand className="mt-14 md:mt-20">
      <div ref={ref} {...t.handlers} className="relative px-3 md:px-14 pt-10 md:pt-24 pb-10 md:pb-28" style={{ perspective: 1600 }}>
        <Spotlight x={t.px} y={t.py} size={700} />
        {left && (
          <motion.div style={reduce ? undefined : { y: leftY }} className="hidden xl:block absolute left-[1.5%] top-[22%] w-[19%] z-[2] -rotate-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"><Still src={left.image} alt={left.alt} /></div>
          </motion.div>
        )}
        {right && (
          <motion.div style={reduce ? undefined : { y: rightY }} className="hidden xl:block absolute right-[1.5%] top-[40%] w-[19%] z-[2] rotate-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"><Still src={right.image} alt={right.alt} /></div>
          </motion.div>
        )}
        <motion.div style={reduce ? undefined : { rotateX, scale, transformOrigin: '50% 100%' }} className="relative z-[1] max-w-5xl mx-auto">
          <Frame media={media} domain={domain} eager sizes="(min-width: 1024px) 64rem, 100vw" />
        </motion.div>
        <ul aria-hidden className="hidden lg:block pointer-events-none absolute inset-0 z-[3]">
          {chips.slice(0, CHIP_SPOTS.length).map((chip, i) => (
            <motion.li
              key={chip}
              className={`absolute ${CHIP_SPOTS[i]} flex items-center gap-2 rounded-full border border-white/10 bg-[#0e1218]/85 backdrop-blur px-4 py-2 text-xs md:text-sm text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.4)]`}
              initial={{ opacity: 0, y: 12 }}
              animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
              transition={reduce ? { duration: 0.6, delay: 0.6 + i * 0.1 } : { opacity: { duration: 0.6, delay: 0.6 + i * 0.1 }, y: { duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${CHIP_DOTS[i % 3]}`} />
              {chip}
            </motion.li>
          ))}
        </ul>
      </div>
    </DarkBand>
  );
};

/* ------------------------------------------------------------------ */
/* Marquee of the site's real headlines                                */
/* ------------------------------------------------------------------ */

const MARQUEE_CSS = `
@keyframes case-marquee { to { transform: translateX(-50%); } }
.case-marquee { animation: case-marquee var(--d, 60s) linear infinite; }
.case-marquee.rev { animation-direction: reverse; }
@media (prefers-reduced-motion: reduce) { .case-marquee { animation: none; } }
`;

export const HeadlineMarquee: React.FC<{ headlines: string[]; label: string }> = ({ headlines, label }) => {
  const half = Math.ceil(headlines.length / 2);
  const rows = [headlines.slice(0, half), headlines.slice(half)];
  return (
    <section aria-label={label} className="mt-20 md:mt-28 overflow-hidden select-none">
      <style>{MARQUEE_CSS}</style>
      {rows.map((row, r) => (
        <div key={r} className="flex whitespace-nowrap py-2 md:py-3">
          <div className={`case-marquee ${r ? 'rev' : ''} flex shrink-0`} style={{ ['--d' as string]: `${70 + r * 12}s` }}>
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
/* The homepage story: sticky on desktop, a list everywhere else        */
/* ------------------------------------------------------------------ */

export type Beat = { title: string; text: string; before?: string; media: Media };

const BeatText: React.FC<{ beat: Beat }> = ({ beat }) => (
  beat.before ? (
    <>
      <p className="text-sm text-white/40"><span className="mr-2 font-bold uppercase tracking-[0.2em] text-[10px] text-white/50">Before</span>{beat.before}</p>
      <p className="mt-3 text-lg text-white/75 leading-relaxed"><span className="mr-2 font-bold uppercase tracking-[0.2em] text-[10px] text-[#b9a1ff]">Now</span>{beat.text}</p>
    </>
  ) : (
    <p className="text-lg text-white/70 leading-relaxed">{beat.text}</p>
  )
);

const StorySticky: React.FC<{ beats: Beat[]; domain: string }> = ({ beats, domain }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(beats.length - 1, Math.max(0, Math.floor(v * beats.length)))));
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((i + 0.5) / beats.length) * (el.offsetHeight - window.innerHeight));
  };
  const beat = beats[active];

  return (
    <div ref={ref} className="relative" style={{ height: `${beats.length * 80}vh` }}>
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-12 grid grid-cols-[1fr_1.75fr] gap-14 items-center">
          <div>
            <Counter n={active + 1} total={beats.length} tone="light" />
            <div className="mt-4 h-[2px] w-40 bg-white/10 rounded-full overflow-hidden"><motion.div style={{ width: bar }} className="h-full bg-[#703FEC]" /></div>
            <ol className="mt-8 space-y-1">
              {beats.map((b, i) => (
                <li key={b.title}>
                  <button onClick={() => jump(i)} className={`text-left text-2xl xl:text-3xl font-bold tracking-[-0.035em] leading-tight transition-colors duration-500 ${i === active ? 'text-white' : 'text-white/20 hover:text-white/50'}`}>
                    {b.title}
                  </button>
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="mt-8 max-w-md">
                <BeatText beat={beat} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(112,63,236,0.35),transparent)]" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={active} initial={reduce ? false : { opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, scale: 1.02, y: -30 }} transition={{ duration: 0.6, ease }} className="relative">
                <Frame media={beat.media} domain={domain} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const StoryList: React.FC<{ beats: Beat[]; domain: string }> = ({ beats, domain }) => (
  <ol className="space-y-20 md:space-y-28">
    {beats.map((b, i) => (
      <li key={b.title} className="px-5 md:px-12 max-w-7xl mx-auto">
        <FadeUp>
          <Counter n={i + 1} total={beats.length} tone="light" />
          <h3 className="mt-4 text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.05]">{b.title}</h3>
          <div className="mt-4 max-w-xl"><BeatText beat={b} /></div>
        </FadeUp>
        <FadeUp delay={0.1} className="mt-8"><Frame media={b.media} domain={domain} /></FadeUp>
      </li>
    ))}
  </ol>
);

export const HomepageStory: React.FC<{ beats: Beat[]; domain: string; eyebrow: string; title: string; intro: string; children?: React.ReactNode }> = ({ beats, domain, eyebrow, title, intro, children }) => {
  const desktop = useIsDesktop();
  return (
    <DarkBand className="mt-28 md:mt-40 py-20 md:py-28">
      <div className="px-5 md:px-12 max-w-7xl mx-auto">
        <SectionHead eyebrow={eyebrow} title={title} tone="light"><p>{intro}</p></SectionHead>
      </div>
      <div className="mt-12 md:mt-20">{desktop ? <StorySticky beats={beats} domain={domain} /> : <StoryList beats={beats} domain={domain} />}</div>
      {children}
    </DarkBand>
  );
};

/* ------------------------------------------------------------------ */
/* Pages gallery: slides sideways as you scroll on desktop              */
/* ------------------------------------------------------------------ */

export type PageShot = { name: string; headline: string; line: string; image: string };

const PageCard: React.FC<{ pg: PageShot; client: string }> = ({ pg, client }) => (
  <>
    <TiltCard className="rounded-[1.5rem] bg-[#0A0A0A] p-2.5">
      <Still src={pg.image} alt={`The ${client} ${pg.name} page: ${pg.headline}`} sizes="(min-width: 1024px) 40vw, 82vw" className="rounded-[1rem]" />
    </TiltCard>
    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{pg.name}</p>
    <h3 className="mt-2 text-2xl md:text-3xl font-bold tracking-[-0.03em]">“{pg.headline}”</h3>
    <p className="mt-2 text-base text-zinc-600 leading-relaxed max-w-md">{pg.line}</p>
  </>
);

const GalleryTrack: React.FC<{ pages: PageShot[]; client: string; eyebrow: string; title: string }> = ({ pages, client, eyebrow, title }) => {
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
    <section ref={ref} className="relative mt-28 md:mt-40" style={{ height: `${Math.max(220, pages.length * 46)}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-12 max-w-7xl w-full mx-auto mb-12 flex items-end justify-between gap-6">
          <div>
            <Label>{eyebrow}</Label>
            <h2 className="mt-5 text-6xl xl:text-8xl font-bold tracking-[-0.055em] leading-[0.95]">{title}</h2>
          </div>
          <div className="w-48 h-[2px] bg-zinc-200 rounded-full overflow-hidden"><motion.div style={{ width: bar }} className="h-full bg-[#703FEC]" /></div>
        </div>
        <motion.ul ref={trackRef} style={{ x }} className="flex gap-8 pl-12 pr-12 will-change-transform">
          {pages.map((pg) => <li key={pg.name} className="shrink-0 w-[40vw] max-w-[620px]"><PageCard pg={pg} client={client} /></li>)}
        </motion.ul>
      </div>
    </section>
  );
};

const GalleryScroller: React.FC<{ pages: PageShot[]; client: string; eyebrow: string; title: string }> = ({ pages, client, eyebrow, title }) => (
  <section className="mt-28 md:mt-40">
    <div className="px-5 md:px-12 max-w-7xl mx-auto"><SectionHead eyebrow={eyebrow} title={title} /></div>
    <ul className="mt-12 md:mt-16 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-12 px-5 md:px-12 pb-4 [scrollbar-width:none]">
      {pages.map((pg) => <li key={pg.name} className="snap-start shrink-0 w-[82vw] sm:w-[60vw] md:w-[46vw]"><PageCard pg={pg} client={client} /></li>)}
    </ul>
  </section>
);

export const PagesGallery: React.FC<{ pages: PageShot[]; client: string; eyebrow: string; title: string }> = (props) => {
  const desktop = useIsDesktop();
  return desktop ? <GalleryTrack {...props} /> : <GalleryScroller {...props} />;
};

/* ------------------------------------------------------------------ */
/* Closing CTA with the site's New message brief                       */
/* ------------------------------------------------------------------ */

export const ClosingCta: React.FC<{ headline: string; line: string; send: (b: Brief) => Promise<unknown>; message: string }> = ({ headline, line, send, message }) => (
  <DarkBand id="start" className="mt-28 md:mt-40 py-20 md:py-28">
    <div className="px-5 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
      <div>
        <Label tone="light">Your turn</Label>
        <h2 className="mt-5 text-5xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.98]">{headline}</h2>
        <p className="mt-6 max-w-xl text-lg md:text-xl text-white/60 leading-relaxed">{line}</p>
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
      <QuickBrief send={send} tone="dark" initial={{ message }} />
    </div>
  </DarkBand>
);
