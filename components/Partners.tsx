import React from 'react';
import { motion } from 'framer-motion';

const PARTNERS_DATA = [
  { 
    name: 'Axion Dynamic', 
    description: 'Elevating digital performance through dynamic solutions.',
    logoId: '15uiZnmVk_mzvVP3RwzGyRUhw3ifAbTkX'
  },
  { 
    name: 'Breakthirty', 
    description: 'Redefining the boundaries of modern brand expression.',
    logoId: '1hJU5_5tgyej1oF8NH5JfTNo5JWvj4cCd'
  },
  { 
    name: 'Cayano', 
    description: 'Strategic craftsmanship for global visionaries.',
    logoId: '1AuhG27gKMn-kJTf6T2sbLefArBGdTXXR'
  },
  { 
    name: 'Folionomics', 
    description: 'Data-driven design for the financial elite.',
    logoId: '16Lxqy2zghfMrWbXPk-a4ZtAfiQf5ObAy'
  },
  { 
    name: 'Mailmunch', 
    description: 'Scaling conversions with intuitive user experiences.',
    logoId: '1AxeHTLI6MEvgt8Qj9dDln9NedLSHkc6y'
  },
  { 
    name: 'Salams', 
    description: 'Building meaningful connections through elegant tech.',
    logoId: '1e2M3OY1iwa6IPzmYBdlgPfh57Bv4VleA'
  },
  { 
    name: 'Zwilt', 
    description: 'Pioneering the future of digital product design.',
    logoId: '1tp8gVcN2t-3ACGca0yJlguB1aSNmdQSg'
  },
];

export const Partners: React.FC = () => {
  // We double the data to create a seamless infinite loop effect
  const duplicatedPartners = [...PARTNERS_DATA, ...PARTNERS_DATA];

  return (
    <section className="py-40 px-0 bg-white overflow-hidden relative border-t border-zinc-100">
      {/* Design Element: Small Red Dot - matching the high-fidelity design */}
      <div className="absolute top-24 left-12 md:left-24">
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="w-1.5 h-1.5 bg-[#F3350C] rounded-full shadow-[0_0_10px_rgba(243,53,12,0.4)]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em]"
        >
          Selected Collaborations
        </motion.p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Fading Edges Overlay - Fading to White for Light Theme */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-6 md:gap-10 px-4"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 45, // Adjusted for smooth infinite scroll
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedPartners.map((partner, i) => (
            <div key={i} className="flex flex-col items-center shrink-0 w-[200px] md:w-[280px] group">
              {/* Logo Card - Refined sizing */}
              <div className="w-full aspect-square rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-b from-zinc-50 to-zinc-100/50 flex items-center justify-center mb-8 border border-zinc-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
                {/* Inner Glow/Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {/* Brand Logo Image */}
                <div className="w-3/4 h-3/4 flex items-center justify-center relative z-10 p-4">
                  <img 
                    src={`https://lh3.googleusercontent.com/d/${partner.logoId}`}
                    alt={`${partner.name} logo`}
                    className="max-w-full max-h-[100px] md:max-h-[120px] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105"
                    onError={(e) => {
                       // Fallback to text if logo fails to load
                       (e.target as HTMLImageElement).style.display = 'none';
                       const textNode = document.createElement('div');
                       textNode.className = "text-black font-black text-xl md:text-2xl tracking-tighter text-center";
                       textNode.innerText = partner.name.toUpperCase();
                       (e.target as HTMLImageElement).parentElement?.appendChild(textNode);
                    }}
                  />
                </div>

                {/* Corner Decorative Element */}
                <div className="absolute top-6 right-6 w-1 h-1 bg-zinc-200 rounded-full group-hover:bg-[#703FEC] transition-colors" />
              </div>
              
              {/* Description Below Card */}
              <div className="text-center px-4">
                <h4 className="text-black font-bold text-[11px] md:text-[13px] mb-1.5 uppercase tracking-wider group-hover:text-[#703FEC] transition-colors">
                  {partner.name}
                </h4>
                <motion.p 
                  className="text-zinc-400 text-[9px] md:text-[11px] font-medium leading-relaxed max-w-[180px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  {partner.description}
                </motion.p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background Aesthetic Text - Extremely subtle in light theme */}
      <div className="mt-32 flex justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14vw] font-bold tracking-tighter text-black whitespace-nowrap">PARTNERSHIPS</span>
      </div>
    </section>
  );
};