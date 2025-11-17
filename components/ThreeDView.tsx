
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
          src={`https://sketchfab.com/models/c6e193ac304e477aaed7946289dbe150/embed?preload=1&transparent=1&ui_theme=dark&background=${backgroundColor}&ui_zoom=1&ui_pan=1`}
          className="w-full h-full"
        >
        </iframe>
      </div>
       <p className="text-sm text-[var(--text-secondary)] mt-4 text-center">
        Use the on-screen controls or your mouse to interact: click & drag to rotate, scroll to zoom, and right-click to pan.
      </p>
      <p className="text-sm font-normal mt-2 text-[var(--text-secondary)] text-center">
        <a href="https://sketchfab.com/3d-models/laptop-and-mouse-c6e193ac304e477aaed7946289dbe150?utm_medium=embed&utm_campaign=share-popup&utm_content=c6e193ac304e477aaed7946289dbe150" target="_blank" rel="noopener noreferrer nofollow" className="font-bold text-[var(--primary-accent)] hover:underline">
          Laptop and mouse
        </a> by 
        <a href="https://sketchfab.com/nickbroad?utm_medium=embed&utm_campaign=share-popup&utm_content=c6e193ac304e477aaed7946289dbe150" target="_blank" rel="noopener noreferrer nofollow" className="font-bold text-[var(--primary-accent)] hover:underline">
          Nick Broad
        </a> on 
        <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=c6e193ac304e477aaed7946289dbe150" target="_blank" rel="noopener noreferrer nofollow" className="font-bold text-[var(--primary-accent)] hover:underline">
          Sketchfab
        </a>
      </p>
    </div>
  );
};

export default ThreeDView;