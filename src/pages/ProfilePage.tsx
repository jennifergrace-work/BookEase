import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  KeyRound,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      showToast('Phone number must be exactly 10 digits', 'error');
      return;
    }

    try {
      setProfileSaving(true);
      await updateProfile({ name: name.trim(), phone: cleanPhone });
      showToast('Profile information updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Profile update failed', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Current password is required', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setPwdSaving(true);
      await changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Title */}
      <div className="mb-4">
        <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--olive-deep)' }}>
          Account Center
        </span>
        <h1 className="font-heading fw-bold mt-1 mb-1" style={{ color: 'var(--olivewood)' }}>
          Profile & Security Settings
        </h1>
        <p className="mb-0" style={{ color: 'var(--bark)' }}>
          Manage your personal contact details, verified credentials, and security password.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Account Summary Card */}
        <div className="col-lg-4">
          <div className="custom-card p-4 text-center mb-4">
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-3"
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: user?.role === 'Admin' ? 'var(--olivewood)' : 'var(--olive-deep)',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              {user?.name.charAt(0)}
            </div>

            <h4 className="font-heading fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
              {user?.name}
            </h4>
            <p className="small mb-2" style={{ color: 'var(--bark)' }}>{user?.email}</p>

            <div className="d-inline-flex justify-content-center mb-3">
              <span className={`badge-status-pill ${user?.role === 'Admin' ? 'badge-completed' : 'badge-confirmed'}`}>
                {user?.role} Portal
              </span>
            </div>

            <div className="border-top border-sand pt-3 text-start small d-flex flex-column gap-2" style={{ color: 'var(--bark)' }}>
              <div className="d-flex justify-content-between">
                <span>Account Status:</span>
                <span className="fw-semibold d-flex align-items-center gap-1" style={{ color: 'var(--olive-deep)' }}>
                  <CheckCircle2 size={13} /> Active & Verified
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>System Role:</span>
                <span className="fw-semibold" style={{ color: 'var(--olivewood)' }}>{user?.role}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>User Identifier:</span>
                <span className="font-monospace text-truncate" style={{ maxWidth: '140px', color: 'var(--olivewood)' }}>
                  {user?.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="col-lg-8">
          {/* Edit Profile Details */}
          <div className="custom-card p-4 p-md-4 mb-4">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--olivewood)' }}>
              <User size={18} style={{ color: 'var(--olive-deep)' }} />
              Personal Information
            </h5>

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address (Read-only):</label>
                <input
                  type="email"
                  className="form-control"
                  style={{ backgroundColor: 'var(--parchment)' }}
                  value={user?.email}
                  disabled
                />
                <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                  Email address serves as your primary login identifier.
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Phone Number (10 digits):</label>
                <input
                  type="tel"
                  maxLength={10}
                  className="form-control"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom d-inline-flex align-items-center gap-2"
                disabled={profileSaving}
              >
                <Save size={16} />
                {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="custom-card p-4 p-md-4">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--olivewood)' }}>
              <KeyRound size={18} style={{ color: 'var(--olive-deep)' }} />
              Security & Password
            </h5>

            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Current Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">New Password (Min 8 chars, 1 uppercase, 1 special):</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirm New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary-custom d-inline-flex align-items-center gap-2"
                disabled={pwdSaving}
              >
                <Lock size={16} />
                {pwdSaving ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
