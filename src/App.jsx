import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { EnrollmentTestingModal } from './components/EnrollmentTestingModal';

import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ClassroomPage } from './pages/ClassroomPage';
import { ProgressPage } from './pages/ProgressPage';
import { ForumPage } from './pages/ForumPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppRoutes = () => {
  const { user, activeTab } = useAuth();

  if (!user || activeTab === 'login') {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Navbar />
      
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'pelatihan' && <CatalogPage />}
      {activeTab === 'detail' && <CourseDetailPage />}
      {activeTab === 'classroom' && <ClassroomPage />}
      {activeTab === 'progress' && <ProgressPage />}
      {activeTab === 'forum' && <ForumPage />}
      {activeTab === 'profil' && <ProfilePage />}
      {activeTab === 'admin' && <AdminDashboardPage />}

      <Toast />
      <EnrollmentTestingModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
