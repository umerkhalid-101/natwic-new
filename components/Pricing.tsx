import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const SERVICES_OPTIONS = [
  "Web Design & Development",
  "Branding & Identity",
  "Digital Marketing",
  "Content Strategy",
  "Other"
];

interface PricingProps {
  setView?: (view: 'home' | 'contact' | 'studio') => void;
}

export const Pricing: React.FC<PricingProps> = ({ setView }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web Design & Development',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    try {
        await fetch(YOUR_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, source: 'Quote Section' })
        });
        setFormState('success');
    } catch (error) {
        console.error('Submission error:', error);
        setFormState('error');
    }
  };

  return (
    <section className="py-32 px-4 bg-[#080808] text-white relative overflow-hidden rounded-[3rem] mx-2 md:mx-6 my-2 min-h-[90vh] flex items-center justify-center border border-white/5 shadow-2xl">
       {/* Ambient Background */}
       <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#703FEC]/20 rounded-full blur-[150px] opacity-40 mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px] opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]" />
          
          {/* Big Blurred Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0">
             <h1 className="text-[18vw] font-black text-white/[0.04] blur-[8px] leading-none whitespace-nowrap select-none tracking-tighter">
                START PROJECT
             </h1>
          </div>
       </div>

       <div className="max-w-4xl mx-auto relative z-10 w-full px-2">
          <div className="text-center mb-16">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex items-center justify-center gap-3 mb-6"
             >
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#703FEC]"></span>
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#703FEC] drop-shadow-[0_0_10px_rgba(112,63,236,0.8)]">Get a Free Quote</p>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#703FEC]"></span>
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-lg"
             >
               Ready to elevate?
             </motion.h2>
          </div>

          <motion.div 
             initial={{ opacity: 0, y: 60 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="relative perspective-[1200px]"
          >
            {/* The Floating Card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-white/20 transition-colors duration-500"
            >
               {/* Shine effect */}
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
               <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#703FEC]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#703FEC]/20 transition-colors duration-700" />

               <AnimatePresence mode="wait">
                  {formState === 'success' ? (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="py-24 text-center"
                     >
                       <div className="w-24 h-24 bg-gradient-to-tr from-[#703FEC] to-blue-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-[0_0_40px_rgba(112,63,236,0.4)] text-white">✓</div>
                       <h3 className="text-4xl font-bold mb-4 tracking-tight">Request Received</h3>
                       <p className="text-zinc-400 mb-10 max-w-sm mx-auto text-lg">We've received your details. Our strategists will analyze your needs and send a quote shortly.</p>
                       <button 
                         onClick={() => { setFormState('idle'); setFormData({ name: '', email: '', service: 'Web Design & Development', message: '' }); }}
                         className="text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-colors"
                       >
                         Request another quote
                       </button>
                     </motion.div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3 group/input">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4 group-focus-within/input:text-[#703FEC] transition-colors">Name</label>
                              <input 
                                required
                                type="text" 
                                placeholder="Your Name"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#703FEC] focus:bg-white/[0.05] transition-all hover:border-white/20"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                              />
                           </div>
                           <div className="space-y-3 group/input">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4 group-focus-within/input:text-[#703FEC] transition-colors">Email</label>
                              <input 
                                required
                                type="email" 
                                placeholder="your@email.com"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#703FEC] focus:bg-white/[0.05] transition-all hover:border-white/20"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-3 group/input">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4 group-focus-within/input:text-[#703FEC] transition-colors">I'm interested in</label>
                          <div className="relative">
                              <select 
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#703FEC] focus:bg-white/[0.05] transition-all appearance-none cursor-pointer hover:border-white/20"
                                value={formData.service}
                                onChange={e => setFormData({...formData, service: e.target.value})}
                              >
                                  {SERVICES_OPTIONS.map(opt => (
                                    <option key={opt} value={opt} className="bg-[#111] text-white">{opt}</option>
                                  ))}
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 9l6 6 6-6"/>
                                </svg>
                              </div>
                          </div>
                        </div>

                        <div className="space-y-3 group/input">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4 group-focus-within/input:text-[#703FEC] transition-colors">Project Details</label>
                          <textarea 
                            required
                            rows={4}
                            placeholder="Tell us about your goals, timeline, and budget..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#703FEC] focus:bg-white/[0.05] transition-all resize-none hover:border-white/20"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                          />
                        </div>

                        <div className="pt-6">
                          <button 
                            disabled={formState === 'submitting'}
                            type="submit"
                            className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] py-6 rounded-2xl hover:bg-[#703FEC] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(112,63,236,0.4)] transform active:scale-[0.99] duration-300 relative overflow-hidden"
                          >
                            <span className="relative z-10">{formState === 'submitting' ? 'Processing...' : 'Get Free Quote'}</span>
                          </button>
                        </div>
                     </form>
                  )}
               </AnimatePresence>
            </motion.div>
          </motion.div>
       </div>
    </section>
  );
};