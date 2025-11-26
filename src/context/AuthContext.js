import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import companyLoader from '../assets/companyLoader.webm';

// ✅ Always send cookies if needed (cross-origin safe)
api.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check Authentication (Runs once on page load/refresh)
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // FIX: Look in this tab's specific storage (sessionStorage)
      // We use generic names 'token' and 'user' because this storage is private to the tab
      const token = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 1. Optimistic Update: Load user immediately so UI doesn't flicker
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // 2. Set Token Header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 3. Verify with Backend (Security Check)
      const response = await api.get('/user/profile');
      
      if (response.data.success) {
        const profileData = response.data.data || {};
        setUser(profileData);
        // Update storage with freshest data
        sessionStorage.setItem('user', JSON.stringify(profileData));
      } else {
        // If API says success: false, the token is probably invalid
        throw new Error('Session invalid');
      }
    } catch (error) {
      console.warn('⚠️ Auth check failed (Token likely expired):', error.message);
      // Clean up invalid session
      sessionStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Login Function
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { success, data } = response.data || {};

      if (success && data?.token) {
        // FIX: Save to SessionStorage (Tab Specific)
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Update Axios Global Header
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

  // ✅ Logout Function
  const logout = useCallback(async () => {
    try {
      // Optional: Tell backend to blacklist token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // FIX: Clear only this tab's storage
      sessionStorage.clear();
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      // Note: We let the UI (Navbar/Pages) handle the redirect to Login
    }
  }, []);

  // ⏰ Auto-refresh every 10 minutes (Updated for SessionStorage)
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const response = await api.post('/auth/refresh');
        if (response.data.success && response.data.token) {
          sessionStorage.setItem('token', response.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          console.log('🔄 Token refreshed successfully');
        }
      } catch (error) {
        console.warn('⚠️ Auto-refresh failed, session might expire soon.');
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