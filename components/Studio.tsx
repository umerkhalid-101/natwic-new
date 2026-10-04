import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useMotionTemplate, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { Magnetic } from './Magnetic';
import { BASE_URL } from '../seo';
import { DaylightMap } from './studio/DaylightMap';
import { Values } from './studio/Values';

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

const Portrait: React.FC<{ m: typeof TEAM[number]; index: number; active: boolean; onEnter: () => void; onTalk: () => void }> = ({ m, index, active, onEnter, onTalk }) => {
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
              <button
                onClick={(e) => { e.stopPropagation(); onTalk(); }}
                className="group mt-5 inline-flex items-center gap-3 rounded-full bg-white text-black pl-5 pr-1.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#703FEC] hover:text-white transition-colors"
              >
                Talk to {m.first}
                <span className="w-8 h-8 rounded-full bg-[#703FEC] text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Team: React.FC<{ onTalk: () => void }> = ({ onTalk }) => {
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
          <Portrait key={m.name} m={m} index={i} active={active === i} onEnter={() => setActive(i)} onTalk={onTalk} />
        ))}
      </div>

      {/* Phones: swipe through */}
      <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-3 px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TEAM.map((m, i) => (
          <div key={m.name} className="snap-center shrink-0 w-[78vw] h-[460px] flex">
            <Portrait m={m} index={i} active onEnter={() => undefined} onTalk={onTalk} />
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

export const Studio: React.FC<{ setView?: (view: 'home' | 'contact' | 'studio' | 'work') => void }> = ({ setView }) => {

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
                Natwic is a web design and branding studio based in Dubai. We work with startups, SaaS teams and small businesses around the world, and we design and build everything ourselves.
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

      <Team onTalk={() => setView?.('contact')} />

      <div className="h-20 md:h-32" />
      <DaylightMap />

      <Process />

      <Values />
    </div>
  );
};
