import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';

export const Stats: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white text-black rounded-[4rem] mx-2 md:mx-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:sticky lg:top-32 self-start"
          >
            <p aria-hidden className="text-sm font-medium text-zinc-500 mb-8">Client testimonials</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
              <span className="sr-only">Client testimonials: </span>What our<br />clients are<br />saying
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
                  <div className="w-12 h-12 bg-zinc-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="/team/adeel-raza.webp" alt="Portrait of Adeel Raza from Mailmunch" width={48} height={48} loading="lazy" className="w-full h-full object-cover" />
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

      </div>
    </section>
  );
};

/** Headline numbers, shown directly under the home hero */
const KEY_STATS = [
  { value: '$2', unit: 'M', label: 'Revenue influenced' },
  { value: '89', unit: 'K', label: 'Leads generated' },
  { value: '50', unit: '+', label: 'Brands partnered' },
];

export const KeyStats: React.FC = () => (
  <section aria-label="Results" className="px-6 md:px-12 pt-14 md:pt-20 pb-16 md:pb-24 bg-white text-black">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-10 lg:gap-16 items-end">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm font-medium text-zinc-500">Track record</p>
        <p className="mt-3 max-w-xs text-2xl md:text-3xl font-semibold tracking-[-0.03em] leading-[1.15]">The numbers behind the work.</p>
      </motion.div>
      <dl className="grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 lg:border-t-0">
        {KEY_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col-reverse pt-6 lg:pt-0 px-3 sm:px-6 md:px-10 first:pl-0 last:pr-0"
          >
            <dt className="mt-2 md:mt-3 text-xs md:text-sm font-medium text-zinc-500">{s.label}</dt>
            <dd className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.05em] leading-none">
              {s.value}<span className="text-[#703FEC]">{s.unit}</span>
            </dd>
          </motion.div>
        ))}
      </dl>
    </div>
  </section>
);
