import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';
import { Magnetic } from './Magnetic';
import { scrollToY } from './smoothScroll';
import { StarWordmark } from './StarWordmark';

interface FooterProps {
  setView?: (view: 'home' | 'contact' | 'studio' | 'privacy' | 'terms') => void;
  currentView?: string;
}

const EMAIL = 'hello@natwic.com';
const PHONE = '+971 58 520 3139';
const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Where you are vs. where we are                                     */
/* ------------------------------------------------------------------ */

type Here = { city: string; time: string; hour: number; dubaiTime: string; dubaiHour: number; sameZone: boolean };

const hourIn = (tz?: string) => Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: tz }).format(new Date()));
const timeIn = (tz?: string) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date());

/** The visitor's city and time from their time zone (no permission prompt), next to Dubai's. */
const useHere = () => {
  const [here, setHere] = useState<Here | null>(null);
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const city = tz.includes('/') ? tz.split('/').pop()!.replace(/_/g, ' ') : 'your city';
    const tick = () => setHere({
      city,
      time: timeIn(),
      hour: hourIn(),
      dubaiTime: timeIn('Asia/Dubai'),
      dubaiHour: hourIn('Asia/Dubai'),
      sameZone: timeIn() === timeIn('Asia/Dubai'),
    });
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);
  return here;
};

const studioStatus = (h: number) =>
  h >= 9 && h < 19 ? 'We’re in the studio right now.'
  : h >= 19 && h < 23 ? 'We’re winding down, but we still check messages.'
  : 'We’re asleep in Dubai. Leave a message and we’ll reply by morning.';

/** The footer's glow follows the visitor's own sky: dawn, day, sunset or night. */
const skyFor = (h: number) =>
  h >= 5 && h < 8 ? { a: 'rgba(243,120,80,0.32)', b: 'rgba(112,63,236,0.22)' } // dawn
  : h >= 8 && h < 17 ? { a: 'rgba(120,150,255,0.26)', b: 'rgba(112,63,236,0.2)' } // day
  : h >= 17 && h < 20 ? { a: 'rgba(243,53,12,0.3)', b: 'rgba(170,70,200,0.26)' } // sunset
  : { a: 'rgba(112,63,236,0.3)', b: 'rgba(40,30,120,0.25)' }; // night

/* ------------------------------------------------------------------ */
/* Pull to launch: keep scrolling at the very bottom to fly back up    */
/* ------------------------------------------------------------------ */

const LAUNCH_AT = 520;

const usePullToLaunch = (pull: MotionValue<number>, onLaunch: () => void) => {
  useEffect(() => {
    let release = 0;
    let launching = false;
    let touchY: number | null = null;
    const atBottom = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    const springBack = () => animate(pull, 0, { type: 'spring', stiffness: 220, damping: 22 });
    const add = (d: number) => {
      if (launching) return;
      const v = Math.max(0, Math.min(LAUNCH_AT, pull.get() + d));
      pull.set(v);
      if (v >= LAUNCH_AT) {
        launching = true;
        onLaunch();
        springBack();
        window.setTimeout(() => { launching = false; }, 1800);
      }
      window.clearTimeout(release);
      release = window.setTimeout(springBack, 240);
    };
    const onWheel = (e: WheelEvent) => {
      if (!atBottom()) return;
      if (e.deltaY > 0) add(e.deltaY * 0.45);
      else if (pull.get() > 0) add(e.deltaY);
    };
    const onTouchStart = (e: TouchEvent) => { touchY = atBottom() ? e.touches[0].clientY : null; };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null || !atBottom()) return;
      const dy = touchY - e.touches[0].clientY;
      if (dy > 0) pull.set(Math.min(LAUNCH_AT, dy * 1.1));
    };
    const onTouchEnd = () => {
      if (touchY !== null && pull.get() >= LAUNCH_AT * 0.95 && !launching) { launching = true; onLaunch(); window.setTimeout(() => { launching = false; }, 1800); }
      touchY = null;
      springBack();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.clearTimeout(release);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [pull, onLaunch]);
};

