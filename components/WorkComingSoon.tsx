import React from 'react';
import { motion } from 'framer-motion';

interface WorkComingSoonProps {
  setView: (view: 'home' | 'contact' | 'studio' | 'work') => void;
}

const AbstractArtifact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[300px] h-[400px] md:w-[380px] md:h-[520px] mx-auto perspective-[2000px] group"
    >
        {/* Glow behind */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#703FEC] rounded-full blur-[80px] opacity-40"
        />

        {/* The Card Container */}
        <motion.div
            animate={{ 
                y: [-15, 15, -15],
                rotateY: [-5, 5, -5],
                rotateX: [2, -2, 2]
            }}
            transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full h-full bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            {/* Image Layer */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop"
                    alt="Abstract Fluid"
                    className="w-full h-full object-cover opacity-80 mix-blend-screen scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80" />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

            {/* Scanning Line */}
            <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 opacity-70"
            />

            {/* Content Inside Card */}
            <div className="absolute bottom-8 left-8 right-8 z-30">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[9px] font-mono text-[#703FEC] uppercase tracking-widest mb-2">System Status</p>
                        <p className="text-xl font-bold text-white tracking-tight">Compiling Assets</p>
                    </div>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                </div>
            </div>

            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    </motion.div>
  );
};

export const WorkComingSoon: React.FC<WorkComingSoonProps> = ({ setView }) => {
  return (
    <section className="min-h-screen bg-[#050505] text-white flex flex-col justify-center relative overflow-hidden px-6 py-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
          <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#703FEC] rounded-full blur-[150px]" 
          />
          <motion.div 
             animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
             transition={{ duration: 15, repeat: Infinity, delay: 2 }}
             className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600 rounded-full blur-[150px]" 
          />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Typography */}
        <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="mb-10 inline-flex"
            >
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#703FEC] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#703FEC]"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Archive In Progress</span>
                </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.85] mb-10 select-none">
                <span className="block overflow-hidden">
                    <motion.span 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="block text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40"
                    >
                        SELECTED
                    </motion.span>
                </span>
                <span className="block overflow-hidden">
                    <motion.span 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="block text-white"
                    >
                        WORKS
                    </motion.span>
                </span>
                <span className="block overflow-hidden text-[#703FEC] italic font-serif opacity-90">
                    <motion.span 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="block"
                    >
                        Processing...
                    </motion.span>
                </span>
            </h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-zinc-400 max-w-md mx-auto lg:mx-0 text-lg font-medium leading-relaxed mb-12"
            >
                We are curating a new collection of our finest digital experiences. The archive is being rebuilt to define the future of Natwic.
            </motion.p>

            <motion.button
                onClick={() => setView('home')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative overflow-hidden bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px]"
            >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Return Home</span>
                <div className="absolute inset-0 bg-[#703FEC] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </motion.button>
        </div>

        {/* Right Column: Artifact */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <AbstractArtifact />
        </div>

      </div>
    </section>
  );
};