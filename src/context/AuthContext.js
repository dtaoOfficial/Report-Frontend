import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import companyLoader from '../assets/companyLoader.webm'; // ✅ Moved inside src/assets/

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Check Auth Status (On Load)
  useEffect(() => {
    const checkAuth = async () => {
      try {
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
    };
    checkAuth();
  }, []);

  // ✅ Login Function
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        const token = response.data.token;
        if (token) localStorage.setItem('token', token);

        const profile = await api.get('/user/profile');
        const profileData = profile.data.data || {};
        profileData.roles = profileData.roles || [];
        setUser(profileData);
        return profile.data;
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  // ✅ Logout Function
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  // ✅ Token Refresh (if supported by backend)
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('🔄 Token refreshed successfully');
      }
    } catch (error) {
      console.warn('⚠️ Token refresh failed, logging out...');
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, logout]);

  // ✅ Periodic refresh every 10 minutes (with ESLint-safe dependency)
  useEffect(() => {
    const interval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* ⏳ Optional Loader Display */}
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
