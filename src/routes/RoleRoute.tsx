import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const RoleRoute: React.FC<{ role: Role; children: React.ReactNode }> = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" style={{ color: 'var(--olive-deep)' }} role="status">
          <span className="visually-hidden">Checking authorizations...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return (
      <div className="container py-5 text-center">
        <div className="card custom-card p-5 mx-auto" style={{ maxWidth: '520px' }}>
          <h3 className="text-danger font-heading mb-3">Access Denied</h3>
          <p className="text-muted mb-4">
            You do not have permission to access this page. This section requires {role} privileges.
          </p>
          <a href="/" className="btn btn-primary-custom mx-auto">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
