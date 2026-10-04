import React, { useEffect, useState } from 'react';
import { SOCIALS } from './socials';
import { QuickBrief, Brief } from './QuickBrief';

// Filled in elsewhere on the site (the home page chat, the footer brief) before opening Contact
type Prefill = { name?: string; service?: string; message?: string };
const readPrefill = (): Prefill => {
  try {
    const json = sessionStorage.getItem('natwic:prefill');
    if (json) return JSON.parse(json) as Prefill;
    return { message: sessionStorage.getItem('natwic:brief') ?? '' };
  } catch { return {}; }
};

/**
 * GOOGLE SHEETS INTEGRATION INSTRUCTIONS:
 * 1. Open your Spreadsheet: https://docs.google.com/spreadsheets/d/1EskdmV6hZDE3Sc3cnfG93_ZOesMTbSFtE7FaFeIzOmE/edit
 * 2. Go to Extensions > App Script.
 * 3. Paste the following code:
 *
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.openById("1EskdmV6hZDE3Sc3cnfG93_ZOesMTbSFtE7FaFeIzOmE").getActiveSheet();
 *   var data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([new Date(), data.name, data.email, data.service, data.budget, data.message]);
 *   return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 * }
 *
 * 4. Click 'Deploy' > 'New Deployment'. Select 'Web App'.
 * 5. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone'.
 * 6. Copy the Web App URL and replace 'YOUR_SCRIPT_URL' below.
 */

const YOUR_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2G50quGk5PYXv-QHT3AM5Lvs78oORiOJrKADEyd7H7xuUcdhGX-HPFySmU2bTB4jg4w/exec';

const EMAIL = 'hello@natwic.com';
const PHONE = '+971 58 520 3139';

interface ContactProps {
  isStandalone?: boolean;
  setView?: (view: 'home' | 'contact') => void;
}

// The Contact sheet's columns: name, email, service, budget, message
const sendToSheet = (b: Brief) =>
  fetch(YOUR_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: b.name, email: b.email, service: b.services.join(', ') || 'Not specified', budget: 'Not asked', message: b.message }),
  });

export const Contact: React.FC<ContactProps> = ({ isStandalone = true }) => {
  const [pre] = useState(readPrefill);
  useEffect(() => {
    try { sessionStorage.removeItem('natwic:brief'); sessionStorage.removeItem('natwic:prefill'); } catch { /* ignore */ }
  }, []);

  return (
    <section id="contact" className={`${isStandalone ? 'min-h-screen pt-32 md:pt-40 pb-28 md:pb-40' : 'py-40'} px-5 md:px-12 bg-[#F4F2EE] text-black`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-start">
        {/* Left: the invitation and the direct lines */}
        <div>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">Start a project</p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.055em] leading-[0.92]">
            Let’s build something <span className="italic text-[#703FEC]">legendary.</span>
          </h1>
          <p className="mt-6 md:mt-8 max-w-md text-lg text-zinc-600 leading-relaxed">
            A few lines is all we need. We’ll reply within 24 hours.
          </p>

          <div className="mt-10 md:mt-14 space-y-3">
            {[
              { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
              { label: 'Call', value: PHONE, href: 'tel:+971585203139' },
            ].map((l) => (
              <a key={l.label} href={l.href} className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white/60 px-5 py-4 hover:border-[#703FEC] hover:bg-white transition-colors">
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{l.label}</span>
                  <span className="block text-lg md:text-xl font-semibold tracking-tight">{l.value}</span>
                </span>
                <span className="w-10 h-10 rounded-full bg-black text-white grid place-items-center transition-[transform,background-color] duration-500 group-hover:-rotate-45 group-hover:bg-[#703FEC]">→</span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span>Dubai, UAE · working worldwide</span>
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-black hover:text-[#703FEC] transition-colors">{s.name} ↗</a>
            ))}
          </div>
        </div>

        <QuickBrief send={sendToSheet} initial={pre} />
      </div>
    </section>
  );
};
