import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const PrincipalDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      className="p-6 text-center pt-24 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.h1
        className="text-4xl font-bold text-alien-500 mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
      >
        Principal Dashboard
      </motion.h1>

      <p className="text-gray-700 text-lg">
        Welcome <span className="font-semibold">{user?.fullName || 'Principal'}</span> 👋
      </p>

      <motion.p
        className="mt-3 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Review, approve, or forward department issues for final processing.
      </motion.p>

      <motion.div
        className="mt-8 bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Approval Overview</h3>
        <p className="text-gray-500">Easily approve or return reports to respective departments.</p>
      </motion.div>
    </motion.div>
  );
};

export default PrincipalDashboard;
