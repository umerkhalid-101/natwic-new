import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Magnetic } from '../Magnetic';
import { Link } from '../nav';
import { useTilt, Spotlight } from '../interactions';
import { sendBrief } from '../Pricing';
import { PROJECTS, projectBySlug } from '../work/projects';
import { BASE_URL, serviceUrl } from '../../seo';
import { FadeUp, TiltCard, ClosingCta, pad2, ease } from '../work/rich/blocks';
import { SERVICE_PAGES, SERVICES_HUB, serviceBySlug, servicePath } from './services';
import { HUB_CONTENT, contentFor } from './content';
import { DEMOS, Constellation, RemoteFeed } from './demos';

const sendFromServices = sendBrief('Services');

const TOGETHER = [
  { title: 'One shared space', text: 'Plans, designs and staging links in one place, so you can check in any time.' },
  { title: 'Calls in your hours', text: 'A short weekly call at a time that suits your time zone.' },
  { title: 'Updates in writing', text: 'Progress shared between calls, so nothing waits on a meeting.' },
];

const JsonLd: React.FC<{ data: object }> = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

/* ------------------------------------------------------------------ */
/* Futuristic building blocks                                           */
/* ------------------------------------------------------------------ */

const GRID_CSS = `
@keyframes svc-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
.svc-scan { animation: svc-scan 7s linear infinite; }
.svc-glow-border { position: relative; isolation: isolate; }
.svc-glow-border::before { content: ''; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; z-index: -1;
  background: conic-gradient(from var(--a, 0deg), transparent 0 70%, #703FEC 80%, #b9a1ff 88%, transparent 96%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; }
.svc-glow-border:hover::before { opacity: 1; animation: svc-border 2.4s linear infinite; }
@property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes svc-border { to { --a: 360deg; } }
@media (prefers-reduced-motion: reduce) { .svc-scan, .svc-glow-border:hover::before { animation: none; } }
`;

/** Dark stage with a grid, a scanning light and a glow that follows the cursor */
const GridStage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const t = useTilt(0);
  return (
    <section {...t.handlers} className={`relative mx-2 md:mx-6 overflow-clip rounded-[2rem] md:rounded-[3rem] bg-[#06060b] text-white ${className}`}>
      <style>{GRID_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_40%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(112,63,236,0.55),transparent_60%)]" />
      <div aria-hidden className="svc-scan pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-[#703FEC]/10 to-transparent" />
      <Spotlight x={t.px} y={t.py} size={600} color="rgba(112,63,236,0.22)" />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light' }> = ({ children, tone = 'light' }) => (
  <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] ${tone === 'light' ? 'border-white/15 bg-white/[0.04] text-white/60' : 'border-zinc-200 bg-white text-zinc-500'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.9)]" />
    {children}
  </p>
);

const H2: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light'; className?: string }> = ({ children, tone = 'dark', className = '' }) => (
  <h2 className={`mt-5 text-[11vw] md:text-6xl lg:text-7xl font-bold tracking-[-0.055em] leading-[0.95] ${tone === 'light' ? 'text-white' : 'text-black'} ${className}`}>{children}</h2>
);

type Crumb = { name: string; href: string };

const Breadcrumb: React.FC<{ items: Crumb[] }> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${BASE_URL}${c.href === '/' ? '/' : c.href}` })),
  };
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={schema} />
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        {items.map((c, i) => (
          <React.Fragment key={c.href}>
            {i > 0 && <li aria-hidden className="text-white/25">/</li>}
            {i < items.length - 1
              ? <li><Link href={c.href} className="text-white/50 hover:text-white transition-colors">{c.name}</Link></li>
              : <li aria-current="page" className="text-white">{c.name}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

const PrimaryButton: React.FC<{ href?: string; children: React.ReactNode }> = ({ href = '/contact', children }) => (
  <Magnetic strength={0.3}>
    <Link href={href} className="group inline-flex items-center gap-4 rounded-full bg-white text-black pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] hover:text-white transition-colors">
      {children}
      <span className="w-11 h-11 rounded-full bg-[#703FEC] text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
    </Link>
  </Magnetic>
);

/** Headline whose words rise into place */
const RiseTitle: React.FC<{ text: string; className: string }> = ({ text, className }) => (
  <h1 className={className}>
    {text.split(' ').map((w, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.05 * i }}>{w}&nbsp;</motion.span>
      </span>
    ))}
  </h1>
);

const CaseCards: React.FC<{ slugs: string[] }> = ({ slugs }) => {
  const cases = slugs.map(projectBySlug).filter(Boolean) as typeof PROJECTS;
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${cases.length > 2 ? 'lg:grid-cols-3' : ''} gap-6 md:gap-8`}>
      {cases.map((p) => (
        <Link key={p.slug} href={`/work/${p.slug}`} className="group block">
          <TiltCard className="rounded-[2rem] bg-zinc-100">
            <img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
          </TiltCard>
          <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] group-hover:text-[#703FEC] transition-colors">{p.title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{p.category}</p>
          <p className="mt-3 text-base text-zinc-700 leading-relaxed">{p.summary}</p>
        </Link>
      ))}
    </div>
  );
};

