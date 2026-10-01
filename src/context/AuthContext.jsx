import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const defaultUser = {
  id: "usr-1",
  name: "Muhammad Ramdan",
  email: "karyawan@trainhub.com",
  role: "karyawan",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  title: "Software Engineer / Lead Frontend",
  department: "IT & Technology"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trainhub_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'pelatihan', 'progress', 'forum', 'profil', 'admin', 'classroom'
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isTestingModalOpen, setIsTestingModalOpen] = useState(false);

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
    addToast('Anda telah logout dari TrainHub.', 'info');
    setActiveTab('login');
  };

  const switchRole = (role) => {
    if (role === 'admin') {
      const adminUser = {
        id: "usr-3",
        name: "Budi Santoso, M.Kom",
        email: "admin@trainhub.com",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        title: "Head of Learning & Corporate Development",
        department: "Human Capital"
      };
      setUser(adminUser);
      addToast('Beralih ke mode Trainer/Admin.', 'info');
      setActiveTab('admin');
    } else {
      setUser(defaultUser);
      addToast('Beralih ke mode Karyawan.', 'info');
      setActiveTab('home');
    }
  };

  const navigateTo = (tab, courseId = null) => {
    setActiveTab(tab);
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      switchRole,
      activeTab,
      setActiveTab,
      navigateTo,
      selectedCourseId,
      setSelectedCourseId,
      globalSearch,
      setGlobalSearch,
      toasts,
      addToast,
      isTestingModalOpen,
      setIsTestingModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
