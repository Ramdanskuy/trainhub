import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  CheckCircle, 
  Circle, 
  FileText, 
  Video, 
  HelpCircle, 
  CheckSquare, 
  Play, 
  Award, 
  Download, 
  Send, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { CertificateModal } from '../components/CertificateModal';

export const ClassroomPage = () => {
  const { selectedCourseId, navigateTo, addToast, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Assignment submission form
  const [assignmentContent, setAssignmentContent] = useState('');
  const [assignmentFile, setAssignmentFile] = useState('Analisis_Tugas_Ramdan.pdf');

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassroomData();
  }, [selectedCourseId]);

  const loadClassroomData = async () => {
    setLoading(true);
    try {
      const res = await api.getTrainingDetail(selectedCourseId || 'trn-101');
      if (res.success) {
        setCourse(res.data);
        
        // Expand all modules by default
        const expanded = {};
        res.data.modules.forEach(m => { expanded[m.id] = true; });
        setExpandedModules(expanded);

        // Set first uncompleted or first material as active
        if (res.data.modules.length > 0 && res.data.modules[0].materials.length > 0) {
          setCurrentMaterial(res.data.modules[0].materials[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMaterial = (mat) => {
    setCurrentMaterial(mat);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = async (matId) => {
    try {
      const res = await api.completeMaterial(matId || currentMaterial.id);
      if (res.success) {
        addToast("Materi berhasil diselesaikan!", "success");
        await loadClassroomData();
      }
    } catch (err) {
      addToast("Gagal mencatat progres materi.", "error");
    }
  };

  const handleQuizOptionSelect = (questionId, optionIdx) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    if (!currentMaterial || !currentMaterial.quizData) return;

    let score = 0;
    let totalScore = 0;

    currentMaterial.quizData.forEach(q => {
      totalScore += q.score;
      if (quizAnswers[q.id] === q.correctOption) {
        score += q.score;
      }
    });

    setQuizResult({ score, totalScore, passed: score >= totalScore * 0.7 });
    setQuizSubmitted(true);
    handleMarkComplete(currentMaterial.id);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentContent) {
      addToast("Isi jawaban tugas terlebih dahulu.", "error");
      return;
    }

    try {
      const res = await api.submitAssignment(
        currentMaterial.id, 
        assignmentContent, 
        assignmentFile, 
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      );
      if (res.success) {
        addToast("Tugas berhasil dikumpulkan!", "success");
        setAssignmentContent('');
        await loadClassroomData();
      }
    } catch (err) {
      addToast("Gagal mengumpulkan tugas.", "error");
    }
  };

  if (!course) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '60px' }}>
        <p>Memuat Halaman Kelas...</p>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ paddingBottom: '20px' }}>
      {/* Top Classroom Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', backgroundColor: 'var(--surface)', padding: '12px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('detail', course.id)}>
            <ChevronLeft size={16} /> Kembali
          </button>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{course.title}</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{course.completedMaterialsCount} dari {course.totalMaterials} Materi Selesai</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
              <span>Progress Kelas</span>
              <span>{course.progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${course.progressPercent}%` }}></div>
            </div>
          </div>

          {course.progressPercent === 100 && (
            <button 
              className="btn btn-soft btn-sm"
              onClick={() => setShowCertificate(true)}
              style={{ backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}
            >
              <Award size={14} /> Unduh Sertifikat
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Classroom Layout */}
      <div className="classroom-layout">
        {/* Left Sidebar - Module Accordion */}
        <div className="classroom-sidebar">
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Daftar Modul & Lesson
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {course.modules && course.modules.map(mod => {
              const isExpanded = expandedModules[mod.id];
              return (
                <div key={mod.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {/* Module Accordion Header */}
                  <div 
                    style={{ padding: '10px 12px', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                    onClick={() => setExpandedModules(prev => ({ ...prev, [mod.id]: !prev[mod.id] }))}
                  >
                    <span>{mod.title}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  {/* Module Material List */}
                  {isExpanded && (
                    <div style={{ padding: '4px', backgroundColor: 'var(--surface)' }}>
                      {mod.materials && mod.materials.map(mat => {
                        const isCurrent = currentMaterial && currentMaterial.id === mat.id;
                        return (
                          <div 
                            key={mat.id}
                            style={{ 
                              padding: '8px 10px', 
                              borderRadius: 'var(--radius-sm)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              cursor: 'pointer',
                              backgroundColor: isCurrent ? 'var(--primary-soft)' : 'transparent',
                              color: isCurrent ? 'var(--primary-dark)' : 'var(--text-secondary)',
                              fontWeight: isCurrent ? 600 : 400,
                              fontSize: '12px',
                              marginBottom: '2px'
                            }}
                            onClick={() => handleSelectMaterial(mat)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                              {mat.type === 'article' && <FileText size={14} color="#2563eb" />}
                              {mat.type === 'pdf' && <FileText size={14} color="#dc2626" />}
                              {mat.type === 'video' && <Video size={14} color="#16a34a" />}
                              {mat.type === 'quiz' && <HelpCircle size={14} color="#f59e0b" />}
                              {mat.type === 'assignment' && <CheckSquare size={14} color="#7c3aed" />}

                              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {mat.title}
                              </span>
                            </div>

                            {mat.isCompleted ? (
                              <CheckCircle size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                            ) : (
                              <Circle size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Content Viewer */}
        <div className="classroom-main">
          {currentMaterial ? (
            <div>
              {/* Material Title Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span className="badge" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {currentMaterial.type.toUpperCase()}
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentMaterial.title}
                  </h2>
                </div>

                {!currentMaterial.isCompleted && currentMaterial.type !== 'quiz' && currentMaterial.type !== 'assignment' && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleMarkComplete(currentMaterial.id)}>
                    <CheckCircle size={14} /> Tandai Selesai
                  </button>
                )}
                {currentMaterial.isCompleted && (
                  <span className="badge badge-in_progress" style={{ padding: '6px 12px' }}>
                    <CheckCircle size={14} /> Materi Ini Telah Selesai
                  </span>
                )}
              </div>

              {/* ARTICLE VIEWER */}
              {currentMaterial.type === 'article' && (
                <div 
                  style={{ maxWidth: '760px', lineHeight: 1.8, fontSize: '15px', color: 'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{ __html: currentMaterial.content }}
                />
              )}

              {/* PDF VIEWER */}
              {currentMaterial.type === 'pdf' && (
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {currentMaterial.content}
                  </p>

                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: 'var(--background)', textAlign: 'center', marginBottom: '16px' }}>
                    <FileText size={48} color="#dc2626" style={{ marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{currentMaterial.fileName || 'Dokumen_Panduan.pdf'}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Format PDF Reader Document</div>
                    
                    <a href={currentMaterial.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                      <Download size={14} /> Buka / Download PDF
                    </a>
                  </div>
                </div>
              )}

              {/* VIDEO VIEWER */}
              {currentMaterial.type === 'video' && (
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {currentMaterial.content}
                  </p>

                  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'black', marginBottom: '16px', boxShadow: 'var(--shadow-md)' }}>
                    <video 
                      controls 
                      style={{ width: '100%', maxHeight: '420px' }}
                      src={currentMaterial.videoUrl}
                      onEnded={() => handleMarkComplete(currentMaterial.id)}
                    >
                      Browser Anda tidak mendukung tag video.
                    </video>
                  </div>
                </div>
              )}

              {/* QUIZ INTERFACE */}
              {currentMaterial.type === 'quiz' && currentMaterial.quizData && (
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    {currentMaterial.content}
                  </p>

                  {quizSubmitted && quizResult ? (
                    <div className="card" style={{ backgroundColor: quizResult.passed ? '#f0fdf4' : '#fef2f2', borderColor: quizResult.passed ? '#bbf7d0' : '#fecaca', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: quizResult.passed ? '#15803d' : '#b91c1c', marginBottom: '8px' }}>
                        {quizResult.passed ? '🎉 Selamat! Anda Lulus Kuis' : '⚠️ Nilai Belum Mencukupi'}
                      </h3>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>
                        Skor Anda: {quizResult.score} / {quizResult.totalScore}
                      </div>
                      <button className="btn btn-secondary btn-sm" onClick={() => setQuizSubmitted(false)}>
                        Coba Kuis Lagi
                      </button>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {currentMaterial.quizData.map((q, qIdx) => (
                      <div key={q.id} className="card">
                        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>
                          Soal {qIdx + 1}: {q.question}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {q.options.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 10, 
                                padding: '10px 14px', 
                                borderRadius: 'var(--radius-sm)', 
                                border: '1px solid var(--border)', 
                                backgroundColor: quizAnswers[q.id] === optIdx ? 'var(--primary-soft)' : 'var(--surface)', 
                                cursor: 'pointer',
                                fontSize: '13px'
                              }}
                            >
                              <input 
                                type="radio" 
                                name={`q-${q.id}`} 
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => handleQuizOptionSelect(q.id, optIdx)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>

                        {quizSubmitted && (
                          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', padding: '8px 12px', backgroundColor: 'var(--background)', borderRadius: '6px' }}>
                            <strong>Penjelasan:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted && (
                    <button 
                      className="btn btn-primary" 
                      style={{ marginTop: '20px' }}
                      onClick={handleQuizSubmit}
                    >
                      Kirim Jawaban Kuis
                    </button>
                  )}
                </div>
              )}

              {/* ASSIGNMENT INTERFACE */}
              {currentMaterial.type === 'assignment' && (
                <div>
                  <div className="card" style={{ marginBottom: '24px', backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b21a8', marginBottom: '8px' }}>
                      Instruksi Tugas Pembelajaran
                    </h3>
                    <div style={{ whiteSpace: 'pre-line', fontSize: '14px', color: '#581c87', lineHeight: 1.6 }}>
                      {currentMaterial.content}
                    </div>

                    {currentMaterial.assignmentData && (
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e9d5ff', fontSize: '12px', color: '#6b21a8', fontWeight: 600 }}>
                        ⏳ Deadline: {new Date(currentMaterial.assignmentData.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>

                  {/* Submission Form */}
                  <div className="card">
                    <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Form Pengumpulan Tugas</h4>
                    <form onSubmit={handleAssignmentSubmit}>
                      <div className="form-group">
                        <label className="form-label">Teks Jawaban / Ringkasan Evaluasi:</label>
                        <textarea 
                          className="form-textarea" 
                          rows={6}
                          placeholder="Tulis ringkasan hasil analisis atau penjelasan jawaban tugas Anda di sini..."
                          value={assignmentContent}
                          onChange={(e) => setAssignmentContent(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Simulasi Lampiran File (PDF/DOCX):</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={assignmentFile}
                          onChange={(e) => setAssignmentFile(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary">
                        <Send size={14} /> Kirim Tugas Sekarang
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Pilih salah satu materi di sidebar kiri untuk memulai pembelajaran.
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal popup when 100% complete */}
      {showCertificate && (
        <CertificateModal 
          certificate={{
            userName: user.name,
            courseTitle: course.title
          }}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
