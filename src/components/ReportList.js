import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllReports } from '../api/reportApi';
import ReportCard from './ReportCard';
import { toast } from 'react-toastify';
import { 
  FaSearch, 
  FaFilter, 
  FaSyncAlt, 
  FaArrowLeft, 
  FaEye 
} from 'react-icons/fa';

const ReportList = ({ role }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔍 Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🧠 Fetch all reports
  const fetchReports = useCallback(async () => {
    // setLoading(true); // Optional: Un-comment if you want loader on every refresh
    try {
      const res = await getAllReports();
      const data = res.data.data || [];
      setReports(data);
      setFilteredReports(data); // Initialize filtered list
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

  // ⚡ Effect: Handle Filtering & Searching
  useEffect(() => {
    let result = reports;

    // 1. Filter by Status
    if (statusFilter !== "ALL") {
      result = result.filter(r => r.status === statusFilter);
    }

    // 2. Filter by Search Term (Title or Creator Name)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.title?.toLowerCase().includes(term) || 
        r.createdByName?.toLowerCase().includes(term) ||
        r.department?.toLowerCase().includes(term)
      );
    }

    setFilteredReports(result);
  }, [searchTerm, statusFilter, reports]);

  // 🔙 Back to list logic
  const handleBack = async () => {
    await fetchReports();
    setSelectedReport(null);
  };

  // 🎨 Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // ------------------------------------------
  // VIEW: DETAILS (ReportCard)
  // ------------------------------------------
  if (selectedReport) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#16a34a] font-medium transition-colors"
        >
          <FaArrowLeft /> Back to List
        </button>
        
        <ReportCard
          report={selectedReport}
          role={role}
          onBack={handleBack}
          onActionComplete={async () => {
            await fetchReports();
            // Logic to keep viewing report details if it still exists
            const updated = reports.find((r) => r.id === selectedReport.id);
            if (updated) setSelectedReport(updated); 
            else setSelectedReport(null);
          }}
        />
      </div>
    );
  }

  // ------------------------------------------
  // VIEW: LIST (Table)
  // ------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A3F2F] flex items-center gap-2">
            Department Reports 
            <span className="text-xs font-normal bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{filteredReports.length}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track submissions across the system.</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          
          {/* Search Input */}
          <div className="relative group flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#16a34a]" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 w-full md:w-48 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none bg-white text-sm appearance-none cursor-pointer hover:border-gray-300"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={() => { setLoading(true); fetchReports(); }}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-[#16a34a] hover:border-[#16a34a] transition-colors"
            title="Refresh Data"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <p>Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-400 text-lg">No reports matching your filters.</p>
            <button 
              onClick={() => {setSearchTerm(""); setStatusFilter("ALL")}}
              className="mt-4 text-[#16a34a] font-semibold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dept</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Stage</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredReports.map((report) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      // ✨ Highlight rows waiting for THIS user's role
                      className={`group transition-colors ${report.currentStage === role ? 'bg-green-50/30' : ''}`}
                    >
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {report.createdByName || 'Unknown'}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {report.department || 'N/A'}
                      </td>
                      <td className="p-4 text-sm text-gray-700 font-medium max-w-xs truncate">
                        {report.title}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 ${report.currentStage === role ? 'text-[#16a34a] bg-green-100' : ''}`}>
                          {report.currentStage || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-gray-400 hover:text-[#16a34a] transition-colors p-2 rounded-full hover:bg-green-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;