import React from 'react';
import { motion } from 'framer-motion';

interface StudioPreviewProps {
  setView: (view: 'home' | 'contact' | 'studio') => void;
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({ setView }) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white text-black border-t border-zinc-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-24 items-center">
        
        {/* Left: Animated Gradient Visual with Quote */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#050505] shadow-2xl min-h-[500px] md:min-h-[650px] flex items-center justify-center group"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.7, 0.4],
                        rotate: [0, 45, 0]
                    }}
                    transition={{ 
                        duration: 15, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#703FEC] rounded-full blur-[140px] mix-blend-screen opacity-50"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        x: [0, -30, 0],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ 
                        duration: 12, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#F3350C] rounded-full blur-[140px] mix-blend-screen opacity-50"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        y: [0, 30, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                        duration: 18, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] mix-blend-screen opacity-40"
                />
                
                {/* Noise Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
            </div>

            {/* Glass Card - Bigger and Rectangular */}
            <div className="relative z-20 w-full max-w-2xl px-6 md:px-12">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden transition-transform duration-700 hover:scale-[1.01]">
                    {/* Subtle inner shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    
                    <p className="relative text-2xl md:text-4xl font-medium text-white leading-[1.2] text-center mb-10 tracking-tight">
                    "Great work doesn’t happen by accident. It comes from listening closely, challenging ideas, and obsessing over the details."
                    </p>
                    
                    <div className="relative text-center border-t border-white/10 pt-8">
                        <p className="text-white font-bold text-lg tracking-wide">Umar</p>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mt-2">Founder of Natwic®</p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Right: Content */}
        <div className="lg:pl-4">
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
          >
              <div className="flex gap-3 items-center mb-8">
                <div className="w-1.5 h-1.5 bg-[#F3350C] rounded-full" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">About us</p>
              </div>
              
              <h2 className="text-4xl md:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-12 text-black">
                We’re a hands-on digital agency building thoughtful solutions for ambitious brands.
              </h2>
              
              <motion.button 
                onClick={() => setView('studio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white text-[12px] font-bold px-8 py-4 rounded-full flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:bg-zinc-900"
              >
                More about us 
                <div className="w-1.5 h-1.5 bg-[#F3350C] rounded-full" />
              </motion.button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};