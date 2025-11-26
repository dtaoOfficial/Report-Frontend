import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaPlus, 
  FaClipboardList, 
  FaUserCog, 
  FaHistory,
  FaGraduationCap
} from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useAuth();

  // 🎬 Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cards = [
    {
      title: 'Submit Report',
      desc: 'File a new issue regarding lab equipment or infrastructure.',
      icon: <FaPlus />,
      link: '/user/reports',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
      btnText: 'Create New'
    },
    {
      title: 'Track Status',
      desc: 'View progress of your submitted reports and history.',
      icon: <FaClipboardList />,
      link: '/user/reports',
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-100',
      btnText: 'View History'
    },
    {
      title: 'Profile Settings',
      desc: 'Update your contact info and manage account security.',
      icon: <FaUserCog />,
      link: '/user/profile',
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-100',
      btnText: 'Manage Profile'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 px-4 sm:px-8 pb-12 font-sans">
      
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 🌌 Hero Welcome Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#0A3F2F] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden mb-10"
        >
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#16a34a] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-[#8B5E3C] rounded-full blur-[80px] opacity-30 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase mb-4">
                <FaGraduationCap /> Student / Staff Portal
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
                Hello, {user?.fullName?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-green-100 text-lg max-w-xl leading-relaxed">
                Welcome to the NHCE Reporting System. Use this dashboard to submit maintenance requests and track their approval status in real-time.
              </p>
            </div>
            
            {/* Primary CTA */}
            <div className="hidden md:block">
               <Link to="/user/reports">
                 <button className="bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/30 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                    <FaPlus /> New Request
                 </button>
               </Link>
            </div>
          </div>
        </motion.div>

        {/* ⚙️ Quick Actions Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border ${card.borderColor} hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full`}
            >
              <div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 ${card.color}`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>
              
              <Link to={card.link}>
                <button className="w-full py-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-[#0A3F2F] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2 group">
                  {card.btnText} <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 📜 Recent Tips / Info (Optional) */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4"
        >
           <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full shrink-0">
              <FaHistory />
           </div>
           <div>
              <h4 className="font-bold text-gray-800">Did you know?</h4>
              <p className="text-sm text-gray-500 mt-1">
                 Reports are processed faster if you include specific location details (e.g., "Lab 3, Row 2, System 4") in your description.
              </p>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

// Helper Icon for button
const FaArrowRight = ({ className, size }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"></path>
  </svg>
);

export default UserDashboard;