import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-[100] px-6 py-4 md:px-12 flex justify-between items-center bg-white border-b border-zinc-100"
    >
      <div className="flex items-center text-black">
        <Logo />
      </div>
      
      <div className="hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-black">
        <a href="#home" className="hover:text-[#703FEC] transition-colors">Home</a>
        <a href="#studio" className="hover:text-[#703FEC] transition-colors">Studio</a>
        <a href="#work" className="flex items-center gap-2 hover:text-[#703FEC] transition-colors group">
          Work 
          <span className="bg-[#F3350C] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
        </a>
        <a href="#blog" className="hover:text-[#703FEC] transition-colors">Blog</a>
        <a href="#contact" className="hover:text-[#703FEC] transition-colors">Contact</a>
        
        <div className="flex flex-col gap-1 w-5 cursor-pointer ml-4 group">
          <div className="h-[1px] bg-black w-full group-hover:bg-[#703FEC] transition-colors" />
          <div className="h-[1px] bg-black w-2/3 self-end group-hover:bg-[#703FEC] transition-colors" />
        </div>
      </div>
      
      <div className="lg:hidden flex flex-col gap-1 w-6 cursor-pointer text-black">
        <div className="h-[1px] bg-current w-full" />
        <div className="h-[1px] bg-current w-full" />
      </div>
    </motion.nav>
  );
};