import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className: string;
  layoutId?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ src, alt, className, layoutId }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className} bg-[var(--background-tertiary)]`}>
      {!isLoaded && (
        <div className="absolute inset-0 skeleton">
          <div className="shimmer-wave" />
        </div>
      )}
      <motion.img
        src={src}
        alt={alt}
        className={className}
        layoutId={layoutId}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setIsLoaded(true)}
        width="300" 
        height="200"
      />
    </div>
  );
};

export default ImageWithSkeleton;