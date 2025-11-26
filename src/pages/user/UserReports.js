import React, { useEffect, useState, useCallback } from 'react';
import { getMyReports } from '../../api/reportApi';
import ReportForm from '../../components/ReportForm';
import { toast } from 'react-toastify';

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const res = await getMyReports();
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="pt-24 px-8 pb-10 bg-gray-50 min-h-screen">
      {/* 🧩 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 📝 Create Report Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Create New Report
          </h2>
          <ReportForm onReportAdded={fetchReports} />
        </div>

        {/* 📋 My Reports Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[82vh]">
          {/* Sticky Header */}
          <div className="p-6 border-b bg-white sticky top-0 z-10">
            <h2 className="text-2xl font-semibold text-gray-800">My Reports</h2>
          </div>

          {/* Scrollable Report List */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {loading ? (
              <p className="text-gray-500">Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-500">No reports found.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="font-bold text-gray-800 text-lg">
                      {r.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{r.description}</p>

                    <p className="text-gray-500 text-xs mt-3">
                      <strong>Location:</strong> {r.location || 'N/A'} <br />
                      <strong>Status:</strong>{' '}
                      <span
                        className={`${
                          r.status === 'APPROVED'
                            ? 'text-green-600'
                            : r.status === 'REJECTED'
                            ? 'text-red-600'
                            : r.status === 'COMPLETED'
                            ? 'text-blue-600'
                            : 'text-yellow-600'
                        } font-semibold`}
                      >
                        {r.status}
                      </span>{' '}
                      | <strong>Stage:</strong> {r.currentStage}
                    </p>

                    {r.rejected && (
                      <div className="mt-2 bg-red-50 text-red-600 p-2 rounded text-sm">
                        ❌ <strong>Rejected By:</strong> {r.rejectedBy} <br />
                        <strong>Reason:</strong> {r.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🌈 Custom Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a0a0a0;
        }
      `}</style>
    </div>
  );
};

export default UserReports;
