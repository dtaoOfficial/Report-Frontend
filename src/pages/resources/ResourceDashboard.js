import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaGavel, 
  FaFileSignature, 
  FaLandmark, 
  FaCheckDouble,
  FaArrowRight
} from 'react-icons/fa';

const ResourceDashboard = () => {
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
      
      {/* 🌊 Background Decoration (Premium Gold/Green for Chairman) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#16a34a] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B5E3C] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 🧠 Executive Header */}
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold tracking-widest uppercase mb-4">
            <FaLandmark /> Highest Authority
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0A3F2F] mb-3">
            Office of the Chairman
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Welcome, <span className="font-bold text-gray-800">{user?.fullName}</span>. 
            Review escalated reports and grant final institutional approval.
          </p>
        </motion.div>

        {/* 🧩 Main Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* 🟢 LEFT: The "Final Decision" Card (8 cols) */}
          <div className="md:col-span-8">
            <Link to="/resources/reports" className="block h-full">
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                whileTap={{ scale: 0.99 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-center relative overflow-hidden group"
              >
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-[#16a34a] via-[#8B5E3C] to-[#16a34a]"></div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-20 h-20 bg-[#0A3F2F] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <FaGavel />
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-[#16a34a] transition-colors">
                      Pending Final Approvals
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-6">
                      Access the docket of reports that have passed through System, Principal, and Dean reviews. Your decision will complete the workflow.
                    </p>
                    
                    <span className="inline-flex items-center gap-2 text-[#0A3F2F] font-bold text-sm uppercase tracking-wider border-b-2 border-[#0A3F2F] pb-1 group-hover:border-[#16a34a] group-hover:text-[#16a34a] transition-all">
                      Enter Executive Console <FaArrowRight />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* ℹ️ RIGHT: Authority Stats (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Card 1 */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#0A3F2F] p-6 rounded-3xl text-white shadow-lg relative overflow-hidden flex-1"
            >
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <FaFileSignature className="text-4xl mb-4 text-green-200" />
              <h3 className="text-xl font-bold mb-1">Final Sign-off</h3>
              <p className="text-sm text-green-100/80">
                You hold the sole authority to mark complex issues as "Completed" or "Closed".
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={itemVariants}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <FaCheckDouble />
                </div>
                <span className="font-bold text-gray-700">System Status</span>
              </div>
              <p className="text-gray-500 text-sm">
                All subordinate departments (System, Dean, Principal) are reporting normally.
              </p>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default ResourceDashboard;