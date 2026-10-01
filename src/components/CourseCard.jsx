import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Play, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const CourseCard = ({ course, onEnrollChange }) => {
  const { navigateTo, addToast } = useAuth();

  const handleEnroll = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.enroll(course.id);
      if (res.success) {
        addToast("Berhasil mendaftar pelatihan!", "success");
        if (onEnrollChange) onEnrollChange();
      } else {
        addToast(res.message, "info");
      }
    } catch (err) {
      addToast("Terjadi kesalahan saat mendaftar.", "error");
    }
  };

  const getLevelBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'badge-beginner';
      case 'intermediate': return 'badge-intermediate';
      case 'advanced': return 'badge-advanced';
      default: return 'badge-beginner';
    }
  };

  return (
    <div 
      className="card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        overflow: 'hidden', 
        padding: 0,
        cursor: 'pointer'
      }}
      onClick={() => navigateTo('detail', course.id)}
    >
      {/* Thumbnail Cover */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img 
          src={course.coverUrl} 
          alt={course.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <span className={`badge ${getLevelBadgeClass(course.level)}`}>
            {course.level}
          </span>
          <span className="badge" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', color: 'white' }}>
            {course.category}
          </span>
        </div>
        {course.isEnrolled && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span className="badge badge-in_progress" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <CheckCircle size={12} /> Diikuti
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
            {course.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>
        </div>

        <div>
          {/* Mentor & Duration */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img 
                src={course.mentorAvatar} 
                alt={course.mentor} 
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} 
              />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {course.mentor}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--text-muted)' }}>
              <Clock size={13} />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Progress Indicator if enrolled */}
          {course.isEnrolled ? (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Progress Belajar</span>
                <span>{course.progressPercent || 0}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${course.progressPercent || 0}%` }}></div>
              </div>
            </div>
          ) : null}

          {/* Action CTA Button */}
          {course.isEnrolled ? (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('classroom', course.id);
              }}
            >
              <Play size={14} />
              <span>{course.progressPercent === 100 ? 'Review Materi' : 'Lanjutkan Belajar'}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={handleEnroll}
              >
                <BookOpen size={14} />
                <span>Ikuti Kelas</span>
              </button>
              <button 
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('detail', course.id);
                }}
              >
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
