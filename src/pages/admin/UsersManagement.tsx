import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { User, Role } from '../../types';
import { useToast } from '../../components/ToastNotification';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Phone,
  Mail,
  Shield,
  UserCheck
} from 'lucide-react';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  // Create / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'User' as Role,
    isActive: true,
  });

  // Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.users.getAll();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'User',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone,
      password: '',
      role: u.role,
      isActive: u.isActive,
    });
    setModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (!editingUser && !formData.password) {
      showToast('Password is required for new accounts', 'error');
      return;
    }

    try {
      if (editingUser) {
        await api.users.update(editingUser.id, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          isActive: formData.isActive,
        });
        showToast('User record updated successfully!', 'success');
      } else {
        await api.users.create(formData);
        showToast('New user registered successfully!', 'success');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const openDeleteModal = (u: User) => {
    setUserToDelete(u);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.users.delete(userToDelete.id);
      showToast('User deleted from platform.', 'success');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove user', 'error');
    }
  };

  const toggleStatus = async (u: User) => {
    try {
      await api.users.update(u.id, { isActive: !u.isActive });
      showToast(`User account ${!u.isActive ? 'activated' : 'deactivated'}`, 'info');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  return (
    <div className="container py-4 pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge badge-status-confirmed mb-2">Access Control</span>
          <h1 className="font-heading fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
            User Accounts & Roles
          </h1>
          <p className="text-muted mb-0">Manage registered clients, staff roles, and account permissions.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary-custom d-flex align-items-center gap-2"
          onClick={openAddModal}
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="card p-3 mb-4 shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--sand)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div className="input-group" style={{ maxWidth: '420px' }}>
          <span
            className="input-group-text border-end-0"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--sand)',
              color: 'var(--sage)'
            }}
          >
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--sand)',
              color: 'var(--olivewood)'
            }}
          />
        </div>
      </div>

      {/* Users Table / Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--olive-deep)' }} role="status">
            <span className="visually-hidden">Loading registered users...</span>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div
          className="card p-5 text-center my-4 shadow-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--sand)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Users size={40} className="mx-auto mb-3" style={{ color: 'var(--sage)' }} />
          <h4 className="font-heading fw-bold" style={{ color: 'var(--olivewood)' }}>
            No users found
          </h4>
          <p className="text-muted small mb-0">No records match your query.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div
            className="card d-none d-md-block overflow-hidden shadow-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--sand)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    backgroundColor: 'var(--sand)',
                    borderBottom: '2px solid rgba(102, 93, 78, 0.2)'
                  }}
                >
                  <tr>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>User Details</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Phone</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Role</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Status</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold text-end" style={{ color: 'var(--olivewood)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td className="px-3 py-3">
                        <div className="d-flex align-items-center gap-2.5">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                            style={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: u.role === 'Admin' ? 'var(--olivewood)' : 'var(--olive-deep)',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                            }}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold" style={{ color: 'var(--olivewood)' }}>{u.name}</div>
                            <div className="text-muted small">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        <span className="small text-muted">{u.phone}</span>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        <span
                          className="badge rounded-pill px-2.5 py-1"
                          style={{
                            backgroundColor: u.role === 'Admin' ? 'var(--olivewood)' : 'var(--olive)',
                            color: u.role === 'Admin' ? 'var(--parchment)' : 'var(--olivewood)',
                            border: '1px solid var(--sand)',
                            fontWeight: 600,
                          }}
                        >
                          {u.role === 'Admin' ? 'Service Provider (Admin)' : 'Client (User)'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        <button
                          type="button"
                          className="badge border-0 rounded-pill px-2.5 py-1"
                          style={{
                            cursor: 'pointer',
                            backgroundColor: u.isActive ? 'var(--olive)' : 'rgba(154, 79, 60, 0.15)',
                            color: u.isActive ? 'var(--olivewood)' : 'var(--clay)',
                            fontWeight: 600
                          }}
                          onClick={() => toggleStatus(u)}
                          title="Click to toggle status"
                        >
                          {u.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-custom me-2"
                          onClick={() => openEditModal(u)}
                          title="Edit details/role"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger-custom"
                          onClick={() => openDeleteModal(u)}
                          title="Remove user"
                          disabled={u.email === 'admin@bookease.com'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="d-md-none d-flex flex-column gap-3">
            {filteredUsers.map(u => (
              <div
                key={u.id}
                className="card p-3 shadow-sm"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--sand)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: u.role === 'Admin' ? 'var(--olivewood)' : 'var(--olive-deep)',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--olivewood)' }}>
                      {u.name}
                    </h6>
                    <span className="small text-muted">{u.email}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-1 small mb-3 text-muted">
                  <span className="d-flex align-items-center gap-2">
                    <Phone size={13} style={{ color: 'var(--sage)' }} /> {u.phone}
                  </span>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span
                      className="badge rounded-pill px-2.5 py-1"
                      style={{
                        backgroundColor: u.role === 'Admin' ? 'var(--olivewood)' : 'var(--olive)',
                        color: u.role === 'Admin' ? 'var(--parchment)' : 'var(--olivewood)',
                        fontWeight: 600,
                      }}
                    >
                      {u.role}
                    </span>
                    <button
                      type="button"
                      className="badge border-0 rounded-pill px-2.5 py-1"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: u.isActive ? 'var(--olive)' : 'rgba(154, 79, 60, 0.15)',
                        color: u.isActive ? 'var(--olivewood)' : 'var(--clay)',
                        fontWeight: 600
                      }}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2" style={{ borderTop: '1px solid var(--sand)' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-custom"
                    onClick={() => openEditModal(u)}
                  >
                    <Edit2 size={14} className="me-1" /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger-custom"
                    onClick={() => openDeleteModal(u)}
                    disabled={u.email === 'admin@bookease.com'}
                  >
                    <Trash2 size={14} className="me-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(44, 46, 38, 0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div className="modal-header border-0 pt-4 px-4 pb-0">
                <h5 className="modal-title font-heading fw-bold" style={{ color: 'var(--olivewood)' }}>
                  {editingUser ? 'Edit User Record' : 'Register New User'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                />
              </div>

              <form onSubmit={handleSaveUser}>
                <div className="modal-body px-4 py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                      Full Name <span style={{ color: 'var(--clay)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                      Email <span style={{ color: 'var(--clay)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      disabled={!!editingUser}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                      10-Digit Phone <span style={{ color: 'var(--clay)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      className="form-control"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  {!editingUser && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                        Password <span style={{ color: 'var(--clay)' }}>*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                      System Role <span style={{ color: 'var(--clay)' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
                    >
                      <option value="User">User / Client</option>
                      <option value="Admin">Admin / Service Provider</option>
                    </select>
                  </div>

                  <div className="form-check form-switch pt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="userActiveSwitch"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="userActiveSwitch" style={{ color: 'var(--olivewood)' }}>
                      Account is active
                    </label>
                  </div>
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-custom"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom">
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete User Record"
        message={`Are you sure you want to remove ${userToDelete?.name} (${userToDelete?.email})? This user will no longer be able to log in or schedule appointments.`}
        confirmLabel="Yes, Remove User"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
};
