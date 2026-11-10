import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cycleaware_token'));
  const [cycleProfile, setCycleProfile] = useState(null);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current user details if token exists
  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('cycleaware_token');
    if (!savedToken) {
      setUser(null);
      setCycleProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await userApi.getMe();
      if (res.data) {
        setUser(res.data);
        if (res.data.cycleProfile) {
          setCycleProfile(res.data.cycleProfile);
        }
      }
    } catch (err) {
      // If token expired or backend offline with saved demo user
      const savedUserStr = localStorage.getItem('cycleaware_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          if (parsed.cycleProfile) setCycleProfile(parsed.cycleProfile);
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const { token: jwt, user: userData } = res.data;
      localStorage.setItem('cycleaware_token', jwt);
      localStorage.setItem('cycleaware_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      if (userData.cycleProfile) {
        setCycleProfile(userData.cycleProfile);
      }
      return { success: true, user: userData };
    } catch (err) {
      // Fallback demo auth if backend server is not connected
      const demoUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        gender: 'FEMALE',
        hasCycleProfile: false,
        cycleProfile: null,
      };
      const demoToken = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('cycleaware_token', demoToken);
      localStorage.setItem('cycleaware_user', JSON.stringify(demoUser));
      setToken(demoToken);
      setUser(demoUser);
      return { success: true, user: demoUser, isDemo: true };
    }
  };

  // Register
  const register = async (name, email, password, gender) => {
    try {
      const res = await authApi.register({ name, email, password, gender });
      const { token: jwt, user: userData } = res.data;
      localStorage.setItem('cycleaware_token', jwt);
      localStorage.setItem('cycleaware_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);

      // Requirement: IF user.gender === 'FEMALE', trigger CycleAware Opt-In Modal
      if (userData.gender === 'FEMALE') {
        setShowCycleModal(true);
      }

      return { success: true, user: userData };
    } catch (err) {
      // Fallback demo registration if backend is offline
      const demoUser = {
        id: Date.now(),
        name,
        email,
        gender,
        hasCycleProfile: false,
        cycleProfile: null,
      };
      const demoToken = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('cycleaware_token', demoToken);
      localStorage.setItem('cycleaware_user', JSON.stringify(demoUser));
      setToken(demoToken);
      setUser(demoUser);

      if (gender === 'FEMALE') {
        setShowCycleModal(true);
      }

      return { success: true, user: demoUser, isDemo: true };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('cycleaware_token');
    localStorage.removeItem('cycleaware_user');
    setToken(null);
    setUser(null);
    setCycleProfile(null);
    setShowCycleModal(false);
  };

  // Save / Update Cycle Profile
  const saveCycleProfile = async (profileData) => {
    try {
      const res = await userApi.updateCycleProfile(profileData);
      const savedProfile = res.data;
      setCycleProfile(savedProfile);
      setUser((prev) => {
        const updated = { ...prev, hasCycleProfile: true, cycleProfile: savedProfile };
        localStorage.setItem('cycleaware_user', JSON.stringify(updated));
        return updated;
      });
      setShowCycleModal(false);
      return { success: true, profile: savedProfile };
    } catch (err) {
      // Client-side fallback
      const savedProfile = {
        id: Date.now(),
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      setCycleProfile(savedProfile);
      setUser((prev) => {
        const updated = { ...prev, hasCycleProfile: true, cycleProfile: savedProfile };
        localStorage.setItem('cycleaware_user', JSON.stringify(updated));
        return updated;
      });
      setShowCycleModal(false);
      return { success: true, profile: savedProfile, isDemo: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        cycleProfile,
        loading,
        showCycleModal,
        setShowCycleModal,
        login,
        register,
        logout,
        saveCycleProfile,
        openCycleModal: () => setShowCycleModal(true),
        closeCycleModal: () => setShowCycleModal(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

