import api from './axiosConfig';

// ✅ Create new report (User)
export const createReport = async (data) => {
  return await api.post('/reports/create', null, { params: data });
};

// ✅ Fetch logged-in user’s reports
export const getMyReports = async () => {
  return await api.get('/reports/my-reports');
};

// ✅ Fetch reports by stage (for dashboards)
export const getReportsByStage = async (stage) => {
  return await api.get(`/reports/${stage}`);
};

// ✅ Fetch all reports (for all dashboards - latest first)
export const getAllReports = async () => {
  return await api.get('/reports/all');
};

// ✅ Forward to next stage
export const forwardReport = async (id, nextStage, comments) => {
  return await api.put(`/reports/${id}/forward`, null, { params: { nextStage, comments } });
};

// ✅ Approve report
export const approveReport = async (id, comments) => {
  return await api.put(`/reports/${id}/approve`, null, { params: { comments } });
};

// ✅ Reject report
export const rejectReport = async (id, reason) => {
  return await api.put(`/reports/${id}/reject`, null, { params: { reason } });
};

// ✅ Complete report (Resources)
export const completeReport = async (id, available, comments) => {
  return await api.put(`/reports/${id}/complete`, null, { params: { available, comments } });
};

// ✅ Get single report by id
export const getReportById = async (id) => {
  return await api.get(`/reports/${id}`);
};
