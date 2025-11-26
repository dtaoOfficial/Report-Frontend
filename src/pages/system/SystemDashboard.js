import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaNetworkWired, 
  FaClipboardCheck, 
  FaArrowRight, 
  FaShieldAlt, 
  FaFilter,
  FaServer
} from 'react-icons/fa';

const SystemDashboard = () => {
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
      
      {/* 🌊 Background Decoration (Tech/Network Vibe) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.04]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#16a34a] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 🧠 Header Section */}
        <motion.div variants={itemVariants} className="mb-10 text-center md:text-left">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <FaNetworkWired className="inline mr-1" /> Level 1 Verification
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3F2F] mt-4 mb-2">
            System Administration
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Welcome, <span className="font-bold text-gray-800">{user?.fullName}</span>. 
            You are the first checkpoint. Verify incoming user reports before forwarding to the Principal.
          </p>
        </motion.div>

        {/* 🧩 Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 🟢 PRIMARY ACTION: Verification Console */}
          <motion.div variants={itemVariants} className="h-full">
            <Link to="/system/reports" className="block h-full">
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(30, 58, 138, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <FaClipboardCheck />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                    Verify Incoming Reports
                  </h2>
                  <p className="text-gray-500 leading-relaxed">
                    Access the intake queue. Validate user submissions for accuracy, filter out spam, and <strong>Forward</strong> valid issues to the Principal.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wide">
                  Open Verification Queue <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ℹ️ INFO CARD: Role Responsibilities */}
          <motion.div variants={itemVariants} className="h-full">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-center">
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                    <FaShieldAlt size={24} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">Your Responsibilities</h2>
              </div>
              
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <div className="mt-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Initial Triage</h4>
                    <p className="text-xs text-gray-500 mt-1">Check if the report details (Location, Description) are clear and valid.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Spam Filtering</h4>
                    <p className="text-xs text-gray-500 mt-1">Reject duplicate or non-actionable reports immediately.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Forwarding</h4>
                    <p className="text-xs text-gray-500 mt-1">Route valid technical/infrastructure issues to the Principal.</p>
                  </div>
                </li>
              </ul>

            </div>
          </motion.div>

        </div>

        {/* 📊 System Health Strip */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 bg-[#0A3F2F] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden"
        >
           {/* Background Pattern */}
           <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <FaFilter size={150} />
           </div>

           <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                 <FaServer />
              </div>
              <div>
                 <h3 className="font-bold text-lg">System Status</h3>
                 <p className="text-green-200 text-sm">Intake server is online. Reporting active.</p>
              </div>
           </div>

           <div className="mt-4 md:mt-0 relative z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold animate-pulse">
                 Online
              </span>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SystemDashboard;