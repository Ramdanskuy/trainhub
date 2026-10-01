import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { Award, TrendingUp, CheckSquare, Clock, Play, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export const ProgressPage = () => {
  const { navigateTo } = useAuth();
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const res = await api.getMyTrainings();
      if (res.success) {
        setProgressSummary(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!progressSummary) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '60px' }}>
        <p>Memuat Data Progress...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Progres & Capaian Belajar Saya
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Pantau statistik pembelajaran, perolehan nilai evaluasi, serta progres penyelesaian setiap kelas.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <StatCard 
          icon={Award} 
          value={progressSummary.completedTrainingsCount} 
          label="Pelatihan Selesai" 
          subtext="Total kelas lulus"
          color="#16a34a"
        />
        <StatCard 
          icon={TrendingUp} 
          value={`${progressSummary.averageScore}%`} 
          label="Rata-rata Nilai" 
          subtext="Evaluasi & Kuis"
          color="#2563eb"
        />
        <StatCard 
          icon={CheckSquare} 
          value={progressSummary.totalGradedTasks} 
          label="Tugas Dinilai" 
          subtext="Submission disetujui"
          color="#7c3aed"
        />
        <StatCard 
          icon={Clock} 
          value={`${progressSummary.learningTimeHours} Jam`} 
          label="Total Jam Belajar" 
          subtext="Akumulasi waktu"
          color="#f59e0b"
        />
      </div>

      {/* Detailed Per-Course Progress List */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
          Rincian Progres Per Pelatihan
        </h2>

        {progressSummary.courses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {progressSummary.courses.map(course => (
              <div key={course.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: '280px' }}>
                    {course.coverUrl && (
                      <img 
                        src={course.coverUrl} 
                        alt={course.title} 
                        style={{ width: 80, height: 60, borderRadius: '8px', objectFit: 'cover' }} 
                      />
                    )}
                    <div>
                      <span className="badge" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {course.category}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {course.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {course.completedMaterials} dari {course.totalMaterials} materi diselesaikan
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div style={{ width: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      <span>Progress</span>
                      <span>{course.progressPercent}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${course.progressPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigateTo('classroom', course.id)}
                    >
                      <Play size={14} />
                      <span>{course.progressPercent === 100 ? 'Review Kelas' : 'Lanjutkan Belajar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Belum ada data pelatihan yang sedang diikuti.
          </div>
        )}
      </div>
    </div>
  );
};
