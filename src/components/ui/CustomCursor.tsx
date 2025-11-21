import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateMotionPreference);

    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
      );
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          width: 32,
          height: 32,
          border: `2px solid var(--primary-accent)`,
          x: position.x - 16,
          y: position.y - 16,
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isPointer ? 0.3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--primary-accent)] pointer-events-none z-[9999]"
        style={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        animate={{
          scale: isPointer ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </>
  );
};

export default CustomCursor;