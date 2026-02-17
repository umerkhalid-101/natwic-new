import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Slightly shorter duration for snappier feel
    const duration = 2000;
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Quartic ease out for smooth counting
      const ease = 1 - Math.pow(1 - rawProgress, 4); 
      
      setProgress(Math.round(ease * 100));

      if (rawProgress < 1) {
        requestAnimationFrame(frame);
      } else {
        // Trigger exit animation
        setIsExiting(true);
        
        // Wait for the expansion animation to cover the screen before completing
        setTimeout(() => {
            onComplete();
            document.body.style.overflow = 'unset';
        }, 800);
      }
    };

    requestAnimationFrame(frame);

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      // We don't fade out the container immediately, we let the white ball fill it first
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.1 } }}
    >
        <div className="relative flex flex-col items-center justify-center w-full h-full">
            
            {/* Bouncing Ball */}
            <motion.div
                className="bg-white rounded-full absolute z-20"
                initial={{ width: 24, height: 24, y: 0 }}
                animate={isExiting ? {
                    scale: 250, // Massive scale to fill viewport (white transition)
                    y: 0 
                } : {
                    y: [0, -80, 0], // Bounce height
                    scaleY: [0.7, 1.1, 0.7], // Squash at bottom, stretch in air
                    scaleX: [1.3, 0.9, 1.3]  // Inverse squash
                }}
                transition={isExiting ? {
                    duration: 0.8,
                    ease: [0.85, 0, 0.15, 1] // Aggressive ease for the fill
                } : {
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                }}
            />

            {/* Counter Text */}
            <AnimatePresence>
                {!isExiting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        className="relative z-10 mt-40 text-white mix-blend-difference"
                    >
                        <div className="flex flex-col items-center">
                            <h1 className="text-[12vw] md:text-[8vw] font-bold tracking-tighter tabular-nums leading-none">
                                {progress}
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mt-4">
                                Loading 
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none z-0" />
        </div>
    </motion.div>
  );
};