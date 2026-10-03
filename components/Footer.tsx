import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { Magnetic } from './Magnetic';
import { scrollToY } from './smoothScroll';

interface FooterProps {
  setView?: (view: 'home' | 'contact' | 'studio' | 'privacy' | 'terms') => void;
  currentView?: string;
}

const EMAIL = 'hello@natwic.com';
const PHONE = '+971 58 520 3139';
const ease = [0.16, 1, 0.3, 1] as const;

// Cursor position as CSS variables, for the spotlight and the wordmark light
const track = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
};

/** Live time in Dubai, so visitors anywhere know when we're around. */
const DubaiClock: React.FC = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{time || '--:--'}</span>;
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
      <span className="text-lg md:text-2xl font-semibold tracking-tight text-white group-hover:text-[#b9a1ff] transition-colors">{EMAIL}</span>
      <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${copied ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/45 group-hover:text-white'}`}>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
};

const BAND = ['Web design', 'Branding', 'Content', 'Social media', 'Start a project'];

const MarqueeBand: React.FC<{ tone: 'violet' | 'white'; rotate: number; reverse?: boolean; onClick: () => void }> = ({ tone, rotate, reverse, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Start a project"
    className={`group/band absolute left-[-5%] w-[110%] top-1/2 -translate-y-1/2 overflow-hidden py-3 md:py-4 ${tone === 'violet' ? 'bg-[#703FEC] text-white z-10' : 'bg-white text-black'}`}
    style={{ rotate: `${rotate}deg` }}
  >
    <div className={`flex w-max gap-0 [animation:footer-marquee_28s_linear_infinite] group-hover/band:[animation-duration:60s] motion-reduce:[animation:none] ${reverse ? '[animation-direction:reverse]' : ''}`}>
      {[0, 1].map((k) => (
        <span key={k} className="flex shrink-0 items-center">
          {Array.from({ length: 3 }).flatMap((_, r) =>
            BAND.map((w) => (
              <span key={`${r}-${w}`} className="flex items-center gap-6 md:gap-8 pr-6 md:pr-8 text-2xl md:text-4xl font-bold tracking-tight whitespace-nowrap">
                {w}
                <span className={tone === 'violet' ? 'text-white/50' : 'text-[#703FEC]'}>✦</span>
              </span>
            )),
          )}
        </span>
      ))}
    </div>
  </button>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-white/[0.07] py-3 text-sm font-medium text-white/70 hover:text-white transition-colors">
    {children}
    <span className="text-white/30 transition-all duration-300 group-hover:text-[#703FEC] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
  </a>
);

export const Footer: React.FC<FooterProps> = ({ setView, currentView }) => (
  <footer className="pt-24 md:pt-32 px-4 md:px-6 border-t border-zinc-900 overflow-hidden bg-black text-white">
    <style>{`@keyframes footer-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    {/* Call to action */}
    <div className="max-w-7xl mx-auto mb-20 md:mb-28">
      <div
        onPointerMove={track}
        className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-zinc-900 bg-zinc-950 px-6 py-20 md:p-28 text-center group [--x:50%] [--y:30%]"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),rgba(112,63,236,0.28),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="flex justify-center mb-10 md:mb-12"
          >
            <Logo variant="mark" className="w-16 h-16 md:w-20 md:h-20" />
          </motion.div>

          <h2 className="text-[clamp(2.75rem,8vw,7rem)] font-bold tracking-[-0.04em] leading-[1.02] mb-12 md:mb-16">
            {[0, 1].map((i) => (
              <span key={i} className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease, delay: i * 0.1 }}
                >
                  {i === 0 ? 'Build your legacy' : <>with <span className="text-[#703FEC] italic">Natwic®</span></>}
                </motion.span>
              </span>
            ))}
          </h2>

          {currentView !== 'contact' && (
            <Magnetic strength={0.3}>
              <button
                onClick={() => setView?.('contact')}
                className="group/btn inline-flex items-center gap-4 rounded-full bg-white text-black pl-8 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 hover:bg-[#703FEC] hover:text-white shadow-[0_0_60px_rgba(112,63,236,0.25)]"
              >
                Contact the studio
                <span className="w-11 h-11 rounded-full bg-black text-white grid place-items-center transition-transform duration-500 group-hover/btn:-rotate-45">→</span>
              </button>
            </Magnetic>
          )}
        </div>
      </div>
    </div>

    {/* Two crossing bands of what we do; click through to start a project */}
    <div className="relative -mx-4 md:-mx-6 h-36 md:h-44 mb-16 md:mb-24">
      <MarqueeBand tone="violet" rotate={-3} onClick={() => setView?.('contact')} />
      <MarqueeBand tone="white" rotate={2.5} reverse onClick={() => setView?.('contact')} />
    </div>

    {/* Details */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20 md:mb-24">
      <div className="md:col-span-5 space-y-6">
        <div className="flex items-center gap-3">
          <Logo variant="mark" className="w-7 h-7" />
          <span className="text-xl font-bold uppercase tracking-tighter">Natwic®</span>
        </div>
        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
          A web design and branding studio based in Dubai, working with startups and small businesses worldwide.
        </p>
        <p className="flex items-center gap-2.5 text-xs font-semibold text-white/60">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          Taking on new projects · Dubai <DubaiClock />
        </p>
      </div>

      <div className="md:col-span-4 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#F3350C]">Say hello</p>
        <CopyEmail />
        <a href="tel:+971585203139" className="block text-sm font-medium text-white/60 hover:text-white transition-colors">{PHONE}</a>
      </div>

      <div className="md:col-span-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#F3350C] mb-2">Connect</p>
        <FooterLink href="https://www.instagram.com/natwicstudio">Instagram</FooterLink>
        <FooterLink href="https://www.linkedin.com/company/natwic/">LinkedIn</FooterLink>
      </div>
    </div>

    <div className="max-w-7xl mx-auto border-t border-zinc-900 py-8 md:py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">
      <p>© 2026 Natwic Studio. Pure Intent.</p>
      <div className="flex items-center gap-8">
        <button onClick={() => setView?.('privacy')} className="uppercase tracking-[0.4em] hover:text-white transition-colors">Privacy</button>
        <button onClick={() => setView?.('terms')} className="uppercase tracking-[0.4em] hover:text-white transition-colors">Terms</button>
        <button
          onClick={() => scrollToY(0)}
          aria-label="Back to top"
          className="w-9 h-9 rounded-full border border-zinc-800 grid place-items-center text-sm tracking-normal text-white/60 hover:text-white hover:border-[#703FEC] hover:bg-[#703FEC] transition-colors"
        >
          ↑
        </button>
      </div>
    </div>

    {/* Wordmark: grab a letter and throw it; it springs back */}
    <div className="relative select-none -mx-4 md:-mx-6 pb-[3vw]">
      <p className="text-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/25 mb-2 md:mb-4 hidden md:block">Grab a letter</p>
      <div aria-hidden className="flex justify-center text-[24vw] font-bold tracking-tighter leading-[0.8]">
        {'NATWIC'.split('').map((ch, i) => (
          <motion.span
            key={i}
            drag
            dragSnapToOrigin
            dragElastic={0.9}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 12 }}
            initial={{ y: '30%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease, delay: i * 0.05 }}
            whileHover={{ y: -12, color: '#703FEC' }}
            whileDrag={{ scale: 1.08, rotate: i % 2 ? 8 : -8, color: '#703FEC', zIndex: 10 }}
            className="inline-block cursor-grab active:cursor-grabbing text-white/[0.08] touch-none"
          >
            {ch}
          </motion.span>
        ))}
      </div>
    </div>
  </footer>
);
