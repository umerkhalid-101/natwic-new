import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { Magnetic } from './Magnetic';
import { BASE_URL } from '../seo';

const ease = [0.16, 1, 0.3, 1] as const;

const VALUES = [
  { number: '01', title: 'Transparency', description: 'We believe in open dialogue. No hidden fees, no surprise clauses. Just honest work and clear communication from day one.' },
  { number: '02', title: 'Passion', description: 'We don’t just build digital products; we craft experiences. Every pixel is placed with intent and every line of code is written with pride.' },
  { number: '03', title: 'Empathy', description: 'User-centric isn’t just a buzzword. We dive deep into the psychology of your audience to build solutions that truly resonate.' },
];

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

// Where we work: home plus the cities our clients work from. Add more as { name, country, tz, lat, lon }.
type City = { name: string; country: string; tz: string; lat: number; lon: number; home?: boolean };
const CITIES: City[] = [
  { name: 'Dubai', country: 'UAE', tz: 'Asia/Dubai', lat: 25.2, lon: 55.27, home: true },
  { name: 'London', country: 'UK', tz: 'Europe/London', lat: 51.5, lon: -0.13 },
  { name: 'New York', country: 'USA', tz: 'America/New_York', lat: 40.71, lon: -74.0 },
  { name: 'Salt Lake City', country: 'USA', tz: 'America/Denver', lat: 40.76, lon: -111.89 },
  { name: 'Toronto', country: 'Canada', tz: 'America/Toronto', lat: 43.65, lon: -79.38 },
  { name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', lat: 52.52, lon: 13.4 },
  { name: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam', lat: 52.37, lon: 4.9 },
  { name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh', lat: 24.71, lon: 46.68 },
  { name: 'Doha', country: 'Qatar', tz: 'Asia/Qatar', lat: 25.29, lon: 51.53 },
  { name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi', lat: 24.86, lon: 67.0 },
  { name: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', lat: -33.87, lon: 151.21 },
];

/** Local time in a zone, and how far it is from Dubai, e.g. "4h behind". */
const zoneMinutes = (tz: string) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', day: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return get('day') * 1440 + get('hour') * 60 + get('minute');
};
const localTime = (tz: string) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date());
const fromDubai = (tz: string) => {
  // Wrap to within a day, so crossing midnight or a month boundary doesn't skew it
  let d = (((zoneMinutes(tz) - zoneMinutes('Asia/Dubai')) % 1440) + 1440) % 1440;
  if (d > 720) d -= 1440;
  const h = Math.round((d / 60) * 2) / 2;
  if (h === 0) return 'Same time as Dubai';
  return `${Math.abs(h)}h ${h < 0 ? 'behind' : 'ahead of'} Dubai`;
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
/* Where we work: the globe                                            */
/* ------------------------------------------------------------------ */

const Daylight: React.FC<{ hour: number }> = ({ hour }) =>
  hour >= 6 && hour < 18 ? (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#FFC24B]" aria-label="Daytime"><circle cx="8" cy="8" r="3.2" fill="currentColor" />{[0, 45, 90, 135, 180, 225, 270, 315].map((d) => <line key={d} x1="8" y1="1.2" x2="8" y2="2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${d} 8 8)`} />)}</svg>
  ) : (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#b9a1ff]" aria-label="Night-time"><path d="M10.5 2.5a5.5 5.5 0 1 0 3 9.9A6 6 0 0 1 10.5 2.5z" fill="currentColor" /></svg>
  );

/** A world clock: every city we work with, its time right now, and its distance from Dubai. */
const WorldClock: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [, setTick] = useState(0);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    if (!inView) return;
    const t = window.setInterval(() => { setBlink((b) => !b); setTick((n) => n + 1); }, 1000);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section className="px-2 md:px-3">
      <div ref={ref} className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-[#0A0A0A] text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(112,63,236,0.3),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-16 items-end mb-12 md:mb-16">
            <div>
              <Label tone="light">Where we work</Label>
              <h2 className="mt-5 text-5xl md:text-8xl font-bold tracking-[-0.05em] leading-[1]">
                Dubai to <span className="italic text-[#b9a1ff]">everywhere.</span>
              </h2>
            </div>
            <p className="text-white/60 leading-relaxed lg:pb-3">
              Based in Dubai, working with clients across five continents. We plan calls around your time zone, not ours.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/[0.08]">
            {CITIES.map((c, i) => {
              const [hh, mm] = localTime(c.tz).split(':');
              const hour = Number(hh);
              return (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease, delay: (i % 4) * 0.06 }}
                  className={`group relative p-5 md:p-7 transition-colors duration-300 ${c.home ? 'bg-[#703FEC]' : 'bg-[#0A0A0A] hover:bg-[#151515]'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${c.home ? 'text-white/70' : 'text-white/35'}`}>{c.country}</span>
                    {c.home ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]">Studio</span> : <Daylight hour={hour} />}
                  </div>
                  <p className="mt-6 md:mt-8 text-lg md:text-xl font-semibold tracking-tight">{c.name}</p>
                  <p className={`mt-1 font-mono text-3xl md:text-4xl tabular-nums tracking-tight transition-colors duration-300 ${c.home ? 'text-white' : 'text-white group-hover:text-[#b9a1ff]'}`}>
                    {hh}<span className={`transition-opacity duration-200 ${blink ? 'opacity-100' : 'opacity-30'}`}>:</span>{mm}
                  </p>
                  <p className={`mt-2 text-xs ${c.home ? 'text-white/70' : 'text-white/40'}`}>{c.home ? 'Where we are' : fromDubai(c.tz)}</p>
                </motion.div>
              );
            })}
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
/* Values: scroll lights each one up in turn                           */
/* ------------------------------------------------------------------ */

const ValueVisual: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) {
    // Transparency: clear panes you can see straight through
    return (
      <div className="relative w-56 h-56 md:w-72 md:h-72">
        {[0, 1, 2].map((k) => (
          <motion.div
            key={k}
            className="absolute inset-0 rounded-[2rem] border border-white/40 bg-white/[0.07]"
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{ x: (k - 1) * 34, y: (k - 1) * -26, rotate: (k - 1) * 6 }}
            transition={{ duration: 1, ease, delay: k * 0.08 }}
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)' }}
          />
        ))}
        <motion.span
          className="absolute left-1/2 top-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.9)]"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </div>
    );
  }
  if (i === 1) {
    // Passion: a warm core that keeps pulsing
    return (
      <div className="relative w-56 h-56 md:w-72 md:h-72 grid place-items-center">
        {[1, 2, 3].map((k) => (
          <motion.span
            key={k}
            className="absolute rounded-full border border-white/25"
            style={{ width: `${30 + k * 22}%`, height: `${30 + k * 22}%` }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: k * 0.3 }}
          />
        ))}
        <motion.span
          className="w-[42%] h-[42%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffd2c2,#F3350C_45%,#703FEC_100%)] shadow-[0_0_80px_rgba(243,53,12,0.6)]"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }
  // Empathy: two circles moving to meet each other
  return (
    <div className="relative w-64 h-48 md:w-80 md:h-60">
      <motion.span
        className="absolute top-1/2 -mt-[30%] left-0 w-[60%] aspect-square rounded-full bg-[#703FEC] mix-blend-screen"
        animate={{ x: ['0%', '22%', '0%'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute top-1/2 -mt-[30%] right-0 w-[60%] aspect-square rounded-full bg-[#F3350C] mix-blend-screen"
        animate={{ x: ['0%', '-22%', '0%'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

const VALUE_BG = ['#141414', '#703FEC', '#0A0A0A'];

const Values: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useEffect(() => scrollYProgress.on('change', (v) => setActive(Math.min(VALUES.length - 1, Math.max(0, Math.floor(v * VALUES.length * 0.999))))), [scrollYProgress]);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen flex items-center px-5 md:px-12">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <Label>Our values</Label>
            <ul className="mt-6 md:mt-10 space-y-1 md:space-y-2">
              {VALUES.map((v, i) => (
                <li key={v.number} className="flex items-baseline gap-4 md:gap-6">
                  <span className={`font-mono text-sm transition-colors duration-500 ${active === i ? 'text-[#703FEC]' : 'text-zinc-300'}`}>{v.number}</span>
                  <motion.span
                    animate={{ x: active === i ? 12 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className={`text-5xl md:text-[6.5rem] font-bold tracking-[-0.055em] leading-[1.02] transition-colors duration-500 ${active === i ? 'text-black' : 'text-zinc-200'}`}
                  >
                    {v.title}
                  </motion.span>
                </li>
              ))}
            </ul>
            <div className="mt-8 md:mt-12 flex gap-2">
              {VALUES.map((v, i) => (
                <span key={v.number} className="h-1 w-12 rounded-full bg-zinc-200 overflow-hidden">
                  <motion.span className="block h-full bg-[#703FEC]" animate={{ width: active >= i ? '100%' : '0%' }} transition={{ duration: 0.5, ease }} />
                </span>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ backgroundColor: VALUE_BG[active] }}
            transition={{ duration: 0.7, ease }}
            className="relative h-[46vh] lg:h-[64vh] min-h-[320px] rounded-[2rem] md:rounded-[3rem] overflow-hidden text-white flex flex-col"
          >
            <div className="flex-1 grid place-items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 6 }}
                  transition={{ duration: 0.6, ease }}
                >
                  <ValueVisual i={active} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="p-7 md:p-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease }}
                  className="max-w-md text-base md:text-lg leading-relaxed text-white/80"
                >
                  {VALUES[active].description}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
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
      <WorldClock />

      <Process />

      <Values />
    </div>
  );
};
