import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, CheckCircle, Edit3, Save, Download, Camera, X } from 'lucide-react';
import { api } from '../services/api';
import { CertificateModal } from '../components/CertificateModal';

export const ProfilePage = () => {
  const { user, setUser, addToast, navigateTo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user ? user.name : '');
  const [title, setTitle] = useState(user ? user.title : '');
  const [bio, setBio] = useState(user ? user.bio : '');
  const [avatarDraft, setAvatarDraft] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef(null);
  const [myProgress, setMyProgress] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    loadMyTrainings();
  }, []);

  const loadMyTrainings = async () => {
    try {
      const res = await api.getMyTrainings();
      if (res.success) {
        setMyProgress(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateProfile({ name, title, bio, avatar: avatarDraft });
      if (res.success) {
        setUser(res.data);
        addToast("Profil berhasil diperbarui!", "success");
        setIsEditing(false);
      } else {
        addToast(res.message || 'Gagal memperbarui profil.', 'error');
      }
    } catch (err) {
      addToast(err.message || "Gagal memperbarui profil.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setTitle(user?.title || '');
    setBio(user?.bio || '');
    setAvatarDraft(user?.avatar || '');
    if (avatarInputRef.current) avatarInputRef.current.value = '';
    setIsEditing(false);
  };

  const handleAvatarSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Pilih foto JPG, JPEG, PNG, atau WEBP.', 'error');
      event.target.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      addToast('Ukuran foto maksimal 1 MB.', 'error');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarDraft(String(reader.result));
    reader.onerror = () => addToast('Foto gagal dibaca. Silakan pilih file lain.', 'error');
    reader.readAsDataURL(file);
  };

  return (
    <div className="main-content">
      {/* Profile Header Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="profile-avatar-wrap">
              <img
                src={isEditing ? (avatarDraft || user.avatar) : user.avatar}
                alt={user.name}
                style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-soft)' }}
              />
              {isEditing && (
                <div className="profile-avatar-actions">
                  <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={handleAvatarSelected} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => avatarInputRef.current?.click()}><Camera size={14} /> Ubah Foto</button>
                  {avatarDraft && <button type="button" className="profile-avatar-remove" onClick={() => { setAvatarDraft(''); if (avatarInputRef.current) avatarInputRef.current.value = ''; }}><X size={13} /> Hapus Foto</button>}
                </div>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '4px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{user.name}</h1>
                <span className="badge badge-in_progress">{user.role.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {user.title || 'Karyawan Enterprise'} — Divisi {user.department || 'IT'}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '540px' }}>
                {user.bio || 'Tidak ada biodata.'}
              </p>
            </div>
          </div>

          <button 
            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
          >
            <Edit3 size={14} />
            <span>{isEditing ? 'Batal Edit' : 'Edit Profil'}</span>
          </button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Nama Lengkap:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jabatan / Spasialisasi:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tentang Saya / Bio:</label>
              <textarea 
                className="form-textarea" 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving}>
              <Save size={14} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
            </button>
          </form>
        )}
      </div>

      {/* Grid: Badges & Certificates */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Achievements Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Pencapaian & Badge Saya</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>Fast Learner Badge</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Menyelesaikan 3 modul materi dalam 1 hari</div>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>Top Scorer Kuis</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mendapatkan nilai sempurna 100 pada kuis data science</div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
            <CheckCircle size={20} color="#2563eb" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Sertifikat Kelulusan Resmi</h3>
          </div>

          {myProgress && myProgress.courses.filter(c => c.progressPercent === 100).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myProgress.courses.filter(c => c.progressPercent === 100).map(c => (
                <div key={c.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#15803d' }}>{c.title}</div>
                    <div style={{ fontSize: '11px', color: '#166534' }}>Status: Lulus (Progress 100%)</div>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedCert({ userName: user.name, courseTitle: c.title })}
                  >
                    <Download size={13} /> Lihat Sertifikat
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Selesaikan 100% materi salah satu kelas untuk membuka sertifikat Anda.
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
};
