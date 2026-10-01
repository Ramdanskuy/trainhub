import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  FileText, 
  Video, 
  HelpCircle, 
  CheckSquare, 
  UserCheck, 
  Award,
  Layers,
  X
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage = () => {
  const { addToast } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('courses'); // 'courses', 'submissions', 'curriculum'
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Course Form Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Data Science',
    level: 'Beginner',
    mentor: 'Budi Santoso, M.Kom',
    duration: '6 Jam',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    skills: 'Python, Data Analytics, Visualization'
  });

  // Material Builder Modal State
  const [selectedCourseForContent, setSelectedCourseForContent] = useState(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [materialType, setMaterialType] = useState('article');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialContent, setMaterialContent] = useState('');

  // Submission Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [scoreInput, setScoreInput] = useState(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [trnRes, subRes] = await Promise.all([
        api.getTrainings({ includeArchived: true }),
        api.getAllSubmissions()
      ]);
      if (trnRes.success) setCourses(trnRes.data);
      if (subRes.success) setSubmissions(subRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        const res = await api.updateTraining(editingCourseId, courseForm);
        if (res.success) addToast("Pelatihan berhasil diperbarui!", "success");
      } else {
        const res = await api.createTraining(courseForm);
        if (res.success) addToast("Pelatihan baru berhasil dibuat!", "success");
      }
      setIsCourseModalOpen(false);
      await loadAdminData();
    } catch (err) {
      addToast("Gagal menyimpan pelatihan.", "error");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin mengarsipkan pelatihan ini?")) return;
    try {
      const res = await api.deleteTraining(id);
      if (res.success) {
        addToast("Pelatihan telah diarsipkan.", "info");
        await loadAdminData();
      }
    } catch (err) {
      addToast("Gagal mengarsipkan pelatihan.", "error");
    }
  };

  const handleAddModule = async () => {
    if (!selectedCourseForContent) return;
    const title = window.prompt("Masukkan Judul Modul Baru:");
    if (!title) return;

    try {
      const res = await api.addModule(selectedCourseForContent.id, title);
      if (res.success) {
        addToast("Modul berhasil ditambahkan!", "success");
        // Reload detail
        const detail = await api.getTrainingDetail(selectedCourseForContent.id);
        if (detail.success) setSelectedCourseForContent(detail.data);
      }
    } catch (err) {
      addToast("Gagal menambahkan modul.", "error");
    }
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!selectedModuleId || !materialTitle) return;

    try {
      const res = await api.addMaterial(selectedModuleId, {
        title: materialTitle,
        type: materialType,
        content: materialType === 'article' ? `<h1>${materialTitle}</h1><p>${materialContent}</p>` : materialContent,
        fileUrl: materialType === 'pdf' ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : '',
        videoUrl: materialType === 'video' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : ''
      });

      if (res.success) {
        addToast("Materi baru berhasil ditambahkan!", "success");
        setIsMaterialModalOpen(false);
        setMaterialTitle('');
        setMaterialContent('');
        const detail = await api.getTrainingDetail(selectedCourseForContent.id);
        if (detail.success) setSelectedCourseForContent(detail.data);
      }
    } catch (err) {
      addToast("Gagal menambah materi.", "error");
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      const res = await api.evaluateSubmission(gradingSubmission.id, scoreInput, feedbackInput);
      if (res.success) {
        addToast("Nilai dan feedback evaluasi berhasil disimpan!", "success");
        setGradingSubmission(null);
        await loadAdminData();
      }
    } catch (err) {
      addToast("Gagal menyimpan nilai evaluasi.", "error");
    }
  };

  return (
    <div className="main-content">
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '4px' }}>
            <Shield size={24} color="#0369a1" />
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Panel Kontrol Admin & Trainer
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Kelola katalog pelatihan internal, kurikulum modul, materi artikel/PDF/video, kuis, serta penilaian tugas karyawan.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingCourseId(null);
            setCourseForm({
              title: '',
              description: '',
              category: 'Data Science',
              level: 'Beginner',
              mentor: 'Budi Santoso, M.Kom',
              duration: '6 Jam',
              coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
              skills: 'Modern Web, React, Node.js'
            });
            setIsCourseModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Tambah Pelatihan Baru</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="card" style={{ padding: 0, marginBottom: '24px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0 16px', gap: 6 }}>
          <button 
            className={`nav-item ${activeAdminTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('courses')}
            style={{ borderRadius: 0, borderBottom: activeAdminTab === 'courses' ? '3px solid var(--primary)' : 'none' }}
          >
            <Layers size={16} /> Kelola Pelatihan ({courses.length})
          </button>
          <button 
            className={`nav-item ${activeAdminTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('submissions')}
            style={{ borderRadius: 0, borderBottom: activeAdminTab === 'submissions' ? '3px solid var(--primary)' : 'none' }}
          >
            <CheckSquare size={16} /> Evaluasi Submission Tugas ({submissions.length})
          </button>
        </div>

        {/* TAB 1: KELOLA PELATIHAN */}
        {activeAdminTab === 'courses' && (
          <div style={{ padding: '20px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--background)', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px' }}>Pelatihan</th>
                    <th style={{ padding: '12px' }}>Kategori & Level</th>
                    <th style={{ padding: '12px' }}>Mentor</th>
                    <th style={{ padding: '12px' }}>Peserta</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={c.coverUrl} alt={c.title} style={{ width: 48, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                          <span>{c.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{c.category}</div>
                        <span className="badge badge-beginner">{c.level}</span>
                      </td>
                      <td style={{ padding: '12px' }}>{c.mentor}</td>
                      <td style={{ padding: '12px' }}>{c.participantsCount || 12} Karyawan</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${c.status === 'published' ? 'badge-in_progress' : 'badge-warning'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={async () => {
                              const detail = await api.getTrainingDetail(c.id);
                              if (detail.success) setSelectedCourseForContent(detail.data);
                            }}
                          >
                            Kelola Modul
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditingCourseId(c.id);
                              setCourseForm({
                                title: c.title,
                                description: c.description,
                                category: c.category,
                                level: c.level,
                                mentor: c.mentor,
                                duration: c.duration,
                                coverUrl: c.coverUrl,
                                skills: Array.isArray(c.skills) ? c.skills.join(', ') : c.skills
                              });
                              setIsCourseModalOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteCourse(c.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Curriculum Builder Details Drawer */}
            {selectedCourseForContent && (
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '2px solid var(--primary-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                    Builder Kurikulum: {selectedCourseForContent.title}
                  </h3>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={handleAddModule}>
                      <Plus size={14} /> Tambah Modul
                    </button>
                    <button 
                      className="btn btn-soft btn-sm" 
                      onClick={() => {
                        if (selectedCourseForContent.modules.length > 0) {
                          setSelectedModuleId(selectedCourseForContent.modules[0].id);
                          setIsMaterialModalOpen(true);
                        } else {
                          addToast("Buat modul terlebih dahulu.", "info");
                        }
                      }}
                    >
                      <Plus size={14} /> Tambah Materi Pembelajaran
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedCourseForContent.modules && selectedCourseForContent.modules.map(m => (
                    <div key={m.id} className="card" style={{ padding: '14px', backgroundColor: 'var(--background)' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{m.title}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {m.materials && m.materials.map(mat => (
                          <div key={mat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--surface)', borderRadius: '6px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="badge" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-secondary)' }}>{mat.type}</span>
                              <span style={{ fontWeight: 600 }}>{mat.title}</span>
                            </div>
                            <span style={{ color: 'var(--text-muted)' }}>{mat.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EVALUASI SUBMISSION TUGAS */}
        {activeAdminTab === 'submissions' && (
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Antrean Evaluasi Tugas Karyawan</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {submissions.map(sub => (
                <div key={sub.id} className="card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={sub.userAvatar} alt={sub.userName} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{sub.userName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.trainingTitle} — {sub.assignmentTitle}</div>
                      </div>
                    </div>

                    <span className={`badge ${sub.status === 'graded' ? 'badge-completed' : 'badge-warning'}`}>
                      {sub.status === 'graded' ? 'Sudah Dinilai' : 'Perlu Evaluasi'}
                    </span>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: 'var(--background)', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', whiteSpace: 'pre-line' }}>
                    <strong>Isi Submission:</strong> "{sub.content}"
                  </div>

                  {sub.evaluation && (
                    <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '12px', color: '#15803d', marginBottom: '12px' }}>
                      <strong>Nilai: {sub.evaluation.score}/100</strong> — Feedback: "{sub.evaluation.feedback}"
                    </div>
                  )}

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setGradingSubmission(sub);
                      setScoreInput(sub.evaluation ? sub.evaluation.score : 90);
                      setFeedbackInput(sub.evaluation ? sub.evaluation.feedback : 'Analisis sudah sangat baik dan terstruktur.');
                    }}
                  >
                    <Award size={14} /> {sub.evaluation ? 'Edit Evaluasi' : 'Berikan Nilai & Feedback'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCourseModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editingCourseId ? 'Edit Pelatihan' : 'Tambah Pelatihan Baru'}</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsCourseModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCourse}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Pelatihan:</label>
                  <input type="text" className="form-input" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Deskripsi:</label>
                  <textarea className="form-textarea" rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kategori:</label>
                    <select className="form-select" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}>
                      <option value="Data Science">Data Science</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Security">Security</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level:</label>
                    <select className="form-select" value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Image URL:</label>
                  <input type="text" className="form-input" value={courseForm.coverUrl} onChange={(e) => setCourseForm({ ...courseForm, coverUrl: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsCourseModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Pelatihan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {isMaterialModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMaterialModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Tambah Materi Pembelajaran Baru</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsMaterialModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMaterial}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Pilih Modul Target:</label>
                  <select className="form-select" value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)}>
                    {selectedCourseForContent.modules.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Materi:</label>
                  <select className="form-select" value={materialType} onChange={(e) => setMaterialType(e.target.value)}>
                    <option value="article">Artikel (Rich Text)</option>
                    <option value="pdf">Dokumen PDF</option>
                    <option value="video">Video Pembelajaran</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Judul Materi:</label>
                  <input type="text" className="form-input" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Konten / Ringkasan Materi:</label>
                  <textarea className="form-textarea" rows={4} value={materialContent} onChange={(e) => setMaterialContent(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsMaterialModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Materi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission Grading Modal */}
      {gradingSubmission && (
        <div className="modal-overlay" onClick={() => setGradingSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Evaluasi & Berikan Nilai Tugas</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setGradingSubmission(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleGradeSubmission}>
              <div className="modal-body">
                <div style={{ marginBottom: '14px', fontSize: '13px' }}>
                  <div><strong>Karyawan:</strong> {gradingSubmission.userName}</div>
                  <div><strong>Tugas:</strong> {gradingSubmission.assignmentTitle}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nilai Evaluasi (0 - 100):</label>
                  <input 
                    type="number" 
                    min={0} 
                    max={100} 
                    className="form-input" 
                    value={scoreInput} 
                    onChange={(e) => setScoreInput(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback Instructor / Catatan Evaluasi:</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    value={feedbackInput} 
                    onChange={(e) => setFeedbackInput(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGradingSubmission(null)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Evaluasi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
