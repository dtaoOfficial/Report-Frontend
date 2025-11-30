import React, { useState, useEffect, useCallback } from "react";
import ReportList from "../../components/ReportList";
import { getReportsByStage } from "../../api/reportApi";
import { motion } from "framer-motion";
import { FaCheckDouble } from "react-icons/fa";
import { useLiveUpdate } from "../../context/LiveUpdateContext"; // ✅ WebSocket listener

const PrincipalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lastUpdate } = useLiveUpdate();

  // ✅ Fetch all reports for the Principal stage
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getReportsByStage("principal");
      let data = res.data.data || [];

      // Filter active ones
      const filtered = data.filter(
        (r) => r.status !== "COMPLETED" && r.status !== "REJECTED"
      );

      // ✅ Sort latest-first (most recent first)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReports(filtered);
    } catch (err) {
      console.error("❌ Error fetching principal reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🧠 Initial load
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ⚡ Handle real-time WebSocket updates
  useEffect(() => {
    if (!lastUpdate?.data) return;
    const { type, data } = lastUpdate;
    const updateType = (type || "").toLowerCase();

    // Only react to relevant updates
    if (["principal", "all", "manual"].includes(updateType)) {
      console.log("🔁 Live update detected in Principal Reports:", data.title);

      setReports((prev) => {
        const exists = prev.find((r) => r.id === data.id);

        if (exists) {
          // 🧩 Update existing record
          const updated = prev.map((r) =>
            r.id === data.id ? { ...r, ...data, __force: Date.now() } : r
          );
          return updated.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else {
          // 🆕 Add new one to the top
          const updated = [{ ...data, __force: Date.now() }, ...prev];
          return updated.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }
      });

     
    }
  }, [lastUpdate]);

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-6 font-sans relative">
      <div className="max-w-6xl mx-auto">
        {/* 🧭 Header */}
        <h1 className="text-3xl font-extrabold text-[#0A3F2F] mb-8 text-center flex items-center justify-center gap-2">
          <FaCheckDouble /> Principal Department Reports
        </h1>

        {/* Reports List */}
        <motion.div
          key="principal-reports"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReportList
            role="PRINCIPAL"
            reports={reports}
            loading={loading}
            onRefresh={fetchReports}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PrincipalReports;
