/** /services/<slug>: one service, dressed in its own theme (see themes.tsx). */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from '../Magnetic';
import { Link } from '../nav';
import { sendBrief } from '../Pricing';
import { PROJECTS, projectBySlug } from '../work/projects';
import { BASE_URL, serviceUrl } from '../../seo';
import { FadeUp, TiltCard, ClosingCta, pad2, ease } from '../work/rich/blocks';
import { SERVICE_PAGES, serviceBySlug, servicePath } from './services';
import { contentFor } from './content';
import { DEMOS, RemoteFeed } from './demos';
import { JsonLd, Breadcrumb, GRID_CSS, TOGETHER } from './ui';
import { Theme, themeFor, ThemeStyles, Stage, SectionLabel, CardTop, ProcessView, ThemeTitle, HeroBackdrop, ProductWidgets, StruckHeadline } from './themes';

/** Main call to action in the theme's colors */
const ThemeButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Magnetic strength={0.3}>
    <Link href="/contact" className="group inline-flex items-center gap-4 rounded-full pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90" style={{ background: 'var(--ink)', color: 'var(--page)' }}>
      {children}
      <span className="w-11 h-11 rounded-full grid place-items-center transition-transform duration-500 group-hover:-rotate-45" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>→</span>
    </Link>
  </Magnetic>
);

const H2: React.FC<{ theme: Theme; children: React.ReactNode; onStage?: boolean }> = ({ theme, children, onStage }) => (
  <h2 className={`mt-5 text-[11vw] md:text-6xl lg:text-7xl leading-[0.98] ${theme.display}`} style={{ color: onStage ? 'var(--stage-ink)' : 'var(--ink)' }}>{children}</h2>
);

/* ------------------------------------------------------------------ */
/* Hero, laid out per theme                                             */
/* ------------------------------------------------------------------ */

