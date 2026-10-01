import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, Search, Send, Clock, User, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const ForumPage = () => {
  const { user, addToast } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // New Discussion Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Expand Thread State
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadDiscussions();
  }, [courseFilter, search]);

  const loadDiscussions = async () => {
    try {
      const res = await api.getDiscussions(courseFilter, search);
      if (res.success) {
        setDiscussions(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const res = await api.createDiscussion('trn-101', newTitle, newContent);
      if (res.success) {
        addToast("Thread diskusi baru berhasil dipublikasikan!", "success");
        setIsModalOpen(false);
        setNewTitle('');
        setNewContent('');
        await loadDiscussions();
      }
    } catch (err) {
      addToast("Gagal membuat thread.", "error");
    }
  };

  const handleSendReply = async (discussionId) => {
    if (!replyText) return;

    try {
      const res = await api.replyDiscussion(discussionId, replyText);
      if (res.success) {
        addToast("Balasan berhasil dikirim!", "success");
        setReplyText('');
        await loadDiscussions();
      }
    } catch (err) {
      addToast("Gagal mengirim balasan.", "error");
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Forum Diskusi Lintas Pelatihan
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Tanyakan kesulitan belajar, berdiskusi dengan mentor & sesama karyawan di seluruh divisi perusahaan.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Buat Thread Diskusi</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1, minWidth: '220px' }}>
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              style={{ width: '100%' }}
              placeholder="Cari kata kunci diskusi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">Semua Pelatihan</option>
            <option value="trn-101">Introduction to Data Science & Analytics</option>
            <option value="trn-102">Fullstack Web Development Modern</option>
          </select>
        </div>
      </div>

      {/* Discussion Threads List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {discussions.map(disc => {
          const isExpanded = expandedThreadId === disc.id;
          return (
            <div key={disc.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: '8px' }}>
                <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                  {disc.courseTitle}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{new Date(disc.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              <h3 
                style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', cursor: 'pointer' }}
                onClick={() => setExpandedThreadId(isExpanded ? null : disc.id)}
              >
                {disc.title}
              </h3>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                {disc.content}
              </p>

              {/* Author Footer & Reply Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={disc.userAvatar} alt={disc.userName} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{disc.userName}</span>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setExpandedThreadId(isExpanded ? null : disc.id)}
                >
                  <MessageSquare size={14} />
                  <span>{disc.replies ? disc.replies.length : 0} Balasan</span>
                </button>
              </div>

              {/* Expanded Replies Section */}
              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Balasan Diskusi ({disc.replies ? disc.replies.length : 0})</h4>

                  {disc.replies && disc.replies.map(rep => (
                    <div key={rep.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--background)', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={rep.userAvatar} alt={rep.userName} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{rep.userName}</span>
                          {rep.userRole === 'admin' && (
                            <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '10px' }}>
                              <ShieldCheck size={10} /> Trainer Admin
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(rep.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{rep.content}</p>
                    </div>
                  ))}

                  {/* Reply Input Form */}
                  <div style={{ display: 'flex', gap: 8, marginTop: '12px' }}>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Tulis balasan Anda..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => handleSendReply(disc.id)}>
                      <Send size={14} /> Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Discussion Thread Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Buat Thread Diskusi Baru</div>
            </div>
            <form onSubmit={handleCreateThread}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Thread:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Contoh: Pertanyaan seputar instalasi Pandas..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Isi Pertanyaan / Diskusi:</label>
                  <textarea 
                    className="form-textarea" 
                    rows={5}
                    placeholder="Jelaskan pertanyaan atau topik diskusi secara rinci..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Publikasikan Thread</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
