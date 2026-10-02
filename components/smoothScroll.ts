import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId = 0;

// Starts Lenis smooth scrolling. Skipped for users who prefer reduced motion.
export const initSmoothScroll = () => {
  if (lenis || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
};

export const destroySmoothScroll = () => {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
};

// Use these instead of touching body overflow directly, so Lenis stays in sync.
export const lockScroll = () => {
  document.body.style.overflow = 'hidden';
  lenis?.stop();
};

export const unlockScroll = () => {
  document.body.style.overflow = '';
  lenis?.start();
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
};

export const scrollToY = (y: number) => {
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
};
