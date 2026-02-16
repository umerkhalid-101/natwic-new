import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPERTS = [
  { id: 1, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", radius: 180, speed: 50, offset: 0 },
  { id: 2, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150", radius: 180, speed: 50, offset: 120 },
  { id: 3, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", radius: 180, speed: 50, offset: 240 },
  { id: 4, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", radius: 110, speed: 40, offset: 60 },
  { id: 5, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150", radius: 110, speed: 40, offset: 180 },
  { id: 6, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150", radius: 110, speed: 40, offset: 300 },
];

const CHAT_MESSAGES = [
  { id: 1, sender: 'client', text: 'Hey!', avatar: 'https://i.pravatar.cc/100?u=u1' },
  { id: 2, sender: 'client', text: 'The website looks awesome' },
  { id: 3, sender: 'client', text: 'Can we update the homepage banner?' },
  { id: 4, sender: 'studio', text: 'Hi Philip!', avatar: 'https://i.pravatar.cc/100?u=natwic_mark' },
  { id: 5, sender: 'studio', text: "Sure, we'll have our team on it" },
];

const ExpertOrbital = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0c0c0c] overflow-hidden">
      {/* Orbital Rings */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[360px] h-[360px] border border-white/5 rounded-full" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute w-[220px] h-[220px] border border-white/5 rounded-full" 
      />
      
      {/* Center Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-[180px]"
      >
        <h3 className="text-xl md:text-2xl font-medium tracking-tight leading-tight text-white/90">
          A strong team of experts
        </h3>
      </motion.div>

      {/* Orbiting Portraits */}
      {EXPERTS.map((exp) => (
        <motion.div
          key={exp.id}
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ duration: exp.speed, repeat: Infinity, ease: "linear" }}
          style={{
            width: 0,
            height: 0,
            transformOrigin: "center",
            rotate: exp.offset
          }}
        >
          <div 
            style={{ 
              transform: `translateY(-${exp.radius}px)` 
            }}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: exp.speed, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-zinc-900 shadow-2xl flex items-center justify-center cursor-pointer group"
              style={{ rotate: -exp.offset }}
              whileHover={{ scale: 1.2, borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <img 
                src={exp.img} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                alt="Expert"
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CollaborationChat = () => {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => (prev < CHAT_MESSAGES.length ? prev + 1 : 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full h-[260px] relative overflow-hidden mt-6">
      <AnimatePresence mode="popLayout">
        {CHAT_MESSAGES.slice(0, visibleCount).map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.9, x: msg.sender === 'studio' ? 20 : -20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className={`flex items-end gap-3 ${msg.sender === 'studio' ? 'flex-row-reverse' : ''}`}
          >
            {msg.avatar ? (
              <img src={msg.avatar} className="w-9 h-9 rounded-full border border-zinc-200 shadow-sm shrink-0" alt="Avatar" />
            ) : (
              <div className="w-9 h-9 shrink-0" />
            )}
            <div 
              className={`px-5 py-3 rounded-2xl text-[13px] font-medium shadow-sm leading-tight transition-all duration-300 ${
                msg.sender === 'studio' 
                  ? 'bg-black text-white rounded-br-none' 
                  : 'bg-white text-black rounded-bl-none border border-zinc-100'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const WhyUs: React.FC = () => {
  return (
    <section className="pt-32 pb-80 px-6 md:px-12 bg-[#f7f7f5] text-black overflow-hidden relative">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          {/* Section Tag */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-2 items-center pt-3 min-w-[200px]"
          >
            <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.6)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Why work with us</p>
          </motion.div>
          {/* Main Headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-[56px] font-semibold tracking-tight leading-[1.1] max-w-4xl"
          >
            We help ambitious brands make their mark—with clarity and precision.
          </motion.h2>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:min-h-[700px]">
        {/* Left: Huge Expert Orbital Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full h-[500px] lg:h-auto rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <ExpertOrbital />
        </motion.div>

        {/* Right column with two cards */}
        <div className="grid grid-rows-2 gap-8 h-full">
          {/* Top: Collaboration Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-[#e4e3df] rounded-[3rem] p-10 md:p-14 flex flex-col relative overflow-hidden group"
          >
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
              Real-time collaboration
            </p>
            <CollaborationChat />
          </motion.div>
          
          {/* Bottom: Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-[#0c0c0c] rounded-[3rem] p-10 md:p-14 relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight group-hover:translate-x-2 transition-transform duration-500">
                Transparent<br/>pricing model
              </h3>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#703FEC', color: 'white' }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black text-[10px] font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl"
              >
                View pricing <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full group-hover:bg-white" />
              </motion.button>
            </div>
            
            {/* Glass 3D visual using the requested direct Google Drive link format */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-16">
              <motion.img 
                animate={{ 
                  y: [0, -30, 0],
                  rotateZ: [0, 5, -5, 0],
                  scale: [1, 1.08, 1]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                src="https://lh3.googleusercontent.com/d/1cVWp8OPf_6JmOZUvs0bnWNVLubYAwHhR" 
                className="w-[95%] h-[95%] object-contain mix-blend-screen opacity-80 group-hover:opacity-100 transition-all duration-1000 drop-shadow-[0_0_50px_rgba(112,63,236,0.5)]"
                alt="Glass 3D Iridescent Shape"
                onError={(e) => {
                  // Fallback if the direct drive link fails due to CORS or visibility
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1635336064729-683f54027ad4?auto=format&fit=crop&q=80&w=1200";
                }}
              />
            </div>

            {/* Aesthetic Glow Enhancement */}
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#703FEC] rounded-full blur-[140px] opacity-15 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#703FEC]/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};