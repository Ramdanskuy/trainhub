import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, RefreshCw, UserCheck, Shield, CheckCircle, Trash2, Zap, Database, Server } from 'lucide-react';
import { api } from '../services/api';

export const EnrollmentTestingModal = () => {
  const { 
    user, 
    switchRole, 
    addToast, 
    isTestingModalOpen, 
    setIsTestingModalOpen,
    navigateTo 
  } = useAuth();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState('online');

  useEffect(() => {
    if (isTestingModalOpen) {
      loadCourses();
    }
  }, [isTestingModalOpen]);

  const loadCourses = async () => {
    try {
      const res = await api.getTrainings();
      if (res.success) {
        setCourses(res.data);
        if (res.data.length > 0) setSelectedCourseId(res.data[0].id);
      }
    } catch (err) {
      setHealthStatus('offline');
    }
  };

  const handleEnrollTest = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const res = await api.enroll(selectedCourseId);
      addToast(res.message, res.success ? 'success' : 'info');
      await loadCourses();
    } catch (err) {
      addToast("Gagal memproses enrollment.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnenrollTest = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const res = await api.unenroll(selectedCourseId);
      addToast(res.message, 'success');
      await loadCourses();
    } catch (err) {
      addToast("Gagal membatalkan enrollment.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCompleteTest = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const res = await api.autoCompleteCourse(selectedCourseId);
      if (res.success) {
        addToast("Semua materi pada kelas ini berhasil diselesaikan (Auto 100%)!", "success");
        await loadCourses();
      }
    } catch (err) {
      addToast("Gagal memproses auto-complete.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedReset = async () => {
    setLoading(true);
    try {
      const res = await api.seedDatabase();
      addToast(res.message, 'success');
      await loadCourses();
    } catch (err) {
      addToast("Gagal me-reset database seed.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isTestingModalOpen) return null;

  const activeCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="modal-overlay" onClick={() => setIsTestingModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header" style={{ backgroundColor: '#fffbeb', borderBottomColor: '#fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
            <div>
              <div className="modal-title" style={{ color: '#78350f' }}>TrainHub Enrollment & System Testing Suite</div>
              <div style={{ fontSize: '12px', color: '#92400e' }}>Fitur Pengujian Pengenalan Modul, Role & Database</div>
            </div>
          </div>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e' }}
            onClick={() => setIsTestingModalOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Section 1: Role Switcher */}
          <div style={{ marginBottom: '20px', padding: '14px', borderRadius: '10px', backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={16} /> Mode Pengguna Aktif
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name} ({user.role.toUpperCase()})</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className={`btn btn-sm ${user.role === 'karyawan' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => switchRole('karyawan')}
                >
                  <UserCheck size={13} /> Karyawan
                </button>
                <button 
                  className={`btn btn-sm ${user.role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => switchRole('admin')}
                >
                  <Shield size={13} /> Admin/Trainer
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Course Enrollment Testing */}
          <div style={{ marginBottom: '20px', padding: '14px', borderRadius: '10px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={16} color="var(--primary)" /> Interactive Enrollment Testing
            </div>

            <div className="form-group">
              <label className="form-label">Pilih Pelatihan untuk Diuji:</label>
              <select 
                className="form-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} — [{c.isEnrolled ? `Enrolled (${c.progressPercent}%)` : 'Belum Enrolled'}]
                  </option>
                ))}
              </select>
            </div>

            {activeCourse && (
              <div style={{ fontSize: '12px', padding: '10px', backgroundColor: 'var(--background)', borderRadius: '6px', marginBottom: '14px' }}>
                <div><strong>Status Enrollment:</strong> {activeCourse.isEnrolled ? `Terdaftar (${activeCourse.progressPercent}% Selesai)` : 'Belum Terdaftar'}</div>
                <div><strong>Total Materi:</strong> {activeCourse.totalMaterials} Materi</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleEnrollTest}
                disabled={loading}
              >
                <CheckCircle size={14} /> Enroll Pelatihan
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleUnenrollTest}
                disabled={loading}
              >
                <Trash2 size={14} /> Un-enroll (Hapus Enrollment)
              </button>

              <button 
                className="btn btn-soft btn-sm"
                onClick={handleAutoCompleteTest}
                disabled={loading}
              >
                <Zap size={14} /> Auto Complete (Selesaikan 100%)
              </button>

              {activeCourse && activeCourse.isEnrolled && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setIsTestingModalOpen(false);
                    navigateTo('classroom', activeCourse.id);
                  }}
                >
                  Buka Halaman Kelas
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Database Reseed */}
          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Database size={16} /> Reset State & Data Testing
            </div>
            <p style={{ fontSize: '12px', color: '#7f1d1d', marginBottom: '10px' }}>
              Kembalikan database backend ke data seed asli (Menghapus submission testing baru & mereset progres).
            </p>
            <button 
              className="btn btn-danger btn-sm"
              onClick={handleSeedReset}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Reset Seed Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginRight: 'auto' }}>
            <Server size={14} color="var(--primary)" /> API Status: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Connected (Express Server :5000)</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsTestingModalOpen(false)}>
            Tutup Testing Suite
          </button>
        </div>
      </div>
    </div>
  );
};
