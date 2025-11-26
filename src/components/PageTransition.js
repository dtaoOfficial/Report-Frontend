import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} // Start slightly down & blurry
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}    // Slide up & clear
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}    // Slide up & blur out
      transition={{ duration: 0.4, ease: "easeOut" }}        // Smooth timing
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;