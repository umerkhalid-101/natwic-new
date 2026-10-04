import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;
const EMAIL = 'hello@natwic.com';

const TEAM = [
  { name: 'Umer', src: '/team/umer.webp' },
  { name: 'Faiq', src: '/team/faiq.webp' },
  { name: 'Hassan', src: '/team/hassan.webp' },
  { name: 'Tanseer', src: '/team/tanseer.webp' },
];

// Services as the sheets have always received them, and how a subject line reads for each
export const SERVICES = [
  { value: 'Web Design & Dev', label: 'A website' },
  { value: 'Branding & Identity', label: 'A brand' },
  { value: 'Content & Strategy', label: 'Content' },
  { value: 'Social & Marketing', label: 'Social media' },
];

/* ------------------------------------------------------------------ */
/* An email to the team, shared by the home page and the Contact page  */
/* ------------------------------------------------------------------ */

export type Brief = { name: string; email: string; services: string[]; message: string };

interface QuickBriefProps {
  /** Where the message goes: each form keeps its own Google Sheet and columns */
  send: (brief: Brief) => Promise<unknown>;
  tone?: 'light' | 'dark';
  /** Carried over from the footer sentence or the home page chat */
  initial?: { name?: string; service?: string; message?: string };
}

const TONE = {
  light: {
    card: 'bg-white border-black/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.08)] text-black',
    bar: 'bg-zinc-50 border-black/[0.06]',
    row: 'border-black/[0.06]',
    key: 'text-black/40',
    field: 'text-black placeholder:text-black/25',
    body: 'text-black/80',
    ring: 'ring-white',
    hint: 'text-black/35',
    send: 'bg-black text-white hover:bg-[#703FEC]',
    muted: 'text-zinc-600',
    strong: 'text-black',
    again: 'text-zinc-500 hover:text-black',
  },
  dark: {
    card: 'bg-[#141414] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] text-white',
    bar: 'bg-white/[0.03] border-white/10',
    row: 'border-white/10',
    key: 'text-white/40',
    field: 'text-white placeholder:text-white/25',
    body: 'text-white/85',
    ring: 'ring-[#141414]',
    hint: 'text-white/35',
    send: 'bg-white text-black hover:bg-[#703FEC] hover:text-white',
    muted: 'text-white/60',
    strong: 'text-white',
    again: 'text-white/50 hover:text-white',
  },
};

