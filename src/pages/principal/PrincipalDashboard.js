import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaFileSignature, 
  FaArrowRight, 
  FaUserShield, 
  FaSitemap,
  FaBuilding
} from 'react-icons/fa';

const PrincipalDashboard = () => {
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
      
      {/* 🌊 Background Decoration (Gold/Brown for Principal Authority) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5E3C] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#16a34a] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 🧠 Header Section */}
        <motion.div variants={itemVariants} className="mb-10 text-center md:text-left border-b border-gray-200 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[#8B5E3C] font-bold tracking-wider uppercase text-xs bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Executive Control
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3F2F] mt-3 mb-2">
                Principal's Dashboard
              </h1>
              <p className="text-gray-500 text-lg">
                Welcome, <span className="font-semibold text-gray-800">{user?.fullName}</span>. Manage institutional workflows.
              </p>
            </div>
            <div className="hidden md:block">
               <FaBuilding className="text-6xl text-gray-100" />
            </div>
          </div>
        </motion.div>

        {/* 🧩 Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 🟢 MAIN ACTION: Manage Reports (Span 2 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
            <Link to="/principal/reports" className="block h-full">
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(139, 94, 60, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Subtle Background Pattern */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#8B5E3C] rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-orange-900/10 group-hover:scale-110 transition-transform">
                    <FaFileSignature />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#8B5E3C] transition-colors">
                    Review & Action Reports
                  </h2>
                  <p className="text-gray-500 leading-relaxed max-w-md">
                    View pending submissions. As Principal, you have the authority to <strong>Forward</strong> to Dean/Resources or return to System.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[#8B5E3C] font-bold text-sm uppercase tracking-wide">
                  Open Console <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* ℹ️ INFO CARD: Routing Authority */}
          <motion.div variants={itemVariants} className="h-full">
            <div className="bg-[#0A3F2F] p-8 rounded-3xl shadow-lg h-full text-white relative overflow-hidden flex flex-col justify-center">
              
              {/* Abstract Patterns */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#16a34a] rounded-full blur-3xl opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                      <FaSitemap size={24} />
                   </div>
                   <h2 className="text-xl font-bold">Routing Logic</h2>
                </div>
                
                <div className="space-y-6 relative">
                   {/* Timeline Line */}
                   <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/20"></div>

                   <div className="flex items-center gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-[#16a34a] border-4 border-[#0A3F2F] z-10"></div>
                      <p className="text-sm text-green-100">Receive from <strong>System</strong></p>
                   </div>
                   <div className="flex items-center gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-[#0A3F2F] z-10"></div>
                      <p className="text-sm font-bold text-white">Principal Decision</p>
                   </div>
                   <div className="flex items-center gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-[#8B5E3C] border-4 border-[#0A3F2F] z-10"></div>
                      <p className="text-sm text-green-100">Forward to <strong>Dean</strong> or <strong>Resources</strong></p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 📊 Status Strip */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
           <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-green-100 text-green-700 rounded-lg"><FaUserShield /></div>
              <div>
                 <p className="text-xs text-gray-400 uppercase font-bold">Role</p>
                 <p className="text-sm font-semibold text-gray-800">Final Approver</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><FaSitemap /></div>
              <div>
                 <p className="text-xs text-gray-400 uppercase font-bold">Access Level</p>
                 <p className="text-sm font-semibold text-gray-800">Full Routing Control</p>
              </div>
           </div>
           {/* Empty slot or another stat */}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default PrincipalDashboard;