import React, { useEffect, useState, useCallback } from 'react';
import { getReportsByStage } from '../api/reportApi';
import ReportCard from './ReportCard';
import { toast } from 'react-toastify';

const ReportList = ({ stage, role }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const res = await getReportsByStage(stage);
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, [stage]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Back to list and refresh reports
  const handleBack = async () => {
    await fetchReports();
    setSelectedReport(null);
  };

  if (loading)
    return <p className="text-gray-500 text-center mt-8">Loading reports...</p>;

  if (selectedReport) {
    return (
      <div className="p-4">
        <button
          onClick={handleBack}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          ← Back to Reports
        </button>
        <ReportCard
          report={selectedReport}
          role={role}
          onActionComplete={async () => {
            await fetchReports(); // ✅ Auto refresh list
            const updated = reports.find((r) => r.id === selectedReport.id);
            if (updated) setSelectedReport(updated); // ✅ Update progress bar/history
            else setSelectedReport(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {role} Department Reports
      </h1>

      {reports.length === 0 ? (
        <p className="text-gray-500 text-center">
          No reports found for {stage.charAt(0).toUpperCase() + stage.slice(1)} stage.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Sent By</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Stage</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{report.title}</td>
                  <td className="p-3">{report.createdByName}</td>
                  <td className="p-3">{report.location || 'N/A'}</td>
                  <td className="p-3">{report.currentStage}</td>
                  <td
                    className={`p-3 font-semibold ${
                      report.status === 'APPROVED'
                        ? 'text-green-600'
                        : report.status === 'REJECTED'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {report.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportList;
