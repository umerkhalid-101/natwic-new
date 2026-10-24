import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '../nav';
import { sendBrief } from '../Pricing';
import { PROJECTS } from '../work/projects';
import { BASE_URL, serviceUrl } from '../../seo';
import { FadeUp, TiltCard, ClosingCta, pad2, ease } from '../work/rich/blocks';
import { SERVICE_PAGES, SERVICES_HUB, servicePath } from './services';
import { HUB_CONTENT } from './content';
import { DEMOS, Constellation } from './demos';
import { JsonLd, GridStage, Eyebrow, H2, Breadcrumb, PrimaryButton, RiseTitle, CaseCards } from './ui';

export { ServicePage } from './ServicePage';

const sendFromServices = sendBrief('Services');

/* ------------------------------------------------------------------ */
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
            <div className="mt-10 md:mt-14"><Eyebrow>Services · {pad2(SERVICE_PAGES.length)}</Eyebrow></div>
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

