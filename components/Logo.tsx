import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-5" }) => {
  return (
    <div className={`flex items-center gap-3 ${className} select-none`}>
      <div className="flex flex-col">
        <span className="font-semibold text-lg tracking-[-0.04em] uppercase leading-none">Natwic</span>
        <span className="text-[8px] font-medium uppercase tracking-[0.2em] mt-0.5 text-zinc-400">Studio</span>
      </div>
      <div className="flex gap-[1.5px] h-6 items-center border-l border-zinc-200 pl-3 ml-1">
        <div className="w-[1px] h-full bg-black/80" />
        <div className="w-[3px] h-full bg-black/80" />
        <div className="w-[1px] h-full bg-black/80" />
        <div className="w-[1px] h-full bg-black/80" />
        <div className="w-[4px] h-full bg-black/80" />
        <div className="w-[1px] h-full bg-black/80" />
        <div className="w-[2px] h-full bg-black/80" />
      </div>
    </div>
  );
};