/** Answers stay in the HTML (no JS needed to read them), so crawlers and FAQ rich results see them */
const Faqs: React.FC<{ faqs: { q: string; a: string }[] }> = ({ faqs }) => (
  <div className="space-y-3">
    {faqs.map((f, i) => (
      <details key={f.q} className="group svc-glow-border rounded-2xl border border-zinc-200 bg-white px-6 py-5 open:shadow-[0_20px_60px_rgba(112,63,236,0.12)]">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
          <span className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-[#703FEC]">{pad2(i + 1)}</span>
            <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] leading-snug">{f.q}</h3>
          </span>
          <span aria-hidden className="mt-0.5 w-8 h-8 shrink-0 rounded-full border border-zinc-200 grid place-items-center text-black transition-transform duration-500 group-open:rotate-45 group-open:bg-[#703FEC] group-open:border-[#703FEC] group-open:text-white">+</span>
        </summary>
        <p className="mt-4 pl-9 max-w-3xl text-base md:text-lg text-zinc-600 leading-relaxed">{f.a}</p>
      </details>
    ))}
  </div>
);

/** The process as a line that fills as you scroll past it */
const ProcessLine: React.FC<{ steps: { title: string; text: string }[] }> = ({ steps }) => {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <ol ref={ref} className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
      <span aria-hidden className="absolute left-5 top-0 bottom-0 w-px bg-zinc-200 md:left-0 md:right-0 md:top-5 md:bottom-auto md:h-px md:w-auto" />
      <motion.span aria-hidden className="absolute left-5 top-0 w-px bg-[#703FEC] md:hidden" style={{ height: reduce ? '100%' : fill }} />
      <motion.span aria-hidden className="absolute top-5 left-0 h-px bg-[#703FEC] hidden md:block" style={{ width: reduce ? '100%' : fill }} />
      {steps.map((s, i) => (
        <li key={s.title} className="relative pl-16 md:pl-0">
          <span className="absolute left-0 top-0 md:static grid place-items-center w-10 h-10 rounded-full bg-black text-white text-sm font-bold ring-8 ring-white shadow-[0_0_0_1px_rgba(112,63,236,0.4)]">{i + 1}</span>
          <h3 className="md:mt-6 text-2xl font-bold tracking-[-0.03em]">{s.title}</h3>
          <p className="mt-2 text-base text-zinc-600 leading-relaxed">{s.text}</p>
        </li>
      ))}
    </ol>
  );
};

