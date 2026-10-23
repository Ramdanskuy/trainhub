import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const readSavedSessionUser = () => {
  const savedUser = localStorage.getItem('trainhub_user');
  const savedToken = localStorage.getItem('trainhub_session_token');
  const tokenParts = savedToken?.split(':') || [];
  const expiresAt = Number(tokenParts[1]);
  if (!savedUser || tokenParts.length !== 3 || !/^[a-f0-9]{64}$/i.test(tokenParts[2]) || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    localStorage.removeItem('trainhub_user');
    localStorage.removeItem('trainhub_session_token');
    return null;
  }
  return JSON.parse(savedUser);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSavedSessionUser);

  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = readSavedSessionUser();
    if (!savedUser) return 'login';
    return savedUser.role === 'admin' ? 'admin' : 'home';
  });
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [notificationTarget, setNotificationTarget] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('trainhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trainhub_user');
    }
  }, [user]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success) {
        localStorage.setItem('trainhub_session_token', res.data.token);
        setUser(res.data.user);
        addToast(res.message, 'success');
        setActiveTab(res.data.user.role === 'admin' ? 'admin' : 'home');
        return { success: true };
      } else {
        addToast(res.message, 'error');
        return { success: false, message: res.message };
      }
    } catch (err) {
      addToast('Gagal terhubung ke server backend.', 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trainhub_session_token');
    addToast('Anda telah logout dari TrainHub.', 'info');
    setActiveTab('login');
  };

  const navigateTo = (tab, courseId = null) => {
    setNotificationTarget(null);
    setActiveTab(tab);
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openNotification = (notification) => {
    setNotificationTarget(notification);
    if (notification.trainingId) setSelectedCourseId(notification.trainingId);
    const destination = {
      grade: 'detail',
      discussion: 'forum',
      deadline: 'classroom'
    }[notification.type] || 'detail';
    setActiveTab(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      activeTab,
      setActiveTab,
      navigateTo,
      notificationTarget,
      openNotification,
      selectedCourseId,
      setSelectedCourseId,
      globalSearch,
      setGlobalSearch,
      toasts,
      addToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
