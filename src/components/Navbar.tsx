import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastNotification';
import {
  Calendar,
  Clock,
  Users,
  LayoutDashboard,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg sticky-top bookease-navbar"
        style={{
          backgroundColor: '#F8F5ED',
          borderBottom: '1px solid #E8E2D5',
          zIndex: 1020,
        }}
      >
        <div className="container">
          {/* Brand Logo with Forest Green Tile */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2.5 text-decoration-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: '#123D2C',
                color: '#FFFEFA',
                borderRadius: '11px',
                boxShadow: '0 3px 8px rgba(18, 61, 44, 0.25)',
              }}
            >
              <Calendar size={20} strokeWidth={2.4} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#123D2C',
              }}
            >
              Book<span style={{ color: '#2B4A3A', fontWeight: 500 }}>Ease</span>
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="navbar-toggler border-0 shadow-none d-lg-none p-1"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{ color: '#123D2C' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Links */}
          <div className="navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `nav-link px-3 py-1.5 rounded-pill ${
                      isActive
                        ? 'fw-semibold'
                        : 'text-muted'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#123D2C' : '#4E5F55',
                    backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                    fontSize: '0.93rem',
                  })}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `nav-link px-3 py-1.5 rounded-pill ${
                      isActive
                        ? 'fw-semibold'
                        : 'text-muted'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#123D2C' : '#4E5F55',
                    backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                    fontSize: '0.93rem',
                  })}
                >
                  Services
                </NavLink>
              </li>

              {/* Client Routes */}
              {user && user.role === 'User' && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/book"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      Book Appointment
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/my-appointments"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      My Appointments
                    </NavLink>
                  </li>
                </>
              )}

              {/* Admin Routes */}
              {user && user.role === 'Admin' && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/appointments"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      Appointments
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/services"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/availability"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      Availability
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        `nav-link px-3 py-1.5 rounded-pill ${
                          isActive ? 'fw-semibold' : 'text-muted'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#123D2C' : '#4E5F55',
                        backgroundColor: isActive ? '#ECE7DB' : 'transparent',
                        fontSize: '0.93rem',
                      })}
                    >
                      Users
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Right side controls */}
            <div className="d-flex align-items-center gap-3">
              {/* User Dropdown / Sign-in */}
              {user ? (
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn d-flex align-items-center gap-2 p-1 pe-2.5 border-0 bg-transparent"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#123D2C',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <span className="small fw-semibold text-truncate d-none d-xl-inline" style={{ maxWidth: '110px', color: '#18342B' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <span
                      className="badge rounded-pill py-0.5 px-2"
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: user.role === 'Admin' ? '#123D2C' : '#A8B69A',
                        color: user.role === 'Admin' ? '#FFFFFF' : '#123D2C',
                      }}
                    >
                      {user.role}
                    </span>
                    <ChevronDown size={14} style={{ color: '#4E5F55' }} />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="position-absolute end-0 mt-2 py-2 shadow-lg custom-card"
                      style={{ minWidth: '220px', zIndex: 1050, backgroundColor: '#FFFEFA' }}
                    >
                      <div className="px-3 py-2 border-bottom" style={{ borderColor: '#E8E2D5' }}>
                        <div className="fw-semibold small text-truncate" style={{ color: '#18342B' }}>
                          {user.name}
                        </div>
                        <div className="small text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
                          {user.email}
                        </div>
                      </div>

                      {user.role === 'Admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item px-3 py-2 small d-flex align-items-center gap-2 text-decoration-none"
                          style={{ color: '#18342B' }}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard size={15} style={{ color: '#123D2C' }} />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="dropdown-item px-3 py-2 small d-flex align-items-center gap-2 text-decoration-none"
                        style={{ color: '#18342B' }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <UserIcon size={15} style={{ color: '#123D2C' }} />
                        Profile Settings
                      </Link>

                      {user.role === 'User' && (
                        <Link
                          to="/my-appointments"
                          className="dropdown-item px-3 py-2 small d-flex align-items-center gap-2 text-decoration-none"
                          style={{ color: '#18342B' }}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <CalendarCheck size={15} style={{ color: '#123D2C' }} />
                          My Appointments
                        </Link>
                      )}

                      <div className="border-top my-1" style={{ borderColor: '#E8E2D5' }} />

                      <button
                        type="button"
                        className="dropdown-item px-3 py-2 small text-danger d-flex align-items-center gap-2 w-100 text-start"
                        onClick={handleLogout}
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <Link
                    to="/login"
                    className="text-decoration-none small fw-medium"
                    style={{ color: '#18342B' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/book"
                    className="btn btn-forest px-3.5 py-2 small text-decoration-none d-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.88rem' }}
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Offcanvas Overlay */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 1040,
            backgroundColor: 'rgba(18, 61, 44, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="position-absolute end-0 top-0 h-100 p-4 d-flex flex-column"
            style={{
              width: '80%',
              maxWidth: '320px',
              backgroundColor: '#F8F5ED',
              color: '#18342B',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: '#E8E2D5' }}>
              <span className="font-heading fw-bold fs-5" style={{ color: '#123D2C' }}>Menu</span>
              <button
                type="button"
                className="btn btn-sm p-0 border-0"
                style={{ color: '#123D2C' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
              <li>
                <Link
                  to="/"
                  className="nav-link py-2 fw-medium"
                  style={{ color: '#18342B' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="nav-link py-2 fw-medium"
                  style={{ color: '#18342B' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Services
                </Link>
              </li>

              {user?.role === 'User' && (
                <>
                  <li>
                    <Link
                      to="/book"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Book Appointment
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-appointments"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Appointments
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'Admin' && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/appointments"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Appointments
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/services"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Services Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/availability"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Working Hours & Availability
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/users"
                      className="nav-link py-2 fw-medium"
                      style={{ color: '#18342B' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Users & Staff
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-auto pt-3 border-top" style={{ borderColor: '#E8E2D5' }}>
              {user ? (
                <div>
                  <div className="small text-muted mb-2">Signed in as {user.name}</div>
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100 btn-sm mb-2"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/login"
                    className="btn btn-outline-forest btn-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/book"
                    className="btn btn-forest btn-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
