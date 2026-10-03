import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

// Cursor position as CSS variables, for the violet light that moves across the letters
const track = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
};

/**
 * The footer sign-off in heavy Poppins. Oversized and cropped, kept quiet, with a violet
 * light that follows the cursor.
 */
export const FooterWordmark: React.FC = () => (
  <div
    onPointerMove={track}
    onPointerLeave={(e) => e.currentTarget.style.setProperty('--x', '-60%')}
    className="relative overflow-hidden select-none [--x:-60%] [--y:40%]"
  >
    <motion.p
      aria-label="Natwic Studio"
      initial={{ y: '45%', opacity: 0 }}
      whileInView={{ y: '0%', opacity: 1 }}
      // amount 0: the word is partly cropped below the page edge, so any visible part should trigger it
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.4, ease }}
      style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
      className="flex justify-center whitespace-nowrap font-black uppercase tracking-[-0.055em] text-[12.6vw] leading-[0.8] -mb-[2.6vw] text-transparent bg-clip-text [-webkit-background-clip:text] [background-image:radial-gradient(30vw_circle_at_var(--x)_var(--y),rgba(150,112,255,0.95),rgba(150,112,255,0.35)_35%,rgba(255,255,255,0.2)_70%)]"
    >
      Natwic Studio
    </motion.p>
  </div>
);
