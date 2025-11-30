import api from './axiosConfig';

// ✅ Create new report (User)
export const createReport = async (data) => {
  return await api.post('/reports/create', null, { params: data });
};

// ✅ Fetch logged-in user’s reports
export const getMyReports = async () => {
  return await api.get('/reports/my-reports');
};

// ✅ Fetch reports by stage (for dashboards: system, principal, etc.)
export const getReportsByStage = async (stage) => {
  return await api.get(`/reports/${stage}`);
};

// ✅ Fetch all reports (for admin or overview dashboards)
export const getAllReports = async () => {
  return await api.get('/reports/all');
};

// ✅ Forward to next stage
export const forwardReport = async (id, nextStage, comments) => {
  return await api.put(`/reports/${id}/forward`, null, {
    params: { nextStage, comments },
  });
};

// ✅ Approve report (Principal)
export const approveReport = async (id, comments) => {
  return await api.put(`/reports/${id}/approve`, null, {
    params: { comments },
  });
};

// ✅ Reject report (Principal/System)
export const rejectReport = async (id, reason) => {
  return await api.put(`/reports/${id}/reject`, null, {
    params: { reason },
  });
};

// ✅ NEW: System marks report as completed (Close Report)
export const closeReport = async (id, solvedNotes) => {
  return await api.post(`/reports/${id}/close`, { solvedNotes });
};

// ✅ NEW: Fetch all completed reports
export const getCompletedReports = async () => {
  return await api.get('/reports/completed');
};

// ✅ Get single report by id
export const getReportById = async (id) => {
  return await api.get(`/reports/${id}`);
};
