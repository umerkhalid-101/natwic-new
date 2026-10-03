import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

export const Footer: React.FC<FooterProps> = ({ setView, currentView }) => (
  <footer className="relative z-10 -mt-10 md:-mt-16 overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-[#0A0A0A] text-white shadow-[0_-30px_80px_rgba(0,0,0,0.25)]">
    {/* A soft glow rising behind the wordmark */}
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,rgba(112,63,236,0.28),transparent_70%)]" />

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12 md:py-16">
        <div className="col-span-2 md:col-span-1">
          <Label>Email</Label>
          <CopyEmail />
        </div>
        <div>
          <Label>Phone</Label>
          <a href="tel:+971585203139" className="text-base md:text-lg font-semibold tracking-tight text-white hover:text-[#b9a1ff] transition-colors">{PHONE}</a>
        </div>
        <div>
          <Label>Studio</Label>
          <p className="text-base md:text-lg font-semibold tracking-tight">Dubai · <DubaiClock /></p>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-white/50">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            Taking on new projects
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

    {/* Finale: the space section's stars drift down into the wordmark, which bleeds off the page */}
    <StarWordmark />
  </footer>
);
