import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaDesktop,
  FaUserTie,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

// 🧠 Stage Mapping
const STAGE_CONFIG = [
  { id: "USER", label: "Submitted", icon: <FaUser /> },
  { id: "SYSTEM", label: "System Verification", icon: <FaDesktop /> },
  { id: "PRINCIPAL", label: "Principal Approval", icon: <FaUserTie /> },
  { id: "COMPLETED", label: "Completed", icon: <FaCheck /> },
];

const ReportProgress = ({ currentStage, status, rejected, rejectionReason }) => {
  const [highlight, setHighlight] = useState(false);

  // 🧭 Normalize possible older stage names
  const normalizedStage = ["DEAN", "RESOURCES"].includes(currentStage)
    ? "PRINCIPAL"
    : currentStage;

  const activeIndex = STAGE_CONFIG.findIndex(
    (s) => s.id === normalizedStage
  );

  const getStepState = (index) => {
    if (rejected && index === activeIndex) return "rejected";
    if (status === "COMPLETED") return "completed";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  };

  // ⚡ Animate flash when report updates live
  useEffect(() => {
    if (status || currentStage) {
      setHighlight(true);
      const timeout = setTimeout(() => setHighlight(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [status, currentStage]);

  return (
    <div className="w-full py-6 select-none relative">
      {/* Progress Bar Container */}
      <div className="relative flex justify-between items-start w-full px-2 sm:px-4">
        {/* Base Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full -z-10"></div>

        {/* Active Line */}
        <motion.div
          className={`absolute top-5 left-0 h-1 rounded-full -z-10 ${
            rejected ? "bg-red-400" : "bg-[#16a34a]"
          }`}
          initial={{ width: "0%" }}
          animate={{
            width:
              status === "COMPLETED"
                ? "100%"
                : `${(activeIndex / (STAGE_CONFIG.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Stage Steps */}
        {STAGE_CONFIG.map((stage, i) => {
          const state = getStepState(i);

          let circleClass =
            "bg-gray-100 text-gray-400 border-2 border-gray-200";
          let textClass = "text-gray-400 font-medium";

          if (state === "completed") {
            circleClass = "bg-[#16a34a] text-white border-[#16a34a]";
            textClass = "text-[#16a34a] font-bold";
          } else if (state === "active") {
            circleClass =
              "bg-white text-blue-600 border-2 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]";
            textClass = "text-blue-600 font-bold";
          } else if (state === "rejected") {
            circleClass =
              "bg-red-500 text-white border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)]";
            textClass = "text-red-600 font-bold";
          }

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center group relative text-center w-1/4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg transition-all duration-300 z-10 ${circleClass} ${
                  highlight && state === "active"
                    ? "ring-4 ring-[#16a34a]/30 animate-pulse"
                    : ""
                }`}
              >
                {state === "completed" ? <FaCheck /> : stage.icon}
              </motion.div>

              <span
                className={`text-[10px] sm:text-xs mt-2 uppercase tracking-wide transition-colors duration-300 ${textClass}`}
              >
                {stage.label}
              </span>

              {/* 🧩 Rejection Tooltip */}
              <AnimatePresence>
                {state === "rejected" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-14 w-40 sm:w-52 bg-red-50 border border-red-200 text-red-700 text-[10px] sm:text-xs p-2 rounded-lg shadow-md leading-tight z-20"
                  >
                    <div className="flex items-center gap-1 font-semibold mb-1">
                      <FaExclamationTriangle className="text-red-500 text-xs" />
                      Rejected
                    </div>
                    <p className="text-[10px] font-medium">{rejectionReason}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer Status */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {rejected ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-bold border border-red-100 shadow-sm">
            <FaExclamationTriangle /> Report Rejected at{" "}
            {STAGE_CONFIG[activeIndex]?.label || normalizedStage} Stage
          </div>
        ) : status === "COMPLETED" ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100 shadow-sm">
            <FaCheck /> Workflow Completed Successfully
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border shadow-sm ${
              highlight
                ? "bg-blue-100 text-blue-700 border-blue-200 animate-pulse"
                : "bg-blue-50 text-blue-700 border-blue-100"
            }`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Current Stage:{" "}
            {STAGE_CONFIG[activeIndex]?.label || normalizedStage}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportProgress;
