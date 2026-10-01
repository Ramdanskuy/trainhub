import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronRight, 
  Clock, 
  User, 
  Award, 
  Play, 
  BookOpen, 
  CheckCircle, 
  FileText, 
  Video, 
  HelpCircle, 
  CheckSquare, 
  MessageSquare,
  FlaskConical
} from 'lucide-react';
import { api } from '../services/api';

export const CourseDetailPage = () => {
  const { selectedCourseId, navigateTo, addToast, setIsTestingModalOpen } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'curriculum', 'resources', 'submissions', 'discussions'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseDetail();
    }
  }, [selectedCourseId]);

  const loadCourseDetail = async () => {
    setLoading(true);
    try {
      const res = await api.getTrainingDetail(selectedCourseId || 'trn-101');
      if (res.success) {
        setCourse(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const res = await api.enroll(course.id);
      if (res.success) {
        addToast(res.message, 'success');
        await loadCourseDetail();
      } else {
        addToast(res.message, 'info');
      }
    } catch (err) {
      addToast("Gagal mendaftar pelatihan.", "error");
    }
  };

  if (!course) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '60px' }}>
        <p>Memuat rincian pelatihan...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('pelatihan')}>Katalog Pelatihan</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{course.title}</span>
      </div>

      {/* Course Hero Banner Card */}
      <div className="card" style={{ marginBottom: '24px', padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Left Thumbnail Cover */}
          <div style={{ width: '320px', minHeight: '220px', position: 'relative' }}>
            <img src={course.coverUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Right Details */}
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: '10px' }}>
                <span className="badge badge-beginner">{course.level}</span>
                <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>{course.category}</span>
                {course.isEnrolled && (
                  <span className="badge badge-in_progress"><CheckCircle size={12} /> Diikuti</span>
                )}
              </div>

              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                {course.title}
              </h1>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={course.mentorAvatar} alt={course.mentor} style={{ width: 26, height: 26, borderRadius: '50%' }} />
                  <span>Mentor: <strong>{course.mentor}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={15} />
                  <span>Durasi: <strong>{course.duration}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={15} />
                  <span>Peserta: <strong>{course.participantsCount || 12} Karyawan</strong></span>
                </div>
              </div>
            </div>

            {/* CTA Button Bar */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              {course.isEnrolled ? (
                <button className="btn btn-primary" onClick={() => navigateTo('classroom', course.id)}>
                  <Play size={16} />
                  <span>{course.progressPercent === 100 ? 'Buka Ruang Kelas (Review Materi)' : 'Lanjutkan Pembelajaran'}</span>
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleEnroll}>
                  <BookOpen size={16} />
                  <span>Ikuti Pelatihan Ini</span>
                </button>
              )}

              <button className="btn btn-secondary btn-sm" onClick={() => setIsTestingModalOpen(true)}>
                <FlaskConical size={14} />
                <span>Uji Enrollment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Sections */}
      <div className="card" style={{ padding: 0 }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0 20px', gap: 4, overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Ringkasan & Detail' },
            { id: 'curriculum', label: 'Kurikulum / Modul' },
            { id: 'resources', label: 'Lampiran & Resources' },
            { id: 'submissions', label: 'Riwayat Tugas' },
            { id: 'discussions', label: 'Diskusi Kelas' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{ padding: '14px 18px', borderRadius: 0, borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent' }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '24px' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid-3">
              <div style={{ gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Tentang Pelatihan Ini</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.7 }}>
                  {course.description} Program ini dirancang khusus untuk meningkatkan kapabilitas teknis dan analitis karyawan sesuai standar industri terkini.
                </p>

                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Keterampilan Yang Akan Dikuasai</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '24px' }}>
                  {course.skills && course.skills.map((skill, idx) => (
                    <span key={idx} style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-soft)', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '12px' }}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="card" style={{ backgroundColor: 'var(--background)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={18} color="var(--primary)" /> Sertifikat Kelulusan
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Selesaikan seluruh materi, kuis, dan tugas dengan nilai minimal 75% untuk memperoleh sertifikat resmi.
                  </p>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-dark)' }}>
                    Badge: {course.achievement || 'Corporate Learning Certificate'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Struktur Modul Pembelajaran</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {course.modules && course.modules.map((mod, idx) => (
                  <div key={mod.id} className="card" style={{ padding: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                      {mod.title}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {mod.materials && mod.materials.map(mat => (
                        <div 
                          key={mat.id}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--background)', borderRadius: '8px', cursor: 'pointer' }}
                          onClick={() => navigateTo('classroom', course.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {mat.type === 'article' && <FileText size={16} color="#2563eb" />}
                            {mat.type === 'pdf' && <FileText size={16} color="#dc2626" />}
                            {mat.type === 'video' && <Video size={16} color="#16a34a" />}
                            {mat.type === 'quiz' && <HelpCircle size={16} color="#f59e0b" />}
                            {mat.type === 'assignment' && <CheckSquare size={16} color="#7c3aed" />}

                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{mat.title}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mat.duration}</span>
                            {mat.isCompleted && <CheckCircle size={16} color="var(--primary)" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Lampiran & Resource Pembelajaran</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Unduh materi bacaan pendukung, cheat sheet, dan dataset latihan.
              </p>

              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={20} color="#dc2626" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>Data_Science_Architecture_Guide_v1.pdf</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2.4 MB · Dokumen PDF</div>
                  </div>
                </div>
                <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  Unduh File
                </a>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Riwayat Submission Tugas Anda</h3>

              {course.userSubmissions && course.userSubmissions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {course.userSubmissions.map(sub => (
                    <div key={sub.id} className="card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>Tugas Dikumpulkan</span>
                        <span className={`badge ${sub.status === 'graded' ? 'badge-completed' : 'badge-warning'}`}>
                          {sub.status === 'graded' ? 'Dinilai' : 'Sudah Dikumpulkan'}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{sub.content}</p>

                      {sub.evaluation && (
                        <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                          <div style={{ fontWeight: 700, color: '#15803d', fontSize: '13px' }}>
                            Nilai Evaluasi: {sub.evaluation.score} / 100
                          </div>
                          <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                            <strong>Feedback Evaluator:</strong> "{sub.evaluation.feedback}"
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Belum ada tugas yang dikumpulkan untuk kelas ini.
                </div>
              )}
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Diskusi Terkait Pelatihan Ini</h3>
                <button className="btn btn-primary btn-sm" onClick={() => navigateTo('forum')}>
                  <MessageSquare size={14} />
                  <span>Buka Forum Utama</span>
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Diskusi aktif dapat diakses melalui menu Forum Diskusi pada navigasi atas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
