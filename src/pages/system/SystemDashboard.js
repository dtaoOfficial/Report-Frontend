import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLiveUpdate } from "../../context/LiveUpdateContext";
import { getReportsByStage } from "../../api/reportApi";
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaNetworkWired,
} from "react-icons/fa";
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

const SystemDashboard = () => {
  const { user } = useAuth();
  const { lastUpdate } = useLiveUpdate();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    remaining: 0,
    completed: 0,
    avgStageTime: 0,
    stageCount: 0,
  });
  const [viewMode, setViewMode] = useState("normal");
  const [newRequest, setNewRequest] = useState(false);

  // 🧠 Fetch reports for both system + completed stages
  const fetchStats = useCallback(async () => {
    try {
      // 1️⃣ Fetch system stage (pending)
      const sysRes = await getReportsByStage("system");
      const systemData = sysRes.data.data || [];

      // 2️⃣ Fetch completed stage (end)
      const completedRes = await getReportsByStage("completed");
      const completedData = completedRes.data.data || [];

      console.log("🧩 System Data:", systemData.map(r => ({
        id: r.id,
        title: r.title,
        status: r.status
      })));

      console.log("🧩 Completed Data:", completedData.map(r => ({
        id: r.id,
        title: r.title,
        status: r.status
      })));

      // 3️⃣ Calculate dashboard stats
      const total = systemData.length + completedData.length;

      const remaining = systemData.filter(
        (r) => r.status === "PENDING" || r.status === "Pending"
      ).length;

      const completed = completedData.filter(
        (r) =>
          r.status === "Completed" ||
          r.status === "COMPLETED" ||
          r.status?.includes("Completed")
      ).length;

      const avgStageTime = systemData.length
        ? Math.round(
            systemData.reduce((sum, r) => {
              if (!r.createdAt || !r.updatedAt) return sum;
              const diff =
                (new Date(r.updatedAt) - new Date(r.createdAt)) / 3600000; // hrs
              return sum + diff;
            }, 0) / systemData.length
          )
        : 0;

      const stageCount = systemData.filter(
        (r) => r.currentStage?.toLowerCase() === "system"
      ).length;

      setStats({ total, remaining, completed, avgStageTime, stageCount });
    } catch (err) {
      console.error("❌ Error loading system dashboard:", err);
    }
  }, []);

  // ✅ Load on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 🔁 Auto-refresh when WebSocket event occurs
  useEffect(() => {
    if (!lastUpdate?.data) return;
    setNewRequest(true);
    fetchStats();
    const timeout = setTimeout(() => setNewRequest(false), 4000);
    return () => clearTimeout(timeout);
  }, [lastUpdate, fetchStats]);

  // 📊 Chart data for detailed view
  const chartData = {
    labels: ["Remaining", "Completed"],
    datasets: [
      {
        label: "Reports",
        data: [stats.remaining, stats.completed],
        backgroundColor: ["#FACC15", "#16A34A"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-6 sm:px-8 font-sans relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🧠 Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3F2F] flex items-center gap-3">
              <FaNetworkWired className="text-green-700" />
              System Administration
              {newRequest && (
                <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full animate-pulse border border-green-200">
                  🔔 New Request
                </span>
              )}
            </h1>
            <p className="text-gray-500 mt-2">
              Welcome, <b>{user?.fullName}</b>. Manage verification,
              completion, and report routing.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm ${
                viewMode === "normal"
                  ? "bg-gray-200 text-gray-800"
                  : "border border-gray-300 text-gray-600 bg-white"
              }`}
              onClick={() => setViewMode("normal")}
            >
              📋 Normal
            </button>
            <button
              className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-sm ${
                viewMode === "detailed"
                  ? "bg-blue-700 text-white"
                  : "border border-gray-300 text-gray-600 bg-white"
              }`}
              onClick={() => setViewMode("detailed")}
            >
              📊 Detailed
            </button>
          </div>
        </div>

        {/* 🌟 Normal View */}
        {viewMode === "normal" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <DashboardCard
                icon={<FaUsers />}
                label="Total Reports"
                value={stats.total}
                color="bg-blue-50 text-blue-600"
              />
              <DashboardCard
                icon={<FaExclamationTriangle />}
                label="Remaining Reports"
                value={stats.remaining}
                color="bg-yellow-50 text-yellow-600"
                onClick={() => navigate("/system/reports")}
              />
              <DashboardCard
                icon={<FaCheckCircle />}
                label="Completed (End) Reports"
                value={stats.completed}
                color="bg-green-50 text-green-600"
                onClick={() => navigate("/system/completed")}
              />
              <DashboardCard
                icon={<FaClock />}
                label="Avg Stage Time"
                value={`${stats.avgStageTime} hrs`}
                color="bg-purple-50 text-purple-600"
              />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-[#0A3F2F] mb-2">
                Reports Currently in System Stage:{" "}
                <span className="text-green-600">{stats.stageCount}</span>
              </h2>
              <p className="text-sm text-gray-500">
                Reports currently under system review or awaiting forwarding.
              </p>
            </div>
          </motion.div>
        )}

        {/* 📊 Detailed View */}
        {viewMode === "detailed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 mt-6"
          >
            <h2 className="text-lg font-bold text-[#0A3F2F] mb-4">
              Reports Breakdown
            </h2>
            <div className="h-72">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// 📦 Small Card Component
const DashboardCard = ({ icon, label, value, color, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer flex items-center gap-3 p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:scale-[1.02] hover:shadow-md ${color}`}
  >
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-xs uppercase font-bold text-gray-500">{label}</p>
      <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default SystemDashboard;
