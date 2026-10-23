import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { lockScroll, unlockScroll } from './smoothScroll';

const BEAT = 0.5; // the ball pulses, then stretches into a line
const OPEN = 0.55; // the two halves part to reveal the page
const OPEN_AT = BEAT - 0.05;
const curtain = [0.76, 0, 0.24, 1] as const;

/**
 * The first-visit intro, about a second long. It starts on exactly what
 * index.html paints before hydration (black, a 24px white ball in the middle),
 * and only animates transforms and opacity so it stays smooth on phones.
 */
export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const reduce = useReducedMotion();
  // Wide enough for the stretched ball to run past both edges
  const stretch = typeof window === 'undefined' ? 80 : (window.innerWidth / 24) * 1.1;

  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    unlockScroll();
    onComplete();
  };

  useEffect(() => {
    // The loader now covers the page, so drop the placeholder index.html showed before hydration
    document.documentElement.classList.remove('intro-pending');
    lockScroll();
    // The animation ends the intro; this only catches a tab that never paints it
    const t = window.setTimeout(finish, 4000);
    return () => { window.clearTimeout(t); unlockScroll(); };
  }, []);

  if (reduce) {
    return (
      <motion.div aria-hidden className="fixed inset-0 z-[9999] bg-[#050505]" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} onAnimationComplete={finish} />
    );
  }

  const half = 'absolute inset-x-0 h-1/2 bg-[#050505] will-change-transform';
  return (
    <div aria-hidden className="fixed inset-0 z-[9999] pointer-events-auto">
      <motion.div className={`${half} top-0`} initial={{ y: 0 }} animate={{ y: '-100%' }} transition={{ duration: OPEN, ease: curtain, delay: OPEN_AT }} />
      <motion.div className={`${half} bottom-0`} initial={{ y: 0 }} animate={{ y: '100%' }} transition={{ duration: OPEN, ease: curtain, delay: OPEN_AT }} onAnimationComplete={finish} />
      <motion.div
        className="absolute left-1/2 top-1/2 -ml-3 -mt-3 h-6 w-6 rounded-full bg-white will-change-transform"
        initial={{ scaleX: 1, scaleY: 1, opacity: 1 }}
        animate={{ scaleX: [1, 1.3, 1, stretch], scaleY: [1, 1.3, 1, 0.1], opacity: 0 }}
        transition={{
          scaleX: { duration: BEAT, times: [0, 0.3, 0.55, 1], ease: ['easeOut', 'easeIn', [0.65, 0, 0.35, 1]] },
          scaleY: { duration: BEAT, times: [0, 0.3, 0.55, 1], ease: ['easeOut', 'easeIn', [0.65, 0, 0.35, 1]] },
          opacity: { duration: 0.25, delay: OPEN_AT + 0.05 },
        }}
      />
    </div>
  );
};
