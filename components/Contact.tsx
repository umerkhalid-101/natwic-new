import React, { useEffect, useState } from 'react';
import { SOCIALS } from './socials';
import { QuickBrief, Brief } from './QuickBrief';
import { Link } from './nav';

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

const STEPS = [
  { t: 'We reply', d: 'Within 24 hours, with a few questions about your project or a suggested time for a call.' },
  { t: 'A short intro call', d: 'On video, at a time that works in your time zone. We talk through your goals, audience, timeline and budget.' },
  { t: 'Your proposal', d: 'A clear scope, timeline and fixed quote, so you know exactly what you’re getting and what it costs before anything starts.' },
];

const TIMELINES = [
  { t: 'Websites and landing pages', d: 'Most run in focused sprints of two to four weeks.' },
  { t: 'Larger brand and product work', d: 'Usually three to six months, depending on scope.' },
];

const FAQS = [
  { q: 'How does working across time zones work?', a: 'We’re based in Dubai and work remotely with clients worldwide. We agree on a regular call time that overlaps with your working hours, share progress in writing between calls and keep designs and staging links in one shared space, so you can check in whenever your day starts.' },
  { q: 'How much does a project cost?', a: 'Every project is different, so we quote each one after the intro call. You get a fixed price for an agreed scope before any work begins.' },
  { q: 'What should I include in my message?', a: 'A sentence or two on what you’re building, what you need from us and any deadline you’re working toward. Links to your current site or product help too, but they’re not required.' },
  { q: 'Do you work with early-stage startups?', a: 'Yes. Startups, SaaS teams and small businesses are who we work with most, including founders who are still before launch.' },
  { q: 'Can we start with a small project?', a: 'Yes. A landing page, a brand refresh or a redesign of a few key pages is a good way to see how we work before committing to something bigger.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">{children}</p>
  </div>
);

/** What happens after someone gets in touch, how long things take, and common questions */
const NextSteps: React.FC = () => (
  <div className="max-w-7xl mx-auto mt-24 md:mt-36">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

    <SectionLabel>What happens next</SectionLabel>
    <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.045em] leading-[1.02] max-w-3xl">Three steps from hello to a plan.</h2>
    <ol className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
      {STEPS.map((s, i) => (
        <li key={s.t} className={`rounded-[2rem] p-8 md:p-10 min-h-[220px] flex flex-col justify-between ${['bg-white text-black', 'bg-[#0A0A0A] text-white', 'bg-[#703FEC] text-white'][i]}`}>
          <span className="font-mono text-xs opacity-60">0{i + 1}</span>
          <div>
            <h3 className="mt-8 text-2xl md:text-3xl font-bold tracking-[-0.03em]">{s.t}</h3>
            <p className="mt-3 text-base leading-relaxed opacity-75">{s.d}</p>
          </div>
        </li>
      ))}
    </ol>

    <div className="mt-24 md:mt-32 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
      <div>
        <SectionLabel>Typical timelines</SectionLabel>
        <ul className="space-y-6">
          {TIMELINES.map((t) => (
            <li key={t.t} className="border-t border-black/10 pt-6">
              <h3 className="text-xl md:text-2xl font-bold tracking-[-0.03em]">{t.t}</h3>
              <p className="mt-2 text-base text-zinc-600 leading-relaxed">{t.d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-zinc-500 leading-relaxed">We confirm the timeline in your proposal and plan around any launch date you’re working toward.</p>
        <div className="mt-10 rounded-[2rem] border border-black/10 bg-white/60 p-7">
          <p className="text-lg font-semibold tracking-tight">Based in Dubai, working with clients worldwide.</p>
          <p className="mt-3 text-base text-zinc-600">
            <a href={`mailto:${EMAIL}`} className="font-semibold text-black hover:text-[#703FEC] transition-colors">{EMAIL}</a>
            <span className="mx-2 text-zinc-300">·</span>
            <a href="tel:+971585203139" className="font-semibold text-black hover:text-[#703FEC] transition-colors">{PHONE}</a>
          </p>
        </div>
      </div>

      <div>
        <SectionLabel>Questions</SectionLabel>
        <div className="divide-y divide-black/10 border-y border-black/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] leading-snug">{f.q}</h3>
                <span aria-hidden className="mt-0.5 w-8 h-8 shrink-0 rounded-full border border-black/10 grid place-items-center text-black transition-transform duration-500 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-base text-zinc-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-base text-zinc-600">
          Want to know more first? See our <Link href="/services" className="font-semibold text-black underline decoration-black/20 underline-offset-4 hover:text-[#703FEC]">services</Link> or <Link href="/work" className="font-semibold text-black underline decoration-black/20 underline-offset-4 hover:text-[#703FEC]">recent work</Link>.
        </p>
      </div>
    </div>
  </div>
);

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
          <h1>
            <span className="flex items-center gap-3 mb-6 md:mb-8 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">
              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
              Start a web design or branding project
            </span>
            <span className="sr-only">: </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.055em] leading-[0.92]">
              Let’s build something <span className="italic text-[#703FEC]">legendary.</span>
            </span>
          </h1>
          <p className="mt-6 md:mt-8 max-w-md text-lg text-zinc-600 leading-relaxed">
            A few lines is all we need. We’ll reply within 24 hours.
          </p>
          <p className="mt-4 max-w-md text-base text-zinc-500 leading-relaxed">
            Tell us what you’re building, who it’s for and when you’d like to launch. Whether you need a new website, a brand identity, a SaaS marketing site or a redesign, we’ll come back with questions or a time to talk.
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
            <span>Based in Dubai, working with clients worldwide</span>
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-black hover:text-[#703FEC] transition-colors">{s.name} ↗</a>
            ))}
          </div>
        </div>

        <QuickBrief send={sendToSheet} initial={pre} />
      </div>

      <NextSteps />
    </section>
  );
};