const LaunchMeter: React.FC<{ pull: MotionValue<number>; launched: number }> = ({ pull, launched }) => {
  const opacity = useTransform(pull, [0, 30], [0, 1]);
  const dash = useTransform(pull, [0, LAUNCH_AT], [113, 0]);
  const lift = useTransform(pull, [0, LAUNCH_AT], [0, -6]);
  const label = useTransform(pull, (v) => (v >= LAUNCH_AT * 0.9 ? 'Release for liftoff' : 'Keep scrolling to launch'));
  return (
    <>
      <motion.div style={{ opacity }} className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-6 z-[90] flex items-center gap-3 rounded-full bg-white/10 border border-white/15 backdrop-blur-md pl-1.5 pr-4 py-1.5 text-white">
        <svg viewBox="0 0 40 40" className="w-9 h-9 -rotate-90">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
          <motion.circle cx="20" cy="20" r="18" fill="none" stroke="#8c63ff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="113" style={{ strokeDashoffset: dash }} />
        </svg>
        <motion.span style={{ y: lift }} className="absolute left-[19px] top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">↑</motion.span>
        <motion.span className="text-[11px] font-semibold tracking-wide">{label}</motion.span>
      </motion.div>
      {/* The launch itself: a streak that shoots up the screen */}
      <AnimatePresence>
        {launched > 0 && (
          <motion.div
            key={launched}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: '-120vh', opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.5, 0, 0.75, 0] }}
            className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-10 z-[90] flex flex-col items-center"
          >
            <span className="w-12 h-12 rounded-full bg-[#703FEC] text-white grid place-items-center text-xl shadow-[0_0_40px_rgba(112,63,236,0.9)]">↑</span>
            <span className="w-[2px] h-40 bg-gradient-to-b from-[#8c63ff] to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CopyEmail: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };
  return (
    <button onClick={copy} className="group flex flex-wrap items-center gap-3 text-left">
      <span className="text-base md:text-lg font-semibold tracking-tight text-white group-hover:text-[#b9a1ff] transition-colors">{EMAIL}</span>
      <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${copied ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/45 group-hover:text-white'}`}>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between max-w-[200px] border-b border-white/[0.08] py-2 text-base font-semibold tracking-tight text-white/80 hover:text-white transition-colors">
    {children}
    <span className="text-white/30 transition-all duration-300 group-hover:text-[#703FEC] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
  </a>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">{children}</p>
);

export const Footer: React.FC<FooterProps> = ({ setView, currentView }) => {
  const ref = React.useRef<HTMLElement>(null);
  const here = useHere();
  const sky = skyFor(here?.hour ?? 22);
  const pull = useMotionValue(0);
  const stretch = useTransform(pull, [0, LAUNCH_AT], [1, 1.45]);
  const [launched, setLaunched] = useState(0);
  const launch = React.useCallback(() => { setLaunched((n) => n + 1); scrollToY(0); }, []);
  usePullToLaunch(pull, launch);
  // Like the space section, the white top nav steps aside while the dark footer is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    // Fires once the footer reaches the top half of the screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) root.dataset.footer = '1';
      else delete root.dataset.footer;
    }, { rootMargin: '0px 0px -50% 0px' });
    io.observe(el);
    return () => { io.disconnect(); delete root.dataset.footer; };
  }, []);

  return (
  <footer ref={ref} className="relative z-10 -mt-10 md:-mt-16 overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-[#0A0A0A] text-white shadow-[0_-30px_80px_rgba(0,0,0,0.25)]">
    {/* A glow rising behind the wordmark, coloured by the visitor's own sky right now */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] transition-[background] duration-[2000ms]"
      style={{ background: `radial-gradient(ellipse 60% 55% at 50% 100%, ${sky.a}, transparent 70%), radial-gradient(ellipse 90% 70% at 50% 110%, ${sky.b}, transparent 75%)` }}
    />

    <div className="relative max-w-7xl mx-auto px-5 md:px-10 pt-20 md:pt-28">
      {/* Call to action */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-10 lg:gap-16 pb-14 md:pb-20 border-b border-white/[0.08]">
        <div>
          <p className="flex items-center gap-3 mb-6 md:mb-8 text-[11px] font-bold uppercase tracking-[0.4em] text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.8)]" />
            Got a project in mind?
          </p>
          <h2 className="text-[clamp(2.75rem,7.5vw,6.5rem)] font-bold tracking-[-0.045em] leading-[1.02]">
            {[0, 1].map((i) => (
              <span key={i} className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease, delay: i * 0.1 }}
                >
                  {i === 0 ? 'Build your legacy' : <>with <span className="italic text-[#703FEC]">Natwic®</span></>}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>

        {currentView !== 'contact' && (
          <Magnetic strength={0.3}>
            <button
              onClick={() => setView?.('contact')}
              className="group/btn inline-flex items-center gap-4 rounded-full bg-white text-black pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-500 hover:bg-[#703FEC] hover:text-white"
            >
              Contact the studio
              <span className="w-12 h-12 rounded-full bg-[#703FEC] text-white grid place-items-center transition-[transform,background-color] duration-500 group-hover/btn:-rotate-45 group-hover/btn:bg-white group-hover/btn:text-black">→</span>
            </button>
          </Magnetic>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 py-12 md:py-16">
        {/* Email and phone stacked in one column */}
        <div className="col-span-2 md:col-span-1">
          <Label>Contact</Label>
          <CopyEmail />
          <a href="tel:+971585203139" className="mt-2 block text-base md:text-lg font-semibold tracking-tight text-white/70 hover:text-[#b9a1ff] transition-colors">{PHONE}</a>
        </div>
        <div>
          <Label>Right now</Label>
          {here && !here.sameZone && (
            <p className="text-sm text-white/55">You · {here.city} <span className="tabular-nums">{here.time}</span></p>
          )}
          <p className="mt-0.5 text-base md:text-lg font-semibold tracking-tight">Dubai · <span className="tabular-nums">{here?.dubaiTime ?? '--:--'}</span>{here?.sameZone && <span className="text-white/50 font-normal text-sm"> · same as you</span>}</p>
          <p className="mt-1.5 flex items-start gap-2 text-xs text-white/50 max-w-[260px] leading-relaxed">
            <span className="relative mt-1 flex w-1.5 h-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            {here ? studioStatus(here.dubaiHour) : 'Taking on new projects.'}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>Follow</Label>
          <FooterLink href="https://www.instagram.com/natwicstudio">Instagram</FooterLink>
          <FooterLink href="https://www.linkedin.com/company/natwic/">LinkedIn</FooterLink>
        </div>
      </div>
    </div>

    <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-6 md:py-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
      <p>© 2026 Natwic Studio</p>
      <div className="flex items-center gap-6 md:gap-8">
        <button onClick={() => setView?.('privacy')} className="uppercase tracking-[0.3em] hover:text-white transition-colors">Privacy</button>
        <button onClick={() => setView?.('terms')} className="uppercase tracking-[0.3em] hover:text-white transition-colors">Terms</button>
        <button
          onClick={() => scrollToY(0)}
          aria-label="Back to top"
          className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-sm tracking-normal text-white/70 hover:text-white hover:border-[#703FEC] hover:bg-[#703FEC] transition-colors"
        >
          ↑
        </button>
      </div>
    </div>

    {/* Finale: the stars drift down into the wordmark; keep scrolling and it stretches, then launches you back up */}
    <motion.div style={{ scaleY: stretch, transformOrigin: '50% 100%' }}>
      <StarWordmark />
    </motion.div>
    <LaunchMeter pull={pull} launched={launched} />
  </footer>
);
};
