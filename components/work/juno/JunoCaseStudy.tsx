import React, { useRef, useState, useEffect } from 'react';
import { BASE_URL, caseUrl } from '../../../seo';
import { sendBrief } from '../../Pricing';
import { projectBySlug, creativeWorkSchema } from '../projects';
import { MoreWork, NextProject, ServiceLink } from '../WorkPages';
import {
  pad2, FadeUp, SectionHead, Placeholder, Still, DarkBand, Counter, TiltCard, CaseHeader, HeroStage, HeadlineMarquee,
  HomepageStory, PagesGallery, ClosingCta,
} from '../rich/blocks';
import {
  HERO, HERO_SIDES, TASKS, HEADLINES, SHIFT, CHALLENGE, GOALS, APPROACH, STORY_INTRO, BEATS, CAPABILITY_STILLS, PAGES, DETAILS,
  DESIGN_SYSTEM, RESULTS, CLOSING,
} from './juno';

const project = projectBySlug('juno')!;
const sendFromJuno = sendBrief('Juno case study');

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

  return (
    <article className="bg-white min-h-screen pt-28 md:pt-36 overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, creativeWorkSchema(project, BASE_URL)]) }} />

      {/* 1. Hero */}
      <CaseHeader name="Juno" eyebrow={HERO.eyebrow} title={HERO.title} accent="Juno:" subtitle={HERO.subtitle} liveUrl={project.url} meta={HERO.meta} />

      <HeroStage media={HERO.media} domain={project.domain} sides={[HERO_SIDES.left, HERO_SIDES.right]} chips={TASKS} />
      <HeadlineMarquee headlines={HEADLINES} label="Headlines from the new Juno site" />

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
      <HomepageStory beats={BEATS} domain={project.domain} eyebrow="The homepage" title="A story, not a feature list." intro={STORY_INTRO}>
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
      </HomepageStory>

      {/* 6. Nine pages, one system */}
      <PagesGallery pages={PAGES} client="Juno" eyebrow="The full site" title="Nine pages. One system." />

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
      <ClosingCta headline={CLOSING.headline} line={CLOSING.line} send={sendFromJuno} message="We saw the Juno case study. Our product is hard to explain too." />

      {/* 11. More work and the next project */}
      <ServiceLink slug="juno" />
      <MoreWork slug="juno" />
      <NextProject slug="juno" />
      <div className="h-16 md:h-24" />
    </article>
  );
};
