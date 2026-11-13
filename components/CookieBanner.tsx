import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from './nav';

/**
 * Asks once whether Google Analytics may set cookies, and remembers the answer.
 * Until someone accepts, consent mode in index.html keeps analytics cookieless.
 * The footer's "Cookies" link reopens it with `openCookieSettings()`.
 */

const KEY = 'natwic:cookies';
const OPEN_EVENT = 'natwic:cookie-settings';
const ease = [0.16, 1, 0.3, 1] as const;

type Choice = 'accepted' | 'declined';

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

const readChoice = (): Choice | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch { return null; }
};

const applyChoice = (c: Choice) => {
  try { localStorage.setItem(KEY, c); } catch { /* private mode: they'll be asked again next visit */ }
  window.gtag?.('consent', 'update', { analytics_storage: c === 'accepted' ? 'granted' : 'denied' });
};

/** A cookie that loses a bite when you accept it */
const Cookie: React.FC<{ bitten: boolean }> = ({ bitten }) => (
  <motion.svg
    viewBox="0 0 64 64"
    aria-hidden
    className="w-14 h-14 shrink-0"
    initial={{ rotate: -18, scale: 0.6, opacity: 0 }}
    animate={bitten ? { rotate: 20, scale: 0.9, opacity: 1 } : { rotate: -8, scale: 1, opacity: 1 }}
    whileHover={bitten ? undefined : { rotate: 8, scale: 1.06 }}
    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: bitten ? 0 : 0.25 }}
  >
    <defs>
      <mask id="cookie-bite">
        <rect width="64" height="64" fill="white" />
        <circle cx="56" cy="12" r="10" fill="black" />
        <circle cx="45" cy="5" r="6" fill="black" />
        <motion.g initial={false} animate={{ scale: bitten ? 1 : 0 }} style={{ originX: '18px', originY: '54px' }} transition={{ duration: 0.25, ease }}>
          <circle cx="12" cy="52" r="11" fill="black" />
          <circle cx="24" cy="60" r="8" fill="black" />
        </motion.g>
      </mask>
    </defs>
    <g mask="url(#cookie-bite)">
      <circle cx="32" cy="32" r="28" fill="#703FEC" />
      <circle cx="32" cy="32" r="22" fill="#8b5cf6" opacity="0.55" />
      <circle cx="22" cy="24" r="3.2" fill="#2a1260" />
      <circle cx="38" cy="30" r="2.6" fill="#2a1260" />
      <circle cx="28" cy="41" r="3" fill="#2a1260" />
      <circle cx="42" cy="44" r="2.2" fill="#2a1260" />
      <circle cx="17" cy="36" r="1.8" fill="#2a1260" />
      <circle cx="33" cy="18" r="1.6" fill="#b9a1ff" />
    </g>
  </motion.svg>
);

export const CookieBanner: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [bitten, setBitten] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Wait for the intro to clear before asking
    const t = readChoice() ? undefined : window.setTimeout(() => setOpen(true), 2200);
    const reopen = () => { setBitten(false); setOpen(true); };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => { if (t) window.clearTimeout(t); window.removeEventListener(OPEN_EVENT, reopen); };
  }, []);

  const choose = (c: Choice) => {
    applyChoice(c);
    if (c === 'accepted' && !reduce) {
      setBitten(true);
      window.setTimeout(() => setOpen(false), 550);
    } else setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: reduce ? 0 : 0.6, ease }}
          className="fixed z-[70] bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[380px] rounded-[1.75rem] border border-white/10 bg-[#141414] text-white shadow-[0_40px_100px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-48 h-48 rounded-full bg-[#703FEC]/20 blur-3xl" />
          <div className="relative p-5 md:p-6">
            <div className="flex items-start gap-4">
              <Cookie bitten={bitten} />
              <div className="min-w-0">
                <p className="text-lg font-bold tracking-[-0.02em] leading-tight">A cookie, if that’s okay?</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  We use Google Analytics to see which pages help people. No ads, and nothing is sold.{' '}
                  <Link href="/privacy" className="text-[#b9a1ff] hover:text-white transition-colors">Privacy policy</Link>
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => choose('declined')}
                className="flex-1 rounded-full border border-white/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                No thanks
              </button>
              <button
                onClick={() => choose('accepted')}
                className="flex-1 rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-black hover:bg-[#703FEC] hover:text-white transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
