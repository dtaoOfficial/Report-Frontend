import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLiveUpdate } from "../../context/LiveUpdateContext";
import { getAllReports } from "../../api/reportApi";
import {
  FaPlus,
  FaClipboardList,
  FaUserCog,
  FaHistory,
  FaGraduationCap,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaListUl,
} from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useAuth();
  const { lastUpdate } = useLiveUpdate();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0,
  });
  const [newUpdate, setNewUpdate] = useState(false);

  // 🧠 Fetch user’s reports from backend
  const fetchUserStats = useCallback(async () => {
    try {
      const res = await getAllReports();
      const allReports = res.data.data || [];

      // Filter reports belonging to current user
      const userReports = allReports.filter(
        (r) =>
          r.createdByName?.toLowerCase() === user?.fullName?.toLowerCase()
      );

      const total = userReports.length;
      const pending = userReports.filter(
        (r) => r.status === "PENDING" || r.status === "Pending"
      ).length;
      const completed = userReports.filter(
        (r) =>
          r.status === "Completed" ||
          r.status === "COMPLETED" ||
          r.status?.includes("Completed")
      ).length;
      const inProgress = userReports.filter(
        (r) =>
          r.currentStage === "SYSTEM" ||
          r.currentStage === "PRINCIPAL"
      ).length;

      setStats({ total, pending, completed, inProgress });
    } catch (err) {
      console.error("❌ Error fetching user stats:", err);
    }
  }, [user]);

  // Load on mount
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Live updates
  useEffect(() => {
    if (!lastUpdate?.data) return;
    setNewUpdate(true);
    fetchUserStats();
    const timeout = setTimeout(() => setNewUpdate(false), 4000);
    return () => clearTimeout(timeout);
  }, [lastUpdate, fetchUserStats]);

  const cards = [
    {
      title: "Submit Report",
      desc: "File a new issue regarding lab equipment or infrastructure.",
      icon: <FaPlus />,
      link: "/user/reports",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100",
      btnText: "Create New",
    },
    {
      title: "Track Status",
      desc: "View and monitor the progress of your submitted reports.",
      icon: <FaClipboardList />,
      link: "/user/reports",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-100",
      btnText: "View Reports",
    },
    {
      title: "Profile Settings",
      desc: "Update your contact info and manage account security.",
      icon: <FaUserCog />,
      link: "/user/profile",
      color: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-100",
      btnText: "Manage Profile",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 px-4 sm:px-8 pb-12 font-sans relative overflow-hidden">
      {/* 🌈 Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🌌 Hero Section */}
        <div className="bg-[#0A3F2F] rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#16a34a] rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-[#8B5E3C] rounded-full blur-[80px] opacity-30"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase mb-4">
                <FaGraduationCap /> Student / Staff Portal
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
                Hello, {user?.fullName?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-green-100 text-lg max-w-xl leading-relaxed">
                Welcome to the NHCE Reporting System. Use this dashboard to
                submit requests and track their approval progress in real-time.
              </p>
              {newUpdate && (
                <div className="mt-3 inline-block bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full animate-pulse border border-green-200">
                  🔔 New report activity detected
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <Link to="/user/reports">
                <button className="bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/30 transition-all hover:-translate-y-1 flex items-center gap-3">
                  <FaPlus /> New Request
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 📊 User Report Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StatCard
            icon={<FaListUl />}
            title="Total Reports"
            value={stats.total}
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            icon={<FaExclamationTriangle />}
            title="Pending Reports"
            value={stats.pending}
            color="bg-yellow-50 text-yellow-700"
            onClick={() => navigate("/user/reports")}
          />
          <StatCard
            icon={<FaClock />}
            title="In Progress"
            value={stats.inProgress}
            color="bg-purple-50 text-purple-700"
          />
          <StatCard
            icon={<FaCheckCircle />}
            title="Completed Reports"
            value={stats.completed}
            color="bg-green-50 text-green-700"
            onClick={() => navigate("/user/reports")}
          />
        </motion.div>

        {/* ⚙️ Quick Actions Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border ${card.borderColor} hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full`}
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 ${card.color}`}
                >
                  {card.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>

              <Link to={card.link}>
                <button className="w-full py-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-[#0A3F2F] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2 group">
                  {card.btnText}{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 📜 Helpful Tip */}
        <motion.div
          className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full shrink-0">
            <FaHistory />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Did you know?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Reports get resolved faster when you include specific location
              details like “Lab 3, Row 2, System 4” in your description.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// 📊 Mini stat card
const StatCard = ({ icon, title, value, color, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer flex items-center gap-3 p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:scale-[1.02] hover:shadow-md ${color}`}
  >
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-xs uppercase font-bold text-gray-500">{title}</p>
      <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default UserDashboard;
