import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container py-5 text-center my-auto">
      <div
        className="card p-5 mx-auto shadow-sm"
        style={{
          maxWidth: '480px',
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--sand)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div
          className="rounded-circle d-inline-flex p-3 mx-auto mb-3"
          style={{
            backgroundColor: 'rgba(154, 79, 60, 0.12)',
            color: 'var(--clay)'
          }}
        >
          <AlertCircle size={36} />
        </div>
        <h1
          className="display-4 font-heading fw-bold mb-1"
          style={{ color: 'var(--olivewood)' }}
        >
          404
        </h1>
        <h4
          className="font-heading fw-bold mb-2"
          style={{ color: 'var(--olivewood)' }}
        >
          Page Not Found
        </h4>
        <p className="text-muted small mb-4">
          The requested page route could not be found or has been moved to another location.
        </p>
        <Link to="/" className="btn btn-primary-custom d-inline-flex align-items-center gap-2 mx-auto">
          <Home size={16} />
          Return to BookEase Home
        </Link>
      </div>
    </div>
  );
};
