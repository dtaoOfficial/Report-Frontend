import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  forwardReport,
  approveReport,
  rejectReport,
  completeReport,
  getReportById,
} from '../api/reportApi';
import { toast } from 'react-toastify';
import ReportProgress from './ReportProgress';
import LoaderSkeleton from './LoaderSkeleton';
import { fadeInUp } from '../animations/variants';

const ReportCard = ({ report, role, onActionComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [liveReport, setLiveReport] = useState(report);
  const [refreshing, setRefreshing] = useState(false);
  const [isForwarded, setIsForwarded] = useState(false);

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showCommentView, setShowCommentView] = useState(false);
  const [viewCommentText, setViewCommentText] = useState('');

  const refreshReport = async () => {
    try {
      setRefreshing(true);
      const res = await getReportById(liveReport.id);
      setLiveReport(res.data.data);
    } catch (err) {
      console.error('Failed to refresh report', err);
    } finally {
      setRefreshing(false);
    }
  };

  // 🧭 Forward Action
  const handleForward = () => {
    if (role === 'PRINCIPAL') setShowForwardModal(true);
    else setShowActionModal('forward');
  };

  // ✅ Confirm Forward (Principal)
  const confirmForwardPrincipal = async () => {
    if (!selectedRole) {
      toast.info('Please select a department to forward.');
      return;
    }
    setLoading(true);
    try {
      const res = await forwardReport(
        liveReport.id,
        selectedRole,
        commentText.trim() || 'Forwarded'
      );
      if (res?.data?.success) {
        toast.success('Report forwarded successfully!');
        setIsForwarded(true);
        await refreshReport();
        await onActionComplete();
      }
    } catch (err) {
      console.error(err);
      toast.error('Forward failed');
    } finally {
      setLoading(false);
      setShowForwardModal(false);
      setCommentText('');
      setSelectedRole('');
    }
  };

  // ✅ Simple forward for other roles
  const confirmForwardSimple = async () => {
    setLoading(true);
    try {
      let nextStage;
      if (role === 'SYSTEM') nextStage = 'PRINCIPAL';
      else if (role === 'DEAN') nextStage = 'PRINCIPAL';
      else if (role === 'PRINCIPAL') nextStage = 'RESOURCES';
      else nextStage = 'RESOURCES';

      const res = await forwardReport(
        liveReport.id,
        nextStage,
        commentText.trim() || 'Forwarded'
      );
      if (res?.data?.success) {
        toast.success('Report forwarded successfully!');
        setIsForwarded(true);
        await refreshReport();
        await onActionComplete();
      }
    } catch (err) {
      toast.error('Forward failed');
    } finally {
      setLoading(false);
      setShowActionModal(null);
      setCommentText('');
    }
  };

  // ✅ Approve / Reject / Complete
  const handleAction = async (type) => {
    setLoading(true);
    try {
      let res;
      if (type === 'approve') {
        res = await approveReport(liveReport.id, commentText.trim() || 'Approved');
      } else if (type === 'reject') {
        if (!commentText.trim()) {
          toast.info('Please enter rejection reason.');
          setLoading(false);
          return;
        }
        res = await rejectReport(liveReport.id, commentText.trim());
      } else if (type === 'complete') {
        const resAvailable = await completeReport(
          liveReport.id,
          true,
          commentText.trim() || 'Marked complete'
        );
        res = resAvailable;
      }

      if (res?.data?.success) {
        toast.success(res.data.message);
        await refreshReport();
        await onActionComplete();
      }
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setLoading(false);
      setShowActionModal(null);
      setCommentText('');
    }
  };

  const disableAllActions =
    ['REJECTED', 'COMPLETED', 'NOT_AVAILABLE'].includes(liveReport.status) ||
    liveReport.currentStage !== role ||
    isForwarded;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <motion.div
        className="p-5 bg-white rounded-xl shadow-md border hover:shadow-xl transition-all duration-300"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
      >
        {/* 🔙 Back Button */}
        <div className="mb-4">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-all"
          >
            ← Back to Reports
          </button>
        </div>

        {/* Report Header */}
        <div className="flex flex-col gap-1 mb-3">
          <h3 className="font-bold text-gray-800 text-lg">{liveReport.title}</h3>
          <p className="text-gray-600">{liveReport.description}</p>
          <p className="text-gray-500 text-sm">
            <strong>Location:</strong> {liveReport.location}
          </p>
          <p className="text-gray-500 text-sm">
            <strong>Status:</strong> {liveReport.status} |{' '}
            <strong>Stage:</strong> {liveReport.currentStage}
          </p>

          {/* 🧍 User Info */}
          <div className="text-gray-500 text-sm mt-1">
            <strong>Reported By:</strong> {liveReport.createdByName}{' '}
            <span className="text-gray-400">({liveReport.department || 'N/A'})</span>
          </div>
        </div>

        {/* Progress */}
        {refreshing ? (
          <div className="mt-3">
            <LoaderSkeleton height="h-4" count={3} />
          </div>
        ) : (
          <ReportProgress
            currentStage={liveReport.currentStage}
            status={liveReport.status}
            rejected={liveReport.rejected}
            rejectionReason={liveReport.rejectionReason}
          />
        )}

        {/* HISTORY */}
        {liveReport.history?.length > 0 && (
          <div className="mt-3 bg-gray-50 rounded-md p-3 text-sm border border-gray-100">
            <strong className="text-gray-700">History:</strong>
            <ul className="list-disc ml-5 text-gray-600 mt-1 space-y-2">
              {liveReport.history.map((h, i) => {
                const forwardTarget =
                  h.action === 'FORWARDED' &&
                  h.comments &&
                  /to\s+(\w+)/i.test(h.comments)
                    ? h.comments.match(/to\s+(\w+)/i)[1]
                    : h.nextStage || '';

                return (
                  <li
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">
                        {h.byDepartment || 'General'}
                      </span>
                      <span className="text-gray-600"> ({h.byName || 'Unknown'})</span>
                      {' — '}
                      <span className="text-gray-700">
                        {h.action}
                        {forwardTarget && (
                          <span className="text-blue-600 italic">
                            {' '}to {forwardTarget.toUpperCase()}
                          </span>
                        )}
                      </span>{' '}
                      <span className="text-gray-400 text-xs">
                        ({formatDate(h.timestamp || liveReport.updatedAt)})
                      </span>
                    </div>

                    {h.comments && (
                      <button
                        className="text-blue-600 text-xs hover:underline mt-1 sm:mt-0"
                        onClick={() => {
                          setViewCommentText(h.comments);
                          setShowCommentView(true);
                        }}
                      >
                        💬 View Comment
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ACTION BUTTONS */}
        {!disableAllActions && (
          <div
            className={`flex gap-2 mt-5 flex-wrap ${
              role === 'RESOURCES' ? 'justify-center' : ''
            }`}
          >
            {/* 🔹 Hide Forward for RESOURCES */}
            {role !== 'RESOURCES' && (
              <button
                disabled={loading}
                onClick={handleForward}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
              >
                Forward
              </button>
            )}

            {/* ✅ Approve */}
            <button
              disabled={loading}
              onClick={() => setShowActionModal('approve')}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 transition-all duration-200"
            >
              Approve
            </button>

            {/* ❌ Reject */}
            <button
              disabled={loading}
              onClick={() => setShowActionModal('reject')}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
            >
              Reject
            </button>
          </div>
        )}
      </motion.div>

      {/* 📨 Modals */}
      <AnimatePresence>
        {showForwardModal && role === 'PRINCIPAL' && (
          <ModalCard
            title="Forward Report To:"
            radios={['SYSTEM', 'DEAN', 'RESOURCES']}
            selected={selectedRole}
            setSelected={setSelectedRole}
            commentText={commentText}
            setCommentText={setCommentText}
            onClose={() => setShowForwardModal(false)}
            onConfirm={confirmForwardPrincipal}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showActionModal && (
          <ModalCard
            title={
              showActionModal === 'approve'
                ? 'Add Approval Comments'
                : showActionModal === 'reject'
                ? 'Rejection Reason'
                : 'Forward Report'
            }
            commentText={commentText}
            setCommentText={setCommentText}
            onClose={() => setShowActionModal(null)}
            onConfirm={
              showActionModal === 'approve'
                ? () => handleAction('approve')
                : showActionModal === 'reject'
                ? () => handleAction('reject')
                : confirmForwardSimple
            }
            loading={loading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCommentView && (
          <CommentModal
            comment={viewCommentText}
            onClose={() => setShowCommentView(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* 🧩 Modal Components */
const ModalCard = ({
  title,
  radios,
  selected,
  setSelected,
  commentText,
  setCommentText,
  onClose,
  onConfirm,
  loading,
}) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-3"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-3">📄 {title}</h3>
      {radios && (
        <div className="space-y-2 mb-3">
          {radios.map((r) => (
            <label key={r} className="flex items-center space-x-2">
              <input
                type="radio"
                value={r}
                checked={selected === r}
                onChange={(e) => setSelected(e.target.value)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
      )}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
        rows={5}
        placeholder="Enter your comments (max 300 words)..."
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
      />
      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const CommentModal = ({ comment, onClose }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-3"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-3">💬 Comment</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{comment}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default ReportCard;
