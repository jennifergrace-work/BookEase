import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
}) => {
  return (
    <div className="custom-card p-5 text-center my-4 mx-auto" style={{ maxWidth: '540px' }}>
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto"
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'var(--olive-soft)',
          color: 'var(--olive-deep)',
        }}
      >
        {icon || (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            <path d="M12 6v6l4 2" />
          </svg>
        )}
      </div>

      <h4 className="font-heading mb-2" style={{ color: 'var(--olivewood)' }}>
        {title}
      </h4>
      <p className="small mb-4 mx-auto" style={{ color: 'var(--bark)', maxWidth: '400px' }}>
        {description}
      </p>

      {actionLabel && (
        actionHref ? (
          <Link to={actionHref} className="btn btn-olive-cta">
            {actionLabel}
          </Link>
        ) : onAction ? (
          <button type="button" onClick={onAction} className="btn btn-olive-cta">
            {actionLabel}
          </button>
        ) : null
      )}
    </div>
  );
};
