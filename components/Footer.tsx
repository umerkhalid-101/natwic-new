import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIALS } from './socials';
import { Magnetic } from './Magnetic';
import { scrollToY } from './smoothScroll';
import { FooterWordmark } from './FooterWordmark';

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

/* ------------------------------------------------------------------ */
/* The brief: a sentence the visitor fills in, handed to Contact       */
/* ------------------------------------------------------------------ */

const NEEDS = [
  { label: 'a website', service: 'Web Design & Dev' },
  { label: 'a brand identity', service: 'Branding & Identity' },
  { label: 'content that sells', service: 'Content & Strategy' },
  { label: 'a social presence', service: 'Social & Marketing' },
  { label: 'a bit of everything', service: 'Web Design & Dev' },
];
const FOR = ['my startup', 'my SaaS product', 'my small business', 'a brand new idea'];
const WHEN = ['as soon as possible', 'next month', 'in two or three months', 'whenever it’s right'];

/** An inline blank that opens a short list of options. */
const Pick: React.FC<{ value: number; options: string[]; onChange: (i: number) => void; label: string }> = ({ value, options, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${options[value]}`}
        onClick={() => setOpen((o) => !o)}
        className="group relative inline-flex items-baseline gap-[0.2em] text-white transition-colors hover:text-[#b9a1ff]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '60%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-60%', opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="inline-block"
          >
            {options[value]}
          </motion.span>
        </AnimatePresence>
        <span aria-hidden className={`text-[0.45em] text-[#703FEC] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
        <span aria-hidden className="absolute left-0 right-0 -bottom-[0.06em] h-[3px] rounded-full bg-[#703FEC]/60 transition-colors duration-300 group-hover:bg-[#b9a1ff]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease }}
            className="absolute left-0 top-full z-30 mt-3 min-w-[15rem] text-base leading-normal tracking-normal rounded-2xl border border-white/10 bg-[#141414]/95 p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            {options.map((o, i) => (
              <li key={o} role="option" aria-selected={i === value}>
                <button
                  type="button"
                  onClick={() => { onChange(i); setOpen(false); }}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-base font-semibold tracking-tight transition-colors ${i === value ? 'bg-[#703FEC] text-white' : 'text-white/75 hover:bg-white/[0.06] hover:text-white'}`}
                >
                  {o}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </span>
  );
};

/** A text blank that grows with what's typed. */
const Blank = React.forwardRef<HTMLInputElement, { value: string; onChange: (v: string) => void; placeholder: string; label: string; onEnter: () => void }>(
  ({ value, onChange, placeholder, label, onEnter }, ref) => (
    <span className="relative inline-grid align-baseline">
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre">{value || placeholder}</span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="name"
        maxLength={40}
        size={1}
        className="col-start-1 row-start-1 w-full min-w-0 bg-transparent text-white placeholder:text-white/25 outline-none caret-[#703FEC]"
      />
      <span aria-hidden className={`absolute left-0 right-0 -bottom-[0.06em] h-[3px] rounded-full transition-colors duration-300 ${value ? 'bg-[#703FEC]/60' : 'bg-white/15'}`} />
    </span>
  ),
);

const Brief: React.FC<{ onSend: () => void }> = ({ onSend }) => {
  const [name, setName] = useState('');
  const [need, setNeed] = useState(0);
  const [who, setWho] = useState(0);
  const [when, setWhen] = useState(1);
  const [nudge, setNudge] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const ready = name.trim().length > 0;

  const send = () => {
    if (!ready) { setNudge((n) => n + 1); nameRef.current?.focus(); return; }
    const message = `Hi Natwic, I'm ${name.trim()}. I need ${NEEDS[need].label} for ${FOR[who]}, ideally ${WHEN[when]}.`;
    try { sessionStorage.setItem('natwic:prefill', JSON.stringify({ name: name.trim(), service: NEEDS[need].service, message })); } catch { /* Contact opens empty */ }
    onSend();
  };

  const line = 'block overflow-visible';
  return (
    <div className="pb-14 md:pb-20 border-b border-white/[0.08]">
      <p className="flex items-center gap-3 mb-8 md:mb-10 text-[11px] font-bold uppercase tracking-[0.4em] text-white/50">
        <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.8)]" />
        Start with a sentence
      </p>
      <motion.form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease }}
        className="text-[clamp(1.85rem,4.6vw,4.25rem)] font-bold tracking-[-0.04em] leading-[1.25] text-white/35"
      >
        <span className={line}>
          Hi Natwic, I’m{' '}
          <span className="whitespace-nowrap">
            <motion.span key={nudge} animate={nudge ? { x: [0, -10, 9, -6, 4, 0] } : {}} transition={{ duration: 0.45 }} className="inline-block">
              <Blank ref={nameRef} value={name} onChange={setName} placeholder="your name" label="Your name" onEnter={send} />
            </motion.span>
            .
          </span>
        </span>
        <span className={line}>
          I need <Pick label="What you need" value={need} options={NEEDS.map((n) => n.label)} onChange={setNeed} />
        </span>
        <span className={line}>
          for <Pick label="Who it's for" value={who} options={FOR} onChange={setWho} />,
        </span>
        <span className={line}>
          ideally <Pick label="When" value={when} options={WHEN} onChange={setWhen} />.
        </span>

        <span className="mt-8 md:mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 text-base tracking-normal leading-normal">
          <Magnetic strength={0.3}>
            <button
              type="submit"
              className={`group/btn inline-flex items-center gap-4 rounded-full pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-500 ${ready ? 'bg-[#703FEC] text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-[#703FEC] hover:text-white'}`}
            >
              Send this brief
              <span className={`w-12 h-12 rounded-full grid place-items-center transition-[transform,background-color,color] duration-500 group-hover/btn:-rotate-45 ${ready ? 'bg-white text-black' : 'bg-[#703FEC] text-white'}`}>→</span>
            </button>
          </Magnetic>
          <span className="text-sm font-medium text-white/40">We reply within one working day.</span>
        </span>
      </motion.form>
    </div>
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
      {currentView !== 'contact' ? (
        <Brief onSend={() => setView?.('contact')} />
      ) : (
        <div className="pb-14 md:pb-20 border-b border-white/[0.08]">
          <h2 className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold tracking-[-0.045em] leading-[1.05]">
            Rather just talk? <a href="mailto:hello@natwic.com" className="text-[#b9a1ff] hover:text-white transition-colors">hello@natwic.com</a>
          </h2>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 py-12 md:py-16">
        {/* Email and phone stacked in one column */}
        <div className="col-span-2 md:col-span-1">
          <Label>Contact</Label>
          <CopyEmail />
          <a href="tel:+971585203139" className="mt-2 block text-base md:text-lg font-semibold tracking-tight text-white/70 hover:text-[#b9a1ff] transition-colors">{PHONE}</a>
        </div>
        <div className="col-span-2 md:col-span-1">
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
          {SOCIALS.map((s) => <FooterLink key={s.name} href={s.href}>{s.name}</FooterLink>)}
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

    <FooterWordmark />
  </footer>
);
};
