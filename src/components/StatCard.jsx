import React from 'react';

export const StatCard = ({ icon: Icon, value, label, subtext, color = 'var(--primary)' }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div 
        style={{ 
          width: 48, 
          height: 48, 
          borderRadius: '12px', 
          backgroundColor: `${color}15`, 
          color: color, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </div>
        {subtext && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
