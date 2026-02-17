import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const MaskedText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div className="overflow-hidden py-4 -my-4" style={{ transform: 'translateZ(0)' }}>
    <motion.div
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }}
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
      x: ["-10%", "10%", "-2%", "2%", "-10%"],
      y: ["-5%", "5%", "10%", "-10%", "-5%"],
      scale: [1, 1.2, 0.9, 1.1, 1],
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
      <div className="absolute top-0 left-0 w-full z-30 px-8 flex justify-between items-center h-20 opacity-5" />
    </div>
  </div>
);

interface HeroProps {
  setView?: (view: 'home' | 'contact' | 'studio') => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, 0.96]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
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
          transition={{ duration: 0.8 }}
        >
          <HeroSkeleton />
        </motion.div>
      ) : (
        <motion.section
          key="content"
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-screen pt-24 md:pt-32 bg-white flex flex-col overflow-hidden"
        >
          {/* Main Heading - Refined for visibility on all screens */}
          <div className="container mx-auto px-4 md:px-12 mb-6 select-none relative z-10 w-full overflow-hidden text-center">
            <MaskedText>
              <h1 className="text-[12.5vw] md:text-[14vw] font-extrabold text-black leading-[0.9] tracking-[-0.06em] lg:tracking-[-0.08em] inline-block">
                NatwicStudio
              </h1>
            </MaskedText>
          </div>

          {/* Main Visual Container */}
          <motion.div 
            style={{ scale }}
            className="relative mx-auto w-[98vw] rounded-2xl md:rounded-[3.5rem] overflow-hidden bg-black flex-1 min-h-[70vh] md:min-h-[82vh] shadow-[0_40px_100px_rgba(0,0,0,0.2)] mb-4 will-change-transform"
          >
            {/* Plasma Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
               <img 
                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500" 
                 className="w-full h-full object-cover opacity-20 scale-110"
                 alt="Natwic Background"
                 loading="eager"
               />
               
               <div className="absolute inset-0 z-0">
                 <PlasmaBlob color="#703FEC" duration={22} size="80vw" initialPos={{ x: "-10%", y: "-10%" }} />
                 <PlasmaBlob color="#a855f7" duration={25} delay={3} size="70vw" initialPos={{ x: "50%", y: "20%" }} />
               </div>

               <div className="absolute inset-0 bg-black/50 backdrop-blur-[60px] pointer-events-none" />
               <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#703FEC] rounded-full blur-[200px] opacity-30 mix-blend-screen pointer-events-none" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-24 pb-24 md:pb-36">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-16">
                <div className="max-w-4xl">
                  <MaskedText delay={0.6}>
                    <p className="text-[9px] md:text-xs font-bold uppercase tracking-[0.7em] mb-4 md:mb-8 text-white/50">ESTABLISHED TWENTY TWENTY FIVE</p>
                  </MaskedText>
                  <MaskedText delay={0.8}>
                    <h2 className="text-3xl md:text-[4.5rem] font-bold text-white leading-[1.1] tracking-[-0.04em]">
                      Not just a studio,<br/><span className="italic text-white/40 font-medium">we are Natwic.</span>
                    </h2>
                  </MaskedText>
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setView?.('contact')}
                  className="flex items-center gap-4 md:gap-5 bg-white/5 backdrop-blur-3xl border border-white/10 p-2 md:p-3 pr-6 md:pr-8 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img src="https://i.pravatar.cc/100?u=natwic_mark" className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio Lead" />
                    <div className="absolute -top-1 -right-1 w-2.5 md:w-3.5 h-2.5 md:h-3.5 bg-[#703FEC] rounded-full border-2 border-zinc-950" />
                  </div>
                  <div className="text-white">
                    <p className="text-xs md:text-sm font-bold leading-none mb-1 md:mb-1.5 group-hover:text-[#703FEC] transition-colors duration-500">Contact Mark</p>
                    <p className="text-[8px] md:text-[9px] font-bold text-white/30 uppercase tracking-[0.25em]">Principal Design</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Soft Scroll Hint */}
            <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-40 text-center opacity-40">
               <motion.div 
                 animate={{ y: [0, 8, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.6em] text-white flex items-center gap-4 md:gap-6"
               >
                 <span className="w-8 md:w-12 h-[1px] bg-white/10" />
                 SCROLL
                 <span className="w-8 md:w-12 h-[1px] bg-white/10" />
               </motion.div>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};