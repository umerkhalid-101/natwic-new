
import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-32 px-6 border-t border-zinc-900 overflow-hidden bg-black text-white">
      <div className="max-w-7xl mx-auto mb-32">
        <div className="bg-zinc-950 rounded-[3rem] p-16 md:p-32 text-center border border-zinc-900 overflow-hidden relative group">
           <div className="absolute top-0 left-0 w-full h-full bg-[#703FEC]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10">
              <div className="flex justify-center mb-12">
                <Logo className="w-20 h-20 text-white" />
              </div>
              <h2 className="text-5xl md:text-[7rem] font-bold tracking-tight leading-[0.8] mb-16">
                Build your legacy<br />with <span className="text-[#703FEC] italic">Natwic®</span>
              </h2>
              <button className="bg-white text-black px-12 py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-[#703FEC] hover:text-white transition-all scale-100 hover:scale-110 shadow-[0_0_50px_rgba(112,63,236,0.2)]">
                Contact the studio
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-32">
        <div className="col-span-2 space-y-8">
           <div className="flex items-center gap-3">
             <span className="text-xl font-bold uppercase tracking-tighter">Natwic®</span>
           </div>
           <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
             A high-fidelity creative studio based globally, redefining the digital experience through intentional design and refined tech.
           </p>
        </div>
        
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F3350C]">Connect</p>
          <ul className="text-zinc-500 text-xs space-y-4 uppercase tracking-[0.3em] font-semibold">
            <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
            <li className="hover:text-white cursor-pointer transition-colors">LinkedIn</li>
            <li className="hover:text-white cursor-pointer transition-colors">Behance</li>
          </ul>
        </div>

        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#703FEC]">Studio</p>
          <ul className="text-zinc-500 text-xs space-y-4 uppercase tracking-[0.3em] font-semibold">
            <li className="hover:text-white cursor-pointer transition-colors">Work</li>
            <li className="hover:text-white cursor-pointer transition-colors">About</li>
            <li className="hover:text-white cursor-pointer transition-colors">Process</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">
        <p>© 2025 Natwic Studio. Pure Intent.</p>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
      </div>

      <div className="relative py-12 pb-24 select-none pointer-events-none">
        <h1 className="text-[20vw] font-bold tracking-tighter leading-none text-white/[0.03] absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
          NATWIC STUDIO
        </h1>
      </div>
    </footer>
  );
};
