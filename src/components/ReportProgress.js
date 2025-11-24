import React from 'react';
import { motion } from 'framer-motion';

// ✅ Full flow including user stage
const stages = ['USER', 'SYSTEM', 'PRINCIPAL', 'DEAN', 'FINAL_PRINCIPAL', 'RESOURCES'];

const ReportProgress = ({ currentStage, status, rejected, rejectionReason }) => {
  // 🎨 Determine stage color dynamically
  const getStageColor = (stage) => {
    if (rejected && currentStage === stage) return 'bg-red-500';
    if (status === 'COMPLETED' && stage === 'RESOURCES') return 'bg-green-600';
    if (stages.indexOf(stage) < stages.indexOf(currentStage)) return 'bg-green-500';
    if (stage === currentStage) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* 🧭 Stage Timeline */}
      <div className="flex justify-between items-center relative flex-wrap sm:flex-nowrap">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            {/* Stage dot */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className={`w-6 h-6 rounded-full ${getStageColor(stage)} z-10 shadow-md`}
              title={
                rejected && currentStage === stage
                  ? `Rejected here: ${rejectionReason}`
                  : `Stage: ${stage}`
              }
            ></motion.div>

            {/* Connector line */}
            {i < stages.length - 1 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                className={`absolute top-3 left-1/2 h-1 ${
                  stages.indexOf(stage) < stages.indexOf(currentStage)
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              ></motion.div>
            )}

            {/* Label */}
            <span className="text-[10px] sm:text-xs text-gray-700 mt-2 font-semibold uppercase tracking-wide">
              {stage}
            </span>
          </div>
        ))}
      </div>

      {/* 📊 Status Summary */}
      <motion.div
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {rejected ? (
          <p className="text-red-600 font-medium">
            ❌ Report Rejected ({rejectionReason || 'No reason provided'})
          </p>
        ) : status === 'COMPLETED' ? (
          <p className="text-green-600 font-medium">✅ Report Completed</p>
        ) : (
          <p className="text-blue-600 font-medium">
            Current Stage: {currentStage}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReportProgress;
