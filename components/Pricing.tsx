import React from 'react';
import { motion } from 'framer-motion';
import { QuickBrief } from './QuickBrief';
import { sendLead } from '../leads';

const sendFromQuote = sendLead('Quote Section');

interface PricingProps {
  setView?: (view: 'home' | 'contact' | 'studio') => void;
}

/** The home page's project form: a short brief, sent from right here. */
export const Pricing: React.FC<PricingProps> = () => (
  <section className="relative overflow-hidden rounded-[3rem] mx-2 md:mx-6 my-2 bg-[#080808] text-white border border-white/5 px-5 py-24 md:py-32">
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(112,63,236,0.14)_0%,transparent_65%)]" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(112,63,236,0.08)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[url('/media/noise.svg')] opacity-[0.12]" />
    </div>

    <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <p className="text-sm font-medium text-white/50">
          Get a free quote
        </p>
        <h2 className="mt-6 text-5xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.98]">
          Tell us what you’re <span className="italic text-[#b9a1ff]">building.</span>
        </h2>
        <p className="mt-6 max-w-sm text-lg text-white/55 leading-relaxed">A few lines is all we need. We’ll reply within 24 hours.</p>
        <a href="mailto:hello@natwic.com" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
          Rather email? <span className="text-[#b9a1ff]">hello@natwic.com</span>
        </a>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
        <QuickBrief send={sendFromQuote} source="pricing" tone="dark" />
      </motion.div>
    </div>
  </section>
);
