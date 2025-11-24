import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { forwardReport, approveReport, rejectReport, completeReport, getReportById } from '../api/reportApi';
import { toast } from 'react-toastify';
import ReportProgress from './ReportProgress';
import LoaderSkeleton from './LoaderSkeleton';
import { fadeInUp } from '../animations/variants';

const ReportCard = ({ report, role, onActionComplete }) => {
  const [approveDisabled, setApproveDisabled] = useState(false);
  const [rejectDisabled, setRejectDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveReport, setLiveReport] = useState(report);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleAction = async (type) => {
    if (loading) return;
    setLoading(true);

    try {
      let res;
      if (type === 'approve') {
        setApproveDisabled(true);
        setRejectDisabled(false);
        res = await approveReport(liveReport.id, 'Approved by ' + role);
      } else if (type === 'reject') {
        const reason = prompt('Enter rejection reason:');
        if (!reason) {
          setLoading(false);
          return;
        }
        setRejectDisabled(true);
        setApproveDisabled(false);
        res = await rejectReport(liveReport.id, reason);
      } else if (type === 'forward') {
        let nextStage;
        if (role === 'PRINCIPAL') {
          const choice = prompt('Forward to:\n1️⃣ System\n2️⃣ Dean\n3️⃣ Resources\n\nEnter number:');
          if (choice === '1') nextStage = 'SYSTEM';
          else if (choice === '2') nextStage = 'DEAN';
          else if (choice === '3') nextStage = 'RESOURCES';
          else {
            toast.info('Cancelled forwarding.');
            setLoading(false);
            return;
          }
        } else if (role === 'SYSTEM') nextStage = 'PRINCIPAL';
        else if (role === 'DEAN') nextStage = 'FINAL_PRINCIPAL';
        else if (role === 'FINAL_PRINCIPAL') nextStage = 'RESOURCES';
        else nextStage = 'RESOURCES';

        const comments = prompt('Enter comments (optional):');
        res = await forwardReport(liveReport.id, nextStage, comments || 'Forwarded');
      } else if (type === 'complete') {
        const available = window.confirm('Mark as AVAILABLE? Click Cancel for NOT AVAILABLE.');
        const comments = prompt('Add any remarks:');
        res = await completeReport(liveReport.id, available, comments || '');
      }

      if (res?.data?.success) {
        toast.success(res.data.message);
        await refreshReport();
        await onActionComplete();
      }
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const disableAllActions = ['REJECTED', 'COMPLETED', 'NOT_AVAILABLE'].includes(liveReport.status);

  return (
    <motion.div
      className="p-5 bg-white rounded-xl shadow-md border hover:shadow-xl transition-all duration-300"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
    >
      <motion.h3
        className="font-bold text-gray-800 text-lg"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {liveReport.title}
      </motion.h3>

      <motion.p
        className="text-gray-600 mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {liveReport.description}
      </motion.p>

      <p className="text-gray-500 text-sm mt-2">
        <strong>Location:</strong> {liveReport.location}
      </p>
      <p className="text-gray-500 text-sm">
        <strong>Status:</strong> {liveReport.status} | <strong>Stage:</strong> {liveReport.currentStage}
      </p>

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

      {liveReport.rejected && (
        <motion.div
          className="mt-3 bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ❌ <strong>Rejected By:</strong> {liveReport.rejectedBy} <br />
          <strong>Reason:</strong> {liveReport.rejectionReason}
        </motion.div>
      )}

      {liveReport.history && liveReport.history.length > 0 && (
        <motion.div
          className="mt-3 bg-gray-50 rounded-md p-3 text-sm border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <strong className="text-gray-700">History:</strong>
          <ul className="list-disc ml-5 text-gray-600 mt-1 space-y-1">
            {liveReport.history.map((h, i) => (
              <li key={i}>
                <span className="font-semibold text-gray-700">{h.byRole}</span> — {h.action} ({h.comments})
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {!disableAllActions && (
        <motion.div
          className="flex gap-2 mt-5 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {(role === 'SYSTEM' || role === 'PRINCIPAL' || role === 'DEAN' || role === 'FINAL_PRINCIPAL' || role === 'RESOURCES') && (
            <>
              {role !== 'RESOURCES' && (
                <button
                  disabled={loading}
                  onClick={() => handleAction('forward')}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  Forward
                </button>
              )}
              {role === 'RESOURCES' && (
                <button
                  disabled={loading}
                  onClick={() => handleAction('complete')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
                >
                  Complete
                </button>
              )}
              <button
                disabled={approveDisabled || loading}
                onClick={() => handleAction('approve')}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 transition-all duration-200"
              >
                Approve
              </button>
              <button
                disabled={rejectDisabled || loading}
                onClick={() => handleAction('reject')}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
              >
                Reject
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReportCard;
