import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const MaskedText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div className="overflow-hidden py-2" style={{ transform: 'translateZ(0)' }}>
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  </div>
);

const PlasmaBlob: React.FC<{ 
  color: string; 
  duration: number; 
  delay?: number; 
  size: string;
  initialPos: { x: string; y: string }
}> = ({ color, duration, delay = 0, size, initialPos }) => (
  <motion.div
    className={`absolute rounded-full blur-[140px] mix-blend-screen opacity-50 pointer-events-none`}
    style={{ 
      backgroundColor: color, 
      width: size, 
      height: size,
      left: initialPos.x,
      top: initialPos.y,
    }}
    animate={{
      x: ["-15%", "15%", "-5%", "5%", "-15%"],
      y: ["-8%", "8%", "15%", "-15%", "-8%"],
      scale: [1, 1.3, 0.85, 1.15, 1],
      rotate: [0, 120, 240, 360],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  />
);

const HeroSkeleton: React.FC = () => (
  <div className="relative min-h-screen pt-32 bg-white flex flex-col overflow-hidden">
    <div className="container mx-auto px-6 md:px-12 mb-6 w-full animate-pulse">
      <div className="flex justify-between items-baseline w-full opacity-10">
        <div className="h-[14vw] w-[45%] bg-zinc-200 rounded-2xl" />
        <div className="h-[14vw] w-[45%] bg-zinc-200 rounded-2xl" />
      </div>
    </div>
    <div className="relative mx-auto w-[98vw] rounded-2xl md:rounded-[3rem] overflow-hidden bg-zinc-100 flex-1 min-h-[82vh] mb-4">
      <div className="absolute top-0 left-0 w-full z-30 px-8 flex justify-between items-center h-20 opacity-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 w-20 bg-black rounded" />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
    </div>
  </div>
);

export const Hero: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.98]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSkeleton />
        </motion.div>
      ) : (
        <motion.section
          key="content"
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen pt-32 bg-white flex flex-col overflow-hidden"
        >
          {/* Massive Background Text - Joined as NatwicStudio */}
          <div className="container mx-auto px-6 md:px-12 mb-6 select-none relative z-10 w-full">
            <div className="flex justify-center items-baseline w-full overflow-hidden">
              <MaskedText>
                <h1 className="text-[14vw] font-bold text-black leading-[0.85] tracking-[-0.08em] whitespace-nowrap">
                  NatwicStudio
                </h1>
              </MaskedText>
            </div>
          </div>

          {/* Main Visual Container */}
          <motion.div 
            style={{ scale }}
            className="relative mx-auto w-[98vw] rounded-2xl md:rounded-[3rem] overflow-hidden bg-black flex-1 min-h-[82vh] shadow-[0_30px_80px_rgba(0,0,0,0.2)] mb-4 will-change-transform"
          >
            {/* Plasma Visual Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
               {/* Robust high fidelity abstract visual */}
               <img 
                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500" 
                 className="w-full h-full object-cover opacity-25 scale-105"
                 alt="Natwic Background Visual"
                 loading="eager"
               />
               
               {/* Plasma Blobs Animation - Switched to Purples */}
               <div className="absolute inset-0 z-0">
                 <PlasmaBlob 
                   color="#703FEC" 
                   duration={18} 
                   size="70vw" 
                   initialPos={{ x: "-5%", y: "-5%" }} 
                 />
                 <PlasmaBlob 
                   color="#a855f7" 
                   duration={22} 
                   delay={2} 
                   size="60vw" 
                   initialPos={{ x: "45%", y: "15%" }} 
                 />
                 <PlasmaBlob 
                   color="#4f46e5" 
                   duration={20} 
                   delay={1} 
                   size="50vw" 
                   initialPos={{ x: "15%", y: "55%" }} 
                 />
               </div>

               {/* Overlay Grain and Blur */}
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[50px] mix-blend-overlay pointer-events-none" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />
               
               {/* Purple Gradient at Bottom Left */}
               <div className="absolute bottom-[-15%] left-[-15%] w-[70%] h-[70%] bg-[#703FEC] rounded-full blur-[160px] opacity-40 mix-blend-screen pointer-events-none" />
            </div>

            {/* Category Tabs */}
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

            {/* Content Layer */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-20 pb-32">
              <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                <div className="max-w-3xl">
                  <MaskedText delay={0.4}>
                    <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.6em] mb-6 text-white/60">DISCOVER NATWIC STUDIO</p>
                  </MaskedText>
                  <MaskedText delay={0.5}>
                    <h2 className="text-5xl md:text-[6.5rem] font-semibold text-white leading-[0.9] tracking-[-0.05em]">
                      Not just a studio,<br/>we are <span className="text-white drop-shadow-[0_0_20px_rgba(112,63,236,0.6)]">Natwic.</span>
                    </h2>
                  </MaskedText>
                </div>

                {/* Profile Badge */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 p-2 pr-6 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group will-change-transform"
                >
                  <div className="relative">
                    <img src="https://i.pravatar.cc/100?u=natwic_mark" className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="Natwic Lead" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#703FEC] rounded-full border-2 border-zinc-950 shadow-[0_0_8px_#703FEC]" />
                  </div>
                  <div className="text-white">
                    <p className="text-xs font-semibold leading-none mb-1 group-hover:text-[#703FEC] transition-colors">Contact Mark</p>
                    <p className="text-[9px] font-medium text-white/30 uppercase tracking-[0.2em]">Principal Design</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-center">
               <div className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/30 flex items-center gap-5">
                 <span className="opacity-40">REVEAL</span>
                 <span className="w-8 h-[1px] bg-white/20" />
                 <span className="text-white/60 animate-pulse">SCROLL TO EXPLORE</span>
                 <span className="w-8 h-[1px] bg-white/20" />
                 <span className="opacity-40">REVEAL</span>
               </div>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};