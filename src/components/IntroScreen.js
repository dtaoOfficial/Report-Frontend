import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Path to your logo reveal animation (WEBM)
const companyLoader = process.env.PUBLIC_URL + '/assets/companyLoader.webm';

const IntroScreen = ({ onFinish }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 3500); // slight delay for smooth fade
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-white flex items-center justify-center z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* 🎥 Responsive Company Loader Video */}
          <motion.video
            src={companyLoader}
            autoPlay
            muted
            playsInline
            loop={false}
            className="object-contain w-[500px] h-[500px] sm:w-[350px] sm:h-[350px] xs:w-[220px] xs:h-[220px]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            onEnded={() => {
              setShow(false);
              if (onFinish) onFinish();
            }}
          />

          {/* 🪩 Brand Title */}
          <motion.div
            className="absolute bottom-14 text-center font-semibold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <h1 className="text-4xl sm:text-3xl xs:text-2xl font-extrabold text-gray-800">
              <span className="text-[#16a34a]">DTAO</span> BASE
            </h1>
            <p className="text-gray-500 text-sm sm:text-xs mt-1">
              Empowering Department Workflow
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