/** Remote by default: three points, and a workspace feed that lights up the one you hover */
const WorkingTogether: React.FC = () => {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <GridStage className="mt-24 md:mt-32 py-16 md:py-24">
      <div className="px-5 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
        <div>
          <Eyebrow>04 · Working together</Eyebrow>
          <H2 tone="light">Remote by default.</H2>
          <ul className="mt-10 border-t border-white/10" onPointerLeave={() => setHover(null)}>
            {TOGETHER.map((t, i) => (
              <li key={t.title} onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={0} className="group relative flex items-start gap-5 border-b border-white/10 py-5 outline-none cursor-default">
                <span className={`absolute left-0 top-0 h-full w-px transition-colors ${hover === i ? 'bg-[#703FEC]' : 'bg-transparent'}`} />
                <span className={`mt-1 font-mono text-xs transition-colors ${hover === i ? 'text-[#b9a1ff]' : 'text-white/35'}`}>{pad2(i + 1)}</span>
                <span>
                  <span className={`block text-xl md:text-2xl font-bold tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${hover === i ? 'translate-x-1.5' : ''}`}>{t.title}</span>
                  <span className="mt-1 block text-base text-white/55 leading-relaxed">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <FadeUp><RemoteFeed highlight={hover} /></FadeUp>
      </div>
    </GridStage>
  );
};

/* ------------------------------------------------------------------ */
/* /services: the hub                                                  */
/* ------------------------------------------------------------------ */

export const ServicesIndex: React.FC = () => {
  const [demo, setDemo] = useState(0);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: SERVICES_HUB.title,
    description: SERVICES_HUB.description,
    url: `${BASE_URL}/services`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: SERVICE_PAGES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: serviceUrl(s.slug) })),
    },
  };
  const Active = DEMOS[SERVICE_PAGES[demo].slug].Demo;

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-28 pb-10 overflow-x-clip">
      <JsonLd data={schema} />

      <GridStage className="pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="px-5 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-8 items-center">
          <div>
            <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]} />
            <div className="mt-10 md:mt-14"><Eyebrow>Services · 05</Eyebrow></div>
            <RiseTitle text={HUB_CONTENT.h1} className="mt-6 text-[13vw] md:text-[6.5vw] lg:text-[5.4vw] font-bold leading-[0.92] tracking-[-0.06em]" />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.4 }} className="mt-8 max-w-xl text-lg md:text-xl text-white/65 leading-relaxed">{HUB_CONTENT.intro}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10"><PrimaryButton>Start a project</PrimaryButton></motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease, delay: 0.3 }}>
            <Constellation services={SERVICE_PAGES} href={servicePath} />
          </motion.div>
        </div>
      </GridStage>

      {/* Every service */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Eyebrow tone="dark">What we do</Eyebrow>
        <H2>Pick your starting point.</H2>
        <ul className="mt-12 md:mt-16 grid gap-4">
          {SERVICE_PAGES.map((s, i) => (
            <li key={s.slug}>
              <FadeUp delay={i * 0.05}>
                <Link href={servicePath(s.slug)} className="svc-glow-border group relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[4rem_1.1fr_1fr_auto] items-center gap-4 md:gap-8 overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white px-5 md:px-8 py-6 md:py-8 transition-colors hover:bg-[#06060b] hover:text-white">
                  <span className="font-mono text-xs text-zinc-400 group-hover:text-[#b9a1ff]">{pad2(i + 1)}</span>
                  <h3 className="text-2xl md:text-4xl font-bold tracking-[-0.045em] leading-none transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-2">{s.name}</h3>
                  <p className="hidden md:block text-base text-zinc-500 group-hover:text-white/60 leading-relaxed">{s.teaser}</p>
                  <span className="w-11 h-11 rounded-full border border-zinc-200 group-hover:border-[#703FEC] group-hover:bg-[#703FEC] group-hover:text-white grid place-items-center transition-all duration-500 group-hover:-rotate-45">→</span>
                  <p className="md:hidden col-span-3 text-base text-zinc-500 group-hover:text-white/60 leading-relaxed">{s.teaser}</p>
                </Link>
              </FadeUp>
            </li>
          ))}
        </ul>
      </section>

      {/* Play with each one */}
      <GridStage className="mt-24 md:mt-32 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <Eyebrow>Hands on</Eyebrow>
          <H2 tone="light">Try each service.</H2>
          <p className="mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">Every service page has a small demo of the craft behind it. Have a go here.</p>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist">
            {SERVICE_PAGES.map((s, i) => (
              <button key={s.slug} role="tab" aria-selected={demo === i} onClick={() => setDemo(i)} className={`relative rounded-full px-4 py-2 text-xs font-semibold transition-colors ${demo === i ? 'text-white' : 'text-white/50 hover:text-white border border-white/10'}`}>
                {demo === i && <motion.span layoutId="hub-demo-tab" className="absolute inset-0 rounded-full bg-[#703FEC]" transition={{ duration: 0.4, ease }} />}
                <span className="relative">{DEMOS[s.slug].label}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 grid lg:grid-cols-[1fr_0.45fr] gap-6 items-start">
            <AnimatePresence mode="wait">
              <motion.div key={demo} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
                <Active />
              </motion.div>
            </AnimatePresence>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#b9a1ff]">{pad2(demo + 1)} / {pad2(SERVICE_PAGES.length)}</p>
              <p className="mt-3 text-2xl font-bold tracking-[-0.03em]">{SERVICE_PAGES[demo].name}</p>
              <p className="mt-2 text-white/60 leading-relaxed">{SERVICE_PAGES[demo].teaser}</p>
              <Link href={servicePath(SERVICE_PAGES[demo].slug)} className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white hover:text-[#b9a1ff] transition-colors">Explore the service →</Link>
            </div>
          </div>
        </div>
      </GridStage>

      {/* How we work, any time zone */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Eyebrow tone="dark">How we work</Eyebrow>
        <H2>One team, <span className="italic text-[#703FEC]">any time zone.</span></H2>
        <div className="mt-12 md:mt-16 grid lg:grid-cols-3 gap-4">
          {HUB_CONTENT.remote.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.08}>
              <TiltCard className={`h-full rounded-[2rem] p-8 md:p-10 min-h-[240px] ${['bg-zinc-100 text-black', 'bg-[#06060b] text-white', 'bg-[#703FEC] text-white'][i]}`} light={i === 2 ? 'rgba(255,255,255,0.25)' : undefined}>
                <span className="font-mono text-xs opacity-60">{pad2(i + 1)}</span>
                <h3 className="mt-12 text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight">{b.title}</h3>
                <p className="mt-3 text-base leading-relaxed opacity-75">{b.text}</p>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow tone="dark">Selected work</Eyebrow>
            <H2>Built by this team.</H2>
          </div>
          <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-black transition-colors shrink-0">All projects →</Link>
        </div>
        <div className="mt-10 md:mt-14"><CaseCards slugs={PROJECTS.slice(0, 3).map((p) => p.slug)} /></div>
      </section>

      <ClosingCta headline="Not sure which one you need? Ask us." line="Tell us what you’re building and we’ll suggest where to start. We design and build websites and brands for startups, SaaS teams and small businesses worldwide." send={sendFromServices} message="We’re not sure which service we need yet. Here’s what we’re building:" />
      <div className="h-10" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* /services/<slug>: one service                                        */
/* ------------------------------------------------------------------ */

export const ServicePage: React.FC<{ slug: string }> = ({ slug }) => {
  const meta = serviceBySlug(slug) ?? SERVICE_PAGES[0];
  const c = contentFor(meta.slug)!;
  const url = serviceUrl(meta.slug);
  const index = SERVICE_PAGES.findIndex((s) => s.slug === meta.slug);
  const others = SERVICE_PAGES.filter((s) => s.slug !== meta.slug);
  const { Demo, label } = DEMOS[meta.slug];
  const send = sendBrief(`Service: ${meta.name}`);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: meta.name,
      serviceType: c.serviceType,
      description: meta.description,
      url,
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: 'Worldwide',
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${BASE_URL}/contact` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  return (
    <article key={meta.slug} className="bg-white min-h-screen pt-24 md:pt-28 pb-10 overflow-x-clip">
      <JsonLd data={schema} />

      {/* Hero: the promise on the left, the craft on the right */}
      <GridStage className="pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: meta.name, href: servicePath(meta.slug) }]} />
          <div className="mt-10 md:mt-14 grid lg:grid-cols-[1fr_1.05fr] gap-12 items-start">
            <div>
              <Eyebrow>Service {pad2(index + 1)} / {pad2(SERVICE_PAGES.length)}</Eyebrow>
              <RiseTitle text={c.h1} className="mt-6 text-[12vw] md:text-[6vw] lg:text-[4.6vw] font-bold leading-[0.92] tracking-[-0.055em]" />
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.35 }} className="mt-8 text-lg md:text-xl font-medium tracking-[-0.01em] leading-[1.45] text-white/80">
                {c.intro[0]}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap items-center gap-4">
                <PrimaryButton>Start a project</PrimaryButton>
                <a href="#pricing" className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors">Pricing ↓</a>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.3 }} className="lg:sticky lg:top-28">
              <Demo />
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">{label} · interactive demo</p>
            </motion.div>
          </div>
        </div>
      </GridStage>

      {/* Who it's for */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Eyebrow tone="dark">01 · Who it’s for</Eyebrow>
        <H2>Made for teams like yours.</H2>
        {c.intro.slice(1).map((p, i) => <p key={i} className="mt-6 max-w-3xl text-lg md:text-xl text-zinc-600 leading-relaxed">{p}</p>)}
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-4">
          {c.forWho.map((b, i) => (
            <FadeUp key={b.title} delay={(i % 2) * 0.08}>
              <div className="svc-glow-border h-full rounded-[1.75rem] border border-zinc-200 bg-white p-7 md:p-9 transition-shadow hover:shadow-[0_30px_80px_rgba(112,63,236,0.12)]">
                <span className="font-mono text-xs text-[#703FEC]">{pad2(i + 1)}</span>
                <h3 className="mt-6 text-2xl md:text-3xl font-bold tracking-[-0.03em]">{b.title}</h3>
                <p className="mt-3 text-base md:text-lg text-zinc-600 leading-relaxed">{b.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* What's included */}
      <GridStage className="mt-24 md:mt-32 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <Eyebrow>02 · What’s included</Eyebrow>
          <H2 tone="light">Everything, start to finish.</H2>
          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.included.map((b, i) => (
              <FadeUp key={b.title} delay={(i % 3) * 0.06}>
                <TiltCard className="svc-glow-border h-full rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#703FEC]/20 font-mono text-xs text-[#b9a1ff] ring-1 ring-[#703FEC]/40">{pad2(i + 1)}</span>
                    <span aria-hidden className="h-px w-16 bg-gradient-to-r from-[#703FEC] to-transparent" />
                  </div>
                  <h3 className="mt-8 text-xl md:text-2xl font-bold tracking-[-0.03em]">{b.title}</h3>
                  <p className="mt-2 text-base text-white/60 leading-relaxed">{b.text}</p>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </GridStage>

      {/* Process */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Eyebrow tone="dark">03 · Process</Eyebrow>
        <H2>Four steps. No surprises.</H2>
        <ProcessLine steps={c.process} />
      </section>

      {/* Working together */}
      <WorkingTogether />

      {/* Pricing */}
      <section id="pricing" className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32 scroll-mt-28">
        <FadeUp>
          <div className="svc-glow-border relative overflow-hidden rounded-[2.5rem] bg-[#703FEC] text-white p-8 md:p-14">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            <Eyebrow>05 · Pricing</Eyebrow>
            <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
              <div>
                <p className="text-3xl md:text-5xl font-bold tracking-[-0.045em] leading-[1.05]">Contact us for pricing.</p>
                <p className="mt-4 max-w-xl text-base md:text-lg text-white/75 leading-relaxed">{c.pricing}</p>
              </div>
              <div className="lg:justify-self-end"><PrimaryButton>Contact us for pricing</PrimaryButton></div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Related work */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow tone="dark">06 · Related work</Eyebrow>
            <H2>Proof, not promises.</H2>
          </div>
          <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-black transition-colors shrink-0">All projects →</Link>
        </div>
        <div className="mt-10 md:mt-14"><CaseCards slugs={c.cases} /></div>
      </section>

      {/* FAQ */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32 grid lg:grid-cols-[0.8fr_1.6fr] gap-10 lg:gap-16">
        <div>
          <Eyebrow tone="dark">07 · FAQ</Eyebrow>
          <H2>Common questions.</H2>
        </div>
        <Faqs faqs={c.faqs} />
      </section>

      {/* Other services */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Eyebrow tone="dark">Other services</Eyebrow>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((s) => (
            <li key={s.slug}>
              <Link href={servicePath(s.slug)} className="svc-glow-border group flex h-full flex-col justify-between gap-6 rounded-[1.75rem] border border-zinc-200 bg-white p-6 transition-colors hover:bg-[#06060b] hover:text-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 group-hover:text-[#b9a1ff]">{DEMOS[s.slug].label}</span>
                <span className="flex items-end justify-between gap-4">
                  <span className="text-xl font-bold tracking-[-0.03em] leading-tight">{s.name}</span>
                  <span className="w-9 h-9 shrink-0 rounded-full bg-black text-white grid place-items-center transition-[transform,background-color] duration-500 group-hover:-rotate-45 group-hover:bg-[#703FEC]">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ClosingCta headline="Ready to get started? Tell us about it." line="We design and build websites and brands for startups, SaaS teams and small businesses worldwide." send={send} message={`We’re interested in ${meta.name.toLowerCase()}. Here’s what we’re building:`} />
      <div className="h-10" />
    </article>
  );
};
