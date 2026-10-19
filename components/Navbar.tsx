import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIALS } from './socials';
import { Logo } from './Logo';
import { Magnetic } from './Magnetic';
import { lockScroll, unlockScroll } from './smoothScroll';
import { Link } from './nav';

export const NAV_ITEMS = [
  { label: 'Home', view: 'home', href: '/' },
  { label: 'Studio', view: 'studio', href: '/studio' },
  { label: 'Work', view: 'work', href: '/work' },
  { label: 'Journal', view: 'journal', href: '/journal' },
  { label: 'Contact', view: 'contact', href: '/contact' },
] as const;

interface NavbarProps {
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return unlockScroll;
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        data-site-nav
        className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-zinc-100"
      >
        <Link
          href="/"
          aria-label="Natwic home"
          className="flex items-center text-black cursor-pointer relative z-[101]"
          onClick={closeMenu}
        >
          <Magnetic>
             <Logo />
          </Magnetic>
        </Link>
        
        {/* Desktop Menu - Visible on Large screens */}
        <div className="hidden lg:flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.15em] text-black">
          {NAV_ITEMS.map((item) => (
            <Magnetic key={item.view}>
              <Link
                href={item.href}
                aria-current={currentView === item.view ? 'page' : undefined}
                className={`block hover:text-[#703FEC] transition-colors p-2 ${currentView === item.view ? 'text-[#703FEC]' : ''}`}
              >
                {item.label}
              </Link>
            </Magnetic>
          ))}

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
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
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
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1), duration: 0.5 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="inline-block text-[13vw] font-bold text-left hover:text-[#703FEC] transition-colors leading-[0.9] tracking-tighter"
                    >
                      {item.label}
                    </Link>
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
                    {SOCIALS.map((s) => (
                      <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-xl font-medium tracking-tight">{s.name} ↗</a>
                    ))}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};