/** A textarea that grows with what's written. */
const useAutosize = (value: string) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 132)}px`;
  }, [value]);
  return ref;
};

/* ------------------------------------------------------------------ */
/* The studio buddy: a pair of eyes peeking over the window            */
/* ------------------------------------------------------------------ */

const Eye: React.FC<{ look: { x: number; y: number }; blink: boolean }> = ({ look, blink }) => (
  <span className="relative grid place-items-center w-6 h-6 rounded-full bg-white overflow-hidden">
    <motion.span
      className="block w-2.5 h-2.5 rounded-full bg-black"
      animate={{ x: look.x * 5, y: look.y * 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
    <motion.span className="absolute inset-x-0 top-0 bg-[#703FEC]" animate={{ height: blink ? '100%' : '0%' }} transition={{ duration: 0.08 }} />
  </span>
);

const Buddy: React.FC<{ say: string; bounce: number; dark: boolean }> = ({ say, bounce, dark }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // Eyes follow the cursor, or whichever field has focus (phones)
  useEffect(() => {
    const aim = (x: number, y: number) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
      const d = Math.max(1, Math.hypot(dx, dy));
      const k = Math.min(1, d / 220);
      setLook({ x: (dx / d) * k, y: (dy / d) * k });
    };
    const onMove = (e: PointerEvent) => aim(e.clientX, e.clientY);
    const onFocus = (e: FocusEvent) => {
      const r = (e.target as HTMLElement)?.getBoundingClientRect?.();
      if (r) aim(r.left + 40, r.top + r.height / 2);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('focusin', onFocus);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('focusin', onFocus); };
  }, []);

  // Blink every few seconds
  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => { setBlink(true); window.setTimeout(() => setBlink(false), 140); loop(); }, 2200 + Math.random() * 2600);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none absolute -top-3 right-6 md:right-8 z-0 flex items-start gap-2.5">
      <motion.span
        key={say}
        initial={{ opacity: 0, x: 8, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.25, ease }}
        className={`rounded-2xl rounded-br-md px-3 py-1.5 text-xs md:text-sm font-semibold whitespace-nowrap shadow-lg ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}
      >
        {say}
      </motion.span>
      <motion.div
        ref={ref}
        aria-hidden
        key={bounce}
        animate={bounce ? { y: [0, -7, 0], rotate: [0, -6, 6, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-1 w-14 h-11 rounded-2xl bg-[#703FEC] shadow-[0_10px_30px_rgba(112,63,236,0.4)]"
      >
        <Eye look={look} blink={blink} />
        <Eye look={look} blink={blink} />
      </motion.div>
    </div>
  );
};

/** What the buddy says, based on where you are and what you've written. */
const buddyLine = (focus: string, email: string, subject: string, message: string, name: string) => {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const first = name.trim().split(' ')[0];
  if (focus === 'email') return email.length > 4 && !emailOk ? 'Hmm, check that email.' : emailOk ? 'Got it.' : 'Where do we reply?';
  if (focus === 'subject') return subject.trim() ? 'Ooh, intriguing.' : 'Optional, but fun.';
  if (focus === 'message') return message.trim().length > 140 ? 'This sounds good.' : message.trim() ? 'Go on…' : 'Tell us everything.';
  if (focus === 'name') return first ? `Hi ${first}!` : 'And you are?';
  if (emailOk && message.trim() && first) return 'Ready when you are.';
  return 'Psst. Write to us.';
};

export const QuickBrief: React.FC<QuickBriefProps> = ({ send, tone = 'light', initial = {} }) => {
  const t = TONE[tone];
  const dark = tone === 'dark';
  const service = initial.service ?? '';
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(() => {
    const s = SERVICES.find((x) => x.value === service);
    return s ? `New project: ${s.label.toLowerCase()}` : '';
  });
  // The greeting is already written above the box, so don't repeat it
  const [message, setMessage] = useState(() => (initial.message ?? '').replace(/^Hi Natwic,\s*/i, ''));
  const [name, setName] = useState(initial.name ?? '');
  const [flying, setFlying] = useState(false);
  const [focus, setFocus] = useState('');
  const [bounce, setBounce] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const bodyRef = useAutosize(message);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (formRef.current && !formRef.current.reportValidity()) return;
    setFormState('submitting');
    setFlying(true);
    const flight = new Promise((r) => window.setTimeout(r, 1300));
    const body = subject.trim() ? `${subject.trim()}\n\n${message.trim()}` : message.trim();
    try {
      await Promise.all([flight, send({ name: name.trim(), email: email.trim(), services: service ? [service] : [], message: body })]);
      setFormState('success');
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
    } finally {
      setFlying(false);
    }
  };

  const reset = () => { setEmail(''); setSubject(''); setMessage(''); setName(''); setFocus(''); setFormState('idle'); };
  const field = `w-full min-w-0 bg-transparent outline-none ${t.field}`;

  return (
    <div className="relative pt-7">
      {formState !== 'success' && !flying && <Buddy say={buddyLine(focus, email, subject, message, name)} bounce={bounce} dark={dark} />}
    <div className={`relative z-[1] rounded-[1.75rem] border overflow-hidden text-left ${t.card}`}>
      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="px-6 md:px-10 py-14 md:py-20">
            <motion.div
              initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.15 }}
              className={`inline-block rounded-xl border-[3px] px-4 py-2 ${dark ? 'border-[#b9a1ff] text-[#b9a1ff]' : 'border-[#703FEC] text-[#703FEC]'}`}
            >
              <span className="block text-3xl font-black uppercase tracking-[0.1em] leading-none">Sent</span>
            </motion.div>
            <h3 className="mt-8 text-4xl md:text-5xl font-bold tracking-[-0.045em] leading-[1.05]">Thanks, {name.trim().split(' ')[0]}.</h3>
            <p className={`mt-4 text-lg leading-relaxed ${t.muted}`}>
              We’ll reply to <span className={`font-semibold ${t.strong}`}>{email.trim()}</span> within 24 hours.
            </p>
            <button onClick={reset} className={`mt-8 text-sm font-semibold transition-colors ${t.again}`}>Write another</button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={submit}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); } }}
            initial={{ opacity: 0 }}
            animate={flying ? { opacity: 0, scale: 0.6, y: -20, rotateX: 50 } : { opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            style={{ transformPerspective: 900 }}
          >
            {/* Window bar */}
            <div className={`flex items-center justify-between border-b px-5 md:px-7 py-3.5 ${t.bar}`}>
              <span className="flex gap-1.5">
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              </span>
              <span className={`text-[11px] font-semibold ${t.key}`}>New message</span>
              <span className="w-12" />
            </div>

            {/* To */}
            <div className={`flex items-center gap-3 border-b px-5 md:px-7 py-3.5 ${t.row}`}>
              <span className={`w-14 shrink-0 text-sm ${t.key}`}>To</span>
              <span className="flex -space-x-2">
                {TEAM.map((m, i) => (
                  <motion.img
                    key={m.name}
                    src={m.src}
                    alt={m.name}
                    width={28}
                    height={28}
                    loading="lazy"
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={`w-7 h-7 rounded-full object-cover object-top ring-2 ${t.ring}`}
                  />
                ))}
              </span>
              <span className="text-sm font-semibold">The Natwic team</span>
              <span className={`ml-auto hidden sm:flex items-center gap-1.5 text-xs ${t.hint}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Replies within 24h
              </span>
            </div>

            {/* From */}
            <label className={`flex items-center gap-3 border-b px-5 md:px-7 py-3.5 ${t.row}`}>
              <span className={`w-14 shrink-0 text-sm ${t.key}`}>From</span>
              <input required type="email" value={email} onChange={(e) => { const v = e.target.value; if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setBounce((b) => b + 1); setEmail(v); }} placeholder="you@company.com" autoComplete="email" aria-label="Your email" onFocus={() => setFocus('email')} className={`${field} text-base font-medium`} />
            </label>

            {/* Subject */}
            <label className={`flex items-center gap-3 border-b px-5 md:px-7 py-3.5 ${t.row}`}>
              <span className={`w-14 shrink-0 text-sm ${t.key}`}>Subject</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="New project" aria-label="Subject" onFocus={() => setFocus('subject')} className={`${field} text-base font-semibold`} />
            </label>

            {/* Body */}
            <div className="px-5 md:px-7 pt-6 pb-4">
              <p className={`text-lg font-medium ${t.body}`}>Hi Natwic,</p>
              <textarea
                ref={bodyRef}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="We’re building… and we need help with…"
                aria-label="Your message" onFocus={() => setFocus('message')}
                className={`${field} mt-2 resize-none text-lg leading-relaxed`}
              />
              <label className={`mt-3 flex items-baseline gap-2 text-lg font-medium ${t.body}`}>
                <span>Thanks,</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" autoComplete="name" aria-label="Your name" onFocus={() => setFocus('name')} className={`${field} font-semibold`} />
              </label>
            </div>

            {formState === 'error' && (
              <p className="px-5 md:px-7 text-sm font-medium text-[#F3350C]">That didn’t send. Try again, or email us at {EMAIL}.</p>
            )}

            {/* Send */}
            <div className="flex items-center justify-between gap-4 px-5 md:px-7 pb-5 md:pb-6 pt-2">
              <span className={`hidden md:inline text-xs ${t.hint}`}>⌘ + Enter to send</span>
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className={`group ml-auto inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors disabled:opacity-60 ${t.send}`}
              >
                {formState === 'submitting' ? 'Sending…' : 'Send'}
                <span className="w-10 h-10 rounded-full bg-[#703FEC] text-white grid place-items-center transition-transform duration-500 group-hover:-rotate-12 group-hover:translate-x-0.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden><path d="M3 11.5 21 3l-7.5 18-2.5-7.5L3 11.5Z" /></svg>
                </span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

    </div>

      {/* Off it goes */}
      <AnimatePresence>
        {flying && (
          <motion.svg
            key="plane"
            viewBox="0 0 48 48"
            aria-hidden
            className="pointer-events-none fixed left-1/2 top-1/2 z-[60] w-16 h-16 md:w-20 md:h-20 text-[#703FEC] drop-shadow-[0_10px_20px_rgba(112,63,236,0.4)]"
            initial={{ x: '-50%', y: '-50%', scale: 0.2, rotate: 0, opacity: 0 }}
            animate={{ x: ['-50%', '-40%', '30vw', '70vw'], y: ['-50%', '-60%', '-25vh', '-70vh'], scale: [0.2, 1, 1, 0.7], rotate: [0, -10, -24, -30], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.3, times: [0, 0.25, 0.7, 1], ease: 'easeIn', delay: 0.25 }}
          >
            <path d="M4 22 44 4 30 44 22 28Z" fill="currentColor" />
            <path d="M22 28 44 4 18 25Z" fill="#b9a1ff" />
            <path d="M22 28v12l6-8" fill="#5a2fd0" />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};
