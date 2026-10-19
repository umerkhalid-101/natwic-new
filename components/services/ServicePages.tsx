import React from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from '../Magnetic';
import { Link } from '../nav';
import { PROJECTS, pad, projectBySlug } from '../work/projects';
import { BASE_URL, serviceUrl } from '../../seo';
import { SERVICE_PAGES, SERVICES_HUB, serviceBySlug, servicePath } from './services';
import { HUB_CONTENT, contentFor } from './content';

const ease = [0.16, 1, 0.3, 1] as const;

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    {children}
  </p>
);

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.span>
  </span>
);

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-5%' }} transition={{ duration: 0.9, ease, delay }} className={className}>
    {children}
  </motion.div>
);

const JsonLd: React.FC<{ data: object }> = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

type Crumb = { name: string; href: string };

const Breadcrumb: React.FC<{ items: Crumb[] }> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${BASE_URL}${c.href === '/' ? '/' : c.href}` })),
  };
  const link = 'text-zinc-500 hover:text-black transition-colors';
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={schema} />
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        {items.map((c, i) => (
          <React.Fragment key={c.href}>
            {i > 0 && <li aria-hidden className="text-zinc-300">/</li>}
            {i < items.length - 1
              ? <li><Link href={c.href} className={link}>{c.name}</Link></li>
              : <li aria-current="page" className="text-black">{c.name}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

const StartButton: React.FC<{ label?: string }> = ({ label = 'Start a project' }) => (
  <Magnetic strength={0.3}>
    <Link href="/contact" className="group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
      {label}
      <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
    </Link>
  </Magnetic>
);

/** A titled row: label column on the left, content on the right, like the case study story */
const Row: React.FC<{ n: string; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <FadeUp className="grid md:grid-cols-[14rem_1fr] gap-6 md:gap-16 py-12 md:py-16 border-t border-zinc-200">
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-[#703FEC]">{n}</span>
      <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">{title}</h2>
    </div>
    <div className="min-w-0">{children}</div>
  </FadeUp>
);

const CaseCards: React.FC<{ slugs: string[] }> = ({ slugs }) => {
  const cases = slugs.map(projectBySlug).filter(Boolean) as typeof PROJECTS;
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${cases.length > 2 ? 'lg:grid-cols-3' : ''} gap-6 md:gap-8`}>
      {cases.map((p) => (
        <Link key={p.slug} href={`/work/${p.slug}`} className="group block">
          <div className="overflow-hidden rounded-[2rem] bg-zinc-100">
            <img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
          </div>
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
  <div className="divide-y divide-zinc-200 border-y border-zinc-200">
    {faqs.map((f) => (
      <details key={f.q} className="group py-6">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
          <h3 className="text-lg md:text-2xl font-semibold tracking-[-0.02em] leading-snug">{f.q}</h3>
          <span aria-hidden className="mt-0.5 w-8 h-8 shrink-0 rounded-full border border-zinc-200 grid place-items-center text-black transition-transform duration-500 group-open:rotate-45">+</span>
        </summary>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-zinc-600 leading-relaxed">{f.a}</p>
      </details>
    ))}
  </div>
);

const ClosingCta: React.FC<{ line: React.ReactNode }> = ({ line }) => (
  <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
    <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] max-w-2xl">{line}</h2>
    <StartButton />
  </section>
);

/* ------------------------------------------------------------------ */
/* /services: the hub                                                  */
/* ------------------------------------------------------------------ */

export const ServicesIndex: React.FC = () => {
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

  return (
    <div className="bg-white min-h-screen pt-28 md:pt-36 pb-24 md:pb-32">
      <JsonLd data={schema} />
      <header className="px-5 md:px-12 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]} />
        <Label className="mt-10 md:mt-14">Services</Label>
        <h1 className="mt-6 text-[13vw] md:text-[8vw] font-bold leading-[0.88] tracking-[-0.06em] text-black max-w-6xl">
          <Reveal>{HUB_CONTENT.h1}</Reveal>
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.3 }} className="mt-8 md:mt-10 max-w-2xl text-lg md:text-xl text-zinc-600 leading-relaxed">
          {HUB_CONTENT.intro}
        </motion.p>
      </header>

      <section className="mt-16 md:mt-24 px-5 md:px-12 max-w-7xl mx-auto">
        <h2 className="sr-only">All services</h2>
        <ul>
          {SERVICE_PAGES.map((s, i) => (
            <motion.li key={s.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-5%' }} transition={{ duration: 0.9, ease, delay: i * 0.05 }} className="border-t border-zinc-200 last:border-b">
              <Link href={servicePath(s.slug)} className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[4rem_1fr_1fr_auto] items-center gap-4 md:gap-8 py-8 md:py-10">
                <span className="font-mono text-xs text-zinc-400">{pad(i + 1)}</span>
                <h3 className="text-3xl md:text-5xl font-bold tracking-[-0.045em] leading-none text-black transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-4 md:group-hover:text-[#703FEC]">{s.name}</h3>
                <p className="hidden md:block text-base text-zinc-500 leading-relaxed">{s.teaser}</p>
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-zinc-200 grid place-items-center text-black transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
                <p className="md:hidden col-span-3 -mt-1 text-base text-zinc-500 leading-relaxed">{s.teaser}</p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Label>How we work</Label>
        <h2 className="mt-5 text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] max-w-3xl">
          One team, <span className="italic text-[#703FEC]">any time zone.</span>
        </h2>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {HUB_CONTENT.remote.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.08} className={`rounded-[2rem] p-8 md:p-10 min-h-[220px] flex flex-col justify-between ${['bg-zinc-100 text-black', 'bg-[#0A0A0A] text-white', 'bg-[#703FEC] text-white'][i % 3]}`}>
              <span className="font-mono text-xs opacity-60">{pad(i + 1)}</span>
              <div>
                <h3 className="mt-8 text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight">{b.title}</h3>
                <p className="mt-3 text-base leading-relaxed opacity-75">{b.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02]">Selected work</h2>
          <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-black transition-colors">All projects →</Link>
        </div>
        <div className="mt-10 md:mt-14">
          <CaseCards slugs={PROJECTS.slice(0, 3).map((p) => p.slug)} />
        </div>
      </section>

      <ClosingCta line={<>Not sure which one you need? <span className="italic text-[#703FEC]">Ask us.</span></>} />
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
  const others = SERVICE_PAGES.filter((s) => s.slug !== meta.slug);

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
    <article key={meta.slug} className="bg-white min-h-screen pt-28 md:pt-36 pb-24 md:pb-32">
      <JsonLd data={schema} />
      <header className="px-5 md:px-12 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: meta.name, href: servicePath(meta.slug) }]} />
        <Label className="mt-10 md:mt-14">Service</Label>
        <h1 className="mt-6 text-[12vw] md:text-[7vw] font-bold leading-[0.9] tracking-[-0.055em] text-black max-w-6xl">
          <Reveal>{c.h1}</Reveal>
        </h1>
        <div className="mt-8 md:mt-12 grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-16 items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.25 }} className="space-y-5">
            {c.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-2xl md:text-3xl font-medium tracking-[-0.03em] leading-[1.25] text-zinc-800' : 'text-lg md:text-xl text-zinc-600 leading-relaxed'}>{p}</p>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.35 }} className="md:justify-self-end">
            <StartButton />
          </motion.div>
        </div>
      </header>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-20 md:mt-28">
        <Row n="01" title="Who it’s for">
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {c.forWho.map((b) => (
              <div key={b.title}>
                <h3 className="text-xl md:text-2xl font-bold tracking-[-0.03em]">{b.title}</h3>
                <p className="mt-2 text-base md:text-lg text-zinc-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </Row>

        <Row n="02" title="What’s included">
          <div className="grid sm:grid-cols-2 gap-4">
            {c.included.map((b, i) => (
              <div key={b.title} className="rounded-[1.5rem] bg-zinc-100 p-6 md:p-8">
                <span className="font-mono text-xs text-[#703FEC]">{pad(i + 1)}</span>
                <h3 className="mt-4 text-xl font-bold tracking-[-0.03em]">{b.title}</h3>
                <p className="mt-2 text-base text-zinc-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </Row>

        <Row n="03" title="Process">
          <ol className="grid gap-8">
            {c.process.map((b, i) => (
              <li key={b.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="w-10 h-10 rounded-full bg-black text-white grid place-items-center text-sm font-bold">{i + 1}</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-[-0.03em]">{b.title}</h3>
                  <p className="mt-2 text-base md:text-lg text-zinc-600 leading-relaxed">{b.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Row>

        <Row n="04" title="Working together">
          <div className="max-w-3xl space-y-5">
            {c.together.map((p, i) => <p key={i} className="text-lg md:text-xl text-zinc-700 leading-relaxed">{p}</p>)}
          </div>
        </Row>

        <Row n="05" title="Pricing">
          <div className="rounded-[2rem] bg-[#0A0A0A] text-white p-8 md:p-12">
            {c.pricing.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-xl md:text-3xl font-medium tracking-[-0.02em] leading-[1.35]' : 'mt-5 text-base md:text-lg text-white/60 leading-relaxed'}>{p}</p>
            ))}
            <div className="mt-8">
              <Link href="/contact" className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b9a1ff] hover:text-white transition-colors">Contact us for pricing →</Link>
            </div>
          </div>
        </Row>
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-16 md:mt-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02]">Related work</h2>
          <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-black transition-colors">All projects →</Link>
        </div>
        <div className="mt-10 md:mt-14">
          <CaseCards slugs={c.cases} />
        </div>
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32 grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
        <div>
          <Label>FAQ</Label>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-[-0.045em] leading-[1.02]">Common questions</h2>
        </div>
        <Faqs faqs={c.faqs} />
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-32">
        <Label>Other services</Label>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((s) => (
            <li key={s.slug}>
              <Link href={servicePath(s.slug)} className="group flex h-full items-center justify-between gap-4 rounded-[2rem] border border-zinc-200 px-7 py-6 hover:border-black transition-colors">
                <span className="text-lg md:text-xl font-bold tracking-[-0.03em] leading-tight">{s.name}</span>
                <span className="w-9 h-9 shrink-0 rounded-full bg-black text-white grid place-items-center transition-[transform,background-color] duration-500 group-hover:-rotate-45 group-hover:bg-[#703FEC]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ClosingCta line={<>Ready to get started? <span className="italic text-[#703FEC]">Tell us about it.</span></>} />
    </article>
  );
};
