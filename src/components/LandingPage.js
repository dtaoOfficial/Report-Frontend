import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/companyLogo.webp";

const LandingPage = () => {
  // 🎬 Subtle, Smooth Animations
  const fadeSmooth = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const mockupSlide = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
    },
  };

  return (
    // Used a slightly warmer off-white for a classic feel
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* ================= LEFT SIDE: CONTENT ================= */}
      <motion.div
        className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 lg:py-0 z-20 relative"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* 🪐 Logo (Top Left - Smaller & Cleaner) */}
        <motion.div variants={fadeSmooth} className="absolute top-6 left-6 sm:left-12 lg:left-20">
          <img src={logo} alt="NHCE Logo" className="w-14 h-auto drop-shadow-sm" />
        </motion.div>

        {/* ✨ Main Headline (Classic Size - Not too big) */}
        <motion.h1 variants={fadeSmooth} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A3F2F] leading-tight tracking-normal mt-16 lg:mt-0">
          NHCE Reporting <br />
          <span className="text-[#16a34a]">Management System</span>
        </motion.h1>

        {/* 📝 Subtitle (Smooth text) */}
        <motion.p variants={fadeSmooth} className="mt-5 text-base sm:text-lg text-gray-600 max-w-md leading-relaxed font-medium">
          A unified academic portal to streamline workflows, track department issues, and manage approvals securely.
        </motion.p>

        {/* 🟢 Action Button (New Hover Color) */}
        <motion.div variants={fadeSmooth} className="mt-8">
          <Link to="/login">
            <motion.button
              // Changed hover color to DTAO Brown for classic contrast
              whileHover={{ scale: 1.02, backgroundColor: "#8B5E3C" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-[#16a34a] text-white text-base sm:text-lg font-semibold rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              Go to Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>

        {/* ⚙️ Footer Credit */}
        <motion.p variants={fadeSmooth} className="absolute bottom-6 text-sm text-gray-400 font-medium">
          Powered by DTAO BASE
        </motion.p>
      </motion.div>


      {/* ================= RIGHT SIDE: SMOOTH VISUALS ================= */}
      {/* Changed background to a clean, light gray-green for a smooth look */}
      <div className="w-full lg:w-[55%] relative bg-[#E8F1EE] overflow-hidden flex items-center justify-center h-[50vh] lg:h-auto px-8 py-12 lg:p-0">
        
        {/* Subtle background graphic */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

        {/* 🖥️ UI Mockup Container (Looks useful and smooth) */}
        <motion.div 
           variants={mockupSlide}
           initial="hidden"
           animate="visible"
           className="relative z-10 w-full max-w-2xl transform lg:translate-x-12 lg:translate-y-6 drop-shadow-2xl"
        >
            {/* The Mockup Image - Using CSS to create a clean dashboard look */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                {/* Mockup Header */}
                <div className="bg-[#0A3F2F] h-12 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 text-center text-white/80 text-xs font-medium">NHCE System Dashboard</div>
                </div>
                {/* Mockup Body */}
                <div className="p-4 bg-gray-50 flex gap-4 h-64 sm:h-80 lg:h-96">
                    {/* Sidebar Mockup */}
                    <div className="w-1/4 bg-white rounded-lg shadow-sm p-3 flex flex-col gap-3">
                        <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse delay-75"></div>
                        <div className="h-6 bg-gray-100 rounded w-5/6 animate-pulse delay-100"></div>
                        <div className="h-6 bg-gray-100 rounded w-4/5 animate-pulse delay-150"></div>
                    </div>
                    {/* Main Content Mockup */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Header stats */}
                        <div className="flex gap-3">
                            <div className="flex-1 h-20 bg-white rounded-lg shadow-sm p-3">
                                <div className="h-4 bg-green-100 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-gray-100 rounded w-full animate-pulse"></div>
                            </div>
                             <div className="flex-1 h-20 bg-white rounded-lg shadow-sm p-3">
                                <div className="h-4 bg-blue-100 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-gray-100 rounded w-full animate-pulse delay-75"></div>
                            </div>
                        </div>
                        {/* List/Table area */}
                        <div className="flex-1 bg-white rounded-lg shadow-sm p-3 flex flex-col gap-2">
                             <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                             {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 bg-gray-50 border border-gray-100 rounded flex items-center px-2 gap-3">
                                     <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                                     <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse delay-100"></div>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;