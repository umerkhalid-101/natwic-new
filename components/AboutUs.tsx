import React from 'react';
import { motion } from 'framer-motion';

export const AboutUs: React.FC = () => {
  return (
    <section id="studio" className="py-32 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Prismatic/Aurora Visual with Quote */}
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden group">
          {/* Aurora Gradient Layer - Shifted to Purples */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#703fec] via-[#a855f7] via-[#6366f1] via-[#c084fc] to-[#703fec] opacity-80 blur-xl scale-110 animate-pulse duration-[10s] will-change-[transform,opacity]" />
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-3xl border border-white/20 p-10 md:p-14 rounded-[2.5rem] max-w-md relative z-10 shadow-2xl text-center"
            >
              <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-10">
                "Great work doesn't happen by accident. It comes from listening closely, challenging ideas, and obsessing over the details — that's what we do every day."
              </p>
              <div>
                <p className="text-sm font-bold text-white mb-1">Umer Khalid</p>
                <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-semibold">Co-founder of Natwic®</p>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white font-bold text-2xl tracking-tighter opacity-50 select-none">
            Natwic®
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:pl-10">
          <div className="flex gap-2 items-center mb-8">
            <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_10px_rgba(112,63,236,0.8)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">About us</p>
          </div>
          <h2 className="text-4xl md:text-[56px] font-semibold tracking-tight leading-[1.05] mb-10">
            We're a hands-on digital agency building thoughtful solutions for ambitious brands.
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed mb-12 max-w-lg font-medium">
            Strategic storytelling combined with technical excellence. We bridge the gap between imagination and implementation.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white text-[10px] font-bold px-10 py-5 rounded-full uppercase tracking-widest flex items-center gap-4 group"
          >
            More about us <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full group-hover:scale-125 transition-transform shadow-[0_0_8px_#703FEC]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};