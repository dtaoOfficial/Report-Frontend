import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        {/* 🪐 Company Logo */}
        <motion.img
          src={process.env.PUBLIC_URL + '/assets/companyLogo.webp'}
          alt="Company Logo"
          className="w-24 h-24 mx-auto mb-4 object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* 🚫 Service Disabled Message */}
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Registration Disabled
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Sorry, this service has been <strong>shut down</strong> based on institutional rules.
          <br />
          For access or inquiries, please contact:
          <br />
          <span className="text-[#16a34a] font-semibold block mt-2">
            New Horizon College of Engineering, Bangalore
          </span>
        </p>

        <div className="mt-8">
          <Link
            to="/login"
            className="bg-[#16a34a] hover:bg-[#14532d] text-white px-6 py-2 rounded-md text-sm font-semibold transition-all"
          >
            Go to Login
          </Link>
        </div>
      </motion.div>

      <p className="text-gray-400 text-xs mt-6">
        &copy; {new Date().getFullYear()} DTAO BASE. All rights reserved.
      </p>
    </div>
  );
};

export default Register;
