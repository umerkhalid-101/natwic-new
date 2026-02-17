import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VALUES = [
  {
    number: '01',
    title: 'Transparency',
    description: 'We believe in open dialogue. No hidden fees, no surprise clauses. Just honest work and clear communication from day one.'
  },
  {
    number: '02',
    title: 'Passion',
    description: 'We don’t just build digital products; we craft experiences. Every pixel is placed with intent and every line of code is written with pride.'
  },
  {
    number: '03',
    title: 'Empathy',
    description: 'User-centric isn’t just a buzzword. We dive deep into the psychology of your audience to build solutions that truly resonate.'
  }
];

const TEAM = [
  { id: 1, name: 'Umer Khalid', role: 'Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Faiq Ahmed', role: 'Co-founder', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Hassan Daniyal Ghauri', role: 'Head of Business', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Tanseer Khoso', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' },
];

// Utility component for the "Masked Reveal" text animation
const RevealText: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  </div>
);

const OrbitalRing: React.FC<{ 
  radius: number; 
  duration: number; 
  members: typeof TEAM; 
  onHover: (member: typeof TEAM[0] | null) => void;
  reverse?: boolean;
}> = ({ radius, duration, members, onHover, reverse = false }) => {
  return (
    <motion.div
      className="absolute rounded-full border border-white/5"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {members.map((member, i) => {
        const angle = (360 / members.length) * i;
        const radian = (angle * Math.PI) / 180;
        
        return (
          <motion.div
            key={member.id}
            className="absolute top-1/2 left-1/2 w-0 h-0"
            style={{ 
              transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` // Initial positioning logic
            }}
          >
            {/* Counter-rotation container to keep images upright while orbiting */}
            <motion.div
              animate={{ rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => onHover(member)}
                onMouseLeave={() => onHover(null)}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#703FEC] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full" />
                
                <motion.div 
                  whileHover={{ scale: 1.3, borderColor: '#703FEC' }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-900 relative z-10 transition-colors duration-300"
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const TeamOrbitalSection: React.FC = () => {
  const [activeMember, setActiveMember] = useState<typeof TEAM[0] | null>(null);

  // Split team into two rings for balanced look with 4 members
  const innerRing = TEAM.slice(0, 2);
  const outerRing = TEAM.slice(2, 4);

  return (
    <section className="relative h-[900px] md:h-[1100px] bg-[#050505] overflow-hidden flex items-center justify-center rounded-[3rem] mx-2 md:mx-6 mb-32 shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#703FEC] rounded-full blur-[200px] opacity-10 pointer-events-none" />

      {/* Center Content - Dynamic */}
      <div className="relative z-20 text-center pointer-events-none max-w-2xl px-6">
        <AnimatePresence mode="wait">
          {activeMember ? (
            <motion.div
              key="member"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="flex flex-col items-center"
            >
              <h3 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-4 drop-shadow-2xl">
                {activeMember.name}
              </h3>
              <div className="h-[2px] w-12 bg-[#703FEC] mb-4" />
              <p className="text-zinc-400 text-sm md:text-lg font-mono uppercase tracking-[0.2em]">
                {activeMember.role}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-[15vw] md:text-[10vw] font-bold text-white/5 tracking-tighter leading-none select-none pointer-events-none">
                THE<br/>MINDS
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orbit Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Inner Ring */}
        <OrbitalRing 
          radius={180} // 180px radius (360px diameter)
          duration={40} 
          members={innerRing} 
          onHover={setActiveMember}
          reverse={false}
        />

        {/* Outer Ring */}
        <OrbitalRing 
          radius={320} // 320px radius (640px diameter)
          duration={60} 
          members={outerRing} 
          onHover={setActiveMember}
          reverse={true}
        />
      </div>

      {/* Interactive Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold animate-pulse">
        Hover to discover
      </div>
    </section>
  );
};

interface StudioProps {
  setView?: (view: 'home' | 'contact' | 'studio') => void;
}

export const Studio: React.FC<StudioProps> = ({ setView }) => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <section className="px-6 md:px-12 mb-24 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <RevealText className="mb-16 md:mb-24">
            <h1 className="text-[17vw] md:text-[14vw] font-bold leading-[0.8] tracking-tighter text-black">
              Studio
            </h1>
          </RevealText>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <RevealText delay={0.2}>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6 flex items-center gap-3">
                   <span className="w-8 h-[1px] bg-zinc-300"></span>
                   Who we are
                 </p>
              </RevealText>
              <div className="overflow-hidden">
                <motion.h2 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight"
                >
                  A multidisciplinary team of designers, developers, and strategists redefining the digital landscape.
                </motion.h2>
              </div>
            </div>
            <div>
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, delay: 0.4 }}
              >
                <p className="text-zinc-500 text-lg leading-relaxed mb-10 font-medium">
                  Founded in 2020, Natwic has grown from a small design boutique to a full-service digital partner for some of the world's most ambitious brands. We merge high-fidelity aesthetics with robust engineering to create products that stand the test of time.
                </p>
              </motion.div>
              
              <div className="flex gap-12 border-t border-zinc-100 pt-8">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  >
                    <h3 className="text-4xl font-bold tracking-tighter mb-2">20+</h3>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Team Members</p>
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  >
                    <h3 className="text-4xl font-bold tracking-tighter mb-2">150+</h3>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Projects Launched</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Parallax */}
      <section className="px-2 md:px-6 mb-32 md:mb-48">
        <motion.div 
          initial={{ clipPath: "inset(10% 10% 10% 10% round 3rem)", scale: 1.1 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 3rem)", scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[98%] mx-auto h-[50vh] md:h-[90vh] overflow-hidden relative"
        >
          <motion.img 
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2400" 
            alt="Studio Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="px-6 md:px-12 mb-32 md:mb-40">
        <div className="max-w-7xl mx-auto">
          <RevealText className="mb-16">
            <div className="flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.6)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Our Values</p>
            </div>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-zinc-100 pt-12">
            {VALUES.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="absolute -top-12 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                
                <div className="text-sm font-mono font-bold text-zinc-300 mb-8 group-hover:text-[#703FEC] transition-colors duration-500">
                  {value.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">{value.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium pr-8">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Orbital Team Section (The Minds) */}
      <TeamOrbitalSection />

      {/* Members Section Grid */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <RevealText className="mb-16">
            <div className="flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.6)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Members</p>
            </div>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="bg-white border border-zinc-100 p-4 rounded-2xl flex items-center gap-5 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:border-zinc-200 transition-all duration-300 cursor-default"
              >
                 <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-lg leading-tight truncate pr-2 group-hover:text-[#703FEC] transition-colors">
                         {member.name}
                       </h3>
                       <span className="font-bold text-sm text-zinc-400 hover:text-[#0077b5] cursor-pointer transition-colors">in</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mt-1 truncate">
                      {member.role}
                    </p>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};