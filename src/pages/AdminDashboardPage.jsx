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
  X,
  MoreVertical,
  Eye,
  Clock,
  ExternalLink,
  Upload,
  ClipboardList
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
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [moduleModalMode, setModuleModalMode] = useState(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', sequenceNumber: 1 });
  const [materialModalMode, setMaterialModalMode] = useState(null);
  const [materialForm, setMaterialForm] = useState({});
  const [materialQuestions, setMaterialQuestions] = useState([]);
  const [viewingMaterial, setViewingMaterial] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const refreshSelectedCourse = async () => {
    if (!selectedCourseForContent) return;
    const detail = await api.getTrainingDetail(selectedCourseForContent.id);
    if (detail.success) setSelectedCourseForContent(detail.data);
  };

  const openModuleForm = (mode, module = null) => {
    setModuleForm(module ? {
      title: module.title || '',
      description: module.description || '',
      sequenceNumber: module.sequenceNumber || 1
    } : {
      title: '',
      description: '',
      sequenceNumber: (selectedCourseForContent?.modules?.length || 0) + 1
    });
    setModuleModalMode({ mode, module });
  };

  const handleSaveModule = async (event) => {
    event.preventDefault();
    if (!selectedCourseForContent) return;
    try {
      const res = moduleModalMode.mode === 'edit'
        ? await api.updateModule(moduleModalMode.module.id, moduleForm)
        : await api.addModule(selectedCourseForContent.id, moduleForm);
      if (!res.success) throw new Error(res.message);
      addToast(moduleModalMode.mode === 'edit' ? 'Modul berhasil diperbarui.' : 'Modul berhasil ditambahkan.', 'success');
      setModuleModalMode(null);
      await refreshSelectedCourse();
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan modul.', 'error');
    }
  };

  const articleToText = (content = '') => content
    .replace(/<\/(p|h[1-6]|li|blockquote|div)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

  const articleToHtml = (content = '') => content
    .split(/\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(paragraph => `<p>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</p>`)
    .join('');

  const openMaterialForm = (mode, material = null, moduleId = selectedModuleId) => {
    const type = material?.type || 'article';
    setSelectedModuleId(material?.moduleId || moduleId || selectedCourseForContent?.modules?.[0]?.id || '');
    setMaterialForm({
      title: material?.title || '',
      type,
      duration: material?.duration || '',
      description: material?.description || '',
      content: type === 'article' ? articleToText(material?.content || '') : material?.content || '',
      fileUrl: material?.fileUrl || '',
      fileName: material?.fileName || '',
      videoUrl: material?.videoUrl || '',
      deadline: material?.assignmentData?.deadline || '',
      attachmentUrl: material?.assignmentData?.attachmentUrl || '',
      attachmentName: material?.assignmentData?.attachmentName || ''
    });
    setMaterialQuestions((material?.quizData || []).map(question => ({
      question: question.question || '',
      options: question.options?.length ? [...question.options] : ['', ''],
      correctOption: Number(question.correctOption) || 0
    })));
    setViewingMaterial(null);
    setMaterialModalMode({ mode, material });
  };

  const handleSaveMaterial = async (event) => {
    event.preventDefault();
    if (!selectedModuleId || !materialForm.title) return;
    if (materialForm.type === 'quiz' && (!materialQuestions.length || materialQuestions.some(question => !question.question.trim() || question.options.length < 2 || question.options.some(option => !option.trim())))) {
      addToast('Kuis memerlukan pertanyaan dan minimal dua pilihan jawaban.', 'error');
      return;
    }
    const { deadline, attachmentUrl, attachmentName, ...fields } = materialForm;
    const payload = {
      ...fields,
      content: materialForm.type === 'article' ? articleToHtml(materialForm.content) : materialForm.content,
      fileUrl: materialForm.type === 'pdf' ? materialForm.fileUrl : '',
      fileName: materialForm.type === 'pdf' ? materialForm.fileName : '',
      videoUrl: materialForm.type === 'video' ? materialForm.videoUrl : '',
      quizData: materialForm.type === 'quiz' ? materialQuestions.map((question, index) => ({
        id: `q-${Date.now()}-${index}`,
        ...question,
        correctOption: Number(question.correctOption),
        score: Math.floor(100 / Math.max(materialQuestions.length, 1))
      })) : [],
      assignmentData: materialForm.type === 'assignment' ? { deadline, attachmentUrl, attachmentName } : null
    };
    try {
      const res = materialModalMode.mode === 'edit'
        ? await api.updateMaterial(materialModalMode.material.id, payload)
        : await api.addMaterial(selectedModuleId, payload);
      if (!res.success) throw new Error(res.message);
      addToast(materialModalMode.mode === 'edit' ? 'Materi berhasil diperbarui.' : 'Materi berhasil ditambahkan.', 'success');
      setMaterialModalMode(null);
      await refreshSelectedCourse();
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan materi.', 'error');
    }
  };

  const handleDeleteCurriculumItem = async () => {
    if (!deleteTarget) return;
    try {
      const res = deleteTarget.type === 'module'
        ? await api.deleteModule(deleteTarget.item.id)
        : await api.deleteMaterial(deleteTarget.item.id);
      if (!res.success) throw new Error(res.message);
      addToast(deleteTarget.type === 'module' ? 'Modul berhasil dihapus.' : 'Materi berhasil dihapus.', 'success');
      setDeleteTarget(null);
      setViewingMaterial(null);
      await refreshSelectedCourse();
    } catch (err) {
      addToast(err.message || 'Gagal menghapus item kurikulum.', 'error');
    }
  };

  const handleMaterialFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      addToast('Ukuran file maksimal 1 MB untuk penyimpanan demo ini.', 'error');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setMaterialForm(current => ({ ...current, fileUrl: reader.result, fileName: file.name }));
    reader.readAsDataURL(file);
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
              <div className="curriculum-builder" style={{ marginTop: '28px', paddingTop: '20px', borderTop: '2px solid var(--primary-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                    Builder Kurikulum: {selectedCourseForContent.title}
                  </h3>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => openModuleForm('add')}>
                      <Plus size={14} /> Tambah Modul
                    </button>
                    <button 
                      className="btn btn-soft btn-sm" 
                      onClick={() => {
                        if (selectedCourseForContent.modules?.length > 0) {
                          openMaterialForm('add', null, selectedCourseForContent.modules[0].id);
                        } else {
                          addToast("Buat modul terlebih dahulu.", "info");
                        }
                      }}
                    >
                      <Plus size={14} /> Tambah Materi Pembelajaran
                    </button>
                  </div>
                </div>

                <div className="curriculum-module-list">
                  {selectedCourseForContent.modules?.map(module => (
                    <section key={module.id} className="curriculum-module card">
                      <div className="curriculum-module-heading">
                        <div>
                          <h4>{module.title}</h4>
                          {module.description && <p>{module.description}</p>}
                        </div>
                        <div className="curriculum-actions">
                          <button className="curriculum-icon-button" title="Edit modul" aria-label={`Edit ${module.title}`} onClick={() => openModuleForm('edit', module)}><Edit size={16} /></button>
                          <button className="curriculum-icon-button curriculum-danger" title="Hapus modul" aria-label={`Hapus ${module.title}`} onClick={() => setDeleteTarget({ type: 'module', item: module })}><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="curriculum-material-list">
                        {module.materials?.map(material => (
                          <div className="curriculum-material-row" key={material.id}>
                            <button className="curriculum-material-open" onClick={() => setViewingMaterial(material)}>
                              <span className="badge curriculum-type-badge">{material.type}</span>
                              <span className="curriculum-material-title">{material.title}</span>
                              <span className="curriculum-material-duration"><Clock size={14} />{material.duration || 'Durasi belum diatur'}</span>
                            </button>
                            <details className="curriculum-menu">
                              <summary aria-label={`Menu ${material.title}`} title="Aksi materi"><MoreVertical size={18} /></summary>
                              <div className="curriculum-menu-popover">
                                <button onClick={() => setViewingMaterial(material)}><Eye size={14} /> Lihat Materi</button>
                                <button onClick={() => openMaterialForm('edit', material)}><Edit size={14} /> Edit Materi</button>
                                <button className="curriculum-danger" onClick={() => setDeleteTarget({ type: 'material', item: material })}><Trash2 size={14} /> Hapus Materi</button>
                              </div>
                            </details>
                          </div>
                        ))}
                        {!module.materials?.length && <p className="curriculum-empty">Belum ada materi di modul ini.</p>}
                      </div>
                    </section>
                  ))}
                  {!selectedCourseForContent.modules?.length && <p className="curriculum-empty">Belum ada modul. Tambahkan modul pertama untuk mulai menyusun kurikulum.</p>}
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

      {moduleModalMode && (
        <div className="modal-overlay" onClick={() => setModuleModalMode(null)}>
          <div className="modal-content curriculum-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">{moduleModalMode.mode === 'edit' ? 'Edit Modul' : 'Tambah Modul'}</div><button aria-label="Tutup" onClick={() => setModuleModalMode(null)}><X size={20} /></button></div>
            <form onSubmit={handleSaveModule}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Nama Modul</label><input className="form-input" value={moduleForm.title} onChange={event => setModuleForm({ ...moduleForm, title: event.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Deskripsi</label><textarea className="form-textarea" rows={3} value={moduleForm.description} onChange={event => setModuleForm({ ...moduleForm, description: event.target.value })} /></div>
                <div className="form-group"><label className="form-label">Urutan</label><input className="form-input" type="number" min="1" value={moduleForm.sequenceNumber} onChange={event => setModuleForm({ ...moduleForm, sequenceNumber: event.target.value })} required /></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary btn-sm" onClick={() => setModuleModalMode(null)}>Batal</button><button className="btn btn-primary btn-sm" type="submit">Simpan Perubahan</button></div>
            </form>
          </div>
        </div>
      )}

      {viewingMaterial && (
        <div className="modal-overlay" onClick={() => setViewingMaterial(null)}>
          <div className="modal-content curriculum-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Detail Materi</div><button aria-label="Tutup" onClick={() => setViewingMaterial(null)}><X size={20} /></button></div>
            <div className="modal-body curriculum-detail">
              <span className="badge curriculum-type-badge">{viewingMaterial.type}</span>
              <h3>{viewingMaterial.title}</h3>
              <p className="curriculum-detail-meta"><Clock size={15} /> {viewingMaterial.duration || 'Durasi belum diatur'}</p>
              {viewingMaterial.description && <p>{viewingMaterial.description}</p>}
              {viewingMaterial.type === 'pdf' && <p>File: {viewingMaterial.fileName || 'Belum ada nama file'}</p>}
              {viewingMaterial.type === 'video' && viewingMaterial.videoUrl && <a className="curriculum-resource-link" href={viewingMaterial.videoUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Buka video</a>}
              {viewingMaterial.type === 'pdf' && viewingMaterial.fileUrl && <a className="curriculum-resource-link" href={viewingMaterial.fileUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Buka PDF</a>}
              {viewingMaterial.content && <div className="curriculum-detail-content">{viewingMaterial.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</div>}
              {viewingMaterial.type === 'quiz' && viewingMaterial.quizData?.map((question, index) => <div className="curriculum-quiz-preview" key={question.id || index}><strong>{index + 1}. {question.question}</strong><p>{question.options?.join(' · ')}</p></div>)}
              {viewingMaterial.type === 'assignment' && viewingMaterial.assignmentData?.deadline && <p>Deadline: {new Date(viewingMaterial.assignmentData.deadline).toLocaleString('id-ID')}</p>}
            </div>
            <div className="modal-footer"><button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget({ type: 'material', item: viewingMaterial })}><Trash2 size={14} /> Hapus Materi</button><button className="btn btn-primary btn-sm" onClick={() => openMaterialForm('edit', viewingMaterial)}><Edit size={14} /> Edit Materi</button></div>
          </div>
        </div>
      )}

      {materialModalMode && selectedCourseForContent && (
        <div className="modal-overlay" onClick={() => setMaterialModalMode(null)}>
          <div className="modal-content curriculum-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">{materialModalMode.mode === 'edit' ? 'Edit Materi' : 'Tambah Materi Pembelajaran'}</div><button aria-label="Tutup" onClick={() => setMaterialModalMode(null)}><X size={20} /></button></div>
            <form onSubmit={handleSaveMaterial}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Pilih Modul</label><select className="form-select" value={selectedModuleId} onChange={event => setSelectedModuleId(event.target.value)} required>{selectedCourseForContent.modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</select></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Jenis Materi</label><select className="form-select" value={materialForm.type || 'article'} onChange={event => setMaterialForm({ ...materialForm, type: event.target.value })}><option value="article">Article</option><option value="pdf">PDF</option><option value="video">Video</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option></select></div>
                  <div className="form-group"><label className="form-label">Durasi</label><input className="form-input" placeholder="Contoh: 15 Menit" value={materialForm.duration || ''} onChange={event => setMaterialForm({ ...materialForm, duration: event.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Judul Materi</label><input className="form-input" value={materialForm.title || ''} onChange={event => setMaterialForm({ ...materialForm, title: event.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Deskripsi</label><textarea className="form-textarea" rows={2} value={materialForm.description || ''} onChange={event => setMaterialForm({ ...materialForm, description: event.target.value })} /></div>
                {materialForm.type === 'article' && <div className="form-group"><label className="form-label">Isi Artikel</label><textarea className="form-textarea" rows={7} value={materialForm.content || ''} onChange={event => setMaterialForm({ ...materialForm, content: event.target.value })} required /></div>}
                {materialForm.type === 'pdf' && <>
                  <div className="form-group"><label className="form-label">Nama File</label><input className="form-input" value={materialForm.fileName || ''} onChange={event => setMaterialForm({ ...materialForm, fileName: event.target.value })} placeholder="panduan.pdf" /></div>
                  <div className="form-group"><label className="form-label">URL PDF atau unggah file (maks. 1 MB)</label><input className="form-input" type="url" placeholder="https://..." value={materialForm.fileUrl?.startsWith('data:') ? '' : materialForm.fileUrl || ''} onChange={event => setMaterialForm({ ...materialForm, fileUrl: event.target.value })} /><label className="curriculum-upload"><Upload size={15} /> Pilih file PDF<input type="file" accept="application/pdf,.pdf" onChange={handleMaterialFile} /></label>{materialForm.fileName && <small>{materialForm.fileName}</small>}</div>
                  <div className="form-group"><label className="form-label">Informasi Materi</label><textarea className="form-textarea" rows={3} value={materialForm.content || ''} onChange={event => setMaterialForm({ ...materialForm, content: event.target.value })} /></div>
                </>}
                {materialForm.type === 'video' && <><div className="form-group"><label className="form-label">URL Video</label><input type="url" className="form-input" placeholder="https://..." value={materialForm.videoUrl || ''} onChange={event => setMaterialForm({ ...materialForm, videoUrl: event.target.value })} /></div><div className="form-group"><label className="form-label">Deskripsi / Informasi Video</label><textarea className="form-textarea" rows={3} value={materialForm.content || ''} onChange={event => setMaterialForm({ ...materialForm, content: event.target.value })} /></div></>}
                {materialForm.type === 'quiz' && <div className="curriculum-question-list"><div className="curriculum-question-title"><strong>Pertanyaan Kuis</strong><button type="button" className="btn btn-secondary btn-sm" onClick={() => setMaterialQuestions([...materialQuestions, { question: '', options: ['', ''], correctOption: 0 }])}><Plus size={14} /> Tambah Pertanyaan</button></div>
                  {materialQuestions.map((question, questionIndex) => <div className="curriculum-question" key={questionIndex}><div className="form-group"><label className="form-label">Pertanyaan {questionIndex + 1}</label><input className="form-input" value={question.question} onChange={event => setMaterialQuestions(materialQuestions.map((item, index) => index === questionIndex ? { ...item, question: event.target.value } : item))} required /></div><div className="form-group"><label className="form-label">Pilihan Jawaban</label>{question.options.map((option, optionIndex) => <div className="curriculum-option" key={optionIndex}><input type="radio" name={`correct-${questionIndex}`} checked={Number(question.correctOption) === optionIndex} onChange={() => setMaterialQuestions(materialQuestions.map((item, index) => index === questionIndex ? { ...item, correctOption: optionIndex } : item))} aria-label={`Tandai pilihan ${optionIndex + 1} sebagai jawaban benar`} /><input className="form-input" value={option} onChange={event => setMaterialQuestions(materialQuestions.map((item, index) => index === questionIndex ? { ...item, options: item.options.map((value, valueIndex) => valueIndex === optionIndex ? event.target.value : value) } : item))} placeholder={`Pilihan ${optionIndex + 1}`} required /></div>)}<button type="button" className="curriculum-text-button" onClick={() => setMaterialQuestions(materialQuestions.map((item, index) => index === questionIndex ? { ...item, options: [...item.options, ''] } : item))}><Plus size={13} /> Tambah pilihan</button></div></div>)}
                  {materialQuestions.length === 0 && <p className="curriculum-empty">Tambahkan minimal satu pertanyaan beserta pilihan jawaban.</p>}
                </div>}
                {materialForm.type === 'assignment' && <><div className="form-group"><label className="form-label">Instruksi Tugas</label><textarea className="form-textarea" rows={5} value={materialForm.content || ''} onChange={event => setMaterialForm({ ...materialForm, content: event.target.value })} required /></div><div className="form-group"><label className="form-label">Deadline (opsional)</label><input type="datetime-local" className="form-input" value={materialForm.deadline ? materialForm.deadline.slice(0, 16) : ''} onChange={event => setMaterialForm({ ...materialForm, deadline: event.target.value ? new Date(event.target.value).toISOString() : '' })} /></div><div className="grid-2"><div className="form-group"><label className="form-label">Nama file pendukung</label><input className="form-input" value={materialForm.attachmentName || ''} onChange={event => setMaterialForm({ ...materialForm, attachmentName: event.target.value })} /></div><div className="form-group"><label className="form-label">URL file pendukung</label><input type="url" className="form-input" value={materialForm.attachmentUrl || ''} onChange={event => setMaterialForm({ ...materialForm, attachmentUrl: event.target.value })} /></div></div></>}
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary btn-sm" onClick={() => setMaterialModalMode(null)}>Batal</button><button className="btn btn-primary btn-sm" type="submit">Simpan Perubahan</button></div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content curriculum-confirm" role="alertdialog" aria-modal="true" onClick={event => event.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Konfirmasi Hapus</div><button aria-label="Tutup" onClick={() => setDeleteTarget(null)}><X size={20} /></button></div>
            <div className="modal-body"><p>{deleteTarget.type === 'module' ? `Hapus modul "${deleteTarget.item.title}" beserta seluruh materi di dalamnya?` : 'Apakah Anda yakin ingin menghapus materi ini?'}</p></div>
            <div className="modal-footer"><button className="btn btn-secondary btn-sm" onClick={() => setDeleteTarget(null)}>Batal</button><button className="btn btn-danger btn-sm" onClick={handleDeleteCurriculumItem}><Trash2 size={14} /> Hapus</button></div>
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
