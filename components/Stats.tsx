import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';

export const Stats: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white text-black rounded-[4rem] mx-2 md:mx-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:sticky lg:top-32 self-start"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 mb-8">Testimonials</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
              What our<br />clients are<br />saying
            </h2>
          </motion.div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="bg-zinc-50 p-12 rounded-[3rem] relative overflow-hidden group border border-zinc-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#703FEC]/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                 <p className="text-2xl font-medium mb-12 leading-relaxed">
                  "Natwic moves fast, sweats the details and is easy to work with. It felt like having a design team <span className="text-[#703FEC] italic font-semibold">in-house</span>."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#703FEC] text-white rounded-full grid place-items-center border-2 border-white shadow-md text-sm font-bold">
                    AR
                  </div>
                  <div>
                    <p className="font-bold">Adeel Raza</p>
                    <p className="text-xs text-zinc-500">Mailmunch</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t, idx) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.8 }}
                  className="h-full flex flex-col p-8 border border-zinc-100 rounded-3xl hover:border-[#703FEC]/30 transition-colors"
                >
                  <div className="flex gap-1.5 mb-6">
                    {[...Array(t.stars)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-[#703FEC] rounded-full" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm font-medium leading-relaxed mb-8">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 grid place-items-center text-[11px] font-bold shrink-0">
                      {t.author.charAt(0)}
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">{t.author}</p>
                      <p className="text-[11px] text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-zinc-100 pt-24">
          <div>
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#703FEC]">$2M</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 text-[10px]">Revenue influenced</p>
          </div>
          <div>
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#703FEC] opacity-80">89K</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 text-[10px]">Leads generated</p>
          </div>
          <div>
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter">50+</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 text-[10px]">Brands partnered</p>
          </div>
        </div>
      </div>
    </section>
  );
};