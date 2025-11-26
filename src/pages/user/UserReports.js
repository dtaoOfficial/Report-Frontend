import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyReports } from '../../api/reportApi';
import ReportForm from '../../components/ReportForm';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, 
  FaSyncAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaClipboardCheck 
} from 'react-icons/fa';

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Reports
  const fetchReports = useCallback(async () => {
    // Optional: Add a subtle loading state only if it's the first load
    // setLoading(true); 
    try {
      const res = await getMyReports();
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 🎨 Status Badge Logic
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <FaCheckCircle />;
      case 'COMPLETED': return <FaClipboardCheck />;
      case 'REJECTED': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  // 🎬 Animation Variants
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

  return (
    <div className="pt-24 px-4 sm:px-8 pb-10 bg-[#F9F8F4] min-h-screen font-sans">
      
      <div className="max-w-7xl mx-auto">
        {/* 🧩 Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A3F2F]">Report Management</h1>
            <p className="text-gray-500 text-sm mt-1">Submit issues and track real-time status.</p>
          </div>
          <button 
            onClick={() => { setLoading(true); fetchReports(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 hover:text-[#16a34a] transition-all text-sm font-medium"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* 🧩 Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT: CREATE REPORT FORM (4 Columns) ================= */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden sticky top-24"
            >
              <div className="bg-[#0A3F2F] p-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="bg-[#16a34a] w-2 h-6 rounded-full block"></span>
                  New Submission
                </h2>
              </div>
              <div className="p-6">
                <ReportForm onReportAdded={fetchReports} />
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT: REPORT LIST (8 Columns) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-[calc(100vh-180px)]">
            
            {/* List Container */}
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col h-full overflow-hidden">
              
              {/* Sticky List Header */}
              <div className="p-5 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">My History</h2>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {reports.length} Records
                </span>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/50">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                     <div className="w-10 h-10 border-4 border-gray-200 border-t-[#16a34a] rounded-full animate-spin"></div>
                     <p className="text-sm">Fetching reports...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70"
                  >
                    <FaClipboardCheck size={48} className="mb-3 text-gray-300" />
                    <p>No reports found.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <AnimatePresence>
                      {reports.map((r) => (
                        <motion.div
                          key={r.id}
                          variants={itemVariants}
                          layoutId={r.id}
                          whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all relative group"
                        >
                          {/* Card Content */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#16a34a] transition-colors">
                                {r.title}
                              </h3>
                              <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">
                                {r.description}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="text-[#8B5E3C]" />
                                  {r.location || 'Unknown Location'}
                                </span>
                                <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>
                                  Stage: <span className="text-gray-600">{r.currentStage}</span>
                                </span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wide ${getStatusColor(r.status)}`}>
                              {getStatusIcon(r.status)}
                              {r.status}
                            </div>
                          </div>

                          {/* Rejection Notice */}
                          {r.rejected && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 bg-red-50/50 border border-red-100 rounded-lg p-3"
                            >
                              <p className="text-red-700 text-xs font-medium flex items-start gap-2">
                                <FaTimesCircle className="mt-0.5 shrink-0" />
                                <span>
                                  <span className="font-bold">Rejected by {r.rejectedBy}:</span> {r.rejectionReason}
                                </span>
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🌈 Custom Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default UserReports;