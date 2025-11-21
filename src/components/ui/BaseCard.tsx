import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, Variants } from 'framer-motion';

interface BaseCardProps {
  children: React.ReactNode;
  onClick: () => void;
  id?: string;
  reduceMotion?: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
};

const BaseCard: React.FC<BaseCardProps> = ({ children, onClick, id, reduceMotion }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const { width, height, left, top } = rect;
      const mouseX = event.clientX - left;
      const mouseY = event.clientY - top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct * 100);
      y.set(yPct * 100);
    }
  };

  const handleMouseLeave = () => {
    if (reduceMotion) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={!reduceMotion ? {
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX,
        rotateY,
      } : {}}
      whileHover={reduceMotion ? {} : { scale: 1.03 }}
      whileTap={reduceMotion ? {} : { scale: 0.97 }}
      className="cursor-pointer"
    >
      <div className="shine-effect" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default BaseCard;