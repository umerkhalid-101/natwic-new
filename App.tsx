import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Partners } from './components/Partners';
import { SelectedWork } from './components/SelectedWork';
import { WhyUs } from './components/WhyUs';
import { AboutUs } from './components/AboutUs';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Blog } from './components/Blog';
import { Footer } from './components/Footer';
import { GeminiChat } from './components/GeminiChat';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <Partners />
        <WhyUs />
        <AboutUs />
        
        <SelectedWork />
        <Services />
        <Stats />
        
        <Pricing />
        <FAQ />
        <Blog />
      </main>

      <Footer />

      {/* AI Chat Integration */}
      <AnimatePresence>
        {isChatOpen && (
          <GeminiChat onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[#703FEC] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-bold leading-none">AI</span>
          <div className="w-1.5 h-1.5 bg-[#F3350C] rounded-full animate-pulse" />
        </div>
      </motion.button>
    </div>
  );
};

export default App;