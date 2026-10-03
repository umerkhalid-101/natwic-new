import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, motionValue, useInView } from 'framer-motion';

const ease = [0.23, 1, 0.32, 1] as const;
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* The chat — the visitor picks a problem, the studio answers          */
/* ------------------------------------------------------------------ */

const EXPERTS = [
  // Outer ring
  { id: 1, name: 'Umer', role: 'Founder · Design & development', img: '/team/umer.jpg', radius: 185, speed: 50, offset: 0 },
  { id: 2, name: 'Faiq', role: 'Content, SEO & ads', img: '/team/faiq.jpg', radius: 185, speed: 50, offset: 180 },
  // Inner ring
  { id: 3, name: 'Hassan', role: 'Partnerships', img: '/team/hassan.jpg', radius: 115, speed: 40, offset: 90 },
  { id: 4, name: 'Tanseer', role: 'Brand designer', img: '/team/tanseer.jpg', radius: 115, speed: 40, offset: 270 },
];
const nameOf = (id: number) => EXPERTS.find((e) => e.id === id)?.name ?? 'Umer';
const FOUNDER = 1; // takes anything a visitor writes in their own words

type Fix = { title: string; points: string[] };
// `by` is the person who'd take this problem on
type Problem = { q: string; a: string; fix: Fix; by: number };

const PROBLEMS: Problem[] = [
  {
    q: 'Our site looks like it’s from 2015.',
    a: 'Happens a lot. We’ll redesign it around who you are today, and set it up so you can edit it yourself.',
    fix: { title: 'Redesign', points: ['Brand-led design', 'Easy-to-edit CMS', 'Built mobile-first'] },
    by: 4,
  },
  {
    q: 'Nobody finds us on Google.',
    a: 'We build for search from day one, so the right people can actually find you.',
    fix: { title: 'Search & local SEO', points: ['Fast, clean pages', 'Proper structure and metadata', 'Google Business profile set up'] },
    by: 2,
  },
  {
    q: 'We launch in three weeks and have nothing.',
    a: 'Tight, but doable. We’ll scope a sharp launch site and ship it in focused weekly sprints.',
    fix: { title: 'Launch sprint', points: ['Scope agreed in week one', 'Weekly demos', 'Built around your date'] },
    by: 1,
  },
  {
    q: 'People visit, but nobody gets in touch.',
    a: 'Then the site isn’t doing its job. We’ll find where people drop off and give them one clear next step.',
    fix: { title: 'Conversion', points: ['A clear offer up top', 'Faster load times', 'One obvious call to action'] },
    by: 2,
  },
  {
    q: 'Our last agency went quiet halfway through.',
    a: 'Not here. You talk directly to the people building it, every week.',
    fix: { title: 'Direct line', points: ['No account managers', 'A shared channel', 'Weekly check-ins'] },
    by: 3,
  },
];

// A studio card carries the next step: who to start with, and what to pre-fill on Contact
type Next = { by: number; brief: string; fix?: Fix };
type Msg = { id: number; from: 'you' | 'studio'; text?: string; next?: Next };

const GREETING: Msg = { id: -1, from: 'studio', text: 'Hi! What’s not working for you right now?' };

/** The studio's avatar: the Natwic mark. */
const StudioAvatar: React.FC = () => (
  <span className="w-7 h-7 rounded-full bg-white border border-black/[0.06] shadow-sm grid place-items-center shrink-0">
    <img src="/brand/mark-128.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
  </span>
);

const TypingDots: React.FC = () => (
  <span className="flex gap-1 px-4 py-3.5">
    {[0, 0.15, 0.3].map((d) => (
      <motion.span
        key={d}
        className="w-1.5 h-1.5 rounded-full bg-black/40"
        animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: d }}
      />
    ))}
  </span>
);

