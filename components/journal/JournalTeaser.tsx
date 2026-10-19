import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { POSTS, Post } from './posts';
import { ease, Label, Meta, Cover, spaClick } from './parts';
import { Magnetic } from '../Magnetic';

const monthYear = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The lead story's cover: tilts toward the cursor, catches a glare, and a "Read" badge follows the pointer. */
const LeadCover: React.FC<{ post: Post }> = ({ post }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const spring = { stiffness: 160, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const badgeX = useSpring(bx, { stiffness: 300, damping: 28 });
  const badgeY = useSpring(by, { stiffness: 300, damping: 28 });
  const glare = useTransform([px, py], ([x, y]: number[]) =>
    `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.28), transparent 55%)`);

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    bx.set(e.clientX - r.left);
    by.set(e.clientY - r.top);
  };
  const onLeave = () => { px.set(0.5); py.set(0.5); setOver(false); };

  return (
    <div className="[perspective:1400px]">
      <motion.div
        ref={ref}
        onPointerEnter={(e) => { onMove(e); setOver(true); }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)]"
      >
        <Cover post={post} eager />
        <motion.div aria-hidden style={{ background: glare }} className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${over ? 'opacity-100' : 'opacity-0'}`} />
        <AnimatePresence>
          {over && (
            <motion.span
              aria-hidden
              style={{ x: badgeX, y: badgeY }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="pointer-events-none absolute left-0 top-0 -ml-12 -mt-12 hidden md:grid w-24 h-24 place-items-center rounded-full bg-[#703FEC] text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-xl"
            >
              Read
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/** A slow news-ticker of every topic the journal covers */
const Ticker: React.FC<{ items: string[] }> = ({ items }) => {
  const reduce = useReducedMotion();
  // Repeat short lists so the strip is always wider than the screen
  const row = Array.from({ length: Math.max(2, Math.ceil(12 / items.length)) }, () => items).flat();
  return (
    <div aria-hidden className="overflow-hidden border-b border-black py-3">
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: row.length * 2.5, ease: 'linear', repeat: Infinity }}
      >
        {[row, row].map((r, k) => (
          <div key={k} className="flex shrink-0">
            {r.map((t, i) => (
              <span key={i} className="flex items-center gap-6 pr-6 text-[11px] font-bold uppercase tracking-[0.35em] text-black whitespace-nowrap">
                {t}
                <span className="text-[#703FEC]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/** "From the journal": a newspaper front page of the latest posts, on the home, studio and work pages. */
export const JournalTeaser: React.FC<{ onOpen: (slug: string) => void; onAll: () => void }> = ({ onOpen, onAll }) => {
  const [lead, ...side] = POSTS.slice(0, 3);
  if (!lead) return null;

  const topics = [...new Set(POSTS.flatMap((p) => p.tags))];
  const count = POSTS.length;

  return (
    <section aria-labelledby="journal-teaser" className="bg-white py-24 md:py-36">
      <div className="px-5 md:px-12 max-w-7xl mx-auto">
        {/* Masthead */}
        <div className="border-t-[3px] border-black">
          <div className="flex items-center justify-between gap-4 border-b border-black py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-black whitespace-nowrap">
            <span>The Natwic Journal</span>
            <span className="hidden md:inline">{count} {count === 1 ? 'entry' : 'entries'}</span>
            <span className="text-zinc-500"><span className="hidden sm:inline">Updated </span>{monthYear(lead.date)}</span>
          </div>
          {topics.length > 0 && <Ticker items={topics} />}
        </div>

        <div className="mt-12 md:mt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <Label>From the journal</Label>
            <h2 id="journal-teaser" className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.055em] leading-[0.9] text-black">
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" initial={{ y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease }}>
                  Notes from
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block italic text-[#703FEC]" initial={{ y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease, delay: 0.08 }}>
                  the studio.
                </motion.span>
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-zinc-600 leading-relaxed lg:text-right">Straight answers on design, brands and building websites, written by the people who do the work.</p>
        </div>

        {/* Front page: lead story, then a ruled column of the next ones */}
        <div className="mt-14 md:mt-20 grid lg:grid-cols-[1.65fr_1fr] gap-14 lg:gap-0">
          <motion.a
            href={`/journal/${lead.slug}`}
            onClick={spaClick(() => onOpen(lead.slug))}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease }}
            className="group block lg:pr-12"
          >
            <LeadCover post={lead} />
            <div className="mt-8 flex items-baseline gap-4">
              <span className="shrink-0 whitespace-nowrap font-mono text-xs text-[#703FEC]">Nº 01</span>
              <Meta post={lead} />
            </div>
            <p className="mt-4 text-3xl md:text-5xl font-bold tracking-[-0.045em] leading-[1.02] text-black transition-colors duration-500 group-hover:text-[#703FEC]">{lead.title}</p>
            {lead.excerpt && <p className="mt-5 max-w-2xl text-lg text-zinc-600 leading-relaxed">{lead.excerpt}</p>}
          </motion.a>

          <div className="lg:border-l lg:border-black lg:pl-12 flex flex-col">
            {side.map((p, i) => (
              <motion.a
                key={p.slug}
                href={`/journal/${p.slug}`}
                onClick={spaClick(() => onOpen(p.slug))}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.1 }}
                className={`group block ${i > 0 ? 'mt-10 pt-10 border-t border-zinc-200' : ''}`}
              >
                <div className="overflow-hidden rounded-2xl">
                  <Cover post={p} framed />
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <span className="shrink-0 whitespace-nowrap font-mono text-xs text-[#703FEC]">Nº {String(i + 2).padStart(2, '0')}</span>
                  <Meta post={p} />
                </div>
                <p className="mt-3 text-xl md:text-2xl font-bold tracking-[-0.035em] leading-[1.15] text-black transition-colors duration-500 group-hover:text-[#703FEC]">{p.title}</p>
              </motion.a>
            ))}

            {/* The way into the full journal; it fills the column when there are few posts */}
            <div className={`${side.length ? 'mt-10 pt-10 border-t border-zinc-200' : ''} ${side.length < 2 ? 'flex-1 flex flex-col justify-end' : ''}`}>
              {side.length < 2 && (
                <p className="text-2xl md:text-3xl font-bold tracking-[-0.035em] leading-[1.15] text-black">
                  More notes are <span className="italic text-[#703FEC]">on the way.</span>
                </p>
              )}
              <Magnetic strength={0.3}>
                <a href="/journal" onClick={spaClick(onAll)} className={`group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors ${side.length < 2 ? 'mt-6' : ''}`}>
                  Read the journal
                  <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
