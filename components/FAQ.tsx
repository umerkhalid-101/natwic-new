import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  { q: "What type of clients do you usually work with?", a: "We design websites and brands for startups, SaaS teams and small businesses. We're based in Dubai and work with clients around the world." },
  { q: "Do you work with clients outside the UAE?", a: "Yes. Most of our work is remote, and we schedule calls around your time zone." },
  { q: "How long does a typical project take?", a: "Most projects run in 2–4 week sprints. Larger brand and product work can take 3–6 months, depending on scope." },
  { q: "Can I update the website myself?", a: "Yes. We set your site up so your team can edit pages, text and images without touching code." },
  { q: "Do you offer ongoing support after a project ends?", a: "Yes, we offer monthly retainer packages for continuous design and development support." },
  { q: "How do I get started?", a: "Click 'Start a project' anywhere on the site, or tell us what's not working in the chat above. We'll get back to you with next steps." }
];

// Lets Google show these answers directly in search results
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-40 px-6 md:px-12 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Left column: Questions */}
        <div className="lg:pr-10">
          <div className="flex gap-2 items-center mb-10">
            <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.6)]" />
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-[0.4em]">FAQ</p>
          </div>
          <h2 className="text-6xl md:text-[80px] font-semibold tracking-tighter mb-8 leading-[0.9] text-black">
            Answered<br />questions.
          </h2>
          <p className="text-zinc-900 font-semibold text-lg mb-16 tracking-tight">Everything you might want to know—up front.</p>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border-b border-zinc-100 last:border-0">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-8 text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-7 h-7 rounded-full bg-[#703FEC] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-lg shadow-[#703FEC]/20">
                      {i + 1}
                    </div>
                    <span className="text-[16px] md:text-[18px] font-bold text-black group-hover:text-[#703FEC] transition-colors">{faq.q}</span>
                  </div>
                  <span className={`text-2xl transition-transform duration-500 font-light text-zinc-400 shrink-0 ${openIndex === i ? 'rotate-45 text-[#703FEC]' : ''}`}>+</span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-10 pl-14 text-zinc-500 leading-relaxed text-[15px] font-medium max-w-lg">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Image */}
        <div className="relative lg:sticky lg:top-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt=""
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};