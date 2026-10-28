import React from 'react';
import { Calendar, Shield, Award, KeyRound, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastNotification';

const forestFooterBackground = new URL('../../12_forest_footer_background.jpg', import.meta.url).href;

export const Footer: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleQuickLogin = async (role: 'Admin' | 'User') => {
    try {
      if (role === 'Admin') {
        await login({ email: 'admin@bookease.com', password: 'Admin@123' });
        showToast('Logged in as Dr. Sarah Mitchell (Provider / Admin)', 'success');
        navigate('/admin/dashboard');
      } else {
        await login({ email: 'john.doe@example.com', password: 'User@123' });
        showToast('Logged in as John Doe (Client)', 'success');
        navigate('/my-appointments');
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <footer
      className="mt-auto pt-5 pb-4 text-white position-relative"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(13,43,31,0.90), rgba(13,43,31,0.96)), url("${forestFooterBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2.5 mb-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#D5C4A1',
                  color: '#123D2C',
                  borderRadius: '10px',
                }}
              >
                <Calendar size={19} strokeWidth={2.4} />
              </div>
              <h5 className="font-heading mb-0 text-white fs-5 fw-bold">
                Book<span style={{ color: '#D5C4A1' }}>Ease</span>
              </h5>
            </div>
            <p className="small mb-3" style={{ color: '#BAC7BF', lineHeight: '1.6', maxWidth: '320px' }}>
              Full-featured appointment scheduling platform engineered with MongoDB, Express, React, and Node.js.
            </p>
            <div className="d-flex align-items-center gap-2 small" style={{ color: '#D5C4A1' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A8B69A', display: 'inline-block' }} />
              <span>Real-time availability  •  Atomic conflict guard</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase tracking-wider fw-bold mb-3" style={{ fontSize: '0.82rem', color: '#E8E2D5' }}>
              Navigation
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-decoration-none" style={{ color: '#BAC7BF' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-decoration-none" style={{ color: '#BAC7BF' }}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-decoration-none" style={{ color: '#BAC7BF' }}>
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-decoration-none" style={{ color: '#BAC7BF' }}>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Demo Access (Panel 6 right column) */}
          <div className="col-lg-5 col-md-12">
            <div
              className="p-3.5 rounded-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(213, 196, 161, 0.2)',
                borderRadius: '14px',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center gap-2 text-white fw-semibold small">
                  <KeyRound size={16} style={{ color: '#D5C4A1' }} />
                  <span>Evaluation & Viva Demo Credentials</span>
                </div>
              </div>

              <p className="small mb-3" style={{ fontSize: '0.78rem', color: '#BAC7BF' }}>
                Instant role credentials for academic grading and live demonstrations:
              </p>

              <div className="row g-2">
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn w-100 p-2.5 text-start rounded-3 d-flex flex-column"
                    style={{
                      backgroundColor: 'rgba(213, 196, 161, 0.12)',
                      border: '1px solid rgba(213, 196, 161, 0.3)',
                    }}
                    onClick={() => handleQuickLogin('Admin')}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100 mb-1">
                      <span className="fw-semibold text-white small">Provider / Admin</span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: '#D5C4A1',
                          color: '#123D2C',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                        }}
                      >
                        Admin
                      </span>
                    </div>
                    <span className="font-monospace" style={{ fontSize: '0.74rem', color: '#D5C4A1' }}>
                      admin@bookease.com
                    </span>
                  </button>
                </div>

                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn w-100 p-2.5 text-start rounded-3 d-flex flex-column"
                    style={{
                      backgroundColor: 'rgba(168, 182, 154, 0.12)',
                      border: '1px solid rgba(168, 182, 154, 0.3)',
                    }}
                    onClick={() => handleQuickLogin('User')}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100 mb-1">
                      <span className="fw-semibold text-white small">Client User</span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: '#A8B69A',
                          color: '#123D2C',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                        }}
                      >
                        Client
                      </span>
                    </div>
                    <span className="font-monospace" style={{ fontSize: '0.74rem', color: '#A8B69A' }}>
                      john.doe@example.com
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 border-top small"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)', color: '#8E9E95', fontSize: '0.78rem' }}
        >
          <div>© 2026 BookEase – Web Technology (IA3) Appointment Scheduling Platform.</div>
          <div className="mt-2 mt-md-0">MERN Stack • Atomic Indexing • JWT + Role Guards</div>
        </div>
      </div>
    </footer>
  );
};
