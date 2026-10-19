import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useMotionTemplate, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { Magnetic } from './Magnetic';
import { BASE_URL } from '../seo';
import { DaylightMap } from './studio/DaylightMap';
import { Values } from './studio/Values';
import { Link } from './nav';
import { PROJECTS } from './work/projects';
import { SERVICE_PAGES, SERVICE_FOR_CASE, servicePath } from './services/services';
import { themeFor, HeroBackdrop } from './services/themes';

const ease = [0.16, 1, 0.3, 1] as const;


const TEAM = [
  { name: 'Umer Khalid', first: 'Umer', role: 'Founder', focus: 'Design & development', handles: ['Web & product design', 'Development', 'Creative direction'], image: '/team/umer.webp', size: [426, 640] as const },
  { name: 'Faiq Ahmed', first: 'Faiq', role: 'Co-founder', focus: 'Content, SEO & ads', handles: ['Content & copy', 'SEO', 'Paid ads'], image: '/team/faiq.webp', size: [426, 640] as const },
  { name: 'Hassan Daniyal Ghauri', first: 'Hassan', role: 'Head of Business', focus: 'Partnerships', handles: ['Partnerships', 'Client relationships', 'Project planning'], image: '/team/hassan.webp', size: [426, 640] as const },
  { name: 'Tanseer Khoso', first: 'Tanseer', role: 'Head of Design', focus: 'Brand design', handles: ['Brand identity', 'Visual systems', 'Art direction'], image: '/team/tanseer.webp', size: [640, 640] as const },
];

// Person structured data for each team member, linked to the studio
const TEAM_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': TEAM.map((m) => ({
    '@type': 'Person',
    name: m.name,
    jobTitle: m.role,
    description: `${m.role} at Natwic Studio. Focus: ${m.focus}.`,
    image: `${BASE_URL}${m.image}`,
    knowsAbout: m.handles,
    worksFor: { '@id': `${BASE_URL}/#organization` },
  })),
};

const STEPS = [
  { t: 'Discover', d: 'A call and a short brief: your goals, your audience and what success looks like for this project.', out: 'Project brief' },
  { t: 'Design', d: 'We set a direction first, then design the full thing, reviewed with you at every milestone.', out: 'Design files' },
  { t: 'Build', d: 'We build what we design: responsive, fast and easy for your team to update.', out: 'Live site or final assets' },
  { t: 'Grow', d: 'After launch we keep improving: new pages, campaigns and content as you grow.', out: 'Ongoing support' },
];

const Label: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light' }> = ({ children, tone = 'dark' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] ${tone === 'dark' ? 'text-zinc-500' : 'text-white/50'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    {children}
  </p>
);

const RevealText: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 1.2, ease, delay }}>
      {children}
    </motion.div>
  </div>
);

/** Counts up to a number when it scrolls into view. */
const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{n}{suffix}</span>;
};

/* ------------------------------------------------------------------ */
/* Team: hover a portrait to bring that person forward                 */
/* ------------------------------------------------------------------ */

