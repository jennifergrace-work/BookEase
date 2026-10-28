import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {toasts.map(toast => {
          let borderColor = 'var(--sand)';
          let icon = <Info size={18} style={{ color: 'var(--bark)' }} />;

          if (toast.type === 'success') {
            borderColor = 'var(--olive-deep)';
            icon = <CheckCircle2 size={18} style={{ color: 'var(--olive-deep)' }} />;
          } else if (toast.type === 'error') {
            borderColor = 'var(--clay)';
            icon = <AlertCircle size={18} style={{ color: 'var(--clay)' }} />;
          }

          return (
            <div
              key={toast.id}
              className="toast show mb-2 shadow-sm"
              role="alert"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--sand)',
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                minWidth: '320px',
                maxWidth: '420px',
              }}
            >
              <div className="toast-body d-flex align-items-center justify-content-between py-2.5 px-3">
                <div className="d-flex align-items-center gap-2.5">
                  {icon}
                  <span className="small fw-medium" style={{ color: 'var(--olivewood)' }}>
                    {toast.message}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-sm ms-2"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close"
                  style={{ filter: 'opacity(0.6)' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
