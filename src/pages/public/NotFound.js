import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import companyLogo from "../../assets/companyLogo.webp"; // Assuming image is in assets

const NotFound = () => {
  // 🎈 Floating Animation for the '404' text
  const float = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F8F4] relative overflow-hidden font-sans">
      
      {/* ================= BACKGROUND SHAPES ================= */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#8B5E3C] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 text-center px-4">
        
        {/* 404 Big Background Text */}
        <motion.h1
          variants={float}
          animate="animate"
          className="text-[150px] md:text-[200px] font-extrabold text-[#0A3F2F] opacity-[0.05] leading-none select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
        >
          404
        </motion.h1>

        {/* Foreground Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 bg-white/80 backdrop-blur-md border border-white/50 p-10 rounded-3xl shadow-xl max-w-lg w-full mx-auto"
        >
          {/* Logo */}
          <motion.img
            src={companyLogo}
            alt="Company Logo"
            className="w-20 h-auto mx-auto mb-6 object-contain drop-shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          <h2 className="text-2xl md:text-3xl font-bold text-[#0A3F2F] mb-3">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            Oops! It looks like you've wandered into an restricted area or the page has moved. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary Button */}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 bg-[#16a34a] text-white font-semibold rounded-xl shadow-lg shadow-green-900/10 hover:bg-[#15803d] transition-all"
              >
                Back to Login
              </motion.button>
            </Link>
            
            {/* Secondary Button (Optional, if you have a home page) */}
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 bg-white text-[#0A3F2F] border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Go Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 text-xs text-gray-400 font-medium"
      >
        &copy; {new Date().getFullYear()} DTAO BASE.
      </motion.p>
    </div>
  );
};

export default NotFound;