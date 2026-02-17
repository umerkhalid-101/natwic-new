import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32px cursor
      cursorY.set(e.clientY - 16);
      
      const target = e.target as HTMLElement;
      
      // Check interactive elements
      const interactive = target.closest('a, button, .cursor-pointer, input, select, textarea');
      const isInteractive = !!interactive || window.getComputedStyle(target).cursor === 'pointer';
      
      // Check for data-cursor-text attribute
      const textContainer = target.closest('[data-cursor-text]');
      const text = textContainer ? textContainer.getAttribute('data-cursor-text') : "";

      setIsHovering(isInteractive);
      setCursorText(text || "");
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{`
        @media (min-width: 769px) {
          body, a, button, input, select, textarea, .cursor-pointer { 
            cursor: none !important; 
          }
        }
        @media (max-width: 768px) {
          .custom-cursor { display: none; }
        }
      `}</style>
      <motion.div
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: 32,
          height: 32,
        }}
      >
        <motion.div 
            className="absolute inset-0 bg-white rounded-full"
            animate={{
                scale: isClicking ? 0.8 : (cursorText ? 3 : (isHovering ? 2.5 : 1)),
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        {cursorText && (
            <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 text-[4px] font-bold text-black uppercase tracking-widest text-center leading-none"
            >
                {cursorText}
            </motion.span>
        )}
      </motion.div>
    </>
  );
};