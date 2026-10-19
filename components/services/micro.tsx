/** Micro-interactions for the themed service pages. All of them stand down for reduced motion. */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ease } from '../work/rich/blocks';
import type { Theme } from './themes';

export const MICRO_CSS = `
details[open] > p { animation: mi-faq .45s cubic-bezier(.16,1,.3,1); }
@keyframes mi-faq { from { opacity: 0; transform: translateY(-6px); } }
.group:hover .mi-spark { animation: mi-draw .9s cubic-bezier(.16,1,.3,1) forwards; }
@keyframes mi-draw { from { stroke-dashoffset: 140; } to { stroke-dashoffset: 0; } }
@keyframes mi-wobble { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-10deg) scale(1.08) } 75% { transform: rotate(8deg) scale(1.05) } }
.mi-wobble:hover { animation: mi-wobble .6s ease; }
@media (prefers-reduced-motion: reduce) { details[open] > p, .group:hover .mi-spark, .mi-wobble:hover { animation: none; } }
`;

/** A thin bar in the theme's accent that fills as you read */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden className="fixed left-0 right-0 top-0 z-[101] h-[3px] origin-left" style={{ scaleX, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />;
};

/** Words that rise in one after another when the heading scrolls into view */
export const RevealWords: React.FC<{ text: string }> = ({ text }) => {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" initial={reduce ? false : { y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease, delay: i * 0.05 }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </>
  );
};

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

/** Text that decodes from random glyphs, replayed whenever `play` changes to true */
export const ScrambleText: React.FC<{ text: string; play: boolean }> = ({ text, play }) => {
  const [out, setOut] = useState(text);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!play || reduce) { setOut(text); return; }
    let frame = 0;
    const total = 18;
    const id = window.setInterval(() => {
      frame += 1;
      const done = Math.floor((frame / total) * text.length);
      setOut(text.split('').map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[(i * 7 + frame) % GLYPHS.length])).join(''));
      if (frame >= total) { clearInterval(id); setOut(text); }
    }, 32);
    return () => clearInterval(id);
  }, [play, text, reduce]);
  return <span aria-label={text}><span aria-hidden>{out}</span></span>;
};

/** Types its text out once it scrolls into view */
export const Typewriter: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!inView || reduce) return;
    setN(0);
    let i = 0;
    const id = window.setInterval(() => { i += 1; setN(i); if (i >= text.length) clearInterval(id); }, 28);
    return () => clearInterval(id);
  }, [inView, reduce, text]);
  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      {n < text.length && <span aria-hidden className="ml-0.5 inline-block w-1.5 h-3 align-middle bg-[var(--accent)]" />}
    </span>
  );
};

/** Theme-specific overlay that appears when a card is hovered */
export const CardHoverFx: React.FC<{ theme: Theme }> = ({ theme }) => {
  if (theme.key === 'blueprint') {
    // Figma-style padding guides with measurements
    const band = 'absolute bg-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100';
    const tag = 'absolute rounded bg-pink-500 px-1 font-mono text-[9px] leading-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100';
    return (
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <span className={`${band} inset-x-0 top-0 h-7 md:h-9`} />
        <span className={`${band} inset-x-0 bottom-0 h-7 md:h-9`} />
        <span className={`${band} inset-y-0 left-0 w-7 md:w-9`} />
        <span className={`${band} inset-y-0 right-0 w-7 md:w-9`} />
        <span className={`${tag} left-1/2 top-2 -translate-x-1/2`}>36</span>
        <span className={`${tag} left-2 top-1/2 -translate-y-1/2`}>36</span>
        <span className="absolute inset-7 md:inset-9 border border-[color:var(--accent-2)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
    );
  }
  if (theme.key === 'editorial') {
    // A swatch strip slides up from the bottom edge
    return (
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex h-2 translate-y-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
        {['#F3350C', '#703FEC', '#E8B04B', '#2F6B4F', '#1d1712'].map((c, i) => <span key={c} className="flex-1 transition-transform duration-500" style={{ background: c, transitionDelay: `${i * 40}ms` }} />)}
      </span>
    );
  }
  if (theme.key === 'product') {
    // A soft accent ring
    return <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent-2) 55%, transparent), 0 0 60px color-mix(in srgb, var(--accent) 25%, transparent)' }} />;
  }
  if (theme.key === 'terminal') {
    // A scanline sweeps across the card
    return <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full -translate-y-full bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-y-full" />;
  }
  return null;
};

/** Live coordinates that follow the cursor across the blueprint hero */
export const CursorCoords: React.FC<{ container: React.RefObject<HTMLElement> }> = ({ container }) => {
  const tag = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = container.current;
    const t = tag.current;
    if (!el || !t || reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = Math.round(e.clientX - r.left);
      const y = Math.round(e.clientY - r.top);
      t.style.opacity = '1';
      t.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
      t.textContent = `x ${x}  y ${y}`;
    };
    const leave = () => { t.style.opacity = '0'; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [container, reduce]);
  return <span ref={tag} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[5] whitespace-pre rounded bg-[var(--accent-2)] px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity duration-200" />;
};

const SHAPE_COLORS = ['#F3350C', '#703FEC', '#E8B04B', '#2F6B4F', '#1d1712'];

/** Brand shapes that wobble on hover and change color when clicked */
export const BrandShapes: React.FC = () => {
  const [c, setC] = useState([0, 1, 2]);
  const shapes = [
    { cls: 'right-[5%] top-[7%] w-20 h-20 rounded-full', delay: '0s' },
    { cls: 'right-[14%] top-[5%] w-12 h-12 rounded-[30%]', delay: '-2s' },
    { cls: 'right-[11%] top-[15%] w-9 h-9', delay: '-4s' },
  ];
  return (
    <div className="absolute inset-0 hidden xl:block pointer-events-none z-[2]">
      {shapes.map((s, i) => (
        <span key={i} className={`th-float absolute ${s.cls}`} style={{ animationDelay: s.delay }}>
          <button
            type="button"
            aria-label="Change shape color"
            onClick={() => setC((prev) => prev.map((v, k) => (k === i ? (v + 1) % SHAPE_COLORS.length : v)))}
            className="mi-wobble pointer-events-auto block w-full h-full cursor-pointer transition-colors duration-500"
            style={{ background: SHAPE_COLORS[c[i]], borderRadius: 'inherit' }}
          />
        </span>
      ))}
    </div>
  );
};
