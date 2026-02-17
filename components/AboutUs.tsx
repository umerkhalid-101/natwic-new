import React from 'react';
import { motion } from 'framer-motion';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-white text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-24 items-center">
        
        {/* Left: Prismatic Visual with Quote */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl md:aspect-[4/3.5]"
        >
            {/* Mesh Gradient Background Simulation */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                {/* Dark Base */}
                <div className="absolute inset-0 bg-[#1a1a1a]" />
                
                {/* Yellow/Lime Glow - Top Left */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#D4F238] rounded-full mix-blend-screen blur-[120px] opacity-60 animate-pulse duration-[6s]" />
                
                {/* Red/Orange Glow - Bottom Right */}
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#F3350C] rounded-full mix-blend-screen blur-[120px] opacity-60" />
                
                {/* Purple/Blue Depth - Center/Top Right */}
                <div className="absolute top-[30%] right-[10%] w-[50%] h-[50%] bg-[#703FEC] rounded-full mix-blend-screen blur-[100px] opacity-50" />
                
                {/* Grain overlay for texture */}
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
            </div>

            {/* Glass Card - Mobile: Flow layout / Desktop: Absolute centered */}
            <div className="relative md:absolute inset-0 flex items-center justify-center p-6 py-20 md:p-12">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-[2rem] w-full max-w-[22rem] md:max-w-md shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
                    {/* Subtle inner shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    
                    <p className="relative text-lg md:text-2xl font-medium text-white leading-relaxed text-center mb-10 tracking-wide">
                    "Great work doesn’t happen by accident. It comes from listening closely, challenging ideas, and obsessing over the details, that’s what we do every day."
                    </p>
                    
                    <div className="relative text-left border-t border-white/10 pt-6">
                        <p className="text-white font-bold text-base tracking-wide">Umar</p>
                        <p className="text-white/60 text-xs font-medium mt-1 tracking-wider">Founder of Natwic®</p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Right: Content */}
        <div className="lg:pl-8">
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white text-[12px] font-bold px-8 py-4 rounded-full flex items-center gap-3 transition-transform shadow-xl hover:shadow-2xl"
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