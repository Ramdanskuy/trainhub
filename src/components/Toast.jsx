import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toasts } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="toast"
          style={{
            borderLeft: toast.type === 'error' ? '4px solid var(--danger)' : 
                       toast.type === 'info' ? '4px solid var(--info)' : 
                       '4px solid var(--primary)'
          }}
        >
          {toast.type === 'error' && <AlertCircle size={18} color="var(--danger)" />}
          {toast.type === 'info' && <Info size={18} color="var(--info)" />}
          {toast.type === 'success' && <CheckCircle size={18} color="var(--primary)" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
