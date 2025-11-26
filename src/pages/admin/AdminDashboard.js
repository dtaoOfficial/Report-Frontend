import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axiosConfig";
import ReportCard from "../../components/ReportCard";
import { toast } from "react-toastify";
import { 
  FaChartPie, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaCheckDouble, 
  FaArrowLeft,
  FaFilter,
  FaSearch
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [showAll, setShowAll] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get("/admin/report-stats"),
        api.get("/admin/all-reports"),
      ]);

      setStats(statsRes.data.data || {});
      setReports(reportsRes.data.data || []);
      setFilteredReports(reportsRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🧭 Filter by status
  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    setShowAll(false);
    if (filter === "ALL") {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter((r) => r.status === filter);
      setFilteredReports(filtered);
    }
  };

  // 🎨 Helper: Get Status Badge Styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
      case "COMPLETED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "REJECTED": return "bg-red-50 text-red-600 border-red-200";
      case "PENDING": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const visibleReports = showAll ? filteredReports : filteredReports.slice(0, 8);

  // 🎬 Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // 📊 Stat Cards Configuration
  const statCards = [
    { label: "Total Reports", value: stats.total, color: "text-gray-600", bg: "bg-gray-50", icon: <FaChartPie />, filter: "ALL" },
    { label: "Approved", value: stats.approved, color: "text-green-600", bg: "bg-green-50", icon: <FaCheckCircle />, filter: "APPROVED" },
    { label: "Pending", value: stats.pending, color: "text-yellow-600", bg: "bg-yellow-50", icon: <FaClock />, filter: "PENDING" },
    { label: "Rejected", value: stats.rejected, color: "text-red-600", bg: "bg-red-50", icon: <FaTimesCircle />, filter: "REJECTED" },
    { label: "Completed", value: stats.completed, color: "text-blue-600", bg: "bg-blue-50", icon: <FaCheckDouble />, filter: "COMPLETED" },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#16a34a] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );

  // 📄 Detailed Report View
  if (selectedReport) {
    return (
      <motion.div
        className="pt-24 px-4 max-w-5xl mx-auto min-h-screen bg-[#F9F8F4]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <button
          onClick={() => setSelectedReport(null)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#16a34a] transition-colors font-medium"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <ReportCard
          report={selectedReport}
          role="ADMIN"
          onActionComplete={fetchDashboardData}
        />
      </motion.div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-8 pb-12 bg-[#F9F8F4] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 🧠 Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A3F2F]">System Overview</h1>
            <p className="text-gray-500 mt-1">Real-time insights and report management.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Filter</p>
            <p className="text-lg font-bold text-[#16a34a]">{selectedFilter}</p>
          </div>
        </div>

        {/* 📊 Stats Grid (Clickable) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFilter(item.filter)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all shadow-sm ${
                selectedFilter === item.filter 
                  ? "bg-white border-[#16a34a] ring-1 ring-[#16a34a] shadow-md" 
                  : "bg-white border-gray-100 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${item.bg} ${item.color} text-lg`}>
                  {item.icon}
                </div>
                {selectedFilter === item.filter && (
                  <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>
                )}
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{item.value || 0}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 📋 Reports Table Container */}
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Table Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                <FaFilter />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                {selectedFilter === "ALL" ? "All Reports" : `${selectedFilter} Reports`}
              </h2>
            </div>

            {filteredReports.length > 8 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-semibold text-[#16a34a] hover:text-[#14532d] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {showAll ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FaSearch />
                </div>
                <p>No reports found for <strong>{selectedFilter}</strong>.</p>
              </div>
            ) : (
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-5">Report Title</th>
                    <th className="p-5">Created By</th>
                    <th className="p-5">Current Stage</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="wait">
                    {visibleReports.map((r) => (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        className="group transition-colors"
                      >
                        <td className="p-5">
                          <p className="font-semibold text-gray-800">{r.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{r.description}</p>
                        </td>
                        <td className="p-5 text-sm text-gray-600 font-medium">
                          {r.createdByName}
                        </td>
                        <td className="p-5">
                          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {r.currentStage}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="text-sm font-semibold text-[#16a34a] hover:text-[#0A3F2F] hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
          
          {/* Footer Gradient for "Show More" feel */}
          {!showAll && filteredReports.length > 8 && (
             <div className="h-2 bg-gradient-to-b from-gray-50 to-gray-100"></div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;