import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaClipboardList, 
  FaArrowRight, 
  FaUserTie, 
  FaCheckDouble,
  FaUniversity
} from 'react-icons/fa';

const DeanDashboard = () => {
  const { user } = useAuth();

  // 🎬 Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-4 sm:px-8 font-sans relative overflow-hidden">
      
      {/* 🌊 Background Decoration (Subtle) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5E3C] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <motion.div 
        className="max-w-5xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 🧠 Header Section */}
        <motion.div variants={itemVariants} className="mb-10 text-center md:text-left">
          <span className="text-[#16a34a] font-bold tracking-wider uppercase text-xs bg-green-50 px-3 py-1 rounded-full border border-green-100">
            Dean's Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3F2F] mt-4 mb-2">
            Welcome Back, {user?.fullName || 'Dean'}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Review departmental reports, provide suggestions, and oversee the approval workflow efficiently.
          </p>
        </motion.div>

        {/* 🧩 Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 🟢 Primary Action: Go To Reports */}
          <motion.div variants={itemVariants} className="h-full">
            <Link to="/dean/reports" className="block h-full">
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(22, 163, 74, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div>
                  <div className="w-14 h-14 bg-[#16a34a] rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-green-900/20 group-hover:scale-110 transition-transform">
                    <FaClipboardList />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#16a34a] transition-colors">
                    Review Pending Reports
                  </h2>
                  <p className="text-gray-500 leading-relaxed">
                    Access the report list to approve, reject, or forward issues back to the Principal.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[#16a34a] font-bold text-sm uppercase tracking-wide">
                  Go to Reports <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ℹ️ Info Card: Workflow Summary */}
          <motion.div variants={itemVariants} className="h-full">
            <div className="bg-[#0A3F2F] p-8 rounded-3xl shadow-lg h-full text-white relative overflow-hidden">
              
              {/* Abstract Patterns */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl mb-6 border border-white/20">
                  <FaUniversity />
                </div>
                <h2 className="text-2xl font-bold mb-4">Workflow Overview</h2>
                
                <ul className="space-y-4 text-green-100/80">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-[#16a34a] p-1 rounded-full"><FaCheckDouble size={10} /></div>
                    <span className="text-sm">Receive reports forwarded by the Principal.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-[#16a34a] p-1 rounded-full"><FaUserTie size={10} /></div>
                    <span className="text-sm">Add expert suggestions and validation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 bg-[#16a34a] p-1 rounded-full"><FaArrowRight size={10} /></div>
                    <span className="text-sm">Forward approved tasks to the Final Principal stage.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 📊 Quick Stat (Optional Placeholder) */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                <FaUserTie />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-400 uppercase">System Status</p>
                <p className="font-semibold text-gray-800">Your account is active and authorized.</p>
             </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DeanDashboard;