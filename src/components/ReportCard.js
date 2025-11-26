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
import { 
  FaCheck, 
  FaTimes, 
  FaHistory, 
  FaCommentDots, 
  FaMapMarkerAlt, 
  FaUser,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';

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

  // 🧭 Action Handlers
  const handleForward = () => {
    if (role === 'PRINCIPAL') setShowForwardModal(true);
    else setShowActionModal('forward');
  };

  const confirmForwardPrincipal = async () => {
    if (!selectedRole) {
      toast.info('Please select a department to forward.');
      return;
    }
    setLoading(true);
    try {
      const res = await forwardReport(liveReport.id, selectedRole, commentText.trim() || 'Forwarded');
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
      setShowForwardModal(false);
      setCommentText('');
      setSelectedRole('');
    }
  };

  const confirmForwardSimple = async () => {
    setLoading(true);
    try {
      let nextStage;
      if (role === 'SYSTEM') nextStage = 'PRINCIPAL';
      else if (role === 'DEAN') nextStage = 'PRINCIPAL';
      else if (role === 'PRINCIPAL') nextStage = 'RESOURCES';
      else nextStage = 'RESOURCES';

      const res = await forwardReport(liveReport.id, nextStage, commentText.trim() || 'Forwarded');
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
        res = await completeReport(liveReport.id, true, commentText.trim() || 'Marked complete');
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

  // 🎨 Helper for History Timeline
  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🟢 Header Banner */}
        <div className="bg-[#0A3F2F] p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <span className="bg-[#16a34a] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{liveReport.status}</span>
                    <h2 className="text-2xl font-bold mt-2 leading-tight">{liveReport.title}</h2>
                 </div>
                 {onBack && (
                   <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                     &larr; Back
                   </button>
                 )}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-green-100/80">
                 <span className="flex items-center gap-1"><FaUser /> {liveReport.createdByName} ({liveReport.department || 'N/A'})</span>
                 <span className="flex items-center gap-1"><FaMapMarkerAlt /> {liveReport.location}</span>
                 <span className="flex items-center gap-1"><FaClock /> {formatDateTime(liveReport.createdAt)}</span>
              </div>
           </div>
        </div>

        <div className="p-6 sm:p-8">
           {/* 📄 Description */}
           <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Report Details</h3>
              <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                 {liveReport.description}
              </p>
           </div>

           {/* 📊 Progress Bar */}
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

           {/* 📜 Timeline History (Modernized) */}
           {liveReport.history?.length > 0 && (
              <div className="mb-8">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaHistory /> Activity Log
                 </h3>
                 <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                    {liveReport.history.map((h, i) => (
                       <div key={i} className="relative">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#16a34a]"></div>
                          
                          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-gray-800 text-sm">{h.byDepartment || 'System'} <span className="font-normal text-gray-500">({h.byName})</span></span>
                                <span className="text-xs text-gray-400">{formatDateTime(h.timestamp)}</span>
                             </div>
                             <p className="text-sm text-gray-600">
                                <span className="font-semibold text-[#16a34a]">{h.action}</span> 
                                {h.comments && <span className="text-gray-400 mx-1">-</span>}
                                {h.comments && (
                                   <button 
                                      onClick={() => { setViewCommentText(h.comments); setShowCommentView(true); }}
                                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                   >
                                      View Note <FaCommentDots />
                                   </button>
                                )}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* ⚡ Action Bar */}
           {!disableAllActions && (
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                 {role !== 'RESOURCES' && (
                    <button
                       disabled={loading}
                       onClick={handleForward}
                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                       <FaPaperPlane /> Forward
                    </button>
                 )}
                 
                 <button
                    disabled={loading}
                    onClick={() => setShowActionModal('approve')}
                    className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                 >
                    <FaCheck /> Approve
                 </button>

                 <button
                    disabled={loading}
                    onClick={() => setShowActionModal('reject')}
                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                 >
                    <FaTimes /> Reject
                 </button>
              </div>
           )}
        </div>
      </motion.div>

      {/* 📨 Modals */}
      <AnimatePresence>
        {showForwardModal && role === 'PRINCIPAL' && (
          <ModalCard
            title="Forward Report To"
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
              showActionModal === 'approve' ? 'Approve Report' : 
              showActionModal === 'reject' ? 'Reject Report' : 'Forward Report'
            }
            commentText={commentText}
            setCommentText={setCommentText}
            onClose={() => setShowActionModal(null)}
            onConfirm={
              showActionModal === 'approve' ? () => handleAction('approve') :
              showActionModal === 'reject' ? () => handleAction('reject') : confirmForwardSimple
            }
            loading={loading}
            isDestructive={showActionModal === 'reject'}
          />
        )}
      </AnimatePresence>

      {/* ✅ FIXED: View Comment Modal */}
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

/* 🧩 Modern Modal Component */
const ModalCard = ({ title, radios, selected, setSelected, commentText, setCommentText, onClose, onConfirm, loading, isDestructive }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60] p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-50 p-5 border-b border-gray-100">
         <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="p-6 space-y-4">
         {radios && (
            <div className="grid grid-cols-3 gap-2">
               {radios.map((r) => (
                  <label key={r} className={`cursor-pointer text-center p-2 rounded-lg border text-sm font-bold transition-all ${selected === r ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                     <input type="radio" value={r} checked={selected === r} onChange={(e) => setSelected(e.target.value)} className="hidden" />
                     {r}
                  </label>
               ))}
            </div>
         )}
         
         <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comments (Optional)</label>
            <textarea
               value={commentText}
               onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
               rows={4}
               placeholder="Add any notes regarding this action..."
               className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-[#16a34a] focus:outline-none resize-none bg-gray-50"
            />
         </div>
      </div>

      <div className="p-4 bg-gray-50 flex justify-end gap-3">
         <button onClick={onClose} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
         <button 
            onClick={onConfirm} 
            disabled={loading}
            className={`px-6 py-2 text-white font-semibold rounded-lg shadow-lg transition-transform active:scale-95 ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#16a34a] hover:bg-[#15803d]'}`}
         >
            {loading ? 'Processing...' : 'Confirm Action'}
         </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ✅ FIXED: Comment Modal with Better Positioning */
const CommentModal = ({ comment, onClose }) => (
  <motion.div
    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    {/* Ensure this div is centered and doesn't overflow weirdly */}
    <motion.div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh] relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
         <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaCommentDots className="text-blue-500"/> Full Comment
         </h3>
         <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors"
         >
            <FaTimes size={18} />
         </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="p-6 overflow-y-auto">
         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-sm">
            {comment}
         </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end bg-white rounded-b-2xl">
         <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
         >
            Close
         </button>
      </div>
    </motion.div>
  </motion.div>
);

export default ReportCard;