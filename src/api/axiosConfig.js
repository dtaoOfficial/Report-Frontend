import axios from 'axios';

// ✅ Load backend URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ✅ Detect role from URL path
const getCurrentRole = () => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/system')) return 'SYSTEM';
  if (path.includes('/principal')) return 'PRINCIPAL';
  if (path.includes('/dean')) return 'DEAN';
  if (path.includes('/resources')) return 'RESOURCES';
  if (path.includes('/admin')) return 'ADMIN';
  return 'USER';
};

// ✅ Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ✅ Attach token immediately on app start (critical for refresh)
(() => {
  const role = getCurrentRole();
  const token = localStorage.getItem(`${role}_token`);
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
})();

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const role = getCurrentRole();
    const token = localStorage.getItem(`${role}_token`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      // 🔐 Handle unauthorized globally
      if (status === 401 || status === 403) {
        console.warn('⚠️ Unauthorized! Token expired or invalid');
        const role = getCurrentRole();
        localStorage.removeItem(`${role}_token`);
        localStorage.removeItem(`${role}_user`);
      }

      // 🔁 Retry if 5xx
      if (!error.config.__isRetryRequest && status >= 500) {
        console.log('🔁 Retrying due to server error...');
        error.config.__isRetryRequest = true;
        return api(error.config);
      }

      console.error(
        `[API ERROR] ${status}: ${
          error.response.data?.message || 'Unknown error'
        }`
      );
    } else if (error.request) {
      console.error('🚫 No response from server — possible CORS issue');
    } else {
      console.error('❌ Axios setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
