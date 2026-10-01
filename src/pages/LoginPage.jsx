import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Shield, Key, ArrowRight, FlaskConical } from 'lucide-react';

export const LoginPage = () => {
  const { login, navigateTo, setIsTestingModalOpen } = useAuth();
  const [email, setEmail] = useState('karyawan@trainhub.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  const handleQuickLogin = async (quickEmail, quickRole) => {
    setLoading(true);
    setEmail(quickEmail);
    setPassword('password123');
    await login(quickEmail, 'password123');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: 'var(--shadow-md)' }}>
            <BookOpen size={26} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>TrainHub</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Portal Pelatihan Karyawan Enterprise</p>
        </div>

        {/* Card Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>Masuk ke Akun Anda</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Alamat Email:</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@trainhub.com"
                  required
                />
                <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password:</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Key size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '11px', marginTop: '8px' }}
              disabled={loading}
            >
              <span>{loading ? 'Memproses...' : 'Masuk / Login'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Login Testing Presets */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
              Quick Presets Login & Testing
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-soft btn-sm"
                onClick={() => handleQuickLogin('karyawan@trainhub.com', 'karyawan')}
              >
                <User size={14} /> Demo Karyawan
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('admin@trainhub.com', 'admin')}
                style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}
              >
                <Shield size={14} /> Demo Admin
              </button>
            </div>

            <button 
              type="button" 
              className="btn-testing" 
              style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
              onClick={() => setIsTestingModalOpen(true)}
            >
              <FlaskConical size={14} />
              <span>Buka Interactive Enrollment Testing Suite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
