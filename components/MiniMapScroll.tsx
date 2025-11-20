import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MiniMapScroll: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [map, setMap] = useState({
    pageHeight: 0,
    viewportHeight: 0,
    scrollTop: 0,
  });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      if (pageHeight > viewportHeight * 1.5) {
        setVisible(true);
        setMap({ pageHeight, viewportHeight, scrollTop });
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const mapRect = mapRef.current.getBoundingClientRect();
    const clickY = e.clientY - mapRect.top;
    const clickRatio = clickY / mapRect.height;
    const targetScrollY = clickRatio * map.pageHeight - map.viewportHeight / 2;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const viewportTop = (map.scrollTop / map.pageHeight) * 100;
  const viewportHeight = (map.viewportHeight / map.pageHeight) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={mapRef}
          onClick={handleClick}
          className="fixed top-1/2 -translate-y-1/2 right-4 w-6 h-1/2 max-h-[400px] bg-[var(--background-secondary)]/30 rounded-full z-50 cursor-pointer backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <motion.div
            className="absolute w-full bg-[var(--primary-accent)]/80 rounded-full"
            style={{
              top: `${viewportTop}%`,
              height: `${viewportHeight}%`,
            }}
            animate={{
              top: `${viewportTop}%`,
              height: `${viewportHeight}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniMapScroll;