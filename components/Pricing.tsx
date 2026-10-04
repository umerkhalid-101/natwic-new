import React from 'react';
import { motion } from 'framer-motion';
import { QuickBrief, Brief } from './QuickBrief';

/**
 * GOOGLE SHEETS INTEGRATION INSTRUCTIONS:
 * 
 * 1. Open your Spreadsheet: https://docs.google.com/spreadsheets/d/18SUwFshvxuUVYWDjBz2aUxir4-WB8IcXQL3_a81_EGQ/edit
 * 2. Go to Extensions > Apps Script.
 * 3. Paste the following code:
 * 
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   var data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([new Date(), data.name, data.email, data.service, data.message]);
 *   return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 * }
 * 
 * 4. Click 'Deploy' > 'New Deployment'. Select 'Web App'.
 * 5. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone'.
 * 6. Copy the Web App URL and replace the value of YOUR_SCRIPT_URL below.
 */

const YOUR_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqQ2130Za78V8VFQ2p-1Le5mvGsly5B6wwfJjPLM1n8KPboQBU02a3fHCeGYaCOQIs/exec';

// The home page sheet's columns: name, email, service, message (plus where it came from)
const sendToSheet = (b: Brief) =>
  fetch(YOUR_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: b.name, email: b.email, service: b.services.join(', ') || 'Not specified', message: b.message, source: 'Quote Section' }),
  });

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
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC] shadow-[0_0_10px_rgba(112,63,236,0.8)]" />
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
        <QuickBrief send={sendToSheet} tone="dark" />
      </motion.div>
    </div>
  </section>
);