const NextCard: React.FC<{ next: Next; onStart: (brief: string) => void }> = ({ next, onStart }) => (
  <div className="rounded-2xl bg-white border border-black/[0.06] p-4 md:p-5 w-[min(300px,82%)] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
    <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[#703FEC]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
      {next.fix ? 'How we fix it' : 'Your message'}
    </p>
    {next.fix ? (
      <>
        <p className="mt-2.5 text-[15px] font-semibold tracking-tight text-black">{next.fix.title}</p>
        <ul className="mt-2.5 space-y-1.5">
          {next.fix.points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-[12px] text-black/65">
              <svg viewBox="0 0 16 16" aria-hidden className="w-3.5 h-3.5 shrink-0 text-[#703FEC]">
                <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {p}
            </li>
          ))}
        </ul>
      </>
    ) : (
      <p className="mt-2.5 text-[13px] leading-snug text-black/70 line-clamp-3">“{next.brief}”</p>
    )}
    <button
      onClick={() => onStart(next.brief)}
      className="mt-4 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-black text-white pl-4 pr-3.5 py-2.5 text-[12px] font-semibold tracking-tight transition-all duration-300 hover:bg-[#703FEC] hover:scale-[1.03]"
    >
      Start a project with {nameOf(next.by)}
      <span className="w-1.5 h-1.5 rounded-full bg-[#F3350C] animate-pulse" />
    </button>
  </div>
);

