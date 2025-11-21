import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingStep } from '../../types';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps: OnboardingStep[] = [
  { element: '#view-switcher', title: 'Switch Views', content: 'Explore products in multiple layouts, from a classic grid to an immersive 3D carousel.' },
  { element: '#filter-sidebar', title: 'Filter & Sort', content: 'Refine your search with powerful filters for price, category, color, and more.' },
  { element: '#command-palette-button', title: 'Command Palette', content: 'Use Ctrl+K to quickly navigate and perform actions like a pro.' },
  { element: '.ai-assistant-button', title: 'AI Assistant', content: 'Need help? Chat with our AI assistant to get product recommendations and answers.' },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const targetElement = useMemo(() => {
    if (!isOpen) return null;
    return document.querySelector(steps[currentStep].element);
  }, [currentStep, isOpen]);

  const highlightStyle = useMemo(() => {
    if (!targetElement) return {};
    const rect = targetElement.getBoundingClientRect();
    return {
      width: rect.width + 16,
      height: rect.height + 16,
      top: rect.top - 8,
      left: rect.left - 8,
    };
  }, [targetElement]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && targetElement && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[1000]"
          />
          <motion.div
            className="fixed border-2 border-[var(--primary-accent)] rounded-[var(--border-radius)] shadow-2xl z-[1001] pointer-events-none"
            initial={highlightStyle}
            animate={highlightStyle}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
          <motion.div
            key={currentStep}
            className="fixed z-[1002] w-72 bg-[var(--background-secondary)] rounded-[var(--border-radius)] p-4 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              top: (targetElement.getBoundingClientRect().bottom + 10),
              left: (targetElement.getBoundingClientRect().left),
            }}
          >
            <h3 className="font-bold text-lg text-[var(--text-primary)]">{steps[currentStep].title}</h3>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">{steps[currentStep].content}</p>
            <div className="flex justify-between items-center mt-4">
                <button onClick={onClose} className="text-xs text-[var(--text-secondary)] hover:underline">Skip Tour</button>
                <div className="flex gap-2">
                    {currentStep > 0 && <button onClick={handlePrev} className="px-3 py-1 text-sm bg-[var(--background-tertiary)] rounded-md">Prev</button>}
                    <button onClick={handleNext} className="px-3 py-1 text-sm bg-[var(--primary-accent)] text-white rounded-md">
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;