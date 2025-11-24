import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      className="pt-24 px-4 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* 🌌 Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-alien-500 to-alien-700 rounded-2xl p-8 text-white shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {user?.fullName} 👋
        </h1>
        <p className="opacity-90">
          Status:{' '}
          <span className="font-mono bg-white/10 px-2 rounded">
            {user?.gender || 'Active'}
          </span>
        </p>
      </motion.div>

      {/* ⚙️ Quick Actions */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >
        {[
          {
            title: 'My Profile',
            desc: 'Update your personal details.',
          },
          {
            title: 'Settings',
            desc: 'Manage account security.',
          },
          {
            title: 'My Reports',
            desc: 'View and manage submitted reports.',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
            <p className="text-gray-500">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
