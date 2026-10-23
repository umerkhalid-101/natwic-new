/** Shared pieces for the services hub and the service pages. */

import React from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from '../Magnetic';
import { Link } from '../nav';
import { useTilt, Spotlight } from '../interactions';
import { PROJECTS, projectBySlug } from '../work/projects';
import { BASE_URL } from '../../seo';
import { TiltCard, ease } from '../work/rich/blocks';

export const TOGETHER = [
  { title: 'One shared space', text: 'Plans, designs and staging links in one place, so you can check in any time.' },
  { title: 'Calls in your hours', text: 'A short weekly call at a time that suits your time zone.' },
  { title: 'Updates in writing', text: 'Progress shared between calls, so nothing waits on a meeting.' },
];

export const JsonLd: React.FC<{ data: object }> = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

/* ------------------------------------------------------------------ */
/* Futuristic building blocks                                           */
/* ------------------------------------------------------------------ */

// Inject with dangerouslySetInnerHTML: as a text child, React's server render escapes the quotes
// and brackets, the browser keeps them literal inside <style>, and hydration fails on the mismatch.
export const GRID_CSS = `
@keyframes svc-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
.svc-scan { animation: svc-scan 7s linear infinite; }
.svc-glow-border { position: relative; isolation: isolate; }
.svc-glow-border::before { content: ''; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; z-index: -1;
  background: conic-gradient(from var(--a, 0deg), transparent 0 70%, var(--accent, #703FEC) 80%, var(--accent-2, #b9a1ff) 88%, transparent 96%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; }
.svc-glow-border:hover::before { opacity: 1; animation: svc-border 2.4s linear infinite; }
@property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes svc-border { to { --a: 360deg; } }
@media (prefers-reduced-motion: reduce) { .svc-scan, .svc-glow-border:hover::before { animation: none; } }
`;

/** Dark stage with a grid, a scanning light and a glow that follows the cursor */
export const GridStage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const t = useTilt(0);
  return (
    <section {...t.handlers} className={`relative mx-2 md:mx-6 overflow-clip rounded-[2rem] md:rounded-[3rem] bg-[#06060b] text-white ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: GRID_CSS }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_40%,transparent_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(112,63,236,0.55),transparent_60%)]" />
      <div aria-hidden className="svc-scan pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-[#703FEC]/10 to-transparent" />
      <Spotlight x={t.px} y={t.py} size={600} color="rgba(112,63,236,0.22)" />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light' }> = ({ children, tone = 'light' }) => (
  <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] ${tone === 'light' ? 'border-white/15 bg-white/[0.04] text-white/60' : 'border-zinc-200 bg-white text-zinc-500'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.9)]" />
    {children}
  </p>
);

export const H2: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light'; className?: string }> = ({ children, tone = 'dark', className = '' }) => (
  <h2 className={`mt-5 text-[11vw] md:text-6xl lg:text-7xl font-bold tracking-[-0.055em] leading-[0.95] ${tone === 'light' ? 'text-white' : 'text-black'} ${className}`}>{children}</h2>
);

export type Crumb = { name: string; href: string };

export const Breadcrumb: React.FC<{ items: Crumb[]; tone?: 'light' | 'theme' }> = ({ items, tone = 'light' }) => {
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
            {i > 0 && <li aria-hidden className={tone === 'light' ? 'text-white/25' : 'opacity-30'}>/</li>}
            {i < items.length - 1
              ? <li><Link href={c.href} className={tone === 'light' ? 'text-white/50 hover:text-white transition-colors' : 'text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors'}>{c.name}</Link></li>
              : <li aria-current="page" className={tone === 'light' ? 'text-white' : 'text-[color:var(--ink)]'}>{c.name}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export const PrimaryButton: React.FC<{ href?: string; children: React.ReactNode }> = ({ href = '/contact', children }) => (
  <Magnetic strength={0.3}>
    <Link href={href} className="group inline-flex items-center gap-4 rounded-full bg-white text-black pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] hover:text-white transition-colors">
      {children}
      <span className="w-11 h-11 rounded-full bg-[#703FEC] text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
    </Link>
  </Magnetic>
);

/** Headline whose words rise into place */
export const RiseTitle: React.FC<{ text: string; className: string }> = ({ text, className }) => (
  <h1 className={className}>
    {text.split(' ').map((w, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.05 * i }}>{w}&nbsp;</motion.span>
      </span>
    ))}
  </h1>
);

export const CaseCards: React.FC<{ slugs: string[] }> = ({ slugs }) => {
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
