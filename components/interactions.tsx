import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, MotionValue } from 'framer-motion';

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Pointer-driven 3D tilt plus a spotlight position, for cards.
 * Spread `handlers` on the element and use `rotateX/rotateY` in its style.
 */
export const useTilt = (max = 6) => {
  const ref = useRef<HTMLElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(-999);
  const py = useMotionValue(-999);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    px.set(x);
    py.set(y);
    ry.set(((x / r.width) - 0.5) * max * 2);
    rx.set(-((y / r.height) - 0.5) * max * 2);
  };

  const onMouseLeave = () => {
    rx.set(0);
    ry.set(0);
    px.set(-999);
    py.set(-999);
  };

  return { ref, rotateX, rotateY, px, py, handlers: { onMouseMove, onMouseLeave } };
};

/** A soft radial light that sits under the cursor. Place inside a `relative overflow-hidden` parent. */
export const Spotlight: React.FC<{ x: MotionValue<number>; y: MotionValue<number>; color?: string; size?: number }> = ({
  x,
  y,
  color = 'rgba(112,63,236,0.35)',
  size = 520,
}) => {
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 65%)`;
  return <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500" style={{ background }} />;
};
