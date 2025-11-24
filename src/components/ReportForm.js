import React, { useState } from 'react';
import { createReport } from '../api/reportApi';
import { toast } from 'react-toastify';

const ReportForm = ({ onReportAdded }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReport(form);
      toast.success('Report submitted successfully!');
      setForm({ title: '', description: '', location: '' });
      onReportAdded();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Create New Report</h2>

      <input
        type="text"
        name="title"
        placeholder="Enter report title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full border rounded p-3 focus:ring-2 focus:ring-green-500"
      />

      <textarea
        name="description"
        placeholder="Describe the issue..."
        value={form.description}
        onChange={handleChange}
        required
        rows="4"
        className="w-full border rounded p-3 focus:ring-2 focus:ring-green-500"
      />

      <input
        type="text"
        name="location"
        placeholder="Enter location"
        value={form.location}
        onChange={handleChange}
        required
        className="w-full border rounded p-3 focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default ReportForm;
