import { useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

/**
 * useAxiosInterceptor Hook
 * Handles:
 * - Adding Authorization headers
 * - Token refresh flow
 * - Redirect on unauthorized (401/403)
 */
const useAxiosInterceptor = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // 🧠 Request Interceptor — attach token
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 🔁 Response Interceptor — handle auth errors
    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (!error.response) return Promise.reject(error);

        const { status } = error.response;

        // 🔄 Attempt token refresh if expired
        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await api.post('/auth/refresh');
            const newToken = refreshResponse?.data?.token;
            if (newToken) {
              localStorage.setItem('token', newToken);
              api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.warn('⚠️ Token refresh failed, logging out...');
            await logout();
            window.location.href = '/login';
          }
        }

        if (status === 403) {
          console.warn('🚫 Access forbidden. Redirecting to dashboard.');
          window.location.href = '/';
        }

        return Promise.reject(error);
      }
    );

    // 🧹 Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [logout]);
};

export default useAxiosInterceptor;
