import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ContactProps {
  isStandalone?: boolean;
  setView?: (view: 'home' | 'contact') => void;
}

export const Contact: React.FC<ContactProps> = ({ isStandalone = true, setView }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web Design',
    budget: '$1,000 - $5,000',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      // Real integration with Google Sheets via Apps Script Web App
      if (YOUR_SCRIPT_URL.includes('placeholder')) {
        console.warn("Please update YOUR_SCRIPT_URL in Contact.tsx with your deployed Apps Script URL.");
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        await fetch(YOUR_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      setFormState('success');
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
    }
  };

  const inputClasses = "w-full bg-transparent border-b border-zinc-200 py-6 text-xl md:text-2xl font-medium focus:border-[#703FEC] focus:outline-none transition-colors placeholder:text-zinc-300";

  return (
    <section id="contact" className={`${isStandalone ? 'min-h-screen pt-40 pb-24' : 'py-48'} px-6 md:px-12 bg-white text-black`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex gap-2 items-center mb-10">
              <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full shadow-[0_0_8px_rgba(112,63,236,0.6)]" />
              <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.4em]">Contact Us</p>
            </div>
            
            {/* H1 for SEO Importance since this is the primary heading of the view */}
            <h1 className="text-6xl md:text-[110px] font-bold tracking-tighter leading-[0.85] mb-16">
              Let's build<br />something<br /><span className="text-[#703FEC] italic">legendary.</span>
            </h1>

            <div className="space-y-16">
              <div className="flex flex-col md:flex-row gap-16">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Email us</p>
                  <a href="mailto:hello@natwic.studio" className="text-2xl font-semibold hover:text-[#703FEC] transition-colors border-b border-zinc-100 pb-2">hello@natwic.studio</a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Call us</p>
                  <a href="tel:+123456789" className="text-2xl font-semibold hover:text-[#703FEC] transition-colors border-b border-zinc-100 pb-2">+1 234 567 890</a>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Visit Studio</p>
                  <p className="text-lg font-medium leading-relaxed text-zinc-600">
                    124 Creative Boulevard<br />
                    Suite 400, Studio District<br />
                    London, UK
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Follow us</p>
                  {['Instagram', 'LinkedIn', 'Behance', 'X (Twitter)'].map((social) => (
                    <a key={social} href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#703FEC] transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-zinc-300 rounded-full group-hover:bg-[#703FEC] transition-colors" />
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-zinc-50/50 p-8 md:p-16 rounded-[3rem] border border-zinc-100"
          >
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[600px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 bg-[#703FEC] rounded-full flex items-center justify-center text-white text-4xl mb-10 shadow-2xl shadow-[#703FEC]/30">
                    ✓
                  </div>
                  <h3 className="text-4xl font-bold mb-6 tracking-tight">Transmission Received.</h3>
                  <p className="text-zinc-500 font-medium max-w-sm">We have received your request and our strategists will reach out within 24 hours.</p>
                  <button 
                    onClick={() => setFormState('idle')}
                    className="mt-12 bg-black text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#703FEC] transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="relative group">
                      <input 
                        required
                        type="text" 
                        placeholder="Full Name *"
                        className={inputClasses}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="relative group">
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address *"
                        className={inputClasses}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service Required</p>
                      <select 
                        className="w-full bg-transparent border-b border-zinc-200 py-4 text-lg font-semibold focus:border-[#703FEC] focus:outline-none appearance-none"
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                      >
                        <option>Web Design & Dev</option>
                        <option>Branding & Identity</option>
                        <option>Content & Strategy</option>
                        <option>Social & Marketing</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Project Budget</p>
                      <select 
                        className="w-full bg-transparent border-b border-zinc-200 py-4 text-lg font-semibold focus:border-[#703FEC] focus:outline-none appearance-none"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      >
                        <option>$ 1,000 - $ 5,000</option>
                        <option>$ 6,000 - $ 10,000</option>
                        <option>$ 11,000 - $ 20,000</option>
                        <option>$ 25,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea 
                      required
                      placeholder="Tell us about your project goals *"
                      rows={5}
                      className={inputClasses}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <div className="pt-10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={formState === 'submitting'}
                      className={`group relative overflow-hidden bg-black text-white px-14 py-7 rounded-full text-[11px] font-bold uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-5 w-full md:w-auto ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="relative z-10">
                        {formState === 'submitting' ? 'Submitting...' : 'Initiate Project'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#703FEC] to-[#a855f7] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      {formState !== 'submitting' && (
                        <div className="w-1.5 h-1.5 bg-[#703FEC] rounded-full group-hover:bg-white transition-colors relative z-10 shadow-[0_0_8px_#703FEC]" />
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
};