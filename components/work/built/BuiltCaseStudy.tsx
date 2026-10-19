/** Case study template for sites we designed and built from scratch (no before and after). */

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BASE_URL, caseUrl } from '../../../seo';
import { sendBrief } from '../../Pricing';
import { projectBySlug, creativeWorkSchema } from '../projects';
import { MoreWork, NextProject, ServiceLink } from '../WorkPages';
import {
  pad2, FadeUp, SectionHead, DarkBand, TiltCard, CaseHeader, HeroStage, HeadlineMarquee, HomepageStory, PagesGallery, ClosingCta,
} from '../rich/blocks';
import { BuiltCase, builtCaseBySlug } from './cases';

/** The whole homepage, scrolling inside a browser frame as the section passes */
const FullPageScroll: React.FC<{ c: BuiltCase; domain: string }> = ({ c, domain }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // The frame is 16:10, so it shows 0.625 of the width in height; slide the rest of the page through it
  const travel = (1 - (0.625 * c.full.width) / c.full.height) * 100;
  const y = useTransform(scrollYProgress, [0.2, 0.85], ['0%', `-${travel}%`]);
  return (
    <div ref={ref}>
      <figure className="overflow-hidden rounded-xl md:rounded-2xl bg-white border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border-b border-black/[0.06] bg-zinc-50">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((col) => <span key={col} className="w-2 h-2 rounded-full" style={{ background: col }} />)}
          <span className="ml-3 rounded-full bg-black/[0.05] px-3 py-1 text-[9px] md:text-[11px] text-black/50">{domain}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={c.full.image}
            alt={c.full.alt}
            width={c.full.width}
            height={c.full.height}
            loading="lazy"
            decoding="async"
            style={reduce ? undefined : { y }}
            className="absolute inset-x-0 top-0 block w-full h-auto will-change-transform"
          />
        </div>
      </figure>
    </div>
  );
};

export const BuiltCaseStudy: React.FC<{ slug: string }> = ({ slug }) => {
  const c = builtCaseBySlug(slug)!;
  const project = projectBySlug(slug)!;
  const send = sendBrief(`${project.title} case study`);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      { '@type': 'ListItem', position: 3, name: project.title, item: caseUrl(slug) },
    ],
  };

  return (
    <article key={slug} className="bg-white min-h-screen pt-28 md:pt-36 overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, creativeWorkSchema(project, BASE_URL)]) }} />

      <CaseHeader name={project.title} eyebrow={c.eyebrow} title={c.title} accent={c.accent} subtitle={c.subtitle} liveUrl={project.url} meta={c.meta} />
      <HeroStage media={c.hero} domain={project.domain} sides={c.sides} chips={c.chips} />
      <HeadlineMarquee headlines={c.headlines} label={`Headlines from the ${project.title} site`} />

      {/* The brief */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-20 md:mt-32">
        <SectionHead eyebrow="The brief" title={c.brief.title}>
          <p>{c.brief.text}</p>
        </SectionHead>
      </section>

      {/* Built from scratch: the whole homepage, plus what we made */}
      <DarkBand className="mt-20 md:mt-28 py-20 md:py-28">
        <div className="px-5 md:px-12 max-w-7xl mx-auto">
          <SectionHead eyebrow="Built from scratch" title="From a blank page to a live site." tone="light">
            <p>No old site to fix, no template to bend. We designed every page and built it from the ground up. Scroll to see the whole homepage.</p>
          </SectionHead>
          <div className="mt-12 md:mt-16 grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
            <FadeUp className="lg:sticky lg:top-28"><FullPageScroll c={c} domain={project.domain} /></FadeUp>
            <ol className="grid gap-4">
              {c.built.map((b, i) => (
                <li key={b.title}>
                  <FadeUp delay={i * 0.08} className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7">
                    <span className="font-mono text-xs text-[#b9a1ff]">{pad2(i + 1)}</span>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{b.title}</h3>
                    <p className="mt-2 text-base text-white/60 leading-relaxed">{b.text}</p>
                  </FadeUp>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DarkBand>

      {/* How we built it */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
        <SectionHead eyebrow="Our approach" title={c.approach.title}>
          <p>{c.approach.text}</p>
        </SectionHead>
        <FadeUp delay={0.1}>
          <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">Key decisions</h3>
          <ol className="mt-4">
            {c.approach.decisions.map((d, i) => (
              <li key={d} className="group flex items-baseline gap-5 border-t border-zinc-200 last:border-b py-5">
                <span className="font-mono text-xs text-[#703FEC]">{pad2(i + 1)}</span>
                <span className="text-lg md:text-2xl font-semibold tracking-[-0.02em] leading-snug transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">{d}</span>
              </li>
            ))}
          </ol>
        </FadeUp>
      </section>

      <HomepageStory beats={c.story.beats} domain={project.domain} eyebrow="The homepage" title={c.story.title} intro={c.story.intro} />

      <PagesGallery pages={c.pages.items} client={project.title} eyebrow="The full site" title={c.pages.title} />

      {/* Results */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-28 md:mt-40">
        <SectionHead eyebrow="Results" title={c.results.title}>
          <p>{c.results.text}</p>
        </SectionHead>
        <FadeUp className="mt-10">
          <TiltCard className="rounded-[2rem] bg-[#703FEC] text-white p-8 md:p-12" light="rgba(255,255,255,0.25)">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">By the numbers</span>
            <dl className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {c.results.stats.map((st) => (
                <div key={st.label}>
                  <dt className="sr-only">{st.label}</dt>
                  <dd>
                    <span className="block text-5xl md:text-7xl font-bold tracking-[-0.05em] leading-none">{st.value}<span className="ml-1.5 text-lg md:text-xl font-semibold tracking-normal text-white/70">{st.unit}</span></span>
                    <span className="mt-3 block text-sm text-white/75 leading-snug" aria-hidden>{st.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </TiltCard>
        </FadeUp>
      </section>

      <ClosingCta headline={c.closing.headline} line={c.closing.line} send={send} message={c.closing.message} />

      <ServiceLink slug={slug} />

      <MoreWork slug={slug} />
      <NextProject slug={slug} />
      <div className="h-16 md:h-24" />
    </article>
  );
};
