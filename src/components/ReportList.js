import React, { useEffect, useState, useCallback } from 'react';
import { getAllReports } from '../api/reportApi';
import ReportCard from './ReportCard';
import { toast } from 'react-toastify';

const ReportList = ({ role }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch all reports (latest first)
  const fetchReports = useCallback(async () => {
    try {
      const res = await getAllReports();
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 🔙 Back to list and refresh reports
  const handleBack = async () => {
    await fetchReports();
    setSelectedReport(null);
  };

  if (loading)
    return <p className="text-gray-500 text-center mt-8">Loading reports...</p>;

  // 🔹 When a report is selected, show the ReportCard view
  if (selectedReport) {
    return (
      <div className="p-4 mt-20"> {/* 👈 Added margin-top for navbar spacing */}
        <ReportCard
          report={selectedReport}
          role={role}
          onBack={handleBack} // ✅ Back button now works
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

  // 🔹 Default table view
  return (
    <div className="p-6 mt-20"> {/* 👈 Added margin-top for navbar spacing */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {role} Department Reports
      </h1>

      {reports.length === 0 ? (
        <p className="text-gray-500 text-center">No reports found yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Dept</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Stage</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className={`border-t hover:bg-gray-50 ${
                    report.currentStage === role ? 'bg-green-50' : ''
                  }`}
                >
                  {/* 🧑 Name */}
                  <td className="p-3 font-medium">{report.createdByName || 'Unknown'}</td>

                  {/* 🏫 Department */}
                  <td className="p-3">{report.department || 'N/A'}</td>

                  {/* 📄 Title */}
                  <td className="p-3">{report.title}</td>

                  {/* 🏁 Stage */}
                  <td className="p-3">{report.currentStage || '-'}</td>

                  {/* 📊 Status */}
                  <td
                    className={`p-3 font-semibold ${
                      report.status === 'APPROVED'
                        ? 'text-green-600'
                        : report.status === 'REJECTED'
                        ? 'text-red-600'
                        : report.status === 'COMPLETED'
                        ? 'text-blue-600'
                        : report.status === 'NOT_AVAILABLE'
                        ? 'text-gray-500'
                        : 'text-yellow-600'
                    }`}
                  >
                    {report.status}
                  </td>

                  {/* 🔍 Action */}
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
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
