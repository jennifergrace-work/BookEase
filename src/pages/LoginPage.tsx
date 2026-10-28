import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';

const loginPanelBackground = new URL('../../01_hero_forest_landscape.jpg', import.meta.url).href;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address';
      }
    }
    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      }
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateField('email', formData.email);
    const pwdErr = validateField('password', formData.password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: pwdErr });

    if (emailErr || pwdErr) {
      showToast('Please check the validation errors', 'error');
      return;
    }

    try {
      setLoading(true);
      await login({ email: formData.email, password: formData.password });
      showToast('Signed in successfully!', 'success');

      const destination = (location.state as any)?.from?.pathname || (formData.email.includes('admin') ? '/admin/dashboard' : '/my-appointments');
      navigate(destination, { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Invalid credentials', 'error');
      setErrors(prev => ({ ...prev, general: err.message || 'Invalid email or password' }));
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (role: 'Admin' | 'User') => {
    if (role === 'Admin') {
      setFormData({ email: 'admin@bookease.com', password: 'Admin@123' });
    } else {
      setFormData({ email: 'john.doe@example.com', password: 'User@123' });
    }
    setErrors({});
  };

  return (
    <div className="container py-4 py-md-5 my-auto" style={{ minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div
            className="row g-0 overflow-hidden shadow-md"
            style={{
              borderRadius: '24px',
              backgroundColor: '#FFFEFA',
              border: '1px solid #ECE5D8',
            }}
          >
            {/* Left Column: Deep Forest Welcome Panel (Desktop) */}
            <div
              className="col-md-5 p-4 p-lg-5 d-none d-md-flex flex-column justify-content-between text-white"
              style={{
                backgroundColor: '#123D2C',
                backgroundImage: `linear-gradient(rgba(18, 61, 44, 0.92), rgba(18, 61, 44, 0.96)), url("${loginPanelBackground}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              <div className="position-relative" style={{ zIndex: 1 }}>
                <div className="d-flex align-items-center gap-2.5 mb-4">
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
                  <span className="font-heading fw-bold fs-5 text-white">
                    Book<span style={{ color: '#D5C4A1' }}>Ease</span>
                  </span>
                </div>

                <h3 className="font-heading text-white fw-bold mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.25' }}>
                  Frictionless Scheduling Portal
                </h3>
                <p className="small mb-4" style={{ color: '#BAC7BF', lineHeight: '1.6' }}>
                  Access your appointments, update provider availability, or inspect central booking logs.
                </p>

                <div className="d-flex flex-column gap-2 small" style={{ color: '#D2DDD7' }}>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={15} style={{ color: '#D5C4A1' }} />
                    <span>Real-time slot availability</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={15} style={{ color: '#D5C4A1' }} />
                    <span>Atomic conflict guard</span>
                  </div>
                </div>
              </div>

              {/* Quick Demo Login Chips */}
              <div
                className="p-3 rounded-3 mt-4 position-relative"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(213, 196, 161, 0.3)',
                  zIndex: 1,
                }}
              >
                <div className="d-flex align-items-center gap-1.5 small fw-semibold text-white mb-2">
                  <Sparkles size={14} style={{ color: '#D5C4A1' }} />
                  <span>Evaluation Quick Fill</span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm flex-grow-1 py-1"
                    style={{
                      fontSize: '0.78rem',
                      backgroundColor: '#D5C4A1',
                      color: '#123D2C',
                      fontWeight: 600,
                      borderRadius: '8px',
                    }}
                    onClick={() => fillQuickCredentials('Admin')}
                  >
                    Admin Test
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm flex-grow-1 py-1"
                    style={{
                      fontSize: '0.78rem',
                      backgroundColor: '#A8B69A',
                      color: '#123D2C',
                      fontWeight: 600,
                      borderRadius: '8px',
                    }}
                    onClick={() => fillQuickCredentials('User')}
                  >
                    Client Test
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Login Form */}
            <div className="col-md-7 p-4 p-lg-5" style={{ backgroundColor: '#FFFEFA' }}>
              <div className="mb-4">
                <span className="small text-uppercase tracking-wider fw-bold" style={{ color: '#123D2C' }}>
                  Secure Authentication
                </span>
                <h2 className="font-heading fw-bold mt-1 mb-1" style={{ color: '#123D2C' }}>
                  Sign In to BookEase
                </h2>
                <p className="small mb-0 text-muted">
                  Enter your registered email and password to proceed.
                </p>
              </div>

              {errors.general && (
                <div
                  className="alert p-2.5 small d-flex align-items-center gap-2 mb-3"
                  style={{
                    backgroundColor: 'rgba(139, 58, 58, 0.1)',
                    color: '#8B3A3A',
                    border: '1px solid rgba(139, 58, 58, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <ShieldAlert size={16} />
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: '#E3DAC9' }}>
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control border-start-0 ${touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''}`}
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  {touched.email && errors.email && (
                    <div className="small text-danger mt-1">{errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderColor: '#E3DAC9' }}>
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`form-control border-start-0 border-end-0 ${touched.password ? (errors.password ? 'is-invalid' : 'is-valid') : ''}`}
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0 text-muted"
                      style={{ borderColor: '#E3DAC9' }}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="small text-danger mt-1">{errors.password}</div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-forest w-100 py-2.5 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  ) : null}
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                {/* Mobile Demo Chips */}
                <div className="d-md-none p-3 rounded-3 mb-3" style={{ backgroundColor: '#F8F5ED', border: '1px solid #ECE5D8' }}>
                  <div className="small fw-semibold mb-2" style={{ color: '#123D2C' }}>
                    Viva Quick Test Fill:
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-sand flex-grow-1"
                      onClick={() => fillQuickCredentials('Admin')}
                    >
                      Fill Admin
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-forest flex-grow-1"
                      onClick={() => fillQuickCredentials('User')}
                    >
                      Fill Client
                    </button>
                  </div>
                </div>

                <div className="text-center small text-muted">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#123D2C' }}>
                    Create account &rarr;
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
