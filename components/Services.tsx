import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { SERVICES } from '../constants';
import { ServiceItem } from '../types';
import { useTilt, Spotlight } from './interactions';
import { Magnetic } from './Magnetic';

const THEMES = [
  { card: 'bg-zinc-100 text-black', muted: 'text-zinc-600', chip: 'bg-white text-black', line: 'border-zinc-300', button: 'bg-black text-white' },
  { card: 'bg-[#0A0A0A] text-white', muted: 'text-white/60', chip: 'bg-white/10 text-white', line: 'border-white/15', button: 'bg-white text-black' },
  { card: 'bg-[#703FEC] text-white', muted: 'text-white/75', chip: 'bg-white/15 text-white', line: 'border-white/25', button: 'bg-white text-black' },
  { card: 'bg-white text-black border border-zinc-200', muted: 'text-zinc-600', chip: 'bg-zinc-100 text-black', line: 'border-zinc-200', button: 'bg-black text-white' },
];

const ServiceCard: React.FC<{
  service: ServiceItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onStart?: () => void;
}> = ({ service, index, total, progress, onStart }) => {
  const theme = THEMES[index % THEMES.length];
  // Earlier cards shrink slightly as the later ones stack over them
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - index - 1) * 0.04]);
  // ...and dim a little, so the active card reads as "on top"
  const dim = useTransform(progress, [Math.min(1, (index + 0.85) / total), Math.min(1, (index + 1.3) / total)], [0, index === total - 1 ? 0 : 0.3]);
  const { px, py, handlers } = useTilt(0);

  // Image wipes open and drifts as the card scrolls through
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imgProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(imgProgress, [0, 1], ['-12%', '12%']);
  const clip = useTransform(imgProgress, [0, 0.35], ['inset(18% 18% 18% 18% round 2rem)', 'inset(0% 0% 0% 0% round 2rem)']);
  const spot = index === 1 ? 'rgba(112,63,236,0.35)' : index === 2 ? 'rgba(255,255,255,0.18)' : 'rgba(112,63,236,0.14)';

  return (
    <div className="sticky h-auto" style={{ top: `calc(6rem + ${index * 1.5}rem)` }}>
      <motion.article
        style={{ scale }}
        {...handlers}
        className={`group/card relative overflow-hidden origin-top rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 lg:min-h-[68vh] shadow-[0_-20px_60px_rgba(0,0,0,0.06)] ${theme.card}`}
      >
        <Spotlight x={px} y={py} color={spot} size={600} />
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-30 bg-black" />
        <span aria-hidden className={`pointer-events-none absolute -right-4 -bottom-10 md:-bottom-16 z-0 font-bold leading-none tracking-tighter text-[10rem] md:text-[18rem] opacity-[0.06] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-4`}>{service.number}</span>
        <div className="relative z-10 flex flex-col justify-between gap-8">
          <div>
            <div className={`flex items-center justify-between border-b pb-5 mb-8 md:mb-12 ${theme.line}`}>
              <span className="font-mono text-sm">{service.number} / {String(total).padStart(2, '0')}</span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.muted}`}>Capability</span>
            </div>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6 md:mb-8">
              {service.title.split('').map((ch, i) => (
                <span
                  key={i}
                  className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-1.5"
                  style={{ transitionDelay: `${i * 18}ms` }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </h3>
            <p className={`text-base md:text-xl leading-relaxed max-w-lg ${theme.muted}`}>{service.description}</p>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {service.tags.map((tag) => (
                <span key={tag} className={`rounded-full px-4 py-2 text-xs font-semibold cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F3350C] hover:text-white ${theme.chip}`}>{tag}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <p className={`text-xs ${theme.muted}`}>
                <span className="font-bold uppercase tracking-[0.2em] text-[10px] mr-2">Ideal for</span>
                {service.idealFor}
              </p>
              {onStart && (
                <Magnetic strength={0.35}>
                  <button
                    onClick={onStart}
                    className={`group shrink-0 self-start inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-[12px] font-bold transition-transform hover:scale-[1.05] ${theme.button}`}
                  >
                    Start a project
                    <span className="w-8 h-8 rounded-full bg-[#703FEC] text-white flex items-center justify-center transition-transform duration-500 group-hover:-rotate-45">→</span>
                  </button>
                </Magnetic>
              )}
            </div>
          </div>
        </div>

        <motion.div ref={imageRef} style={{ clipPath: clip }} className="relative z-10 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] h-48 md:h-72 lg:h-auto">
          <motion.img
            src={service.imageUrl}
            alt={service.title}
            loading="lazy"
            decoding="async"
            style={{ y: imgY, scale: 1.25 }}
            className="absolute inset-0 w-full h-full object-cover grayscale-[30%] transition-[filter] duration-700 group-hover/card:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#703FEC]/30 to-transparent mix-blend-multiply transition-opacity duration-700 group-hover/card:opacity-0" />
        </motion.div>
      </motion.article>
    </div>
  );
};

interface ServicesProps {
  setView?: (view: 'home' | 'contact' | 'studio' | 'work') => void;
}

export const Services: React.FC<ServicesProps> = ({ setView }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="services" className="relative z-10 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-40px_100px_rgba(0,0,0,0.45)] pt-20 md:pt-28 pb-24 md:pb-40 px-2 md:px-3 bg-white text-black">
      <div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20 px-4 md:px-9">
          <div>
            <div className="flex gap-3 items-center mb-6">
              <div className="w-1.5 h-1.5 bg-[#F3350C] rounded-full" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Capabilities</p>
            </div>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85]">
              Services<span className="text-[#703FEC]">.</span>
            </h2>
          </div>
          <div className="flex items-end gap-6 max-w-md">
            <p className="text-zinc-600 text-base leading-relaxed">
              Four ways we help startups and local businesses grow. Pick one, or combine them into a single project.
            </p>
            <span className="text-[#703FEC] font-mono text-lg shrink-0">(04)</span>
          </div>
        </div>

        <div ref={stackRef} className="relative flex flex-col gap-6 md:gap-10 pb-[10vh]">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              total={SERVICES.length}
              progress={scrollYProgress}
              onStart={setView ? () => setView('contact') : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
