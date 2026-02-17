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
  // Triple items for ultra-smooth loop on large screens
  const duplicatedPartners = [...PARTNERS_DATA, ...PARTNERS_DATA, ...PARTNERS_DATA];

  return (
    <section className="py-40 px-0 bg-white overflow-hidden relative border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-3 items-center justify-center mb-8"
        >
          <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_12px_rgba(112,63,236,0.8)]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-zinc-400">Trusted Partnerships</p>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-black leading-[1.05]"
        >
          Collaborating with<br />the world's boldest.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed"
        >
          From high-growth startups to enterprise giants, we help industry leaders define what’s next through pure intent and design excellence.
        </motion.p>
      </div>

      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-8 md:gap-14 px-4 will-change-transform"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            duration: 12, // Maximum speed with high-end smoothness
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedPartners.map((partner, i) => (
            <div key={i} className="flex flex-col items-center shrink-0 w-[220px] md:w-[320px] group/item">
              <div className="w-full aspect-square rounded-[2rem] md:rounded-[3rem] bg-zinc-50 flex items-center justify-center mb-10 border border-zinc-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.01)] relative overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)]">
                <div className="w-2/3 h-2/3 flex items-center justify-center relative z-10 p-6">
                  <img 
                    src={`https://lh3.googleusercontent.com/d/${partner.logoId}`}
                    alt={`${partner.name}`}
                    className="max-w-full max-h-[100px] object-contain grayscale opacity-40 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700 transform group-hover/item:scale-110"
                  />
                </div>
              </div>
              <div className="text-center px-6">
                <h4 className="text-black font-bold text-[12px] md:text-[14px] mb-2 uppercase tracking-widest opacity-40 group-hover/item:opacity-100 transition-all duration-500">
                  {partner.name}
                </h4>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};