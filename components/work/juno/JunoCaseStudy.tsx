import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Magnetic } from '../../Magnetic';
import { Link } from '../../nav';
import { BASE_URL, caseUrl } from '../../../seo';
import { projectBySlug } from '../projects';
import { MoreWork, NextProject } from '../WorkPages';
import {
  HERO, CHALLENGE, GOALS, APPROACH, STORY_INTRO, BEATS, CAPABILITY_STILLS, PAGES, DETAILS, DESIGN_SYSTEM, RESULTS, CLOSING, Media,
} from './juno';

const ease = [0.16, 1, 0.3, 1] as const;
const project = projectBySlug('juno')!;

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
    <h2 className={`mt-5 text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.045em] leading-[1.02] max-w-4xl ${tone === 'light' ? 'text-white' : 'text-black'}`}>{title}</h2>
    {children && <div className={`mt-6 max-w-2xl text-lg md:text-xl leading-relaxed ${tone === 'light' ? 'text-white/60' : 'text-zinc-600'}`}>{children}</div>}
  </FadeUp>
);

/** A grey box naming the asset still to come, at the right aspect ratio */
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

/** A still or clip framed as a browser window. Missing assets render as labeled placeholders. */
const Frame: React.FC<{ media: Media; eager?: boolean; className?: string }> = ({ media, eager = false, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className={`overflow-hidden rounded-xl md:rounded-2xl bg-[#07090d] border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.5)] ${className}`}>
      <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
        <span className="ml-3 rounded-full bg-white/[0.06] px-3 py-1 text-[9px] md:text-[11px] text-white/45">{project.domain}</span>
      </div>
      <div className="relative">
        {media.video ? (
          <InViewVideo src={media.video} poster={media.image} label={media.alt} />
        ) : media.image ? (
          <img
            src={media.image}
            alt={media.alt}
            width={1600}
            height={1000}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`block w-full h-auto transition-opacity duration-700 ${loaded || eager ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <Placeholder file={media.file} />
        )}
        {!media.video && media.image && (
          <span className="absolute right-3 bottom-3 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[10px] text-white/70 backdrop-blur">Video to come: {media.file}</span>
        )}
      </div>
    </figure>
  );
};

const DarkBand: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => (
  <section id={id} className={`relative mx-2 md:mx-6 rounded-[2rem] md:rounded-[3rem] bg-[#0A0A0A] text-white overflow-hidden ${className}`}>
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(112,63,236,0.35),transparent_60%)]" />
    <div className="relative">{children}</div>
  </section>
);

const Counter: React.FC<{ n: number; total: number; tone?: 'dark' | 'light' }> = ({ n, total, tone = 'dark' }) => (
  <span className={`font-mono text-xs ${tone === 'light' ? 'text-white/45' : 'text-zinc-400'}`}>
    <span className="text-[#703FEC]">{String(n).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
  </span>
);

const Todo: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light' }> = ({ children, tone = 'dark' }) => (
  <span className={`inline-block rounded-lg border border-dashed px-3 py-2 font-mono text-sm ${tone === 'light' ? 'border-white/20 text-white/55' : 'border-zinc-300 text-zinc-500'}`}>{children}</span>
);

/* ------------------------------------------------------------------ */
/* The page                                                             */
/* ------------------------------------------------------------------ */

export const JunoCaseStudy: React.FC = () => {
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
    document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className="bg-white min-h-screen pt-28 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }} className="mt-6 text-[10.5vw] md:text-[5.6vw] font-bold leading-[0.98] tracking-[-0.05em] text-black max-w-6xl">
          {HERO.title}
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }} className="mt-8 md:mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16 items-end">
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
        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.35 }} className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 border-t border-zinc-200 pt-6">
          {HERO.meta.map((m) => (
            <div key={m.k}>
              <dt className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{m.k}</dt>
              <dd className={`mt-2 text-sm md:text-base font-semibold ${m.v.startsWith('[TODO') ? 'font-mono text-zinc-400' : 'text-black'}`}>{m.v}</dd>
            </div>
          ))}
        </motion.dl>
      </header>

      <DarkBand className="mt-14 md:mt-20 px-3 md:px-14 py-6 md:py-14">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.3 }} className="max-w-6xl mx-auto">
          <Frame media={HERO.media} eager />
        </motion.div>
      </DarkBand>

      {/* 2. The challenge */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="The challenge" title="Powerful product. Unclear story.">
          <p>{CHALLENGE.text}</p>
        </SectionHead>
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-4 md:gap-6">
          {CHALLENGE.before.map((m) => (
            <FadeUp key={m.file}>
              <Placeholder file={m.file} tone="dark" />
              <p className="mt-3 text-sm text-zinc-500">Before: {m.alt}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 3. What we set out to do */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="The goals" title="Clear. Trusted. Premium." />
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOALS.map((g, i) => (
            <FadeUp key={g} delay={i * 0.08} className={`rounded-[2rem] p-8 md:p-10 min-h-[220px] flex flex-col justify-between ${['bg-zinc-100 text-black', 'bg-[#0A0A0A] text-white', 'bg-[#703FEC] text-white'][i]}`}>
              <span className="font-mono text-xs opacity-60">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-10 text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight">{g}</h3>
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
              <li key={d} className="flex items-baseline gap-5 border-t border-zinc-200 last:border-b py-5">
                <span className="font-mono text-xs text-[#703FEC]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg md:text-2xl font-semibold tracking-[-0.02em] leading-snug">{d}</span>
              </li>
            ))}
          </ol>
        </FadeUp>
      </section>

      {/* 5. The homepage story */}
      <DarkBand className="mt-28 md:mt-40 py-20 md:py-32">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionHead eyebrow="The homepage" title="A story, not a feature list." tone="light">
            <p>{STORY_INTRO}</p>
          </SectionHead>
        </div>
        <ol className="mt-16 md:mt-24 space-y-20 md:space-y-32">
          {BEATS.map((b, i) => (
            <li key={b.title} className="px-5 md:px-12 max-w-7xl mx-auto">
              <div className={`grid lg:grid-cols-[1fr_1.7fr] gap-8 lg:gap-16 items-center ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <FadeUp>
                  <Counter n={i + 1} total={BEATS.length} tone="light" />
                  <h3 className="mt-4 text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.05]">{b.title}</h3>
                  <p className="mt-4 text-lg text-white/60 leading-relaxed max-w-md">{b.text}</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <Frame media={b.media} />
                </FadeUp>
              </div>
              {i === 2 && (
                <FadeUp className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CAPABILITY_STILLS.map((c) => (
                    <figure key={c.caption} className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090d]">
                      <img src={c.image} alt={c.alt} width={1600} height={1000} loading="lazy" decoding="async" className="block w-full h-auto" />
                      <figcaption className="px-4 py-3 text-sm text-white/60">{c.caption}</figcaption>
                    </figure>
                  ))}
                </FadeUp>
              )}
            </li>
          ))}
        </ol>
      </DarkBand>

      {/* 6. Nine pages, one system */}
      <section className="mt-28 md:mt-40">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionHead eyebrow="The full site" title="Nine pages. One system." />
        </div>
        <ul className="mt-12 md:mt-16 flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-5 px-5 md:px-12 max-w-7xl mx-auto pb-4 md:pb-0 [scrollbar-width:none]">
          {PAGES.map((pg, i) => (
            <li key={pg.name} className="snap-start shrink-0 w-[82vw] sm:w-[60vw] md:w-auto">
              <FadeUp delay={(i % 3) * 0.06}>
                <div className="overflow-hidden rounded-[1.5rem] bg-[#0A0A0A] p-2.5">
                  <img src={pg.image} alt={`The Juno ${pg.name} page: ${pg.headline}`} width={1600} height={1000} loading="lazy" decoding="async" className="block w-full h-auto rounded-[1rem]" />
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{pg.name}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em]">“{pg.headline}”</h3>
                <p className="mt-2 text-base text-zinc-600 leading-relaxed">{pg.line}</p>
              </FadeUp>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. The details */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="The details" title="Small things. Big trust." />
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-4 md:gap-6">
          {DETAILS.map((d, i) => (
            <FadeUp key={d.title} delay={(i % 2) * 0.08} className="rounded-[2rem] bg-zinc-100 p-4 md:p-5">
              <div className="rounded-[1.25rem] bg-[#0A0A0A] p-4">
                <Placeholder file={d.media.file} ratio="aspect-[16/9]" />
              </div>
              <div className="px-3 md:px-4 pt-6 pb-3">
                <h3 className="text-2xl font-bold tracking-[-0.03em]">{d.title}</h3>
                <p className="mt-2 text-base text-zinc-600 leading-relaxed">{d.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 8. Design system */}
      <DarkBand className="mt-28 md:mt-40 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionHead eyebrow="Design system" title="Built to scale." tone="light">
            <p>Color tokens, type scale, spacing and motion principles, plus core components: {DESIGN_SYSTEM.components.join(', ').toLowerCase()}.</p>
          </SectionHead>

          <div className="mt-14 md:mt-20 grid lg:grid-cols-2 gap-10 lg:gap-16">
            <FadeUp>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Color</h3>
              <ul className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {DESIGN_SYSTEM.colors.map((c) => (
                  <li key={c.name}>
                    <span className="block aspect-square rounded-xl border border-white/10" style={{ background: c.value }} />
                    <span className="mt-2 block text-xs font-semibold">{c.name}</span>
                    <span className="block font-mono text-[10px] text-white/45 uppercase">{c.value}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Type · {DESIGN_SYSTEM.font}</h3>
              <ul className="mt-5">
                {DESIGN_SYSTEM.type.map((t) => (
                  <li key={t.name} className="flex items-baseline justify-between gap-4 border-t border-white/10 py-3">
                    <span className="truncate text-lg md:text-xl font-semibold tracking-[-0.02em]">{t.sample}</span>
                    <span className="shrink-0 font-mono text-[11px] text-white/45">{t.name} · {t.size}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Radius</h3>
              <ul className="mt-5 flex flex-wrap gap-4">
                {DESIGN_SYSTEM.radii.map((r) => (
                  <li key={r} className="text-center">
                    <span className="block w-16 h-16 border border-white/25 bg-white/[0.04]" style={{ borderRadius: r }} />
                    <span className="mt-2 block font-mono text-[10px] text-white/45">{r}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Motion</h3>
              <ul className="mt-5">
                {DESIGN_SYSTEM.motion.map((m) => (
                  <li key={m.name} className="grid grid-cols-[5rem_1fr] gap-4 border-t border-white/10 py-3">
                    <span className="font-semibold">{m.name}</span>
                    <span><span className="block text-sm text-white/70">{m.use}</span><span className="block font-mono text-[10px] text-white/40">{m.curve}</span></span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
          <div className="mt-12"><Todo tone="light">{DESIGN_SYSTEM.todo}</Todo></div>
        </div>
      </DarkBand>

      {/* 9. Results */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="Results" title="The client loved it.">
          <p>{RESULTS.line}</p>
        </SectionHead>
        <FadeUp className="mt-10 flex flex-col items-start gap-4">
          <Todo>{RESULTS.quote}</Todo>
          <Todo>{RESULTS.metrics}</Todo>
        </FadeUp>
      </section>

      {/* 10. Closing CTA */}
      <DarkBand id="start" className="mt-28 md:mt-40 py-20 md:py-28 scroll-mt-24">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <Label tone="light">Your turn</Label>
          <h2 className="mt-5 text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02] max-w-5xl">{CLOSING.headline}</h2>
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
      </DarkBand>

      {/* 11. More work and the next project */}
      <MoreWork slug="juno" />
      <NextProject slug="juno" />
      <div className="h-16 md:h-24" />
    </article>
  );
};
