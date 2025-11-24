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
    <div className="p-6 space-y-8">
      <ReportForm onReportAdded={fetchReports} />

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Reports</h2>
        {loading ? (
          <p className="text-gray-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-500">No reports found.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="p-4 bg-white rounded-lg shadow border">
                <h3 className="font-bold text-gray-800">{r.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{r.description}</p>
                <p className="text-gray-500 text-xs mt-2">
                  <strong>Status:</strong> {r.status} | <strong>Stage:</strong> {r.currentStage}
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
  );
};

export default UserReports;
