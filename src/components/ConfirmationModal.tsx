import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(44, 46, 38, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-custom border-0 shadow-lg">
          <div className="modal-header border-0 pt-4 px-4 pb-0">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: isDestructive ? 'var(--clay-soft)' : 'var(--olive-soft)',
                  color: isDestructive ? 'var(--clay)' : 'var(--olive-deep)',
                }}
              >
                <AlertTriangle size={20} strokeWidth={1.75} />
              </div>
              <h5 className="modal-title font-heading fw-bold mb-0" style={{ color: 'var(--olivewood)' }}>
                {title}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="Close"
              style={{ filter: 'opacity(0.6)' }}
            />
          </div>

          <div className="modal-body px-4 py-3">
            <p className="mb-0" style={{ color: 'var(--bark)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {message}
            </p>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary-custom"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={isDestructive ? 'btn btn-danger-custom' : 'btn btn-primary-custom'}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
