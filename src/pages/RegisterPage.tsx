import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import {
  Calendar,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone
} from 'lucide-react';

const registerPanelBackground = new URL('../../01_hero_forest_landscape.jpg', import.meta.url).href;

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'User' as 'User' | 'Admin',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real-time password criteria
  const passwordCriteria = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };

  const validScore = Object.values(passwordCriteria).filter(Boolean).length;
  const meterColor =
    validScore <= 2
      ? '#8B3A3A'
      : validScore <= 4
      ? '#D5C4A1'
      : '#123D2C';

  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'name') {
      if (!value.trim()) error = 'Full name is required';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
    }

    if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
    }

    if (name === 'phone') {
      const cleanPhone = value.replace(/\D/g, '');
      if (!value.trim()) error = 'Phone number is required';
      else if (cleanPhone.length !== 10) error = 'Phone number must be exactly 10 digits';
    }

    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 8) error = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(value)) error = 'Requires an uppercase letter';
      else if (!/[a-z]/.test(value)) error = 'Requires a lowercase letter';
      else if (!/[0-9]/.test(value)) error = 'Requires a number';
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
        error = 'Requires a special character';
    }

    if (name === 'confirmPassword') {
      if (!value) error = 'Please confirm your password';
      else if (value !== formData.password) error = 'Passwords do not match';
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

    if (name === 'password' && touched.confirmPassword) {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
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

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const phoneErr = validateField('phone', formData.phone);
    const pwdErr = validateField('password', formData.password);
    const cpwdErr = validateField('confirmPassword', formData.confirmPassword);

    const newErrors = {
      name: nameErr,
      email: emailErr,
      phone: phoneErr,
      password: pwdErr,
      confirmPassword: cpwdErr,
    };

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      showToast('Please fix the highlighted validation errors', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      showToast(`Welcome to BookEase, ${formData.name}!`, 'success');
      if (formData.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/my-appointments');
      }
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      setErrors(prev => ({ ...prev, email: err.message || 'Registration error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5 my-auto" style={{ minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-lg-11 col-xl-10">
          <div
            className="row g-0 overflow-hidden shadow-md"
            style={{
              borderRadius: '24px',
              backgroundColor: '#FFFEFA',
              border: '1px solid #ECE5D8',
            }}
          >
            {/* Left Column: Forest Welcome Panel */}
            <div
              className="col-md-5 p-4 p-lg-5 d-none d-md-flex flex-column justify-content-between text-white"
              style={{
                backgroundColor: '#123D2C',
                backgroundImage: `linear-gradient(rgba(18, 61, 44, 0.92), rgba(18, 61, 44, 0.96)), url("${registerPanelBackground}")`,
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
                  Create Your Account
                </h3>
                <p className="small mb-4" style={{ color: '#BAC7BF', lineHeight: '1.6' }}>
                  Register as a client to reserve appointments or as an administrator to manage consultations and schedules.
                </p>

                <div className="d-flex flex-column gap-2.5 small" style={{ color: '#D2DDD7' }}>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} style={{ color: '#D5C4A1' }} />
                    <span>Instant slot reservation & reminders</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} style={{ color: '#D5C4A1' }} />
                    <span>Real-time availability and conflict guard</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} style={{ color: '#D5C4A1' }} />
                    <span>Centralized calendar and rescheduling</span>
                  </div>
                </div>
              </div>

              <div className="small pt-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#BAC7BF', zIndex: 1 }}>
                Protected with bcrypt password hashing and JWT authentication.
              </div>
            </div>

            {/* Right Column: Register Form */}
            <div className="col-md-7 p-4 p-lg-5" style={{ backgroundColor: '#FFFEFA' }}>
              <div className="mb-4">
                <span className="small text-uppercase tracking-wider fw-bold" style={{ color: '#123D2C' }}>
                  Get started
                </span>
                <h2 className="font-heading fw-bold mt-1 mb-1" style={{ color: '#123D2C' }}>
                  User Registration
                </h2>
                <p className="small mb-0 text-muted">
                  Select your system role and enter your details below.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Role Switcher */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    I am registering as:
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <label
                        className={`card p-2.5 text-center transition-all ${formData.role === 'User' ? 'border-2' : ''}`}
                        style={{
                          backgroundColor: formData.role === 'User' ? '#EFECE2' : '#FFFFFF',
                          borderColor: formData.role === 'User' ? '#123D2C' : '#E3DAC9',
                          borderRadius: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value="User"
                          checked={formData.role === 'User'}
                          onChange={handleChange}
                          className="d-none"
                        />
                        <div className="fw-bold small" style={{ color: '#123D2C' }}>Client / User</div>
                        <div className="small text-muted" style={{ fontSize: '0.72rem' }}>Book appointments</div>
                      </label>
                    </div>

                    <div className="col-6">
                      <label
                        className={`card p-2.5 text-center transition-all ${formData.role === 'Admin' ? 'border-2' : ''}`}
                        style={{
                          backgroundColor: formData.role === 'Admin' ? '#EFECE2' : '#FFFFFF',
                          borderColor: formData.role === 'Admin' ? '#123D2C' : '#E3DAC9',
                          borderRadius: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value="Admin"
                          checked={formData.role === 'Admin'}
                          onChange={handleChange}
                          className="d-none"
                        />
                        <div className="fw-bold small" style={{ color: '#123D2C' }}>Provider / Admin</div>
                        <div className="small text-muted" style={{ fontSize: '0.72rem' }}>Manage slots & services</div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${touched.name ? (errors.name ? 'is-invalid' : 'is-valid') : ''}`}
                    placeholder="e.g. Jennifer Grace"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.name && errors.name && (
                    <div className="small text-danger mt-1">{errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.email && errors.email && (
                    <div className="small text-danger mt-1">{errors.email}</div>
                  )}
                </div>

                {/* 10-Digit Phone */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Phone Number (10 digits) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    className={`form-control ${touched.phone ? (errors.phone ? 'is-invalid' : 'is-valid') : ''}`}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.phone && errors.phone && (
                    <div className="small text-danger mt-1">{errors.phone}</div>
                  )}
                </div>

                {/* Password with strength meter */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`form-control border-end-0 ${touched.password ? (errors.password ? 'is-invalid' : 'is-valid') : ''}`}
                      placeholder="At least 8 characters"
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
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="small text-danger mt-1">{errors.password}</div>
                  )}

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1 small" style={{ fontSize: '0.74rem' }}>
                        <span className="text-muted">Password strength:</span>
                        <span className="fw-bold" style={{ color: meterColor }}>
                          {validScore <= 2 ? 'Weak' : validScore <= 4 ? 'Moderate' : 'Strong'}
                        </span>
                      </div>
                      <div className="progress" style={{ height: '5px', backgroundColor: '#EFECE2' }}>
                        <div
                          className="progress-bar transition-all"
                          style={{
                            width: `${(validScore / 5) * 100}%`,
                            backgroundColor: meterColor,
                          }}
                        />
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-2 small text-muted" style={{ fontSize: '0.72rem' }}>
                        <span style={{ color: passwordCriteria.length ? '#123D2C' : undefined }}>
                          • Min 8 chars
                        </span>
                        <span style={{ color: passwordCriteria.upper ? '#123D2C' : undefined }}>
                          • Uppercase
                        </span>
                        <span style={{ color: passwordCriteria.lower ? '#123D2C' : undefined }}>
                          • Lowercase
                        </span>
                        <span style={{ color: passwordCriteria.number ? '#123D2C' : undefined }}>
                          • Number
                        </span>
                        <span style={{ color: passwordCriteria.special ? '#123D2C' : undefined }}>
                          • Symbol (!@#$)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: '#18342B' }}>
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-control ${touched.confirmPassword ? (errors.confirmPassword ? 'is-invalid' : 'is-valid') : ''}`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="small text-danger mt-1">{errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-forest w-100 py-2.5 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Complete Registration'}
                </button>

                <div className="text-center small text-muted">
                  Already registered?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#123D2C' }}>
                    Sign in here &rarr;
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
