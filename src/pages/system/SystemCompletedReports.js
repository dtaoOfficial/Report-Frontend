import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getCompletedReports } from "../../api/reportApi";
import { useLiveUpdate } from "../../context/LiveUpdateContext";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaDownload,
  FaHistory,
  FaSearch,
  FaFilter,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LoaderSkeleton from "../../components/LoaderSkeleton";
import ReportProgress from "../../components/ReportProgress";
import logo from "../../assets/collegeLogo.webp";

const SystemCompletedReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [sortNewest, setSortNewest] = useState(true);
  const { lastUpdate } = useLiveUpdate();

  // ✅ Fetch completed reports (System role)
  const fetchReports = useCallback(async () => {
    try {
      const res = await getCompletedReports();
      const data = res.data.data || [];
      // Sort newest first by default
      const sorted = data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setReports(sorted);
      setFilteredReports(sorted);
    } catch (err) {
      console.error("❌ Error fetching completed reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ✅ Auto-refresh when System or Global WebSocket event arrives
  useEffect(() => {
    if (!lastUpdate?.data) return;
    const { type, data } = lastUpdate;
    const updateType = (type || "").toLowerCase();
    if (["system", "all", "manual"].includes(updateType)) {
      console.log("🔁 Live update detected in Completed Reports:", data.title);
      fetchReports();
    }
  }, [lastUpdate, fetchReports]);

  // ✅ Handle Search + Filter + Sort
  useEffect(() => {
    let result = [...reports];

    // 🔍 Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.department.toLowerCase().includes(term) ||
          r.createdByName.toLowerCase().includes(term)
      );
    }

    // 🏫 Filter by Department
    if (filterDept !== "ALL") {
      result = result.filter((r) => r.department === filterDept);
    }

    // ⏫ Sort (Newest or Oldest)
    result.sort((a, b) =>
      sortNewest
        ? new Date(b.updatedAt) - new Date(a.updatedAt)
        : new Date(a.updatedAt) - new Date(b.updatedAt)
    );

    setFilteredReports(result);
  }, [searchTerm, filterDept, sortNewest, reports]);

  // ✅ Unique departments for filter dropdown
  const departments = useMemo(
    () => ["ALL", ...new Set(reports.map((r) => r.department).filter(Boolean))],
    [reports]
  );

  // ✅ Date formatting
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const daysAgo = (dateStr) => {
    const created = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Completed today";
    if (diff === 1) return "Completed 1 day ago";
    return `Completed ${diff} days ago`;
  };

  const formatRole = (role) => {
    if (!role) return "User";
    if (role.includes("SYSTEM")) return "System";
    if (role.includes("PRINCIPAL")) return "Principal";
    if (role.includes("ADMIN")) return "Admin";
    if (role.includes("USER")) return "User";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const getReadableMessage = (entry) => {
    const byRole = entry.byRole || "";
    const byName = entry.byName || "User";
    const byDept = entry.byDepartment || "";
    const toDept = entry.toDepartment || "";
    const toName = entry.toName || "";
    const action = entry.action ? entry.action.toUpperCase() : "ACTION";

    const fromStage =
      byDept && !byRole.includes("SYSTEM") && !byRole.includes("PRINCIPAL")
        ? `${byDept} (${byName})`
        : `${formatRole(byRole)} (${byName})`;

    const toStage =
      toDept && toName
        ? `${formatRole(toDept)} (${toName})`
        : toDept
        ? formatRole(toDept)
        : "";

    switch (action) {
      case "CREATED":
        return `${fromStage} Created The Report`;
      case "FORWARDED":
        return toStage
          ? `${fromStage} Forwarded To ${toStage}`
          : `${fromStage} Forwarded The Report`;
      case "APPROVED":
        return `${fromStage} Approved The Report`;
      case "REJECTED":
        return `${fromStage} Rejected The Report`;
      case "COMPLETED":
        return `${fromStage} Completed The Report`;
      default:
        return `${fromStage} Performed ${action}`;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATED":
        return "text-green-600";
      case "FORWARDED":
        return "text-blue-600";
      case "APPROVED":
        return "text-green-700";
      case "REJECTED":
        return "text-red-600";
      case "COMPLETED":
        return "text-gray-700";
      default:
        return "text-gray-800";
    }
  };

  // ✅ PDF Download
  const downloadPDF = (report) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.addImage(logo, "PNG", 15, 10, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("New Horizon College of Engineering", pageWidth / 2, 18, {
      align: "center",
    });
    doc.setFontSize(11);
    doc.text("System & Network Department", pageWidth / 2, 25, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text("Official Completed Report Summary", pageWidth / 2, 31, {
      align: "center",
    });

    doc.setDrawColor(22, 163, 74);
    doc.line(14, 36, pageWidth - 14, 36);

    let y = 45;
    doc.setFontSize(12);
    doc.text("Report Details", 14, y);
    y += 6;

    const details = [
      ["Title", report.title],
      ["Created By", `${report.createdByName} (${report.department})`],
      ["Location", report.location],
      ["Status", report.status],
      ["Created At", formatDate(report.createdAt)],
      ["Completed At", formatDate(report.updatedAt)],
    ];

    autoTable(doc, {
      startY: y,
      body: details,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    });

    y = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("Action History", 14, y);
    y += 4;

    const tableData = report.history.map((h) => [
      getReadableMessage(h),
      h.comments || "",
      formatDate(h.timestamp),
    ]);

    autoTable(doc, {
      head: [["Action", "Comments", "Time"]],
      body: tableData,
      startY: y + 2,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [22, 163, 74], textColor: 255 },
    });

    doc.save(`${report.title.replace(/\s+/g, "_")}_report.pdf`);
  };

  if (loading) return <LoaderSkeleton count={3} />;

  return (
    <div className="min-h-screen bg-[#F9F8F4] pt-24 pb-12 px-6 font-sans relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#0A3F2F] mb-6 text-center">
          Completed Reports
        </h1>

        {/* 🔍 Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#16a34a] outline-none"
              />
            </div>
            <button
              onClick={() => setSortNewest(!sortNewest)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              title="Toggle Sort Order"
            >
              <FaSortAmountDownAlt />
              {sortNewest ? "Newest" : "Oldest"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#16a34a] outline-none"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "ALL" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selected ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredReports.length === 0 ? (
              <div className="text-center text-gray-500 font-medium mt-10">
                No completed reports found.
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-5 text-left">Created By</th>
                      <th className="py-3 px-5 text-left">Department</th>
                      <th className="py-3 px-5 text-left">Title</th>
                      <th className="py-3 px-5 text-left">Completed On</th>
                      <th className="py-3 px-5 text-left">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelected(r)}
                      >
                        <td className="py-3 px-5 font-semibold">{r.createdByName}</td>
                        <td className="py-3 px-5">{r.department}</td>
                        <td className="py-3 px-5">{r.title}</td>
                        <td className="py-3 px-5 text-sm text-gray-500">
                          {daysAgo(r.updatedAt)}
                        </td>
                        <td className="py-3 px-5">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            COMPLETED
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right text-gray-600">
                          <FaClipboardList />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#0A3F2F]">{selected.title}</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadPDF(selected)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  <FaDownload /> Download PDF
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm font-bold text-gray-600 hover:text-black"
                >
                  ← Back
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Created on <strong>{formatDate(selected.createdAt)}</strong> •{" "}
              {daysAgo(selected.updatedAt)}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border mb-6">
              <p className="text-gray-800 leading-relaxed text-lg">
                {selected.description}
              </p>
            </div>

            <ReportProgress
              currentStage={selected.currentStage}
              status={selected.status}
              rejected={selected.rejected}
              rejectionReason={selected.rejectionReason}
            />

            <div className="mt-10">
              <h3 className="text-sm font-extrabold text-[#0A3F2F] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaHistory /> Report History
              </h3>
              <div className="space-y-4 border-l-2 border-gray-300 pl-5">
                {selected.history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[11px] top-1 w-3 h-3 rounded-full bg-[#16a34a]" />
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`font-bold text-sm ${getActionColor(
                            h.action?.toUpperCase()
                          )}`}
                        >
                          {getReadableMessage(h)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(h.timestamp)}
                        </span>
                      </div>
                      {h.comments && (
                        <p className="text-sm text-gray-800 mt-1 leading-relaxed">
                          {h.comments}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SystemCompletedReports;
