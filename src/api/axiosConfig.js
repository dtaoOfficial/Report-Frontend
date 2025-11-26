import axios from 'axios';

// ✅ Load backend URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ✅ Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ✅ Attach token immediately on app start (Fixed for Refresh Issue)
// We check sessionStorage immediately so the token is ready before any API call
(() => {
  const token = sessionStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
})();

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    // FIX: Get token from sessionStorage (Specific to this tab only)
    const token = sessionStorage.getItem('token');
    
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
        
        // FIX: Clear only this tab's session
        sessionStorage.clear();
        
        // Optional: Redirect to login if needed, but usually AuthContext handles this
        // window.location.href = '/login'; 
      }

      // 🔁 Retry if 5xx (Server Error) - YOUR OLD LOGIC KEPT SAFE
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