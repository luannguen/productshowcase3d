import React from 'react';

interface AccessibilityAnnouncerProps {
  message: string;
}

const AccessibilityAnnouncer: React.FC<AccessibilityAnnouncerProps> = ({ message }) => {
  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      {message}
    </div>
  );
};

export default AccessibilityAnnouncer;
