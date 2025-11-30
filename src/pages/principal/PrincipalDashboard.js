import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLiveUpdate } from "../../context/LiveUpdateContext";
import {
  
  FaArrowRight,
  FaChartBar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaUsers,
  
  FaListAlt,
} from "react-icons/fa";
import { getReportsByStage } from "../../api/reportApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const { lastUpdate } = useLiveUpdate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    avgStageTime: 0,
    stageCount: 0,
  });
  const [newRequest, setNewRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("detailed"); // ✅ toggle between normal/detailed

  // 🧮 Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getReportsByStage("principal");
      const data = res.data.data || [];

      const total = data.length;

      // ✅ Approved = Completed
      const completed = data.filter((r) =>
        ["COMPLETED", "APPROVED"].includes(r.status)
      ).length;

      // ✅ Others = Pending
      const pending = total - completed;

      // ✅ Average Time (in hours)
      const validReports = data.filter(
        (r) => r.createdAt && r.updatedAt && new Date(r.updatedAt) > new Date(r.createdAt)
      );
      const avgStageTime =
        validReports.length > 0
          ? Math.round(
              validReports.reduce((sum, r) => {
                const diff =
                  (new Date(r.updatedAt) - new Date(r.createdAt)) / 3600000;
                return sum + diff;
              }, 0) / validReports.length
            )
          : 0;

      const stageCount = data.filter(
        (r) => r.currentStage === "PRINCIPAL"
      ).length;

      setStats({ total, pending, completed, avgStageTime, stageCount });
    } catch (err) {
      console.error("❌ Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 🔁 WebSocket update
  useEffect(() => {
    if (!lastUpdate?.data) return;
    setNewRequest(true);
    fetchStats();
    const t = setTimeout(() => setNewRequest(false), 4000);
    return () => clearTimeout(t);
  }, [lastUpdate, fetchStats]);

  // 🎨 Animation presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const chartData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        label: "Reports",
        data: [stats.pending, stats.completed],
        backgroundColor: ["#FACC15", "#16A34A"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-6 sm:px-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5E3C] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#16a34a] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-10 text-center md:text-left border-b border-gray-200 pb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[#8B5E3C] font-bold tracking-wider uppercase text-xs bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Executive Control
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3F2F] mt-3 mb-2 flex items-center gap-3">
                Principal’s Dashboard
                {newRequest && (
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full animate-pulse border border-green-200">
                    🔔 New Request
                  </span>
                )}
              </h1>
              <p className="text-gray-500 text-lg">
                Welcome,{" "}
                <span className="font-semibold text-gray-800">
                  {user?.fullName || "principal"}
                </span>
                . Manage institutional workflows efficiently.
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("normal")}
                className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${
                  viewMode === "normal"
                    ? "bg-[#0A3F2F] text-white border-[#0A3F2F]"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                <FaListAlt className="inline mr-1" /> Normal
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${
                  viewMode === "detailed"
                    ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                <FaChartBar className="inline mr-1" /> Detailed
              </button>
            </div>
          </div>
        </motion.div>

        {/* ✅ Detailed View */}
        {viewMode === "detailed" && (
          <>
            {loading ? (
              <div className="text-center py-20 text-gray-400 font-semibold animate-pulse">
                Loading dashboard data...
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
                >
                  <StatCard
                    icon={<FaUsers />}
                    title="Total Reports"
                    value={stats.total}
                    color="text-blue-600 bg-blue-50"
                  />
                  <StatCard
                    icon={<FaExclamationTriangle />}
                    title="Pending Reports"
                    value={stats.pending}
                    color="text-yellow-600 bg-yellow-50"
                  />
                  <StatCard
                    icon={<FaCheckCircle />}
                    title="Completed Reports"
                    value={stats.completed}
                    color="text-green-600 bg-green-50"
                  />
                  <StatCard
                    icon={<FaClock />}
                    title="Avg Stage Time"
                    value={`${stats.avgStageTime || 0} hrs`}
                    color="text-purple-600 bg-purple-50"
                  />
                </motion.div>

                {/* Chart */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 mb-10"
                >
                  <h2 className="text-lg font-bold text-[#0A3F2F] mb-2">
                    Reports in Current Stage:{" "}
                    <span className="text-[#16a34a]">{stats.stageCount}</span>
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    These reports are awaiting your review and action.
                  </p>
                  <div className="h-64">
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}

        {/* ✅ Normal View */}
        {viewMode === "normal" && (
          <motion.div variants={itemVariants}>
            <Link to="/principal/reports" className="block">
              <motion.div
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px -10px rgba(139, 94, 60, 0.15)",
                }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-[#8B5E3C] transition-colors">
                    Review & Action Reports
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Click to open the Principal’s console and handle submissions in real-time.
                  </p>
                </div>
                <FaArrowRight className="text-[#8B5E3C] text-xl group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// 📊 Stat Card
const StatCard = ({ icon, title, value, color }) => (
  <div
    className={`flex items-center justify-between p-5 rounded-2xl border border-gray-100 shadow-sm ${color}`}
  >
    <div className="flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs uppercase font-bold text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  </div>
);

export default PrincipalDashboard;
