import React from 'react';

/**
 * "Opens elsewhere" arrow. Drawn as SVG because the ↗ character isn't in the
 * site's Inter subset, and some browsers render it as a missing-glyph box.
 */
export const ArrowUpRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={`inline-block w-[0.8em] h-[0.8em] align-[-0.05em] ${className}`}>
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
);
