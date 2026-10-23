import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PROJECTS, pad } from './projects';
import { Magnetic } from '../Magnetic';
import { Link } from '../nav';
import { SERVICE_FOR_CASE, serviceBySlug, servicePath } from '../services/services';

const ease = [0.16, 1, 0.3, 1] as const;

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
    <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.span>
  </span>
);

/* ------------------------------------------------------------------ */
/* /work: the index                                                     */
/* ------------------------------------------------------------------ */

export const WorkIndex: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  // Preview that trails the cursor, tilting with its speed
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const vel = useMotionValue(0);
  const rotate = useSpring(useTransform(vel, [-1500, 1500], [-10, 10]), { stiffness: 180, damping: 20 });
  const last = useRef({ x: 0, t: 0 });

  const onMove = (e: React.PointerEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
    const now = performance.now();
    const dt = Math.max(16, now - last.current.t);
    vel.set(((e.clientX - last.current.x) / dt) * 1000);
    last.current = { x: e.clientX, t: now };
  };

  return (
    <div className="bg-white min-h-screen pt-28 md:pt-36 pb-24 md:pb-32">
      <section className="px-5 md:px-12 max-w-7xl mx-auto">
        <h1>
          <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500"><span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />Web design &amp; branding case studies</span>
          <span className="sr-only">: </span>
          <span className="mt-6 flex items-start gap-3 md:gap-5 text-[22vw] md:text-[13vw] font-bold leading-[0.82] tracking-[-0.06em] text-black">
            <Reveal>Work</Reveal>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="mt-8 md:mt-10 max-w-xl text-lg md:text-xl text-zinc-600 leading-relaxed"
        >
          Websites and products we’ve designed and built for startups, SaaS teams and small businesses around the world.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.4 }}
          className="mt-5 max-w-xl text-base md:text-lg text-zinc-500 leading-relaxed"
        >
          Each case study covers the problem, how we approached it and what we shipped, from an AI chief of staff for founders and a verified business directory to sites for a growth agency, a remote staffing company and a London lettings agency. Every project was run remotely, across time zones.
        </motion.p>
      </section>

      {/* The list */}
      <section className="mt-16 md:mt-24 px-5 md:px-12 max-w-7xl mx-auto" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        <ul>
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.9, ease, delay: i * 0.06 }}
              className="border-t border-zinc-200 last:border-b"
            >
              <Link
                href={`/work/${p.slug}`}
                onPointerEnter={() => setHovered(i)}
                className={`group w-full text-left py-6 md:py-9 grid grid-cols-[auto_1fr_auto] md:grid-cols-[4rem_1fr_14rem_10rem] items-center gap-4 md:gap-6 transition-opacity duration-500 ${hovered !== null && hovered !== i ? 'md:opacity-30' : ''}`}
              >
                <span className="font-mono text-xs text-zinc-400">{pad(i + 1)}</span>
                <span className="min-w-0">
                  <span className="block text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-none text-black transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-4 md:group-hover:text-[#703FEC]">
                    {p.title}
                  </span>
                  <span className="mt-2 md:mt-3 block text-sm md:text-base text-zinc-500 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-4">{p.industry}: {p.services.join(', ')}</span>
                </span>
                <span className="hidden md:block text-sm text-zinc-500">{p.category}</span>
                <span className="flex items-center justify-end gap-3 text-sm text-zinc-500">
                  <span className="hidden md:inline">{p.domain}</span>
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-zinc-200 grid place-items-center text-black transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
                </span>
              </Link>
              {/* Phones get the cover inline */}
              <Link href={`/work/${p.slug}`} tabIndex={-1} aria-hidden className="md:hidden block w-full pb-6">
                <img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover object-top rounded-2xl" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Cursor preview */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        style={{ x, y, rotate }}
      >
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, scale: 0.8, clipPath: 'inset(50% 50% 50% 50% round 1.5rem)' }}
              animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 1.5rem)' }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, ease }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[380px] aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <img src={PROJECTS[hovered].image} alt="" width={PROJECTS[hovered].imageSize[0]} height={PROJECTS[hovered].imageSize[1]} className="w-full h-full object-cover object-top" />
              <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">{PROJECTS[hovered].category}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <section className="mt-24 md:mt-32 px-5 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] max-w-2xl">
          Your project could be <span className="italic text-[#703FEC]">next.</span>
        </h2>
        <Magnetic strength={0.3}>
          <Link href="/contact" className="group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
            Start a project
            <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
          </Link>
        </Magnetic>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* /work/<slug>: a case study                                          */
