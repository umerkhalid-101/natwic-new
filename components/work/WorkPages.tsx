import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { PROJECTS, Project, pad, projectBySlug } from './projects';
import { Magnetic } from '../Magnetic';

const ease = [0.16, 1, 0.3, 1] as const;

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    {children}
  </p>
);

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
    <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.span>
  </span>
);

const BrowserFrame: React.FC<{ project: Project; className?: string }> = ({ project, className = '' }) => (
  <div className={`overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] ${className}`}>
    <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border-b border-black/[0.06] bg-zinc-50">
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
      <span className="ml-3 rounded-full bg-black/[0.05] px-3 py-1 text-[9px] md:text-[11px] text-black/50">{project.domain}</span>
    </div>
    <img src={project.image} alt={`${project.title} website`} className="block w-full h-auto" />
  </div>
);

/* ------------------------------------------------------------------ */
/* /work: the index                                                     */
/* ------------------------------------------------------------------ */

export const WorkIndex: React.FC<{ onOpen: (slug: string) => void; onContact: () => void }> = ({ onOpen, onContact }) => {
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
        <Label>Selected work</Label>
        <h1 className="mt-6 flex items-start gap-3 md:gap-5 text-[22vw] md:text-[13vw] font-bold leading-[0.82] tracking-[-0.06em] text-black">
          <Reveal>Work</Reveal>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="mt-8 md:mt-10 max-w-xl text-lg md:text-xl text-zinc-600 leading-relaxed"
        >
          Websites and products we’ve designed and built for startups, SaaS teams and small businesses around the world.
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
              <button
                onClick={() => onOpen(p.slug)}
                onPointerEnter={() => setHovered(i)}
                className={`group w-full text-left py-6 md:py-9 grid grid-cols-[auto_1fr_auto] md:grid-cols-[4rem_1fr_14rem_10rem] items-center gap-4 md:gap-6 transition-opacity duration-500 ${hovered !== null && hovered !== i ? 'md:opacity-30' : ''}`}
              >
                <span className="font-mono text-xs text-zinc-400">{pad(i + 1)}</span>
                <span className="text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-none text-black transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-4 md:group-hover:text-[#703FEC]">
                  {p.title}
                </span>
                <span className="hidden md:block text-sm text-zinc-500">{p.category}</span>
                <span className="flex items-center justify-end gap-3 text-sm text-zinc-500">
                  <span className="hidden md:inline">{p.domain}</span>
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-zinc-200 grid place-items-center text-black transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
                </span>
              </button>
              {/* Phones get the cover inline */}
              <button onClick={() => onOpen(p.slug)} className="md:hidden block w-full pb-6" aria-label={`Open ${p.title}`}>
                <img src={p.image} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover object-top rounded-2xl" />
              </button>
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
              <img src={PROJECTS[hovered].image} alt="" className="w-full h-full object-cover object-top" />
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
          <button onClick={onContact} className="group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
            Start a project
            <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
          </button>
        </Magnetic>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* /work/<slug>: a case study                                          */
/* ------------------------------------------------------------------ */

export const CaseStudyPage: React.FC<{ slug: string; onOpen: (slug: string) => void; onAll: () => void; onContact: () => void }> = ({ slug, onOpen, onAll, onContact }) => {
  const project = projectBySlug(slug) ?? PROJECTS[0];
  const index = PROJECTS.indexOf(project);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ['start end', 'end start'] });
  const coverScale = useTransform(scrollYProgress, [0, 0.45], [0.9, 1]);
  const coverY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  const [nextHover, setNextHover] = useState(false);
  useEffect(() => { setNextHover(false); }, [slug]);

  const sections = [
    { n: '01', t: 'The challenge', b: project.challenge },
    { n: '02', t: 'What we did', b: project.approach },
    { n: '03', t: 'The result', b: project.outcome },
  ];

  return (
    <article key={project.slug} className="bg-white min-h-screen pt-28 md:pt-36 pb-0">
      <header className="px-5 md:px-12 max-w-7xl mx-auto">
        <button onClick={onAll} className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-black transition-colors">
          <span className="transition-transform group-hover:-translate-x-1">←</span> All work
        </button>
        <div className="mt-10 md:mt-14 flex items-center gap-4">
          <Label>{project.category}</Label>
        </div>
        <h1 className="mt-5 text-[19vw] md:text-[11vw] font-bold leading-[0.85] tracking-[-0.06em]">
          <Reveal>{project.title}</Reveal>
        </h1>
        <div className="mt-8 md:mt-12 grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-16 items-end">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.25 }} className="text-2xl md:text-4xl font-medium tracking-[-0.03em] leading-[1.15] text-zinc-800">
            {project.summary}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.35 }} className="flex flex-col gap-5 md:items-end">
            <div className="flex flex-wrap gap-2 md:justify-end">
              {project.services.map((s) => <span key={s} className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold">{s}</span>)}
            </div>
            <Magnetic strength={0.3}>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 rounded-full bg-[#703FEC] text-white pl-6 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-black transition-colors">
                Visit {project.domain}
                <span className="w-10 h-10 rounded-full bg-white text-black grid place-items-center transition-transform duration-500 group-hover:-rotate-45">↗</span>
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </header>

      {/* Cover, framed as the live site */}
      <div ref={coverRef} className="mt-16 md:mt-24 px-3 md:px-6">
        <motion.div style={{ scale: coverScale }} className="relative mx-auto max-w-[1400px] rounded-[2rem] md:rounded-[3rem] bg-[#0A0A0A] p-4 md:p-14 overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(112,63,236,0.45),transparent_60%)]" />
          <motion.div style={{ y: coverY }} className="relative">
            <BrowserFrame project={project} />
          </motion.div>
        </motion.div>
      </div>

      {/* Story */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-20 md:mt-32 grid gap-14 md:gap-0">
        {sections.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease, delay: i * 0.05 }}
            className="grid md:grid-cols-[14rem_1fr] gap-4 md:gap-16 md:py-12 md:border-t border-zinc-200"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#703FEC]">{s.n}</span>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">{s.t}</h2>
            </div>
            <p className="text-xl md:text-3xl font-medium tracking-[-0.02em] leading-[1.35] text-zinc-900 max-w-3xl">{s.b}</p>
          </motion.div>
        ))}
      </section>

      {/* Highlights */}
      <section className="px-5 md:px-12 max-w-7xl mx-auto mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4">
        {project.highlights.map((h, i) => (
          <motion.div
            key={h}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className={`rounded-[2rem] p-8 md:p-10 min-h-[180px] flex flex-col justify-between ${['bg-zinc-100 text-black', 'bg-[#0A0A0A] text-white', 'bg-[#703FEC] text-white'][i % 3]}`}
          >
            <span className="font-mono text-xs opacity-60">{pad(i + 1)}</span>
            <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight">{h}</p>
          </motion.div>
        ))}
      </section>

      {/* Next project */}
      <section className="mt-24 md:mt-36 border-t border-zinc-200">
        <button
          onClick={() => onOpen(next.slug)}
          onPointerEnter={() => setNextHover(true)}
          onPointerLeave={() => setNextHover(false)}
          className="group relative w-full overflow-hidden px-5 md:px-12 py-16 md:py-24 text-left"
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
              initial={false}
              animate={{ opacity: nextHover ? 1 : 0, y: nextHover ? 0 : 30, rotate: nextHover ? -3 : 0 }}
              transition={{ duration: 0.6, ease }}
              className="hidden md:block w-[340px] aspect-[4/3] object-cover object-top rounded-2xl shadow-2xl"
            />
          </div>
        </button>
      </section>

      <section className="px-5 md:px-12 max-w-7xl mx-auto py-16 md:py-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em]">Want something like this?</p>
        <button onClick={onContact} className="group inline-flex items-center gap-4 self-start rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
          Start a project
          <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
        </button>
      </section>
    </article>
  );
};
