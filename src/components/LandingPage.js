import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/companyLogo.webp';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-alien-50 to-white overflow-hidden pt-16 relative">
      
      {/* 🪐 Animated Company Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="mb-6"
      >
        <img
          src={logo}
          alt="NHCE Report System Logo"
          className="w-40 h-40 object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* ✨ Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center px-6 max-w-4xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Welcome to <span className="text-alien-600">NHCE</span> Report System
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 font-medium">
          Please log in to continue and manage your department reports securely.
        </p>

        {/* 🟤 Login Button - Fixed Spacing + Glow Animation */}
        <div className="mt-12 flex justify-center relative">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link
              to="/login"
              className="bg-[#6B4226] text-white px-10 py-3 rounded-full text-lg font-semibold 
                         hover:bg-[#8B5E3C] shadow-lg hover:shadow-green-400/40 
                         transition-all duration-300 ease-out relative z-10"
            >
              Log In
            </Link>

            {/* 🌟 Soft Glow Pulse Behind Button */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl bg-[#8B5E3C]/30"
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            ></motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* 🌌 Floating Glow Effects */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute top-24 left-1/3 w-72 h-72 bg-alien-300/40 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-alien-400/30 blur-[120px] rounded-full animate-pulse delay-300" />
      </motion.div>

      {/* ⚙️ Slogan Now Lower & Clear */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-3 text-gray-500 text-sm font-medium tracking-wide"
      >
        Powered by <span className="text-[#6B4226] font-semibold">DTAO BASE</span>
      </motion.p>
    </div>
  );
};

export default LandingPage;
