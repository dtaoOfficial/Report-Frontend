import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full"
      >
        {/* 🪐 Logo */}
        <motion.img
          src={process.env.PUBLIC_URL + "/assets/companyLogo.webp"}
          alt="Company Logo"
          className="w-24 h-24 mx-auto mb-4 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        <h1 className="text-3xl font-bold text-red-600 mb-3">
          You’re in the wrong area 👀
        </h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist or has been moved.  
          Please head back to the login page.
        </p>

        <Link
          to="/login"
          className="bg-[#16a34a] hover:bg-[#14532d] text-white px-6 py-2 rounded-md text-sm font-semibold transition-all"
        >
          Go to Login Page
        </Link>
      </motion.div>

      <p className="text-gray-400 text-xs mt-6">
        &copy; {new Date().getFullYear()} DTAO BASE. All rights reserved.
      </p>
    </div>
  );
};

export default NotFound;
