import axios from 'axios';

// ✅ Load backend URL from environment for flexibility
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ✅ Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // ⏱ 15s safety timeout for slow servers
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Token attach if stored in localStorage
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Optional debug logging
    // console.log(`[API REQUEST] ${config.method?.toUpperCase()} → ${config.url}`);
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
        console.warn('⚠️ Unauthorized or Forbidden! Redirecting to login...');
        // localStorage.clear();
        // window.location.href = '/login'; // optional
      }

      // 🔁 Simple retry mechanism for network errors
      if (!error.config.__isRetryRequest && status >= 500) {
        console.log('🔁 Retrying request due to server error...');
        error.config.__isRetryRequest = true;
        return api(error.config);
      }

      // 🧩 Centralized error logging
      console.error(
        `[API ERROR] ${status}: ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      console.error('🚫 No response from server. Network or CORS issue.');
    } else {
      console.error('❌ Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
