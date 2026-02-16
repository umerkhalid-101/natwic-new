
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Explicitly type MaskedText as React.FC to fix children prop missing errors
const MaskedText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div className="overflow-hidden py-2">
    <motion.div
      {...({
        initial: { y: "100%" },
        animate: { y: 0 },
        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }
      } as any)}
    >
      {children}
    </motion.div>
  </div>
);

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.96]);

  return (
    <section id="home" className="relative min-h-screen pt-32 bg-white flex flex-col overflow-hidden">
      {/* Massive Background Text */}
      <div className="container mx-auto px-6 md:px-12 mb-6 select-none relative z-10 w-full">
        <div className="flex justify-between items-baseline w-full">
          <div className="flex-1 text-left">
            <MaskedText>
              <h1 className="text-[14vw] font-bold text-black leading-[0.85] tracking-[-0.06em]">
                Natwic
              </h1>
            </MaskedText>
          </div>
          <div className="flex-1 text-right">
            <MaskedText delay={0.1}>
              <h1 className="text-[14vw] font-bold text-black leading-[0.85] tracking-[-0.06em]">
                Studio
              </h1>
            </MaskedText>
          </div>
        </div>
      </div>

      {/* Main Visual Container */}
      <motion.div 
        style={{ scale }}
        className="relative mx-auto w-[98vw] rounded-2xl md:rounded-[3rem] overflow-hidden bg-zinc-950 flex-1 min-h-[82vh] shadow-[0_30px_80px_rgba(0,0,0,0.2)] mb-4"
      >
        {/* Category Tabs with Dotted Lines */}
        <div className="absolute top-0 left-0 w-full z-30 px-8 flex justify-between items-center text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
          {['Web design', 'Branding', 'Content', 'Social media'].map((cat, i) => (
            <div 
              key={cat} 
              className={`flex-1 text-center py-8 md:py-10 transition-colors cursor-pointer hover:text-white relative ${i === 0 ? 'text-white' : ''}`}
            >
              {cat}
              <div className="absolute bottom-0 left-6 right-6 border-b border-dotted border-white/10" />
            </div>
          ))}
        </div>

        {/* Dynamic Prismatic Animation */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0">
             <motion.div 
               animate={{ 
                 rotate: [0, 360],
                 scale: [1, 1.2, 1],
                 x: [-40, 40, -40],
                 y: [-20, 20, -20]
               }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute top-[-25%] left-[-25%] w-[150%] h-[150%] bg-gradient-to-tr from-[#703FEC]/40 via-[#F3350C]/20 via-emerald-400/10 via-[#703FEC]/30 to-[#F3350C]/40 blur-[130px] opacity-60"
             />
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
        </motion.div>

        {/* Content Layer */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-20 pb-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl">
              <MaskedText delay={0.4}>
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.6em] mb-6 text-white/40">DISCOVER NATWIC STUDIO</p>
              </MaskedText>
              <MaskedText delay={0.5}>
                <h2 className="text-5xl md:text-[6rem] font-semibold text-white leading-[0.9] tracking-[-0.05em]">
                  Not just a studio,<br/>we are <span className="text-[#703FEC]">Unforgettable.</span>
                </h2>
              </MaskedText>
            </div>

            {/* Profile Badge */}
            <motion.div 
              {...({
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 1.2, duration: 1 }
              } as any)}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 p-2 pr-6 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="relative">
                <img src="https://i.pravatar.cc/100?u=natwic_mark" className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="Mark" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F3350C] rounded-full border-2 border-zinc-950" />
              </div>
              <div className="text-white">
                <p className="text-xs font-semibold leading-none mb-1 group-hover:text-[#703FEC] transition-colors">Contact Mark</p>
                <p className="text-[9px] font-medium text-white/30 uppercase tracking-[0.2em]">Creative Lead</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Centered Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-center">
           <div className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/30 flex items-center gap-5">
             <span className="opacity-40">REVEAL</span>
             <span className="w-8 h-[1px] bg-white/20" />
             <span className="text-white/60 animate-pulse">SCROLL TO REVEAL</span>
             <span className="w-8 h-[1px] bg-white/20" />
             <span className="opacity-40">REVEAL</span>
           </div>
        </div>
      </motion.div>
    </section>
  );
};
