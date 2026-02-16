import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [springX, springY]);

  return (
    <section id="services" className="py-32 px-6 relative overflow-hidden bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-24 border-b border-zinc-900 pb-12">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-4">Capabilities</p>
            <h2 className="text-6xl font-bold tracking-tighter">Services.</h2>
          </div>
          <span className="text-[#703FEC] font-mono text-xl">(04)</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {SERVICES.map((service) => (
            <div 
              key={service.id}
              className="relative py-20 group cursor-pointer"
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex flex-col md:flex-row gap-12 items-center relative z-10 transition-colors group-hover:text-[#703FEC]">
                <div className="text-zinc-400 font-mono text-xl group-hover:text-[#703FEC]">{service.number}</div>
                <div className="flex-1">
                  <h3 className="text-5xl md:text-8xl font-bold mb-0 transition-all duration-700 group-hover:translate-x-12">
                    {service.title}
                  </h3>
                </div>
                <div className="max-w-xs hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-right">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                    {service.tags.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hover Image Portal */}
        <AnimatePresence>
          {hoveredId && (
            <motion.div 
              style={{
                left: springX,
                top: springY,
                x: "-50%",
                y: "-50%",
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 50
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 h-[450px] overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl"
            >
              <img 
                src={SERVICES.find(s => s.id === hoveredId)?.imageUrl} 
                className="w-full h-full object-cover grayscale transition-all duration-700 scale-110"
                alt="Service Preview"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#703FEC]/60 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};