const Hero: React.FC<{ theme: Theme; slug: string }> = ({ theme, slug }) => {
  const meta = serviceBySlug(slug)!;
  const c = contentFor(slug)!;
  const index = SERVICE_PAGES.findIndex((s) => s.slug === slug);
  const { Demo, label } = DEMOS[slug];
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: meta.name, href: servicePath(slug) }];
  const eyebrow = <SectionLabel theme={theme} n={index + 1} text={`${theme.name} · Service`} />;
  const titleSize = 'text-[12vw] md:text-[6vw] lg:text-[4.8vw]';
  const intro = (
    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.35 }} className="mt-8 max-w-xl text-lg md:text-xl leading-[1.5]" style={{ color: 'var(--muted)' }}>
      {c.intro[0]}
    </motion.p>
  );
  const cta = (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap items-center gap-5">
      <ThemeButton>Start a project</ThemeButton>
      <a href="#pricing" className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-60 hover:opacity-100 transition-opacity">Pricing ↓</a>
    </motion.div>
  );
  const demo = (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.3 }} className="relative">
      {theme.key === 'product' && <ProductWidgets />}
      {theme.key === 'blueprint' && <span className="absolute -top-6 left-0 font-mono text-[10px] text-[color:var(--accent-2)]">Frame · Live demo</span>}
      <div className={`rounded-[1.75rem] ${theme.dark ? '' : 'bg-[#0b0b12] shadow-[0_40px_100px_rgba(0,0,0,0.25)]'} ${theme.key === 'blueprint' ? 'outline outline-1 outline-dashed outline-offset-8 outline-[color:var(--accent-2)]/50' : ''}`}><Demo /></div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] opacity-40">{label} · interactive demo</p>
    </motion.div>
  );

  const shell = (children: React.ReactNode) => (
    <section className="relative mx-2 md:mx-6 overflow-clip rounded-[2rem] md:rounded-[3rem] border border-[color:var(--border)] pt-12 md:pt-16 pb-16 md:pb-24" style={{ background: theme.key === 'editorial' || theme.key === 'transform' || theme.key === 'blueprint' ? 'var(--page)' : 'var(--stage)' }}>
      <HeroBackdrop theme={theme} />
      <div className="relative z-[1] px-5 md:px-12 max-w-7xl mx-auto">
        <Breadcrumb items={crumbs} tone="theme" />
        {children}
      </div>
    </section>
  );

  if (theme.key === 'editorial') {
    // Brand book: the headline gets the full width, like a cover
    return shell(
      <div className="mt-10 md:mt-14">
        {eyebrow}
        <ThemeTitle theme={theme} text={c.h1} className="mt-6 text-[13vw] md:text-[8vw] lg:text-[7vw] max-w-6xl" />
        <div className="mt-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>{intro}{cta}</div>
          {demo}
        </div>
      </div>,
    );
  }

  if (theme.key === 'terminal') {
    // Terminal: the pitch is written inside a terminal window
    return shell(
      <div className="mt-10 md:mt-14 grid lg:grid-cols-[1fr_1.05fr] gap-12 items-start">
        <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-black/50 backdrop-blur">
          <div className="flex items-center gap-1.5 border-b border-[color:var(--border)] px-4 py-3">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((col) => <span key={col} className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />)}
            <span className="ml-3 font-mono text-[11px] text-[color:var(--muted)]">~/natwic/{slug}</span>
          </div>
          <div className="p-6 md:p-8">
            {eyebrow}
            <ThemeTitle theme={theme} text={c.h1} className="mt-6 text-[10vw] md:text-[5vw] lg:text-[3.6vw]" />
            {intro}
            {cta}
          </div>
        </div>
        {demo}
      </div>,
    );
  }

  return shell(
    <div className="mt-10 md:mt-14 grid lg:grid-cols-[1fr_1.05fr] gap-12 items-start">
      <div>
        {theme.key === 'transform' && <div className="mb-4"><StruckHeadline /></div>}
        {eyebrow}
        <div className={theme.key === 'blueprint' ? 'mt-10' : 'mt-6'}>
          <ThemeTitle theme={theme} text={c.h1} className={titleSize} />
        </div>
        {intro}
        {cta}
      </div>
      {demo}
    </div>,
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

const WorkingTogether: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Stage theme={theme} className="mt-24 md:mt-32 py-16 md:py-24">
      <div className="px-5 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <SectionLabel theme={theme} n={4} text="Working together" onStage />
          <H2 theme={theme} onStage>Remote by default.</H2>
          <ul className="mt-10 border-t border-white/10" onPointerLeave={() => setHover(null)}>
            {TOGETHER.map((t, i) => (
              <li key={t.title} onPointerEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={0} className="relative flex items-start gap-5 border-b border-white/10 py-5 outline-none cursor-default">
                <span className="absolute left-0 top-0 h-full w-px transition-colors" style={{ background: hover === i ? 'var(--accent)' : 'transparent' }} />
                <span className="mt-1 font-mono text-xs transition-colors" style={{ color: hover === i ? 'var(--accent)' : 'rgba(255,255,255,0.35)' }}>{pad2(i + 1)}</span>
                <span>
                  <span className={`block text-xl md:text-2xl font-bold tracking-[-0.03em] transition-transform duration-500 ${hover === i ? 'translate-x-1.5' : ''}`}>{t.title}</span>
                  <span className="mt-1 block text-base text-white/55 leading-relaxed">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <FadeUp><RemoteFeed highlight={hover} /></FadeUp>
      </div>
    </Stage>
  );
};

const ThemedCases: React.FC<{ slugs: string[] }> = ({ slugs }) => {
  const cases = slugs.map(projectBySlug).filter(Boolean) as typeof PROJECTS;
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${cases.length > 2 ? 'lg:grid-cols-3' : ''} gap-6 md:gap-8`}>
      {cases.map((p) => (
        <Link key={p.slug} href={`/work/${p.slug}`} className="group block">
          <TiltCard className="rounded-[2rem] border border-[color:var(--border)]">
            <img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
          </TiltCard>
          <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] transition-colors group-hover:text-[color:var(--accent)]">{p.title}</h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{p.category}</p>
          <p className="mt-3 text-base leading-relaxed opacity-80">{p.summary}</p>
        </Link>
      ))}
    </div>
  );
};

export const ServicePage: React.FC<{ slug: string }> = ({ slug }) => {
  const meta = serviceBySlug(slug) ?? SERVICE_PAGES[0];
  const c = contentFor(meta.slug)!;
  const theme = themeFor(meta.slug);
  const url = serviceUrl(meta.slug);
  const others = SERVICE_PAGES.filter((s) => s.slug !== meta.slug);
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
    <article key={meta.slug} data-theme={theme.key} className="min-h-screen pt-24 md:pt-28 pb-10 overflow-x-clip" style={{ ...theme.vars, background: 'var(--page)', color: 'var(--ink)' } as React.CSSProperties}>
      <JsonLd data={schema} />
      <style>{GRID_CSS}</style>
      <ThemeStyles />

      <Hero theme={theme} slug={meta.slug} />

      {/* Who it's for */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <SectionLabel theme={theme} n={1} text="Who it’s for" />
        <H2 theme={theme}>Made for teams like yours.</H2>
        {c.intro.slice(1).map((p, i) => <p key={i} className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>{p}</p>)}
        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-4">
          {c.forWho.map((b, i) => (
            <FadeUp key={b.title} delay={(i % 2) * 0.08}>
              <div className="svc-glow-border h-full rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-7 md:p-9 transition-transform duration-500 hover:-translate-y-1">
                <CardTop theme={theme} i={i} title={b.title} />
                <h3 className={`mt-6 text-2xl md:text-3xl tracking-[-0.03em] ${theme.key === 'editorial' ? '[font-family:Georgia,serif]' : 'font-bold'}`}>{b.title}</h3>
                <p className="mt-3 text-base md:text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{b.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* What's included */}
      <Stage theme={theme} className="mt-24 md:mt-32 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionLabel theme={theme} n={2} text="What’s included" onStage />
          <H2 theme={theme} onStage>Everything, start to finish.</H2>
          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.included.map((b, i) => (
              <FadeUp key={b.title} delay={(i % 3) * 0.06}>
                <TiltCard className="svc-glow-border h-full rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className={`grid place-items-center w-10 h-10 rounded-xl font-mono text-xs ${theme.key === 'editorial' ? '[font-family:Georgia,serif] italic text-base' : ''}`} style={{ background: 'color-mix(in srgb, var(--accent) 22%, transparent)', color: 'var(--accent)', boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent)' }}>{theme.key === 'editorial' ? ['i', 'ii', 'iii', 'iv', 'v', 'vi'][i] : pad2(i + 1)}</span>
                    <span aria-hidden className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
                  </div>
                  <h3 className={`mt-8 text-xl md:text-2xl tracking-[-0.03em] ${theme.key === 'editorial' ? '[font-family:Georgia,serif]' : 'font-bold'}`}>{b.title}</h3>
                  <p className="mt-2 text-base text-white/60 leading-relaxed">{b.text}</p>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </Stage>

      {/* Process */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <SectionLabel theme={theme} n={3} text="Process" />
        <H2 theme={theme}>Four steps. No surprises.</H2>
        <ProcessView theme={theme} steps={c.process} />
      </section>

      <WorkingTogether theme={theme} />

      {/* Pricing */}
      <section id="pricing" className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32 scroll-mt-28">
        <FadeUp>
          <div className="svc-glow-border relative overflow-hidden rounded-[2.5rem] p-8 md:p-14" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/15 blur-3xl" />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">{theme.label(5, 'Pricing')}</p>
            <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
              <div>
                <p className={`text-3xl md:text-5xl leading-[1.05] ${theme.display}`}>Contact us for pricing.</p>
                <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed opacity-80">{c.pricing}</p>
              </div>
              <div className="lg:justify-self-end">
                <Magnetic strength={0.3}>
                  <Link href="/contact" className="group inline-flex items-center gap-4 rounded-full bg-white text-black pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em]">
                    Get a quote
                    <span className="w-11 h-11 rounded-full bg-black text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Related work */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel theme={theme} n={6} text="Related work" />
            <H2 theme={theme}>Proof, not promises.</H2>
          </div>
          <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-60 hover:opacity-100 transition-opacity shrink-0">All projects →</Link>
        </div>
        <div className="mt-10 md:mt-14"><ThemedCases slugs={c.cases} /></div>
      </section>

      {/* FAQ: answers stay in the HTML for crawlers and rich results */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32 grid lg:grid-cols-[0.8fr_1.6fr] gap-10 lg:gap-16">
        <div>
          <SectionLabel theme={theme} n={7} text="FAQ" />
          <H2 theme={theme}>Common questions.</H2>
        </div>
        <div className="space-y-3">
          {c.faqs.map((f, i) => (
            <details key={f.q} className="group svc-glow-border rounded-2xl border border-[color:var(--border)] bg-[var(--card)] px-6 py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{theme.key === 'terminal' ? `q${i + 1}` : pad2(i + 1)}</span>
                  <h3 className={`text-lg md:text-xl tracking-[-0.02em] leading-snug ${theme.key === 'editorial' ? '[font-family:Georgia,serif]' : 'font-semibold'}`}>{f.q}</h3>
                </span>
                <span aria-hidden className="mt-0.5 w-8 h-8 shrink-0 rounded-full border border-[color:var(--border)] grid place-items-center transition-transform duration-500 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 pl-9 max-w-3xl text-base md:text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other services, each previewing its own theme */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <SectionLabel theme={theme} n={8} text="Other services" />
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((s) => {
            const t = themeFor(s.slug);
            return (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)} className="group flex h-full flex-col justify-between gap-6 rounded-[1.75rem] border p-6 transition-transform duration-500 hover:-translate-y-1" style={{ ...t.vars, background: 'var(--page)', color: 'var(--ink)', borderColor: 'var(--border)' } as React.CSSProperties}>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />{t.name}</span>
                  <span className="flex items-end justify-between gap-4">
                    <span className={`text-xl leading-tight tracking-[-0.03em] ${t.display}`}>{s.name}</span>
                    <span className="w-9 h-9 shrink-0 rounded-full grid place-items-center transition-transform duration-500 group-hover:-rotate-45" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <ClosingCta headline="Ready to get started? Tell us about it." line="We design and build websites and brands for startups, SaaS teams and small businesses worldwide." send={send} message={`We’re interested in ${meta.name.toLowerCase()}. Here’s what we’re building:`} />
      <div className="h-10" />
    </article>
  );
};