const ProblemChat: React.FC<{ onStart: (brief: string) => void; onSpeaker: (id: number | null) => void }> = ({ onStart, onSpeaker }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState('');
  const [autoTyping, setAutoTyping] = useState(false);
  const [typing, setTyping] = useState<number | null>(null); // who is typing
  const [thread, setThread] = useState<Msg[]>([GREETING]);
  const timers = useRef<number[]>([]);
  const touched = useRef(false);
  const nextId = useRef(0);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /** The visitor's message lands, the right person picks it up, answers, and offers the next step. */
  const converse = useCallback((text: string, by: number, reply: string, next: Next) => {
    const after = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    const push = (m: Omit<Msg, 'id'>) => setThread((t) => [...t, { ...m, id: nextId.current++ }].slice(-5));
    push({ from: 'you', text });
    after(450, () => { setTyping(by); onSpeaker(by); });
    after(1650, () => { setTyping(null); push({ from: 'studio', text: reply }); });
    after(2100, () => { push({ from: 'studio', next }); setBusy(false); });
    after(5600, () => onSpeaker(null));
  }, [onSpeaker]);

  const ask = useCallback((i: number) => {
    clearTimers();
    const after = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    const { q, a, fix, by } = PROBLEMS[i];

    setActive(i);
    setBusy(true);
    setTyping(null);
    setAutoTyping(true);

    // The line types into the composer before it's sent
    let n = reducedMotion() ? q.length : 0;
    const type = () => {
      n = Math.min(q.length, n + 2);
      setDraft(q.slice(0, n));
      if (n < q.length) return after(22, type);
      after(280, () => {
        setDraft('');
        setAutoTyping(false);
        converse(q, by, a, { by, brief: q, fix });
      });
    };
    type();
  }, [converse]);

  /** The visitor clicks into the box: stop the demo, and clear any line it was typing. */
  const takeOver = () => {
    touched.current = true;
    if (!autoTyping) return;
    clearTimers();
    setAutoTyping(false);
    setBusy(false);
    setDraft('');
  };

  /** Anything the visitor writes themselves goes straight to the founder. */
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || autoTyping) return;
    touched.current = true;
    clearTimers();
    setActive(-1);
    setBusy(true);
    setTyping(null);
    setDraft('');
    converse(text, FOUNDER, `Got it. Send it over and ${nameOf(FOUNDER)} will look at it personally.`, { by: FOUNDER, brief: text });
  };

  // Plays through on its own until the visitor picks one
  useEffect(() => {
    if (!inView || busy || touched.current) return;
    const t = window.setTimeout(() => !touched.current && ask((active + 1) % PROBLEMS.length), active < 0 ? 700 : 4800);
    return () => clearTimeout(t);
  }, [inView, busy, active, ask]);

  // Keep the active quick reply in view as the conversation plays through
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = strip.current;
    const chip = el?.children[active] as HTMLElement | undefined;
    if (el && chip) el.scrollTo({ left: chip.offsetLeft - 24, behavior: 'smooth' });
  }, [active]);

  const pick = (i: number) => {
    touched.current = true;
    ask(i);
  };

  return (
    <div ref={ref} className="flex flex-col h-[560px] md:h-[600px]">
      <p className="pt-10 md:pt-14 px-6 text-center text-[9px] font-bold uppercase tracking-[0.4em] text-black/25">Tell us what’s not working</p>

      {/* Thread */}
      <div
        className="relative flex-1 min-h-0 flex flex-col justify-end gap-3 px-5 md:px-8 pt-6 pb-4 overflow-hidden"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)' }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {thread.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className={`flex items-end gap-2.5 ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}
              style={{ transformOrigin: m.from === 'you' ? 'bottom right' : 'bottom left' }}
            >
              {m.from === 'studio' && (m.next ? <span className="w-7 shrink-0" /> : <StudioAvatar />)}
              {m.next ? (
                <NextCard next={m.next} onStart={onStart} />
              ) : (
                <div
                  className={`max-w-[78%] px-4 py-2.5 text-[13px] md:text-[14px] leading-snug shadow-sm ${
                    m.from === 'you'
                      ? 'bg-black text-white rounded-[1.25rem] rounded-br-md'
                      : 'bg-white text-black border border-black/[0.04] rounded-[1.25rem] rounded-bl-md'
                  }`}
                >
                  {m.text}
                </div>
              )}
              {m.from === 'you' && (
                <span className="w-7 h-7 rounded-full bg-[#703FEC] text-white text-[9px] font-bold grid place-items-center shrink-0">You</span>
              )}
            </motion.div>
          ))}
          {typing !== null && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-end gap-2.5"
            >
              <StudioAvatar />
              <span className="flex flex-col gap-1">
                <span className="text-[10px] text-black/45 pl-1">{nameOf(typing)} is typing…</span>
                <span className="w-fit bg-white border border-black/[0.04] rounded-[1.25rem] rounded-bl-md shadow-sm"><TypingDots /></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick replies: the problems we hear most */}
      <div
        ref={strip}
        className="relative flex gap-2 overflow-x-auto px-5 md:px-8 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: 'linear-gradient(to right, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)' }}
        data-lenis-prevent
      >
        {PROBLEMS.map((p, i) => (
          <button
            key={p.q}
            onClick={() => pick(i)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all duration-300 ${
              active === i
                ? 'bg-[#703FEC] border-[#703FEC] text-white'
                : 'bg-white/60 border-black/[0.08] text-black/70 hover:bg-white hover:text-black hover:border-black/15'
            }`}
          >
            {p.q}
          </button>
        ))}
      </div>

      {/* Composer: picked problems type in here, or the visitor writes their own */}
      <form onSubmit={send} className="px-5 md:px-8 pb-6 md:pb-8">
        <div className="flex items-center gap-3 rounded-full bg-white border border-black/[0.06] pl-5 pr-1.5 py-1.5 shadow-sm focus-within:border-[#703FEC]/50 transition-colors">
          <input
            value={draft}
            onChange={(e) => !autoTyping && setDraft(e.target.value)}
            onFocus={takeOver}
            readOnly={autoTyping}
            maxLength={280}
            aria-label="Describe your problem"
            placeholder="Write your own, or pick one above…"
            className="flex-1 min-w-0 bg-transparent outline-none text-[13px] text-black placeholder:text-black/35"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || autoTyping}
            className={`w-9 h-9 rounded-full grid place-items-center shrink-0 transition-all duration-300 ${
              draft.trim() ? 'bg-[#703FEC] text-white scale-100' : 'bg-black/[0.06] text-black/30 scale-90'
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4">
              <path d="M5 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The team — hover or tap a face to bring that person forward         */
/* ------------------------------------------------------------------ */

const ExpertOrbital: React.FC<{ speaker: number | null }> = ({ speaker }) => {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.15 });
  const [hover, setHover] = useState<number | null>(null);
  const [fit, setFit] = useState(1);
  // Hover wins; otherwise whoever is answering in the chat steps forward
  const focus = hover ?? speaker;
  const focusRef = useRef<number | null>(null);
  focusRef.current = focus;

  // One motion value set per face, written from a single loop so nothing re-renders per frame
  const mv = useRef(EXPERTS.map(() => ({ x: motionValue(0), y: motionValue(0), scale: motionValue(1), opacity: motionValue(1) }))).current;
  const sim = useRef({ angles: EXPERTS.map((e) => e.offset), pull: EXPERTS.map(() => 0), dim: EXPERTS.map(() => 1), speed: 1 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setFit(Math.min(1, (e.contentRect.width - 32) / 440)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduced = reducedMotion();
    const s = sim.current;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const f = focusRef.current;
      const k = reduced ? 1 : 1 - Math.pow(0.004, dt);
      // Everyone else slows to a drift while one person is in focus
      s.speed += ((reduced ? 0 : f === null ? 1 : 0.12) - s.speed) * k;

      EXPERTS.forEach((e, i) => {
        s.angles[i] += (360 / e.speed) * dt * s.speed;
        s.pull[i] += ((f === e.id ? 1 : 0) - s.pull[i]) * k;
        s.dim[i] += ((f !== null && f !== e.id ? 0.4 : 1) - s.dim[i]) * k;
        const a = (s.angles[i] * Math.PI) / 180;
        const r = e.radius * fit;
        const p = s.pull[i];
        mv[i].x.set(Math.sin(a) * r * (1 - p));
        mv[i].y.set(-Math.cos(a) * r * (1 - p) - p * 22 * fit);
        mv[i].scale.set(1 + p * 1.35);
        mv[i].opacity.set(s.dim[i]);
      });
      if (inView) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, fit, mv]);

  const focused = EXPERTS.find((e) => e.id === focus);

  return (
    <div
      ref={box}
      onMouseLeave={() => setHover(null)}
      className="relative w-full h-[480px] md:h-[600px] flex items-center justify-center bg-[#0F0F0F] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(112,63,236,0.06)_0%,_transparent_70%)] pointer-events-none" />

      <div className="absolute border border-white/[0.04] rounded-full pointer-events-none" style={{ width: 370 * fit, height: 370 * fit }} />
      <div className="absolute border border-white/[0.04] rounded-full pointer-events-none" style={{ width: 230 * fit, height: 230 * fit }} />

      <AnimatePresence mode="wait">
        {focused ? (
          <motion.div
            key={focused.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease, delay: 0.1 }}
            className="absolute left-0 right-0 top-1/2 text-center pointer-events-none"
            style={{ marginTop: 52 * fit + 28 }}
          >
            <p className="text-xl md:text-2xl font-medium tracking-tight text-white">{focused.name}</p>
            {focused.role && <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">{focused.role}</p>}
          </motion.div>
        ) : (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="relative z-30 text-center pointer-events-none max-w-[200px]"
          >
            <h3 className="text-2xl md:text-[32px] font-medium tracking-tight text-white leading-[1.2]">A strong team of experts</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {EXPERTS.map((e, i) => (
        <motion.button
          key={e.id}
          aria-label={e.name}
          aria-pressed={focus === e.id}
          onPointerEnter={(ev) => ev.pointerType === 'mouse' && setHover(e.id)}
          onClick={() => setHover((f) => (f === e.id ? null : e.id))}
          style={{ x: mv[i].x, y: mv[i].y, scale: mv[i].scale, opacity: mv[i].opacity, zIndex: focus === e.id ? 40 : 20 }}
          className="absolute left-1/2 top-1/2 -ml-6 -mt-6 md:-ml-7 md:-mt-7 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shadow-xl"
        >
          <img
            src={e.img}
            alt=""
            draggable={false}
            className={`w-full h-full object-cover object-top transition-[filter] duration-500 ${focus === e.id ? 'grayscale-0' : 'grayscale'}`}
          />
        </motion.button>
      ))}

      <p className="absolute top-10 md:top-14 inset-x-0 px-6 text-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 pointer-events-none">
        You talk to the people who build it
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */

export const WhyUs: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [speaker, setSpeaker] = useState<number | null>(null);

  // Contact picks the brief up and pre-fills its message box
  const startWith = useCallback((brief: string) => {
    try { sessionStorage.setItem('natwic:brief', brief); } catch { /* storage blocked: Contact opens empty */ }
    onStart();
  }, [onStart]);

  return (
    <section className="py-24 md:py-32 px-4 md:px-12 bg-white text-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto mb-16 md:mb-20 px-2 md:px-0">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-32 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-3 items-center pt-2 min-w-[200px]"
          >
            <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.3)]" />
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">WHY WORK WITH US</p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease }}
            className="text-4xl md:text-[56px] font-bold tracking-tight leading-[1.05] max-w-4xl [text-wrap:balance]"
          >
            We help ambitious brands make their mark with clarity and precision.
          </motion.h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
          className="rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#0A0A0A] relative shadow-lg flex flex-col"
        >
          <ExpertOrbital speaker={speaker} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.1, ease }}
          className="bg-[#E5E4E0] rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden flex flex-col border border-black/[0.03]"
        >
          <ProblemChat onStart={startWith} onSpeaker={setSpeaker} />
        </motion.div>
      </div>
    </section>
  );
};
