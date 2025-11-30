import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  forwardReport,
  approveReport,
  rejectReport,
  closeReport,
  getReportById,
} from "../api/reportApi";
import { useLiveUpdate } from "../context/LiveUpdateContext";
import { toast } from "react-toastify";
import ReportProgress from "./ReportProgress";
import LoaderSkeleton from "./LoaderSkeleton";
import {
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaPaperPlane,
  FaLock,
  FaHistory,
} from "react-icons/fa";

const ReportCard = ({ report, role, onActionComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [liveReport, setLiveReport] = useState(report);
  const [refreshing, setRefreshing] = useState(false);
  const [showActionModal, setShowActionModal] = useState(null);
  const [commentText, setCommentText] = useState("");

  // ✅ Manage button states
  const [actionState, setActionState] = useState({
    approved: false,
    rejected: false,
    forwarded: false,
  });

  const { lastUpdate } = useLiveUpdate(); // ✅ WebSocket live data

  // ✅ Real-time sync when backend pushes updated report
  useEffect(() => {
    if (!lastUpdate?.data) return;
    const updated = lastUpdate.data;
    const targetType = (lastUpdate.type || "").toLowerCase();

    if (
      updated?.id === liveReport.id &&
      ["all", "system", "principal"].includes(targetType)
    ) {
      console.log("🔁 Live update received for report:", updated.id);
      setLiveReport(updated);
      toast.info(`🔄 "${updated.title}" was updated in real-time`, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  }, [lastUpdate, liveReport.id]);

  const refreshReport = async () => {
    try {
      setRefreshing(true);
      const res = await getReportById(liveReport.id);
      setLiveReport(res.data.data);
    } catch (err) {
      console.error("❌ Failed to refresh report:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAction = async (type) => {
    if (!commentText.trim()) {
      toast.info("Please add your comments before proceeding.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (type === "approve") {
        res = await approveReport(liveReport.id, commentText.trim());
        setActionState({ approved: true, rejected: false, forwarded: true });
      } else if (type === "reject") {
        res = await rejectReport(liveReport.id, commentText.trim());
        setActionState({ approved: false, rejected: true, forwarded: true });
      } else if (type === "forward") {
        const nextStage = role === "SYSTEM" ? "PRINCIPAL" : "SYSTEM";
        res = await forwardReport(liveReport.id, nextStage, commentText.trim());
        setActionState((prev) => ({ ...prev, forwarded: true }));
      } else if (type === "close") {
        res = await closeReport(liveReport.id, commentText.trim());
      }

      if (res?.data?.success) {
        toast.success(res.data.message);
        await refreshReport();
        await onActionComplete?.();
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Action failed. Please try again.");
    } finally {
      setLoading(false);
      setShowActionModal(null);
      setCommentText("");
    }
  };

  const canCloseReport =
    role === "SYSTEM" &&
    liveReport.status === "APPROVED" &&
    liveReport.currentStage === "PRINCIPAL";

  const disableAllActions = ["REJECTED", "COMPLETED"].includes(
    liveReport.status
  );

  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="bg-[#0A3F2F] p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="bg-[#16a34a] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {liveReport.status}
                </span>
                <h2 className="text-2xl font-bold mt-2">{liveReport.title}</h2>
              </div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10"
                >
                  &larr; Back
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-white/90">
              <span className="flex items-center gap-1">
                <FaUser /> {liveReport.createdByName}
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {liveReport.location}
              </span>
              <span className="flex items-center gap-1">
                <FaClock /> {formatDateTime(liveReport.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase mb-2">Report Details</h3>
            <p className="text-gray-900 text-lg bg-gray-50 p-4 rounded-xl border border-gray-300">
              {liveReport.description}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            {refreshing ? (
              <LoaderSkeleton height="h-4" count={1} />
            ) : (
              <ReportProgress
                currentStage={liveReport.currentStage}
                status={liveReport.status}
                rejected={liveReport.rejected}
                rejectionReason={liveReport.rejectionReason}
              />
            )}
          </div>

          {/* 📜 History */}
          {liveReport.history?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-extrabold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaHistory /> Activity Log
              </h3>
              <div className="relative pl-4 border-l-2 border-gray-300 space-y-5">
                {liveReport.history.map((h, i) => (
                  <HistoryItem key={i} entry={h} formatDateTime={formatDateTime} />
                ))}
              </div>
            </div>
          )}

          {/* ⚙️ Action Buttons */}
          {!disableAllActions && (
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-300">
              {/* SYSTEM */}
              {role === "SYSTEM" && (
                <>
                  <button
                    disabled={loading || actionState.forwarded}
                    onClick={() => setShowActionModal("forward")}
                    className={`flex-1 ${
                      actionState.forwarded
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2`}
                  >
                    <FaPaperPlane /> Forward to Principal
                  </button>

                  {canCloseReport && (
                    <button
                      disabled={loading}
                      onClick={() => setShowActionModal("close")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <FaLock /> End Report
                    </button>
                  )}
                </>
              )}

              {/* PRINCIPAL */}
              {role === "PRINCIPAL" && (
                <>
                  <button
                    disabled={loading || actionState.forwarded}
                    onClick={() => setShowActionModal("forward")}
                    className={`flex-1 ${
                      actionState.forwarded
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2`}
                  >
                    <FaPaperPlane /> Forward to System
                  </button>

                  <button
                    disabled={loading || actionState.approved}
                    onClick={() => setShowActionModal("approve")}
                    className={`flex-1 ${
                      actionState.approved
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2`}
                  >
                    <FaCheck /> Approve
                  </button>

                  <button
                    disabled={loading || actionState.approved}
                    onClick={() => setShowActionModal("reject")}
                    className={`flex-1 ${
                      actionState.approved
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-white border-2 border-red-200 text-red-600 hover:bg-red-50"
                    } py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2`}
                  >
                    <FaTimes /> Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && (
          <ModalCard
            title={
              showActionModal === "approve"
                ? "Approve Report"
                : showActionModal === "reject"
                ? "Reject Report"
                : showActionModal === "close"
                ? "End Report"
                : "Forward Report"
            }
            commentText={commentText}
            setCommentText={setCommentText}
            onClose={() => setShowActionModal(null)}
            onConfirm={() => handleAction(showActionModal)}
            loading={loading}
            isDestructive={showActionModal === "reject"}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* 🧩 HistoryItem Component */
const HistoryItem = ({ entry, formatDateTime }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LEN = 120;
  const text = entry.comments || "";
  const isLong = text.length > MAX_LEN;

  const getReadableMessage = () => {
    const action = entry.action?.toUpperCase() || "";
    switch (action) {
      case "CREATED":
        return `${entry.byName} created the report`;
      case "FORWARDED":
        return `${entry.byName} forwarded to ${entry.toDepartment || "next stage"}`;
      case "APPROVED":
        return `${entry.byName} approved the report`;
      case "REJECTED":
        return `${entry.byName} rejected the report`;
      case "COMPLETED":
        return `${entry.byName} completed the report`;
      default:
        return `${entry.byName} performed ${action}`;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#16a34a]" />
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-1">
          <span className="font-bold text-sm text-gray-800">
            {getReadableMessage()}
          </span>
          <span className="text-xs text-gray-500">
            {formatDateTime(entry.timestamp)}
          </span>
        </div>
        {text && (
          <p className="text-sm text-gray-800 mt-1 leading-relaxed">
            {expanded ? text : `${text.slice(0, MAX_LEN)}${isLong ? "..." : ""}`}
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

/* ✅ Modal Component */
const ModalCard = ({
  title,
  commentText,
  setCommentText,
  onClose,
  onConfirm,
  loading,
  isDestructive,
}) => {
  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-100 p-5 border-b border-gray-300">
          <h3 className="text-lg font-bold text-black">{title}</h3>
        </div>
        <div className="p-6 space-y-4">
          <label className="block text-xs font-bold uppercase mb-1">
            Comments
          </label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, 500))}
            rows={4}
            placeholder="Write your comments (required)"
            className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#16a34a] outline-none resize-none"
          />
        </div>
        <div className="p-4 bg-gray-100 flex justify-end gap-3 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 text-black font-bold hover:bg-gray-200 rounded-lg border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#16a34a] hover:bg-[#15803d]"
            }`}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ReportCard;
