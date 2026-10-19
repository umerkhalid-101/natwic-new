import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { POSTS } from './posts';
import { ease, Label, Meta, Cover, spaClick } from './parts';
import { Magnetic } from '../Magnetic';

/** "From the journal": the latest posts, shown on the home, studio and work pages. */
export const JournalTeaser: React.FC<{ onOpen: (slug: string) => void; onAll: () => void }> = ({ onOpen, onAll }) => {
  const posts = POSTS.slice(0, 3);
  const [hovered, setHovered] = useState<number | null>(null);

  // Cover that trails the cursor, tilting with its speed (same feel as the work list)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const vel = useMotionValue(0);
  const rotate = useSpring(useTransform(vel, [-1500, 1500], [-10, 10]), { stiffness: 180, damping: 20 });
  const last = useRef({ x: 0, t: 0 });

  const onMove = (e: React.PointerEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
    const now = performance.now();
    const dt = Math.max(16, now - last.current.t);
    vel.set(((e.clientX - last.current.x) / dt) * 1000);
    last.current = { x: e.clientX, t: now };
  };

  if (!posts.length) return null;

  return (
    <section aria-labelledby="journal-teaser" className="bg-white py-24 md:py-36">
      <div className="px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
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
          <div className="flex flex-col gap-6 max-w-md lg:items-end lg:max-w-xs">
            <p className="text-zinc-600 leading-relaxed lg:text-right">Straight answers on design, brands and building websites, written by the people who do the work.</p>
            <Magnetic strength={0.3}>
              <a href="/journal" onClick={spaClick(onAll)} className="group inline-flex items-center gap-4 self-start lg:self-end rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
                Read the journal
                <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <ul className="mt-16 md:mt-24" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
          {posts.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.9, ease, delay: i * 0.08 }}
              className="border-t border-zinc-200 last:border-b"
            >
              <a
                href={`/journal/${p.slug}`}
                onClick={spaClick(() => onOpen(p.slug))}
                onPointerEnter={() => setHovered(i)}
                className={`group block py-8 md:py-10 transition-opacity duration-500 ${hovered !== null && hovered !== i ? 'md:opacity-30' : ''}`}
              >
                {/* Phones get the cover inline */}
                <div className="md:hidden mb-6 overflow-hidden rounded-2xl"><Cover post={p} /></div>
                <div className="grid grid-cols-[1fr_auto] md:grid-cols-[4rem_1fr_auto] items-center gap-4 md:gap-8">
                  <span className="hidden md:block font-mono text-xs text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <Meta post={p} />
                    <p className="mt-3 text-2xl md:text-5xl font-bold tracking-[-0.045em] leading-[1.05] text-black transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-4 md:group-hover:text-[#703FEC]">
                      {p.title}
                    </p>
                  </div>
                  <span className="w-11 h-11 md:w-14 md:h-14 shrink-0 rounded-full border border-zinc-200 grid place-items-center text-black transition-all duration-500 group-hover:bg-[#703FEC] group-hover:border-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Cursor preview */}
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block" style={{ x, y, rotate }}>
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, scale: 0.8, clipPath: 'inset(50% 50% 50% 50% round 1.5rem)' }}
              animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 1.5rem)' }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, ease }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[400px] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <Cover post={posts[hovered]} eager />
              <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">{posts[hovered].readingMinutes} min read</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
