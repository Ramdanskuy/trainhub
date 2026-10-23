import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Key, Mail } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="TrainHub - level up your potential" style={{ width: 176, height: 176, objectFit: 'contain', marginBottom: '12px' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Portal Pelatihan Karyawan Enterprise</p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>Masuk ke Akun Anda</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="account-email">Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <input id="account-email" type="email" className="form-input" style={{ paddingLeft: 36 }} value={email} onChange={event => setEmail(event.target.value)} placeholder="nama@perusahaan.com" autoComplete="email" required />
                <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="account-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="account-password" type="password" className="form-input" style={{ paddingLeft: 36 }} value={password} onChange={event => setPassword(event.target.value)} placeholder="Password akun" autoComplete="current-password" required />
                <Key size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 11, marginTop: 8 }} disabled={loading}>
              <span>{loading ? 'Memproses...' : 'Masuk'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
