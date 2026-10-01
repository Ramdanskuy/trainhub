import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Home, 
  Compass, 
  BarChart2, 
  MessageSquare, 
  Search, 
  FlaskConical, 
  User, 
  Shield, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    user, 
    activeTab, 
    navigateTo, 
    logout, 
    switchRole, 
    globalSearch, 
    setGlobalSearch,
    setIsTestingModalOpen 
  } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user || activeTab === 'login') return null;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => navigateTo('home')}>
          <div className="brand-icon">
            <BookOpen size={20} />
          </div>
          <span>TrainHub</span>
        </div>

        {/* Global Navigation Items */}
        <nav>
          <ul className="nav-links">
            <li 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              <Home size={16} />
              <span>Home</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'pelatihan' ? 'active' : ''}`}
              onClick={() => navigateTo('pelatihan')}
            >
              <Compass size={16} />
              <span>Pelatihan</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => navigateTo('progress')}
            >
              <BarChart2 size={16} />
              <span>Progress</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'forum' ? 'active' : ''}`}
              onClick={() => navigateTo('forum')}
            >
              <MessageSquare size={16} />
              <span>Forum Diskusi</span>
            </li>
            {user.role === 'admin' && (
              <li 
                className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => navigateTo('admin')}
                style={{ color: '#0284c7', backgroundColor: '#e0f2fe' }}
              >
                <Shield size={16} />
                <span>Kelola Admin</span>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Utility Section */}
        <div className="nav-right">
          {/* Global Search Box */}
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari pelatihan..." 
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (activeTab !== 'pelatihan') navigateTo('pelatihan');
              }}
            />
          </div>

          {/* Enrollment & Feature Testing Suite Button */}
          <button 
            className="btn-testing"
            onClick={() => setIsTestingModalOpen(true)}
            title="Buka Menu Pengujian Enrollment & Fitur"
          >
            <FlaskConical size={14} />
            <span>Testing Suite</span>
          </button>

          {/* User Avatar Menu */}
          <div className="avatar-menu">
            <button className="avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={user.avatar} alt={user.name} className="avatar-img" />
              <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu" onClick={() => setDropdownOpen(false)}>
                <div className="dropdown-header">
                  <div className="dropdown-name">{user.name}</div>
                  <div className="dropdown-role">{user.role === 'admin' ? 'Trainer / Admin' : 'Karyawan'}</div>
                </div>

                <div className="dropdown-item" onClick={() => navigateTo('profil')}>
                  <User size={15} />
                  <span>Lihat Profil Saya</span>
                </div>

                <div className="dropdown-item" onClick={() => switchRole(user.role === 'admin' ? 'karyawan' : 'admin')}>
                  <Shield size={15} />
                  <span>Beralih ke Mode {user.role === 'admin' ? 'Karyawan' : 'Admin'}</span>
                </div>

                <div className="dropdown-item danger" onClick={logout}>
                  <LogOut size={15} />
                  <span>Keluar / Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
