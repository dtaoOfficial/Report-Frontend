import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../animations/variants';

/**
 * LoaderSkeleton Component
 * Used as a placeholder while data or components are loading.
 */
const LoaderSkeleton = ({ height = 'h-6', width = 'w-full', count = 3 }) => {
  return (
    <motion.div
      className="space-y-3 animate-pulse"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded-lg ${height} ${width}`}
        ></div>
      ))}
    </motion.div>
  );
};

export default LoaderSkeleton;
