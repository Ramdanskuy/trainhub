import React, { useEffect, useState } from 'react';
import { Bell, BookOpen, CalendarClock, CheckCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const notificationIcons = {
  grade: CheckCircle,
  discussion: MessageSquare,
  deadline: CalendarClock
};

export const NotificationsPage = () => {
  const { openNotification } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await api.getNotifications();
        if (response.success) setNotifications(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  return (
    <main className="main-content">
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div className="brand-icon"><Bell size={19} /></div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Notifikasi</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 3 }}>Pembaruan tugas, diskusi, dan tenggat pelatihan Anda.</p>
        </div>
      </header>

      {loading ? (
        <div className="card" style={{ padding: 24, color: 'var(--text-secondary)' }}>Memuat notifikasi...</div>
      ) : notifications.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(notification => {
            const Icon = notificationIcons[notification.type] || Bell;
            return (
              <article key={notification.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
                <div style={{ width: 40, height: 40, flex: '0 0 40px', display: 'grid', placeItems: 'center', borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary-dark)' }}>
                  <Icon size={19} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700 }}>{notification.title}</h2>
                  <p style={{ marginTop: 3, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notification.message}</p>
                  <p style={{ marginTop: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                    {notification.trainingTitle} · {new Date(notification.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => openNotification(notification)}>
                  <BookOpen size={14} /> {notification.type === 'grade' ? 'Lihat nilai' : notification.type === 'discussion' ? 'Buka diskusi' : 'Buka tugas'}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Bell size={26} color="var(--text-muted)" style={{ marginBottom: 10 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Belum ada notifikasi</h2>
          <p style={{ marginTop: 5, color: 'var(--text-secondary)' }}>Pemberitahuan pelatihan akan muncul di sini.</p>
        </div>
      )}
    </main>
  );
};