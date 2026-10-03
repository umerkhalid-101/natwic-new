import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import type { GlobeScene, City } from './studio/globeScene';
import { Magnetic } from './Magnetic';

const ease = [0.16, 1, 0.3, 1] as const;

const VALUES = [
  { number: '01', title: 'Transparency', description: 'We believe in open dialogue. No hidden fees, no surprise clauses. Just honest work and clear communication from day one.' },
  { number: '02', title: 'Passion', description: 'We don’t just build digital products; we craft experiences. Every pixel is placed with intent and every line of code is written with pride.' },
  { number: '03', title: 'Empathy', description: 'User-centric isn’t just a buzzword. We dive deep into the psychology of your audience to build solutions that truly resonate.' },
];

const TEAM = [
  { name: 'Umer Khalid', first: 'Umer', role: 'Founder', focus: 'Design & development', handles: ['Web & product design', 'Development', 'Creative direction'], image: '/team/umer.jpg' },
  { name: 'Faiq Ahmed', first: 'Faiq', role: 'Co-founder', focus: 'Content, SEO & ads', handles: ['Content & copy', 'SEO', 'Paid ads'], image: '/team/faiq.jpg' },
  { name: 'Hassan Daniyal Ghauri', first: 'Hassan', role: 'Head of Business', focus: 'Partnerships', handles: ['Partnerships', 'Client relationships', 'Project planning'], image: '/team/hassan.jpg' },
  { name: 'Tanseer Khoso', first: 'Tanseer', role: 'Head of Design', focus: 'Brand design', handles: ['Brand identity', 'Visual systems', 'Art direction'], image: '/team/tanseer.jpg' },
];

// Where clients are. Add more as { name, clients, lat, lon }.
const CITIES: City[] = [
  { name: 'Dubai', clients: 'Natwic Studio', lat: 25.2, lon: 55.27, home: true },
  { name: 'London', clients: 'Cayano · Beyond Hut', lat: 51.5, lon: -0.13 },
  { name: 'Utah', clients: 'Breakthirty', lat: 40.76, lon: -111.89 },
];

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
        alt={m.name}
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
/* Where we work: the globe                                            */
/* ------------------------------------------------------------------ */

const Globe: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GlobeScene | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let cleanup = () => {};
    let cancelled = false;
    import('./studio/globeScene').then(({ GlobeScene }) => {
      if (cancelled) return;
      let scene: GlobeScene;
      try { scene = new GlobeScene(canvas, CITIES); } catch { return; }
      sceneRef.current = scene;
      scene.onFrame = (pts) => {
        pts.forEach((p, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
          el.style.opacity = p.visible ? '1' : '0';
        });
      };
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? scene.start() : scene.stop()));
      io.observe(wrap);
      const ro = new ResizeObserver(() => scene.resize());
      ro.observe(canvas);
      cleanup = () => { io.disconnect(); ro.disconnect(); scene.dispose(); sceneRef.current = null; };
    });
    return () => { cancelled = true; cleanup(); };
  }, []);

  const go = (i: number) => { setFocus(i); sceneRef.current?.focus(i); };

  return (
    <section className="px-2 md:px-3">
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-[#0A0A0A] text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(112,63,236,0.28),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] items-center gap-6 px-6 md:px-12 py-16 md:py-24">
          <div>
            <Label tone="light">Where we work</Label>
            <h2 className="mt-5 text-4xl md:text-7xl font-bold tracking-[-0.045em] leading-[1.02]">
              Dubai to <span className="italic text-[#b9a1ff]">everywhere.</span>
            </h2>
            <p className="mt-6 max-w-md text-white/60 leading-relaxed">
              We’re based in Dubai and work remotely with clients around the world, scheduling around your time zone.
            </p>
            <div className="mt-10 flex flex-wrap gap-2">
              {CITIES.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => go(i)}
                  className={`group rounded-full border px-4 py-2.5 text-left transition-all duration-300 ${focus === i ? 'bg-white text-black border-white' : 'border-white/15 text-white/80 hover:border-white/40'}`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.home ? 'bg-[#F3350C]' : 'bg-[#8c63ff]'}`} />
                    {c.name}
                  </span>
                  <span className={`block text-[11px] ${focus === i ? 'text-black/55' : 'text-white/40'}`}>{c.clients}</span>
                </button>
              ))}
            </div>
          </div>

          <div ref={wrapRef} className="relative aspect-square w-full max-w-[640px] mx-auto touch-none">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" aria-label="Globe showing where our clients are" />
            {CITIES.map((c, i) => (
              <div key={c.name} ref={(el) => { labelRefs.current[i] = el; }} className="pointer-events-none absolute left-0 top-0 transition-opacity duration-300" style={{ opacity: 0 }}>
                <span className="absolute left-3 -top-3 whitespace-nowrap rounded-full bg-black/70 border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-white">
                  {c.name}
                </span>
              </div>
            ))}
            <p className="pointer-events-none absolute bottom-2 inset-x-0 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">Drag to spin</p>
          </div>
        </div>
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
  const [openValue, setOpenValue] = useState<number | null>(0);

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
      <Globe />

      <Process />

      {/* Values: hover to open */}
      <section className="px-5 md:px-12 pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto">
          <Label>Our values</Label>
          <ul className="mt-8 md:mt-12 border-t border-zinc-200">
            {VALUES.map((v, i) => (
              <li key={v.number} className="border-b border-zinc-200">
                <button
                  onPointerEnter={() => setOpenValue(i)}
                  onClick={() => setOpenValue(openValue === i ? null : i)}
                  className="group relative w-full text-left py-7 md:py-10 overflow-hidden"
                >
                  <motion.span aria-hidden className="absolute inset-0 bg-[#703FEC] origin-left" initial={false} animate={{ scaleX: openValue === i ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
                  <span className="relative grid md:grid-cols-[6rem_1fr_1.2fr] gap-3 md:gap-8 items-baseline px-1 md:px-4">
                    <span className={`font-mono text-sm transition-colors duration-500 ${openValue === i ? 'text-white/70' : 'text-[#703FEC]'}`}>{v.number}</span>
                    <span className={`text-4xl md:text-6xl font-bold tracking-[-0.045em] transition-colors duration-500 ${openValue === i ? 'text-white' : 'text-black'}`}>{v.title}</span>
                    <AnimatePresence initial={false}>
                      {openValue === i && (
                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease }}
                          className="text-base md:text-lg leading-relaxed text-white/85"
                        >
                          {v.description}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
