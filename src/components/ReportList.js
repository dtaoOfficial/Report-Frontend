import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllReports } from "../api/reportApi";
import ReportCard from "./ReportCard";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaArrowLeft,
  FaEye,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { useLiveUpdate } from "../context/LiveUpdateContext";

const ReportList = ({ role }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("latest"); // ✅ NEW: latest first
  const { lastUpdate } = useLiveUpdate();

  // 🧠 Fetch all reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllReports();
      let data = res.data.data || [];

      // ✅ Sort newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReports(data);
      setFilteredReports(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Initial load
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ⚡ Handle live updates
  useEffect(() => {
    if (!lastUpdate?.data) return;
    const updated = lastUpdate.data;
    const target = (lastUpdate.type || "").toLowerCase();

    if (target === role.toLowerCase() || target === "all") {
      console.log(`⚡ Live update in ${role} ReportList:`, updated.title);

      setReports((prev) => {
        const exists = prev.find((r) => r.id === updated.id);

        let newList;
        if (exists) {
          // 🧩 Update record
          newList = prev.map((r) =>
            r.id === updated.id ? { ...r, ...updated, __force: Date.now() } : r
          );
        } else {
          // 🆕 Insert new record
          newList = [{ ...updated, __force: Date.now() }, ...prev];
        }

        // ✅ Sort list based on current order
        newList.sort((a, b) =>
          sortOrder === "latest"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt)
        );

        return newList;
      });

      
    }
  }, [lastUpdate, role, sortOrder]);

  // 🔍 Filters
  useEffect(() => {
    let result = [...reports];

    if (statusFilter !== "ALL") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(term) ||
          r.createdByName?.toLowerCase().includes(term) ||
          r.department?.toLowerCase().includes(term)
      );
    }

    // ✅ Apply sort again before displaying
    result.sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setFilteredReports(result);
  }, [searchTerm, statusFilter, reports, sortOrder]);

  // 🔙 Back to list
  const handleBack = async () => {
    await fetchReports();
    setSelectedReport(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // 🧩 Sort toggle
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  if (selectedReport) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-[#16a34a] font-bold transition-colors"
        >
          <FaArrowLeft /> Back to List
        </button>

        <ReportCard
          report={selectedReport}
          role={role}
          onBack={handleBack}
          onActionComplete={async () => {
            await fetchReports();
            const updated = reports.find((r) => r.id === selectedReport.id);
            if (updated) setSelectedReport(updated);
            else setSelectedReport(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A3F2F] flex items-center gap-2">
            Department Reports
            <span className="text-sm font-bold bg-gray-200 text-gray-800 px-2 py-1 rounded-full border border-gray-300">
              {filteredReports.length}
            </span>
          </h1>
          <p className="text-gray-700 font-medium text-sm mt-1">
            Manage and track submissions across the system.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative group flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-3 text-gray-500 group-focus-within:text-[#16a34a]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all text-sm font-medium text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filter */}
          <div className="relative flex-1 md:flex-none">
            <FaFilter className="absolute left-3 top-3 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 w-full md:w-48 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none bg-white text-sm font-bold text-gray-800 appearance-none cursor-pointer hover:border-gray-400"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* 🔁 Sort Toggle */}
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-300 rounded-xl text-gray-600 hover:text-[#16a34a] hover:border-[#16a34a] transition-colors"
            title="Toggle Sort Order"
          >
            <FaSortAmountDownAlt />
            {sortOrder === "latest" ? "Latest First" : "Oldest First"}
          </button>

          {/* 🔃 Refresh */}
          <button
            onClick={() => {
              setLoading(true);
              fetchReports();
            }}
            className="p-2.5 bg-white border-2 border-gray-300 text-gray-600 rounded-xl hover:text-[#16a34a] hover:border-[#16a34a] transition-colors"
            title="Refresh Data"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-bold">
            Loading reports...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-500 text-lg font-bold">
              No reports matching your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="mt-4 text-[#16a34a] font-bold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-extrabold text-black uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="p-4 text-xs font-extrabold text-black uppercase tracking-wider">
                    Dept
                  </th>
                  <th className="p-4 text-xs font-extrabold text-black uppercase tracking-wider">
                    Title
                  </th>
                  <th className="p-4 text-xs font-extrabold text-black uppercase tracking-wider">
                    Current Stage
                  </th>
                  <th className="p-4 text-xs font-extrabold text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs font-extrabold text-black uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredReports.map((report) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className={`group transition-colors ${
                        report.currentStage === role ? "bg-green-50/50" : ""
                      }`}
                    >
                      <td className="p-4 text-sm font-bold text-gray-900">
                        {report.createdByName || "Unknown"}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-700">
                        {report.department || "N/A"}
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900 max-w-xs truncate">
                        {report.title}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-extrabold px-2 py-1 rounded border ${
                            report.currentStage === role
                              ? "text-[#16a34a] bg-green-100 border-green-200"
                              : "text-gray-700 bg-gray-200 border-gray-300"
                          }`}
                        >
                          {report.currentStage || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wide ${getStatusBadge(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-gray-600 hover:text-[#16a34a] transition-colors p-2 rounded-full hover:bg-green-100"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;
