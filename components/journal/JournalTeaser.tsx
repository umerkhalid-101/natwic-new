import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Post, frontPagePosts } from './posts';
import { ease, Label, Meta, Cover, spaClick } from './parts';
import { Magnetic } from '../Magnetic';

// Where each card sits in the pile, front to back
const SPOTS = [
  { rotate: -3, x: 0, y: 0, scale: 1 },
  { rotate: 4, x: 18, y: 10, scale: 0.96 },
  { rotate: 9, x: 34, y: 20, scale: 0.92 },
  { rotate: -7, x: -14, y: 26, scale: 0.88 },
];

// Plain backing cards so a journal with one or two posts still reads as a deck
const BLANKS = ['bg-[#703FEC]', 'bg-zinc-900'];

const pad = (n: number) => String(n).padStart(2, '0');

/** "From the journal": the latest posts as a deck of cards you drag through, on the home, studio and work pages. */
export const JournalTeaser: React.FC<{ onOpen: (slug: string) => void; onAll: () => void }> = ({ onOpen, onAll }) => {
  const posts = frontPagePosts(4);
  const [order, setOrder] = useState(() => posts.map((_, i) => i));
  const [dir, setDir] = useState(1);
  const dragged = useRef(false);

  if (!posts.length) return null;

  const active: Post = posts[order[0]];
  const canShuffle = posts.length > 1;
  const next = () => { setDir(1); setOrder((o) => [...o.slice(1), o[0]]); };
  const prev = () => { setDir(-1); setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]); };
  const bringToFront = (i: number) => { setDir(1); setOrder((o) => [i, ...o.filter((x) => x !== i)]); };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next();
    // Let the click that ends a drag pass without opening the post
    setTimeout(() => { dragged.current = false; }, 0);
  };

  const blanks = BLANKS.slice(0, Math.max(0, 3 - posts.length));

  return (
    <section aria-labelledby="journal-teaser" className="bg-white py-24 md:py-36 overflow-hidden">
      <div className="px-5 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-24 items-center">
        {/* The deck */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none pr-10 pb-10">
          <div className="relative aspect-[1200/630]">
            {blanks.map((bg, b) => (
              <motion.div
                key={bg}
                aria-hidden
                className={`absolute inset-0 rounded-3xl ${bg} shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)]`}
                initial={false}
                animate={SPOTS[posts.length + b]}
                style={{ zIndex: 0 }}
              />
            ))}

            {posts.map((p, i) => {
              const pos = order.indexOf(i);
              const top = pos === 0;
              return (
                <motion.div
                  key={p.slug}
                  className="absolute inset-0"
                  initial={false}
                  animate={SPOTS[pos]}
                  transition={{ duration: 0.7, ease }}
                  style={{ zIndex: posts.length - pos + 1 }}
                >
                  <motion.a
                    href={`/journal/${p.slug}`}
                    aria-label={top ? `Read: ${p.title}` : `Show: ${p.title}`}
                    tabIndex={top ? 0 : -1}
                    drag={top && canShuffle ? 'x' : false}
                    dragSnapToOrigin
                    dragElastic={0.6}
                    onDragStart={() => { dragged.current = true; }}
                    onDragEnd={onDragEnd}
                    onClick={(e) => {
                      if (dragged.current) { e.preventDefault(); return; }
                      if (!top) { e.preventDefault(); bringToFront(i); return; }
                      spaClick(() => onOpen(p.slug))(e);
                    }}
                    whileHover={top ? { y: -6, rotate: 1 } : undefined}
                    whileDrag={{ scale: 1.03, rotate: 0, cursor: 'grabbing' }}
                    style={{ touchAction: 'pan-y' }}
                    className={`group block overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] ${top && canShuffle ? 'cursor-grab' : 'cursor-pointer'}`}
                  >
                    <Cover post={p} framed eager={top} className="pointer-events-none select-none" />
                  </motion.a>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* What's on top */}
        <div>
          <Label>From the journal</Label>
          <h2 id="journal-teaser" className="mt-6 text-5xl md:text-7xl font-bold tracking-[-0.055em] leading-[0.92] text-black">
            Notes from <span className="italic text-[#703FEC]">the studio.</span>
          </h2>

          <div className="mt-10 md:mt-12 border-t border-zinc-200 pt-8 min-h-[13rem]">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.a
                key={active.slug}
                href={`/journal/${active.slug}`}
                onClick={spaClick(() => onOpen(active.slug))}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, y: 24 * d }),
                  center: { opacity: 1, y: 0 },
                  exit: (d: number) => ({ opacity: 0, y: -24 * d }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
                className="group block"
              >
                <div className="flex items-baseline gap-4">
                  {canShuffle && (
                    <span className="shrink-0 whitespace-nowrap font-mono text-xs text-[#703FEC]">{pad(order[0] + 1)} / {pad(posts.length)}</span>
                  )}
                  <Meta post={active} />
                </div>
                <p className="mt-4 text-2xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.08] text-black transition-colors duration-500 group-hover:text-[#703FEC]">{active.title}</p>
                {active.excerpt && <p className="mt-4 text-zinc-600 leading-relaxed line-clamp-3">{active.excerpt}</p>}
              </motion.a>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-5">
            <Magnetic strength={0.3}>
              <a href="/journal" onClick={spaClick(onAll)} className="group inline-flex items-center gap-4 rounded-full bg-black text-white pl-7 pr-2 py-2 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#703FEC] transition-colors">
                Read the journal
                <span className="w-11 h-11 rounded-full bg-[#703FEC] grid place-items-center transition-transform duration-500 group-hover:-rotate-45">→</span>
              </a>
            </Magnetic>
            {canShuffle && (
              <div className="flex items-center gap-3">
                <button onClick={prev} aria-label="Previous post" className="w-12 h-12 rounded-full border border-zinc-200 grid place-items-center text-black hover:border-black transition-colors">←</button>
                <button onClick={next} aria-label="Next post" className="w-12 h-12 rounded-full border border-zinc-200 grid place-items-center text-black hover:border-black transition-colors">→</button>
                <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  <span className="hidden md:inline">Drag</span><span className="md:hidden">Swipe</span> the cards
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
