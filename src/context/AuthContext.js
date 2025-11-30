import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import companyLoader from '../assets/companyLoader.webm';

api.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check authentication on app load
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Optimistic user load
      if (storedUser) setUser(JSON.parse(storedUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/user/profile');

      if (response.data.success) {
        const profile = response.data.data || {};
        setUser(profile);
        sessionStorage.setItem('user', JSON.stringify(profile));
      } else {
        throw new Error('Session invalid');
      }
    } catch (error) {
      console.warn('⚠️ Auth check failed:', error.message);
      sessionStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Login
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { success, data } = response.data || {};

      if (success && data?.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        return { success: true, role: data.role };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  // ✅ Logout
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionStorage.clear();
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, []);

  // ✅ Auto-refresh token every 10 min — uses same login endpoint if needed
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        // Instead of /auth/refresh, we verify validity via profile
        const response = await api.get('/user/profile');
        if (!response.data.success) {
          throw new Error('Invalid session');
        }

        console.log('✅ Token still valid, session active');
      } catch (error) {
        console.warn('⚠️ Token expired, clearing session.');
        sessionStorage.clear();
        setUser(null);
      }
    };

    const interval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <video
            src={companyLoader}
            autoPlay
            loop
            muted
            playsInline
            className="w-40 h-40 object-contain"
          />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
