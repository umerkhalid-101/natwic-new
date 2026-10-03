import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { lockScroll, unlockScroll } from './smoothScroll';

const ease = [0.16, 1, 0.3, 1] as const;

export type Work = { id: number; title: string; image: string; year: string; category: string; summary: string; url?: string; domain?: string };

// Live client sites shown on the home page; covers are captured from each site
export const WORKS: Work[] = [
  { id: 1, title: 'Unita', category: 'Web platform', year: '', domain: 'unitaw.com', url: 'https://unitaw.com/', image: '/work/unitaw.jpg', summary: 'A directory where verified businesses find each other.' },
  { id: 2, title: 'Folionomics', category: 'Fintech · Product UI', year: '', domain: 'folionomics.com', url: 'https://www.folionomics.com/', image: '/work/folionomics.jpg', summary: 'Wallets and DeFi positions in one clear view.' },
  { id: 3, title: 'Breakthirty', category: 'Marketing · Website', year: '', domain: 'breakthirty.com', url: 'https://www.breakthirty.com/', image: '/work/breakthirty.jpg', summary: 'A growth marketing agency site built to convert.' },
  { id: 4, title: 'Beyond Hut', category: 'Remote staffing · Website', year: '', domain: 'beyondhut.com', url: 'https://beyondhut.com/', image: '/work/beyondhut.jpg', summary: 'Remote property teams, without the overhead.' },
  { id: 5, title: 'Cayano', category: 'Property · Website', year: '', domain: 'cayano.co.uk', url: 'https://cayano.co.uk/', image: '/work/cayano.jpg', summary: 'Property management that puts people first.' },
];

export const pad = (n: number) => String(n).padStart(2, '0');

export const CaseStudy: React.FC<{
  index: number;
  onClose: () => void;
  onGo: (i: number) => void;
  onAll: () => void;
}> = ({ index, onClose, onGo, onAll }) => {
  const work = WORKS[index];
  const next = WORKS[(index + 1) % WORKS.length];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lockScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  });

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} case study`}
      initial={{ backgroundColor: 'rgba(8,8,8,0)' }}
      animate={{ backgroundColor: 'rgba(8,8,8,1)' }}
      exit={{ backgroundColor: 'rgba(8,8,8,0)', transition: { duration: 0.5, delay: 0.1 } }}
      className="fixed inset-0 z-[200] text-white"
    >
      <div ref={scrollRef} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
        {/* Top bar */}
        <motion.div {...fadeUp(0.3)} className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 md:px-12 py-5 bg-gradient-to-b from-[#080808] to-transparent">
          <span className="font-mono text-sm text-white/60">Case study {pad(index + 1)} / {pad(WORKS.length)}</span>
          <button
            onClick={onClose}
            aria-label="Close case study"
            className="group w-14 h-14 rounded-full bg-white text-black flex items-center justify-center transition-colors hover:bg-[#703FEC] hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-500 group-hover:rotate-90"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </motion.div>

        <div className="max-w-7xl mx-auto px-5 md:px-12 pt-6 flex flex-col gap-12 md:gap-16">
          {/* Title */}
          <div className="flex flex-col gap-6">
            <motion.p {...fadeUp(0.35)} className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a98bff]">{work.category} — {work.year}</motion.p>
            <div className="overflow-hidden">
              <motion.h2
                key={work.id}
                initial={{ y: '100%' }}
                animate={{ y: 0, transition: { duration: 1, delay: 0.3, ease } }}
                exit={{ opacity: 0 }}
                className="text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-[-0.05em] leading-[0.85] pb-2"
              >
                {work.title}
              </motion.h2>
            </div>
            <motion.p {...fadeUp(0.5)} className="max-w-2xl text-lg md:text-xl text-white/65 leading-relaxed">{work.summary}</motion.p>
          </div>

        </div>

        {/* Hero image (morphs from the card), edge to edge */}
        <motion.div
          key={`hero-${work.id}`}
          initial={{ clipPath: 'inset(12% 10% 12% 10% round 2.5rem)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 0rem)', opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="relative w-full h-[70vh] md:h-[92vh] my-12 md:my-16 overflow-hidden bg-zinc-900"
        >
          <img src={work.image} alt={work.title} className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-5 md:px-12 pb-24 flex flex-col gap-12 md:gap-16">

          {/* Meta */}
          <motion.dl {...fadeUp(0.6)} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-3xl overflow-hidden">
            {[
              ['Client', '[Client name]'],
              ['Discipline', work.category],
              ['Year', work.year],
              ['Deliverables', '[e.g. Logo, website]'],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#080808] py-5 pr-4 flex flex-col gap-1.5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">{k}</dt>
                <dd className="text-base font-semibold">{v}</dd>
              </div>
            ))}
          </motion.dl>

          {/* Story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              ['01', 'The challenge', '[What problem did the client have? Who were they trying to reach, and what wasn’t working?]'],
              ['02', 'Our approach', '[The key decisions: direction, structure, and what you designed and built.]'],
            ].map(([n, t, d], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, root: scrollRef }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className="rounded-[2rem] bg-white/[0.06] p-8 md:p-10 flex flex-col gap-4"
              >
                <span className="font-mono text-[#a98bff]">{n}</span>
                <h3 className="text-[1.75rem] font-bold tracking-tight">{t}</h3>
                <p className="text-base leading-relaxed text-white/70">{d}</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, root: scrollRef }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="rounded-[2rem] bg-[#703FEC] p-8 md:p-10 flex flex-col gap-4"
            >
              <span className="font-mono text-white/80">03</span>
              <h3 className="text-[1.75rem] font-bold tracking-tight">The outcome</h3>
              <p className="text-5xl font-extrabold tracking-[-0.04em] leading-none">[Result]</p>
              <p className="text-base leading-relaxed text-white/85">[One real, measurable result: signups, bookings, launch date.]</p>
            </motion.div>
          </div>

          {/* Detail shots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {['20% 30%', '80% 70%'].map((pos, i) => (
              <motion.div
                key={pos}
                initial={{ clipPath: 'inset(20% 20% 20% 20% round 2rem)', opacity: 0 }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', opacity: 1 }}
                viewport={{ once: true, root: scrollRef }}
                transition={{ duration: 1.1, delay: i * 0.1, ease }}
                className="overflow-hidden rounded-[2rem] aspect-[4/3]"
              >
                <img src={work.image} alt={`${work.title} detail ${i + 1}`} style={{ objectPosition: pos }} className="w-full h-full object-cover scale-150 transition-transform duration-1000 hover:scale-[1.65]" />
              </motion.div>
            ))}
          </div>

          {/* Next project */}
          <button
            onClick={() => onGo((index + 1) % WORKS.length)}
            className="group relative overflow-hidden rounded-[2rem] md:rounded-[3rem] text-left min-h-[280px] md:min-h-[360px] flex flex-col justify-end p-8 md:p-14"
          >
            <img src={next.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-1000 group-hover:opacity-80 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 mb-4">Next project</p>
                <p className="text-5xl md:text-8xl font-bold tracking-[-0.05em] leading-[0.85]">{next.title}</p>
              </div>
              <span className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center text-2xl transition-all duration-500 group-hover:bg-[#703FEC] group-hover:text-white group-hover:-rotate-45">→</span>
            </div>
          </button>

          <button onClick={onAll} className="self-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white border-b border-white/30 pb-2 transition-colors">
            See all projects
          </button>
        </div>
      </div>
    </motion.div>
  );
};
