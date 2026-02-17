import React from 'react';
import { motion } from 'framer-motion';

interface StudioPreviewProps {
  setView: (view: 'home' | 'contact' | 'studio') => void;
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({ setView }) => {
  return (
    <section className="py-32 px-6 md:px-12 bg-white text-black border-t border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-black group cursor-pointer shadow-2xl"
              onClick={() => setView('studio')}
            >
                <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                    alt="Studio Culture"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/20">
                        <span className="text-white text-3xl">→</span>
                    </div>
                </div>
                <div className="absolute bottom-10 left-10 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">Internal</p>
                    <p className="text-2xl font-medium tracking-tight">Inside the Natwic® Lab</p>
                </div>
            </motion.div>

            <div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex gap-3 items-center mb-8">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">The Studio</p>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8">
                        Where pure intent meets digital craftsmanship.
                    </h2>

                    <p className="text-lg text-zinc-500 mb-12 leading-relaxed font-medium">
                        We are a collective of multidisciplinary experts obsessed with detail. We don't just build websites; we engineer legacy-grade digital experiences that define categories.
                    </p>

                    <button 
                        onClick={() => setView('studio')}
                        className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-[#703FEC] transition-colors"
                    >
                        <span className="border-b-2 border-black pb-1 group-hover:border-[#703FEC] transition-colors">Enter the Studio</span>
                        <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
};