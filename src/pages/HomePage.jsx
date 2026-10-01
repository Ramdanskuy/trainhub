import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { CourseCard } from '../components/CourseCard';
import { BookOpen, CheckSquare, TrendingUp, Award, Clock, ArrowRight, Play, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const HomePage = () => {
  const { user, navigateTo } = useAuth();
  const [summary, setSummary] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, trnRes] = await Promise.all([
        api.getMyTrainings(),
        api.getTrainings()
      ]);
      if (sumRes.success) setSummary(sumRes.data);
      if (trnRes.success) setCourses(trnRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enrolledCourses = courses.filter(c => c.isEnrolled);

  return (
    <div className="main-content">
      {/* Header Banner */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Selamat datang kembali, {user.name} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Lanjutkan perjalanan pembelajaran dan tingkatkan keahlian profesional Anda hari ini.
        </p>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <StatCard 
          icon={BookOpen} 
          value={summary ? summary.courses.length : 0} 
          label="Pelatihan Diikuti" 
          subtext="Aktif bulan ini"
          color="#2563eb"
        />
        <StatCard 
          icon={CheckSquare} 
          value="2" 
          label="Tugas Perlu Dikumpulkan" 
          subtext="Tugas terdekat: 15 Okt"
          color="#f59e0b"
        />
        <StatCard 
          icon={TrendingUp} 
          value={`${summary ? summary.averageScore : 86}%`} 
          label="Capaian Keseluruhan" 
          subtext="Rata-rata evaluasi"
          color="#16a34a"
        />
        <StatCard 
          icon={Award} 
          value={summary ? summary.completedTrainingsCount : 0} 
          label="Pelatihan Selesai" 
          subtext="Sertifikat didapatkan"
          color="#7c3aed"
        />
      </div>

      {/* Continue Learning Section */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Pelatihan Sedang Diikuti
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lanjutkan kelas tempat Anda terakhir kali belajar</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('pelatihan')}>
            <span>Lihat Semua Katalog</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid-3">
            {enrolledCourses.map(course => (
              <CourseCard key={course.id} course={course} onEnrollChange={loadDashboardData} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Belum ada pelatihan yang diikuti</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Jelajahi katalog pelatihan karyawan untuk memulai modul pembelajaran baru.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => navigateTo('pelatihan')}>
              Jelajahi Katalog Pelatihan
            </button>
          </div>
        )}
      </div>

      {/* Bottom Grid: Upcoming Tasks & Recent Activity */}
      <div className="grid-2">
        {/* Upcoming Tasks Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckSquare size={18} color="var(--warning)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Tugas Perlu Dikumpulkan</h3>
            </div>
            <span className="badge badge-warning">2 Tugas</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Tugas 1: Analisis Laporan Penjualan Kuartalan</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Introduction to Data Science & Analytics
                </div>
                <div style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> Deadline: 15 Oktober 2026 (23:59 WIB)
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigateTo('classroom', 'trn-101')}>
                Kerjakan
              </button>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Tugas 2: Desain Web UI & Component Architecture</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Fullstack Web Development Modern
                </div>
                <div style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> Deadline: 20 Oktober 2026 (23:59 WIB)
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('classroom', 'trn-102')}>
                Lihat Instruksi
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
            <Clock size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Aktivitas Pembelajaran Terbaru</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12, fontSize: '13px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: 6, flexShrink: 0 }}></div>
              <div>
                <div><strong>Menyelesaikan materi video</strong> "Exploratory Data Analysis" pada Data Science.</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hari ini, 10:30 WIB</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, fontSize: '13px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb', marginTop: 6, flexShrink: 0 }}></div>
              <div>
                <div><strong>Mendapatkan nilai 95/100</strong> dari Budi Santoso pada Tugas Analisis Sales.</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Kemarin, 14:20 WIB</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, fontSize: '13px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#7c3aed', marginTop: 6, flexShrink: 0 }}></div>
              <div>
                <div><strong>Membuat thread diskusi baru</strong> di forum "Penanganan Outlier Data".</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>25 Sep 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
