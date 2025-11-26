import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaDesktop, 
  FaUserTie, 
  FaUniversity, 
  FaGavel, 
  FaCheck 
} from 'react-icons/fa';

// 🧠 Configuration: Maps Backend Roles to Visual Labels & Icons
const STAGE_CONFIG = [
  { id: 'USER', label: 'Submitted', icon: <FaUser /> },
  { id: 'SYSTEM', label: 'System Verif.', icon: <FaDesktop /> },
  { id: 'PRINCIPAL', label: 'Principal', icon: <FaUserTie /> },
  { id: 'DEAN', label: 'Dean Review', icon: <FaUniversity /> },
  { id: 'RESOURCES', label: 'Chairman', icon: <FaGavel /> } // Backend: RESOURCES -> UI: CHAIRMAN
];

const ReportProgress = ({ currentStage, status, rejected, rejectionReason }) => {
  
  // 🛠️ Normalize Stage: If backend sends 'RESOURCES', treat it as 'RESOURCES' to match config
  // If your backend actually sends 'CHAIRMAN', change 'RESOURCES' in STAGE_CONFIG to 'CHAIRMAN'
  const activeIndex = STAGE_CONFIG.findIndex(s => s.id === currentStage);
  
  // 🎨 Helper: Determine Step State
  const getStepState = (index) => {
    if (rejected && index === activeIndex) return 'rejected';
    if (status === 'COMPLETED') return 'completed';
    if (index < activeIndex) return 'completed';
    if (index === activeIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full py-4">
      
      {/* 🧭 Timeline Container */}
      <div className="relative flex justify-between items-start w-full">
        
        {/* ➖ Background Line (Gray) */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full -z-10"></div>

        {/* ➖ Progress Line (Green) */}
        <motion.div 
          className="absolute top-5 left-0 h-1 bg-[#16a34a] rounded-full -z-10"
          initial={{ width: '0%' }}
          animate={{ 
            width: status === 'COMPLETED' ? '100%' : `${(activeIndex / (STAGE_CONFIG.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        ></motion.div>

        {/* 📍 Steps */}
        {STAGE_CONFIG.map((stage, i) => {
          const state = getStepState(i);
          
          let circleClass = "bg-gray-100 text-gray-400 border-2 border-gray-200"; // Pending
          let textClass = "text-gray-400 font-medium";

          if (state === 'completed') {
            circleClass = "bg-[#16a34a] text-white border-[#16a34a]";
            textClass = "text-[#16a34a] font-bold";
          } else if (state === 'active') {
            circleClass = "bg-white text-blue-600 border-2 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]";
            textClass = "text-blue-600 font-bold";
          } else if (state === 'rejected') {
            circleClass = "bg-red-500 text-white border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)]";
            textClass = "text-red-600 font-bold";
          }

          return (
            <div key={stage.id} className="flex flex-col items-center group relative">
              
              {/* Circle Icon */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 z-10 ${circleClass}`}
              >
                {state === 'completed' ? <FaCheck /> : stage.icon}
              </motion.div>

              {/* Label */}
              <span className={`text-[10px] sm:text-xs mt-2 uppercase tracking-wide text-center transition-colors duration-300 ${textClass}`}>
                {stage.label}
              </span>

              {/* Reject Reason Tooltip */}
              {state === 'rejected' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-14 w-32 bg-red-50 border border-red-200 text-red-700 text-[10px] p-2 rounded-lg shadow-sm text-center leading-tight z-20"
                >
                  <strong>Rejected:</strong> {rejectionReason}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* 📊 Final Status Text */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {rejected ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-bold border border-red-100">
            Report Rejected at {currentStage} Stage
          </div>
        ) : status === 'COMPLETED' ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
            <FaCheck /> Workflow Completed Successfully
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Current Stage: {STAGE_CONFIG[activeIndex]?.label || currentStage}
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default ReportProgress;