/* ------------------------------------------------------------------ */

/** Link from a case study to the service page behind it */
export const ServiceLink: React.FC<{ slug: string }> = ({ slug }) => {
  const service = serviceBySlug(SERVICE_FOR_CASE[slug] ?? 'web-design')!;
  return (
    <section className="px-5 md:px-12 max-w-7xl mx-auto mt-16 md:mt-24">
      <Link href={servicePath(service.slug)} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[2rem] border border-zinc-200 px-7 md:px-10 py-7 md:py-8 hover:border-black transition-colors">
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Service</span>
          <span className="mt-2 block text-2xl md:text-3xl font-bold tracking-[-0.03em]">{service.name}</span>
        </span>
        <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-black">
          How we work on projects like this
          <span className="w-10 h-10 rounded-full bg-black text-white grid place-items-center transition-[transform,background-color] duration-500 group-hover:-rotate-45 group-hover:bg-[#703FEC]">→</span>
        </span>
      </Link>
    </section>
  );
};

/** Two more case studies after the next one, so every case study links to three others */
export const MoreWork: React.FC<{ slug: string }> = ({ slug }) => {
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const more = [2, 3].map((k) => PROJECTS[(index + k) % PROJECTS.length]);
  return (
    <section className="px-5 md:px-12 max-w-7xl mx-auto mt-24 md:mt-36">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02]">More work</h2>
        <Link href="/work" className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-black transition-colors">All projects →</Link>
      </div>
      <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {more.map((p, i) => (
          <motion.div key={p.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: i * 0.08 }}>
            <Link href={`/work/${p.slug}`} className="group block">
              <div className="overflow-hidden rounded-[2rem] bg-zinc-100">
                <img src={p.image} alt={p.imageAlt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em] group-hover:text-[#703FEC] transition-colors">{p.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{p.category}</p>
                </div>
                <span className="w-11 h-11 shrink-0 rounded-full border border-zinc-200 grid place-items-center text-black transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const NextProject: React.FC<{ slug: string }> = ({ slug }) => {
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const [nextHover, setNextHover] = useState(false);
  useEffect(() => { setNextHover(false); }, [slug]);
  return (
    <section className="mt-24 md:mt-36 border-t border-zinc-200">
      <Link
        href={`/work/${next.slug}`}
        onPointerEnter={() => setNextHover(true)}
        onPointerLeave={() => setNextHover(false)}
        className="group relative block w-full overflow-hidden px-5 md:px-12 py-16 md:py-24 text-left"
      >
        <motion.div aria-hidden className="absolute inset-0 bg-[#0A0A0A] origin-bottom" initial={false} animate={{ scaleY: nextHover ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
        <div className="relative max-w-7xl mx-auto flex items-end justify-between gap-6">
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-[0.4em] transition-colors duration-500 ${nextHover ? 'text-white/50' : 'text-zinc-500'}`}>Next project</p>
            <p className={`mt-4 text-[15vw] md:text-[9vw] font-bold leading-[0.85] tracking-[-0.06em] transition-colors duration-500 ${nextHover ? 'text-white' : 'text-black'}`}>{next.title}</p>
          </div>
          <motion.img
            src={next.image}
            alt=""
            loading="lazy"
            width={next.imageSize[0]}
            height={next.imageSize[1]}
            initial={false}
            animate={{ opacity: nextHover ? 1 : 0, y: nextHover ? 0 : 30, rotate: nextHover ? -3 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="hidden md:block w-[340px] aspect-[4/3] object-cover object-top rounded-2xl shadow-2xl"
          />
        </div>
      </Link>
    </section>
  );
};
