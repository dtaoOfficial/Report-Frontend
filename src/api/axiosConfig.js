import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ✅ Attach token on startup
(() => {
  const token = sessionStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
})();

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else delete config.headers.Authorization;
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

      if (status === 401 || status === 403) {
        console.warn('⚠️ Unauthorized or expired token, clearing session...');
        sessionStorage.clear();
      }

      if (!error.config.__isRetryRequest && status >= 500) {
        console.log('🔁 Retrying due to server error...');
        error.config.__isRetryRequest = true;
        return api(error.config);
      }

      console.error(`[API ERROR] ${status}: ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('🚫 No response from server — possible CORS issue');
    } else {
      console.error('❌ Axios setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
