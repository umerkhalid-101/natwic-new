import React from 'react';

const MARK = '/brand/mark-128.png';

/** The Natwic mark with the wordmark, or the mark on its own (`variant="mark"`). */
export const Logo: React.FC<{ className?: string; variant?: 'full' | 'mark' }> = ({ className = 'h-5', variant = 'full' }) => {
  if (variant === 'mark') {
    return <img src={MARK} alt="Natwic" width={128} height={128} draggable={false} className={`${className} object-contain select-none`} />;
  }
  return (
    <div className={`flex items-center gap-2.5 ${className} select-none`}>
      <img src={MARK} alt="" width={28} height={28} draggable={false} className="w-7 h-7 object-contain" />
      <div className="flex flex-col">
        <span className="font-semibold text-lg tracking-[-0.04em] uppercase leading-none">Natwic</span>
        <span className="text-[8px] font-medium uppercase tracking-[0.2em] mt-0.5 text-zinc-400">Studio</span>
      </div>
    </div>
  );
};
