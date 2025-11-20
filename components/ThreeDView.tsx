import React from 'react';

interface ThreeDViewProps {
  themeStyles: React.CSSProperties;
}

const ThreeDView: React.FC<ThreeDViewProps> = ({ themeStyles }) => {
  const backgroundColor = (themeStyles['--background-primary'] as string || '#111827').replace('#', '');

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl">
      <div className="sketchfab-embed-wrapper w-full aspect-video rounded-[var(--border-radius)] overflow-hidden">
        <iframe
          title="Laptop and mouse"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src={`https://sketchfab.com/models/503d0a0b273b435c93922578505d93b3/embed?autospin=1&autostart=1&ui_theme=${backgroundColor.startsWith('f') ? 'light' : 'dark'}&ui_controls=0&ui_infos=0&ui_watermark=0&preload=1&camera=0`}
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default ThreeDView;