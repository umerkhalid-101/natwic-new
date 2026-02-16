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
          >
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 mb-8">Testimonials</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
              What our<br />clients are<br />saying
            </h2>
            <div className="space-y-8 max-w-md">
              <div className="flex justify-between items-center py-4 border-b border-zinc-100 group">
                <span className="text-4xl font-bold group-hover:text-[#703FEC] transition-colors">92%</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Return for project</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-zinc-100 group">
                <span className="text-4xl font-bold group-hover:text-[#703FEC] transition-colors">87%</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand Perception</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-zinc-100 group">
                <span className="text-4xl font-bold group-hover:text-[#703FEC] transition-colors">74%</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Engagement</span>
              </div>
            </div>
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
                  "Working with Natwic felt less like hiring a design agency and more like gaining a strategic partner <span className="text-[#703FEC] italic font-semibold">forever</span>."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="https://i.pravatar.cc/150?u=harold" alt="Harold" />
                  </div>
                  <div>
                    <p className="font-bold">Harold Mercer</p>
                    <p className="text-xs text-zinc-500">Investor at Solence®</p>
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
                  className="p-8 border border-zinc-100 rounded-3xl hover:border-[#703FEC]/30 transition-colors"
                >
                  <div className="flex gap-1.5 mb-6">
                    {[...Array(t.stars)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-[#703FEC] rounded-full" />
                    ))}
                  </div>
                  <p className="text-sm font-medium leading-relaxed mb-8">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} className="w-8 h-8 rounded-full border border-zinc-100" alt={t.author} />
                    <p className="text-xs font-bold uppercase tracking-tight">{t.author}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-zinc-100 pt-24">
          <div>
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#703FEC]">$43M</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 text-[10px]">Revenue influenced</p>
          </div>
          <div>
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#703FEC] opacity-80">87K</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 text-[10px]">Leads generated</p>
          </div>
          <div>
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter">268</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-4 text-[10px]">Brands partnered</p>
          </div>
        </div>
      </div>
    </section>
  );
};