
import React from 'react';
import { motion } from 'framer-motion';

const PARTNERS = ['LOGORIPSUM', 'typeform', 'only fans', 'lego ipsum', '8BIT', 'Loreipsum'];

export const Partners: React.FC = () => {
  return (
    <section className="py-24 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <p className="text-zinc-500 text-sm mb-16 tracking-widest text-center uppercase">
          We collaborate with forward-thinking brands to build lasting creative impact.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 items-center">
          {PARTNERS.map((partner, i) => (
            /* Use spread operator to bypass strict type checking for motion props */
            <motion.div 
              key={i}
              {...({
                whileHover: { opacity: 1 },
                initial: { opacity: 0.5 }
              } as any)}
              className="flex flex-col items-center gap-4 grayscale"
            >
              <div className="text-2xl font-black text-zinc-300">{partner}</div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-tighter">Lorem ipsum dolor</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
