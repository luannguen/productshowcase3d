import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState('default');

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        const updateCursorVariant = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, [role="button"], input[type="range"]')) {
                setCursorVariant('pointer');
            } else if (target.closest('input[type="text"], textarea')) {
                setCursorVariant('text');
            } else {
                setCursorVariant('default');
            }
        };

        window.addEventListener('mousemove', mouseMove);
        document.body.addEventListener('mouseover', updateCursorVariant);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            document.body.removeEventListener('mouseover', updateCursorVariant);
        };
    }, []);

    const variants = {
        default: {
            height: 24,
            width: 24,
            border: '2px solid var(--primary-accent)',
            backgroundColor: 'transparent',
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
        },
        pointer: {
            height: 32,
            width: 32,
            border: 'none',
            backgroundColor: 'var(--primary-accent)',
            mixBlendMode: 'difference',
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
        },
        text: {
            height: 32,
            width: 2,
            borderRadius: 0,
            border: 'none',
            backgroundColor: 'var(--primary-accent)',
            x: mousePosition.x - 1,
            y: mousePosition.y - 16,
        },
    };
    
    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full z-[9999] pointer-events-none"
            variants={variants}
            animate={cursorVariant}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    );
};

export default CustomCursor;