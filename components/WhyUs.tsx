import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPERTS = [
  { id: 1, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", radius: 185, speed: 100, offset: 0 },
  { id: 2, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150", radius: 185, speed: 100, offset: 120 },
  { id: 3, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", radius: 185, speed: 100, offset: 240 },
  { id: 4, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400", radius: 115, speed: 70, offset: 60 },
  { id: 5, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400", radius: 115, speed: 70, offset: 180 },
  { id: 6, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400", radius: 115, speed: 70, offset: 300 },
];

const CHAT_MESSAGES = [
  { id: 1, sender: 'philip', text: 'Hey!', avatar: 'https://i.pravatar.cc/100?u=philip' },
  { id: 2, sender: 'philip', text: 'The website looks awesome', avatar: 'https://i.pravatar.cc/100?u=philip' },
  { id: 3, sender: 'philip', text: 'Can we update the homepage banner?', avatar: 'https://i.pravatar.cc/100?u=philip' },
  { id: 4, sender: 'studio', text: 'Hi Philip!', avatar: 'https://i.pravatar.cc/100?u=natwic_mark' },
  { id: 5, sender: 'studio', text: "Sure, we'll have our team on it", avatar: 'https://i.pravatar.cc/100?u=natwic_mark' },
];

const ExpertOrbital = () => {
  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-[#0F0F0F] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(112,63,236,0.02)_0%,_transparent_75%)] pointer-events-none" />
      
      <div className="absolute w-[370px] h-[370px] border border-white/[0.03] rounded-full pointer-events-none" />
      <div className="absolute w-[230px] h-[230px] border border-white/[0.03] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-30 text-center pointer-events-none max-w-[200px]"
      >
        <h3 className="text-2xl md:text-[32px] font-medium tracking-tight text-white leading-[1.2]">
          A strong team of experts
        </h3>
      </motion.div>

      {EXPERTS.map((exp) => (
        <motion.div
          key={exp.id}
          className="absolute will-change-transform"
          animate={{ rotate: 360 }}
          transition={{ duration: exp.speed, repeat: Infinity, ease: "linear", delay: -exp.offset }}
          style={{ width: exp.radius * 2, height: exp.radius * 2, pointerEvents: 'none' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ pointerEvents: 'auto' }}>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: exp.speed, repeat: Infinity, ease: "linear", delay: -exp.offset }}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shadow-xl"
            >
              <img 
                src={exp.img} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
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
  const [messages, setMessages] = useState<typeof CHAT_MESSAGES>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Initial thread start
    setMessages([CHAT_MESSAGES[0]]);
    setIndex(1);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const nextIdx = prev + 1;
        
        if (nextIdx > CHAT_MESSAGES.length) {
          // Restart thread immediately
          setMessages([CHAT_MESSAGES[0]]);
          return 1;
        }

        setMessages(CHAT_MESSAGES.slice(0, nextIdx));
        return nextIdx;
      });
    }, 2800); // Premium reading pace
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full h-full min-h-[420px] relative overflow-hidden px-8 py-10 md:px-12 md:py-14">
      <p className="text-[9px] font-bold text-black/20 uppercase tracking-[0.4em] text-center mb-10">REAL-TIME COLLABORATION</p>
      
      <div className="flex flex-col gap-4 justify-end h-full">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.id}-${i}`}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className={`flex items-end gap-3 md:gap-4 ${msg.sender === 'studio' ? 'flex-row-reverse text-right' : 'text-left'}`}
            >
              <div className="w-8 h-8 rounded-full border border-black/5 overflow-hidden shrink-0 shadow-sm bg-zinc-100">
                 <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
              </div>
              <div className={`max-w-[70%] px-5 py-2.5 rounded-[1.5rem] text-[11px] md:text-[12px] font-medium leading-tight shadow-sm border transition-all duration-500 ${
                msg.sender === 'studio' 
                  ? 'bg-black text-white border-black rounded-br-none' 
                  : 'bg-white text-black border-black/[0.02] rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const WhyUs: React.FC = () => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white text-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-32 items-start">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-3 items-center pt-2 min-w-[200px]"
          >
            <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.3)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">WHY WORK WITH US</p>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-[56px] font-bold tracking-tight leading-[1.05] max-w-4xl"
          >
            We help ambitious brands make their<br/>mark with clarity and precision.
          </motion.h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
        
        {/* Left Box: Expert Orbital */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[3rem] overflow-hidden bg-[#0A0A0A] relative shadow-lg flex flex-col"
        >
          <div className="flex-1">
            <ExpertOrbital />
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="grid grid-cols-1 grid-rows-[auto_auto] lg:grid-rows-[1.2fr_1fr] gap-6">
          
          {/* Top Right: Collaboration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="bg-[#E5E4E0] rounded-[3rem] relative overflow-hidden flex flex-col border border-black/[0.03]"
          >
            <div className="flex-1">
              <CollaborationChat />
            </div>
          </motion.div>
          
          {/* Bottom Right: Pricing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="bg-black rounded-[3rem] p-10 md:p-12 relative overflow-hidden group shadow-xl flex flex-col min-h-[300px]"
          >
            <div className="flex flex-row justify-between items-start relative z-20 w-full mb-8">
              <h3 className="text-2xl md:text-[32px] font-medium text-white tracking-tight leading-tight">
                Transparent<br/>pricing model
              </h3>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black text-[9px] font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg shrink-0"
              >
                View pricing <div className="w-1.5 h-1.5 bg-[#F3350C] rounded-full animate-pulse" />
              </motion.button>
            </div>
            
            {/* Prismatic Asset - Adjusted to be smaller and at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none flex items-end justify-center">
              <motion.img 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 12, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                src="https://lh3.googleusercontent.com/d/1cVWp8OPf_6JmOZUvs0bnWNVLubYAwHhR" 
                className="w-[85%] h-full object-contain object-bottom opacity-100 mix-blend-screen"
                alt="3D Asset"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};