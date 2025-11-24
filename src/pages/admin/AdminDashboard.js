import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig';
import ReportCard from '../../components/ReportCard';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/report-stats'),
        api.get('/admin/all-reports'),
      ]);

      setStats(statsRes.data.data || {});
      setReports(reportsRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <motion.div
        className="text-center mt-10 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading dashboard...
      </motion.div>
    );

  if (selectedReport) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setSelectedReport(null)}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
        >
          ← Back to Reports
        </button>
        <ReportCard
          report={selectedReport}
          role="ADMIN"
          onActionComplete={fetchDashboardData}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pt-24 px-4 max-w-7xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Admin Command Center
      </h1>

      {/* 📊 Stats Overview */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          { label: 'Total Reports', value: stats.total, color: 'blue' },
          { label: 'Approved', value: stats.approved, color: 'green' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Rejected', value: stats.rejected, color: 'red' },
          { label: 'Completed', value: stats.completed, color: 'teal' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`bg-${item.color}-100 p-4 rounded-lg shadow text-center hover:shadow-md transition`}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className={`text-lg font-semibold text-${item.color}-700`}>
              {item.label}
            </h3>
            <p className="text-2xl font-bold">{item.value || 0}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 📋 Reports Table */}
      <motion.div
        className="bg-white shadow rounded-lg p-6 overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          All Reports
        </h2>
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reports found.</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Stage</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <motion.tr
                  key={r.id}
                  className="border-t hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">{r.createdByName}</td>
                  <td className="p-3">{r.currentStage}</td>
                  <td
                    className={`p-3 font-semibold ${
                      r.status === 'APPROVED'
                        ? 'text-green-600'
                        : r.status === 'REJECTED'
                        ? 'text-red-600'
                        : r.status === 'COMPLETED'
                        ? 'text-teal-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {r.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
