import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CourseCard } from '../components/CourseCard';
import { Search, Filter, Compass, Plus } from 'lucide-react';
import { api } from '../services/api';

export const CatalogPage = () => {
  const { user, globalSearch, setGlobalSearch, navigateTo } = useAuth();
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Semua'); // 'Semua', 'Sedang Diikuti', 'Belum Diikuti', 'Telah Selesai'
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [levelFilter, setLevelFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [globalSearch, categoryFilter, levelFilter]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getTrainings({
        search: globalSearch,
        category: categoryFilter,
        level: levelFilter
      });
      if (res.success) {
        setCourses(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (statusFilter === 'Sedang Diikuti') return course.isEnrolled && course.progressPercent < 100;
    if (statusFilter === 'Belum Diikuti') return !course.isEnrolled;
    if (statusFilter === 'Telah Selesai') return course.isEnrolled && course.progressPercent === 100;
    return true;
  });

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Katalog Pelatihan Internal
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Temukan dan ikuti program pelatihan terstruktur untuk meningkatkan kompetensi profesional Anda.
          </p>
        </div>

        {user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => navigateTo('admin')}>
            <Plus size={16} />
            <span>Tambah Pelatihan Baru</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Semua', 'Sedang Diikuti', 'Belum Diikuti', 'Telah Selesai'].map(st => (
              <button
                key={st}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search, Category & Level Dropdowns */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div className="search-box" style={{ flex: 1, minWidth: '220px' }}>
              <Search size={15} className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                style={{ width: '100%' }}
                placeholder="Cari pelatihan, judul, atau mentor..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Kategori:</span>
              <select 
                className="form-select" 
                style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Data Science">Data Science</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Security">Security</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

            {/* Level Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Level:</span>
              <select 
                className="form-select" 
                style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="Semua">Semua Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid-3">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onEnrollChange={loadCourses} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Compass size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Tidak Ada Pelatihan Ditemukan</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Coba sesuaikan kata kunci pencarian atau filter status yang Anda pilih.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setGlobalSearch('');
              setStatusFilter('Semua');
              setCategoryFilter('Semua');
              setLevelFilter('Semua');
            }}
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
