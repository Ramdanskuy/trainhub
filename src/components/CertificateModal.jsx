import React from 'react';
import { Award, X, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '720px', padding: 0, overflow: 'hidden' }}
      >
        {/* Certificate Border Header */}
        <div style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <Award size={20} />
            <span>Sertifikat Kelulusan Resmi — TrainHub</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Certificate Paper View */}
        <div style={{ padding: '36px', backgroundColor: '#fff8f0', border: '8px double #d97706', margin: '20px', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#92400e', fontWeight: 700, marginBottom: '6px' }}>
            TrainHub Corporate Learning Academy
          </div>

          <h2 style={{ fontSize: '26px', fontFamily: 'serif', fontWeight: 700, color: '#451a03', marginBottom: '16px' }}>
            SERTIFIKAT KELULUSAN
          </h2>

          <p style={{ fontSize: '13px', color: '#78350f', marginBottom: '12px' }}>
            Sertifikat ini secara resmi diberikan kepada:
          </p>

          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', textDecoration: 'underline', marginBottom: '16px' }}>
            {certificate.userName}
          </h3>

          <p style={{ fontSize: '13px', color: '#78350f', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
            Telah menyelesaikan dengan hasil memuaskan seluruh materi pembelajaran, evaluasi tugas, serta kuis pada pelatihan internal:
          </p>

          <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a', display: 'inline-block', marginBottom: '24px' }}>
            "{certificate.courseTitle}"
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #d97706' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#92400e' }}>Tanggal Kelulusan</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#451a03' }}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ShieldCheck size={32} color="#15803d" />
              <div style={{ fontSize: '10px', color: '#15803d', fontWeight: 700, marginTop: '4px' }}>VERIFIED CERTIFICATE</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#92400e' }}>Head of Corporate Learning</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#451a03', marginTop: '16px', borderTop: '1px solid #451a03', paddingTop: '4px' }}>
                Budi Santoso, M.Kom
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Tutup</button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Download size={14} /> Cetak / Unduh Sertifikat (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
