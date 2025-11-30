import React, { useState, useEffect, useCallback } from "react";
import ReportList from "../../components/ReportList";
import { getReportsByStage } from "../../api/reportApi";
import { motion } from "framer-motion";
import { FaClipboardCheck, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLiveUpdate } from "../../context/LiveUpdateContext";

const SystemReports = () => {
  const [tab, setTab] = useState("ACTIVE");
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const { lastUpdate } = useLiveUpdate();

  // ✅ Fetch reports normally
  const fetchReports = useCallback(async () => {
    try {
      const res = await getReportsByStage("system");
      const data = res.data.data || [];

      // Show only active ones
      const activeOnly = data.filter(
        (r) => r.status !== "COMPLETED" && r.status !== "REJECTED"
      );
      setReports(activeOnly);
    } catch (err) {
      console.error("Error fetching system reports:", err);
    }
  }, []);

  // ✅ Load reports initially
  useEffect(() => {
    if (tab === "ACTIVE") {
      fetchReports();
    } else if (tab === "COMPLETED") {
      navigate("/system/completed");
    }
  }, [tab, fetchReports, navigate]);

  // ✅ INSTANT LIVE UPDATE HANDLING (fix)
  useEffect(() => {
    if (!lastUpdate?.data) return;
    const updated = lastUpdate.data;
    const target = lastUpdate.type;

    // Only apply if system or global
    if (target === "system" || target === "ALL") {
      console.log("⚡ Instant Live Update in System Reports:", updated.title);

      setReports((prev) => {
        const exists = prev.find((r) => r.id === updated.id);

        if (exists) {
          // 🧩 Update existing report inline
          return prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r));
        } else {
          // 🆕 Add new report on top instantly
          return [updated, ...prev];
        }
      });

      // 🔁 Still fetch latest copy from backend for consistency (after short delay)
      setTimeout(fetchReports, 1500);
    }
  }, [lastUpdate, fetchReports]);

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-6 font-sans relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#0A3F2F] mb-6 text-center">
          System Department Reports
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-10 gap-4">
          <button
            onClick={() => setTab("ACTIVE")}
            className={`px-6 py-2 rounded-full font-bold border-2 transition-all ${
              tab === "ACTIVE"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaClipboardCheck className="inline mr-2" />
            Active Reports
          </button>

          <button
            onClick={() => setTab("COMPLETED")}
            className={`px-6 py-2 rounded-full font-bold border-2 transition-all ${
              tab === "COMPLETED"
                ? "bg-green-600 text-white border-green-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaClipboardList className="inline mr-2" />
            Completed Reports
          </button>
        </div>

        {tab === "ACTIVE" && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReportList
              role="SYSTEM"
              reports={reports}
              onRefresh={fetchReports}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SystemReports;
