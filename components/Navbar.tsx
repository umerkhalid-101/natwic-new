import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Magnetic } from './Magnetic';

interface NavbarProps {
  setView: (view: 'home' | 'contact' | 'studio' | 'work') => void;
  currentView: 'home' | 'contact' | 'studio' | 'work';
}

export const Navbar: React.FC<NavbarProps> = ({ setView, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (view: 'home' | 'contact' | 'studio' | 'work') => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-zinc-100"
      >
        <div 
          className="flex items-center text-black cursor-pointer relative z-[101]" 
          onClick={() => handleNavClick('home')}
        >
          <Magnetic>
             <Logo />
          </Magnetic>
        </div>
        
        {/* Desktop Menu - Visible on Large screens */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-black">
          <Magnetic>
            <button 
              onClick={() => setView('home')} 
              className={`hover:text-[#703FEC] transition-colors p-2 ${currentView === 'home' ? 'text-[#703FEC]' : ''}`}
            >
              Home
            </button>
          </Magnetic>
          
          <Magnetic>
            <button 
              onClick={() => setView('studio')}
              className={`hover:text-[#703FEC] transition-colors p-2 ${currentView === 'studio' ? 'text-[#703FEC]' : ''}`}
            >
              Studio
            </button>
          </Magnetic>

          <Magnetic>
            <button 
              onClick={() => setView('work')}
              className={`flex items-center gap-2 hover:text-[#703FEC] transition-colors group p-2 ${currentView === 'work' ? 'text-[#703FEC]' : ''}`}
            >
              Work 
              <span className="bg-[#703FEC] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold group-hover:scale-110 transition-transform">3</span>
            </button>
          </Magnetic>

          <Magnetic>
            <button 
              onClick={() => setView('contact')}
              className={`hover:text-[#703FEC] transition-colors p-2 ${currentView === 'contact' ? 'text-[#703FEC]' : ''}`}
            >
              Contact
            </button>
          </Magnetic>
          
          <Magnetic>
            <div className="flex flex-col gap-1 w-5 cursor-pointer ml-4 group p-2">
              <div className="h-[1px] bg-black w-full group-hover:bg-[#703FEC] transition-colors" />
              <div className="h-[1px] bg-black w-2/3 self-end group-hover:bg-[#703FEC] transition-colors" />
            </div>
          </Magnetic>
        </div>
        
        {/* Mobile Hamburger - Hidden on lg screens */}
        <button 
          className="lg:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-end cursor-pointer text-black relative z-[101] p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <motion.div 
            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
            className="h-[1.5px] bg-black w-full origin-center transition-all" 
          />
          <motion.div 
            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            className="h-[1.5px] bg-black w-2/3 transition-all" 
          />
          <motion.div 
            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
            className="h-[1.5px] bg-black w-full origin-center transition-all" 
          />
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] bg-white pt-24 px-6 pb-6 flex flex-col lg:hidden"
          >
             <div className="flex flex-col gap-2 mt-10">
                {[
                  { label: 'Home', action: () => handleNavClick('home') },
                  { label: 'Studio', action: () => handleNavClick('studio') },
                  { label: 'Work', action: () => handleNavClick('work') },
                  { label: 'Contact', action: () => handleNavClick('contact') }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1), duration: 0.5 }}
                  >
                    <button 
                      onClick={item.action}
                      className="text-[13vw] font-bold text-left hover:text-[#703FEC] transition-colors leading-[0.9] tracking-tighter"
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ))}
             </div>

             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-auto border-t border-zinc-100 pt-8"
             >
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Connect</p>
                <div className="flex flex-col gap-4">
                    <a href="#" className="text-xl font-medium tracking-tight">Instagram ↗</a>
                    <a href="#" className="text-xl font-medium tracking-tight">LinkedIn ↗</a>
                    <a href="#" className="text-xl font-medium tracking-tight">Behance ↗</a>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};