const Portrait: React.FC<{ m: typeof TEAM[number]; index: number; active: boolean; onEnter: () => void }> = ({ m, index, active, onEnter }) => {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const ix = useSpring(useTransform(px, [-0.5, 0.5], [18, -18]), { stiffness: 120, damping: 18 });
  const iy = useSpring(useTransform(py, [-0.5, 0.5], [14, -14]), { stiffness: 120, damping: 18 });

  return (
    <motion.div
      layout
      onPointerEnter={onEnter}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { px.set(0); py.set(0); }}
      animate={{ flexGrow: active ? 2.6 : 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 24 }}
      className="relative basis-0 min-w-0 h-full overflow-hidden rounded-[2rem] bg-zinc-900 cursor-pointer"
    >
      <motion.img
        src={m.image}
        alt={`Portrait of ${m.name}, ${m.role} at Natwic`}
        width={m.size[0]}
        height={m.size[1]}
        loading="lazy"
        decoding="async"
        style={{ x: ix, y: iy, scale: 1.15 }}
        className={`absolute inset-0 w-full h-full object-cover object-top transition-[filter] duration-700 ${active ? 'grayscale-0' : 'grayscale'}`}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-70'}`} />
      <span className="absolute left-5 top-5 font-mono text-xs text-white/70">0{index + 1}</span>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-white">
        <p className={`font-bold tracking-[-0.03em] leading-none transition-all duration-500 ${active ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>{active ? m.name : m.first}</p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">{m.role}</p>
        <AnimatePresence>
          {active && (
            <motion.div
              key="more"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5, ease } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            >
              <p className="mt-4 text-sm text-white/75">Handles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {m.handles.map((h) => <span key={h} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">{h}</span>)}
              </div>
              <Link
                href="/contact"
                onClick={(e) => e.stopPropagation()}
                className="group mt-5 inline-flex items-center gap-3 rounded-full bg-white text-black pl-5 pr-1.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#703FEC] hover:text-white transition-colors"
              >
                Talk to {m.first}
                <span className="w-8 h-8 rounded-full bg-[#703FEC] text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Team: React.FC = () => {
  const [active, setActive] = useState(0);
  return (
    <section className="px-3 md:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TEAM_SCHEMA) }} />
      <div className="max-w-7xl mx-auto px-2 md:px-6 mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Label>The team</Label>
          <h2 className="mt-5 text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02]">The people who build it.</h2>
        </div>
        <p className="max-w-sm text-zinc-500 leading-relaxed">No account managers in between. You talk directly to the people designing and building your project.</p>
      </div>

      {/* Desktop: an accordion of portraits */}
      <div className="hidden md:flex gap-3 h-[620px] max-w-[1400px] mx-auto">
        {TEAM.map((m, i) => (
          <Portrait key={m.name} m={m} index={i} active={active === i} onEnter={() => setActive(i)} />
        ))}
      </div>

      {/* Phones: swipe through */}
      <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-3 px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TEAM.map((m, i) => (
          <div key={m.name} className="snap-center shrink-0 w-[78vw] h-[460px] flex">
            <Portrait m={m} index={i} active onEnter={() => undefined} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* How we work: a strip that slides sideways as you scroll             */
/* ------------------------------------------------------------------ */

const Process: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (t) setDistance(Math.max(0, t.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-5 md:px-12 max-w-7xl w-full mx-auto mb-10 md:mb-14 flex items-end justify-between gap-6">
          <div>
            <Label>How we work</Label>
            <h2 className="mt-5 text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02]">Four steps, start to growth.</h2>
          </div>
          <div className="hidden md:block w-48 h-[2px] bg-zinc-200 rounded-full overflow-hidden">
            <motion.div style={{ width: bar }} className="h-full bg-[#703FEC]" />
          </div>
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex gap-4 md:gap-6 pl-5 md:pl-12 pr-6 will-change-transform">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.t}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`group shrink-0 w-[82vw] md:w-[42vw] lg:w-[36vw] h-[52vh] min-h-[340px] rounded-[2rem] md:rounded-[2.5rem] p-7 md:p-10 flex flex-col justify-between ${['bg-zinc-100 text-black', 'bg-[#0A0A0A] text-white', 'bg-[#703FEC] text-white', 'bg-white text-black border border-zinc-200'][i]}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[6rem] md:text-[8rem] font-bold leading-none tracking-[-0.06em] opacity-15 transition-opacity duration-500 group-hover:opacity-40">0{i + 1}</span>
                <span className="rounded-full border border-current/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">{s.out}</span>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-[-0.04em]">{s.t}</h3>
                <p className="mt-4 max-w-md text-base md:text-lg leading-relaxed opacity-70">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* What we do: every service and case study, one click away            */
/* ------------------------------------------------------------------ */

const WAYS = ['One shared workspace', 'Written updates', 'Calls in your hours'];

// Case studies grouped by the service behind them
const CASES_BY_SERVICE = Object.entries(SERVICE_FOR_CASE).reduce<Record<string, string[]>>((acc, [cs, sv]) => {
  (acc[sv] ??= []).push(cs);
  return acc;
}, {});

const STRIP_CSS = `
@keyframes wwd-strip { to { transform: translateX(-50%); } }
.wwd-strip { animation: wwd-strip 50s linear infinite; }
.wwd-strip:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .wwd-strip { animation: none; } }
`;

/** The active service, previewed in its own page's theme */
const ServicePreview: React.FC<{ slug: string }> = ({ slug }) => {
  const theme = themeFor(slug);
  const sv = SERVICE_PAGES.find((x) => x.slug === slug)!;
  const related = (CASES_BY_SERVICE[slug] ?? []).map((c) => PROJECTS.find((p) => p.slug === c)!).filter(Boolean);
  return (
    <motion.div
      key={slug}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.45, ease }}
      className="relative overflow-hidden rounded-[2rem] border p-7 md:p-9"
      style={{ ...theme.vars, background: 'var(--page)', color: 'var(--ink)', borderColor: 'var(--border)' } as React.CSSProperties}
    >
      <HeroBackdrop theme={theme} />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ borderColor: 'var(--border)', color: 'var(--accent)', background: 'var(--card)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />{theme.name}
        </span>
        <p className={`mt-8 text-4xl md:text-5xl leading-[0.98] ${theme.display}`}>{sv.name}</p>
        <p className="mt-4 max-w-md text-base md:text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{sv.teaser}</p>
        <Link href={servicePath(slug)} className="group mt-8 inline-flex items-center gap-3 rounded-full pl-5 pr-1.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] transition-transform active:scale-95" style={{ background: 'var(--ink)', color: 'var(--page)' }}>
          Explore the service
          <span className="w-8 h-8 rounded-full grid place-items-center transition-transform duration-500 group-hover:-rotate-45" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>→</span>
        </Link>
        {related.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>Related work</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {related.slice(0, 3).map((p) => (
                <Link key={p.slug} href={`/work/${p.slug}`} className="group block overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <span className="block px-2.5 py-2 text-xs font-semibold">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const WhatWeDo: React.FC = () => {
  const [active, setActive] = useState(0);
  const strip = [...PROJECTS, ...PROJECTS];
  return (
    <section className="px-2 md:px-6 py-16 md:py-24">
      <style>{STRIP_CSS}</style>
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-[#0A0A0A] text-white py-16 md:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(112,63,236,0.45),transparent_60%)]" />
        <div className="relative px-5 md:px-12 max-w-7xl mx-auto">
          <Label tone="light">What we do</Label>
          <div className="mt-5 grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-end">
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02]">
              Remote by default, <span className="italic text-[#b9a1ff]">close by design.</span>
            </h2>
            <div>
              <p className="text-lg text-white/60 leading-relaxed">Founders in different countries, one team that plans, designs and builds with you from the first call to launch.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {WAYS.map((w) => (
                  <li key={w} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_8px_#703FEC]" />{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The switchboard: pick a service, see it in its own theme */}
          <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start [&>*]:min-w-0">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-white/45">Services</p>
              <ol>
                {SERVICE_PAGES.map((sv, i) => {
                  const t = themeFor(sv.slug);
                  const on = active === i;
                  return (
                    <li key={sv.slug} className="border-t border-white/10 last:border-b">
                      <Link
                        href={servicePath(sv.slug)}
                        onPointerEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={(e) => { if (!on && window.matchMedia('(hover: none)').matches) { e.preventDefault(); setActive(i); } }}
                        className="group flex items-baseline gap-4 py-4 md:py-5"
                      >
                        <span className="font-mono text-xs transition-colors" style={{ color: on ? t.vars['--accent'] : 'rgba(255,255,255,0.3)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={`text-3xl md:text-4xl xl:text-5xl font-bold tracking-[-0.045em] leading-[1.02] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${on ? 'text-white translate-x-2' : 'text-white/25 group-hover:text-white/50'}`}>{sv.name}</span>
                        <span className={`ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`} style={{ color: t.vars['--accent'] }}>{t.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
              <Link href="/services" className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-white/45 hover:text-white transition-colors">All services →</Link>
            </div>
            <div className="lg:sticky lg:top-28">
              <AnimatePresence mode="wait">
                <ServicePreview key={SERVICE_PAGES[active].slug} slug={SERVICE_PAGES[active].slug} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Every case study, drifting past */}
        <div className="relative mt-16 md:mt-24">
          <div className="px-5 md:px-12 max-w-7xl mx-auto mb-5 flex items-baseline justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">Case studies</p>
            <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/45 hover:text-white transition-colors">All work →</Link>
          </div>
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="wwd-strip flex w-max gap-4 px-4">
              {strip.map((p, i) => (
                <li key={`${p.slug}-${i}`} aria-hidden={i >= PROJECTS.length} className="w-[70vw] sm:w-[22rem] shrink-0">
                  <Link href={`/work/${p.slug}`} tabIndex={i >= PROJECTS.length ? -1 : undefined} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    <div className="overflow-hidden"><img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" /></div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <span>
                        <span className="block font-bold tracking-[-0.02em]">{p.title}</span>
                        <span className="block text-xs text-white/50">{p.industry}</span>
                      </span>
                      <span className="w-8 h-8 shrink-0 rounded-full bg-white/10 grid place-items-center transition-all duration-500 group-hover:bg-[#703FEC] group-hover:-rotate-45">→</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */

export const Studio: React.FC = () => {

  return (
    <div className="bg-white min-h-screen pt-28 md:pt-36">
      {/* Hero */}
      <section className="px-5 md:px-12 mb-20 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <RevealText className="mb-12 md:mb-20">
            <h1 className="text-[22vw] md:text-[14vw] font-bold leading-[0.8] tracking-[-0.06em] text-black">Studio</h1>
          </RevealText>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <RevealText delay={0.15}><Label>Who we are</Label></RevealText>
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.25, ease }}
                className="mt-6 text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight"
              >
                A small, senior team of designers, developers and strategists.
              </motion.h2>
            </div>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.35 }}
                className="text-zinc-500 text-lg leading-relaxed mb-10 font-medium"
              >
                Natwic is a web design and branding studio based in Dubai, partnering with startups, SaaS teams and small businesses around the world. We work remotely across time zones, and we design and build everything ourselves.
              </motion.p>
              <div className="grid grid-cols-3 gap-6 border-t border-zinc-100 pt-8">
                <div>
                  <p className="text-4xl md:text-5xl font-bold tracking-tighter"><CountUp to={4} /></p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Core team</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold tracking-tighter"><CountUp to={50} suffix="+" /></p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Brands partnered</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold tracking-tighter text-[#703FEC]">$<CountUp to={2} />M</p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Revenue influenced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Team />

      <div className="h-20 md:h-32" />
      <DaylightMap />

      <Process />

      <WhatWeDo />

      <Values />
    </div>
  );
};
