import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import companyLoader from '../assets/companyLoader.webm';

api.defaults.withCredentials = true; // ✅ Always send cookies if needed (cross-origin safe)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🧠 Detect current role from URL path
  const getCurrentRole = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/system')) return 'SYSTEM';
    if (path.includes('/principal')) return 'PRINCIPAL';
    if (path.includes('/dean')) return 'DEAN';
    if (path.includes('/resources')) return 'RESOURCES';
    if (path.includes('/admin')) return 'ADMIN';
    return 'USER';
  };

  // ✅ Restore token immediately on mount (for deep links or refresh)
  useEffect(() => {
    const role = getCurrentRole();
    const storedToken = localStorage.getItem(`${role}_token`);
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // ✅ Check Authentication (runs once on load)
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const role = getCurrentRole();
      const token = localStorage.getItem(`${role}_token`);
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/user/profile');
      if (response.data.success) {
        const profileData = response.data.data || {};
        profileData.roles = profileData.roles || [];
        setUser(profileData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('⚠️ Auth check failed:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Login per-role (matches backend AuthController)
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { success, data } = response.data || {};

      if (success && data?.token && data?.role) {
        const role = data.role.replace('ROLE_', '');

        // 🧩 Save role-specific token and user
        localStorage.setItem(`${role}_token`, data.token);
        localStorage.setItem(`${role}_user`, JSON.stringify(data.user));

        // 🔐 Attach new token globally
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        setUser(data.user);
        return { success: true, role };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  // ✅ Logout per-role (doesn’t affect other roles)
  const logout = useCallback(async () => {
    try {
      const role = getCurrentRole();
      await api.post('/auth/logout');
      localStorage.removeItem(`${role}_token`);
      localStorage.removeItem(`${role}_user`);
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  }, []);

  // ✅ Optional: Token Refresh (if backend supports /auth/refresh)
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const role = getCurrentRole();
      const token = localStorage.getItem(`${role}_token`);
      if (!token) return;

      const response = await api.post('/auth/refresh');
      if (response.data.success && response.data.token) {
        localStorage.setItem(`${role}_token`, response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log(`🔄 Token refreshed successfully for ${role}`);
      }
    } catch (error) {
      console.warn('⚠️ Token refresh failed — logging out');
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, logout]);

  // ⏰ Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken]);

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
