import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Path to your logo reveal animation (WEBM)
const companyLoader = process.env.PUBLIC_URL + '/assets/companyLoader.webm';

const IntroScreen = ({ onFinish }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fallback timer in case video doesn't autoplay or is too short
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 4000); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          
          {/* 🎥 Centered Video */}
          <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            <motion.video
              src={companyLoader}
              autoPlay
              muted
              playsInline
              loop={false}
              className="w-full h-full object-contain px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onEnded={() => {
                setShow(false);
                if (onFinish) onFinish();
              }}
            />
          </div>

          {/* 🪩 Brand Title (Matches new Theme) */}
          <motion.div
            className="absolute bottom-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A3F2F]">
              DTAO <span className="text-[#16a34a]">BASE</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-8 bg-gray-300"></div>
              <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-medium">
                System's & Network
              </p>
              <div className="h-[1px] w-8 bg-gray-300"></div>
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;