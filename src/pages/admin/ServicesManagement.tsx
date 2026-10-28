import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Service } from '../../types';
import { useToast } from '../../components/ToastNotification';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { EmptyState } from '../../components/EmptyState';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Search,
  Briefcase,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Healthcare',
    duration: 45,
    price: 100,
    isActive: true,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.services.getAll({ all: true, search: search.trim() || undefined });
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Error fetching services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: 'Healthcare',
      duration: 45,
      price: 100,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      showToast('Please provide service title and description', 'error');
      return;
    }

    try {
      if (editingService) {
        await api.services.update(editingService.id, formData);
        showToast('Service updated successfully!', 'success');
      } else {
        await api.services.create(formData);
        showToast('Service created with default schedule!', 'success');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await api.services.delete(serviceToDelete.id);
      showToast('Service removed successfully.', 'success');
      setDeleteModalOpen(false);
      setServiceToDelete(null);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  const toggleStatus = async (service: Service) => {
    try {
      await api.services.update(service.id, { isActive: !service.isActive });
      showToast(`Service set to ${!service.isActive ? 'Active' : 'Inactive'}`, 'info');
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Status toggle failed', 'error');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--olive-deep)' }}>
            Service Offerings
          </span>
          <h1 className="font-heading fw-bold mt-1 mb-1" style={{ color: 'var(--olivewood)' }}>
            Service Management CRUD
          </h1>
          <p className="mb-0" style={{ color: 'var(--bark)' }}>
            Create consultation offerings, set durations and fees, or toggle booking availability.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-olive-cta d-flex align-items-center gap-2"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Create New Service
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="custom-card p-3 mb-4">
        <div className="input-group" style={{ maxWidth: '420px' }}>
          <span className="input-group-text bg-white border-end-0" style={{ borderColor: 'var(--sand)', color: 'var(--sage)' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchServices()}
          />
          <button type="button" className="btn btn-secondary-custom" onClick={fetchServices}>
            Search
          </button>
        </div>
      </div>

      {/* Services Table (Desktop) / Cards (Mobile) */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" style={{ color: 'var(--olive-deep)' }}>
            <span className="visually-hidden">Loading services...</span>
          </div>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Create your first consultation offering to open client booking."
          actionLabel="Create First Service"
          onAction={openCreateModal}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="custom-card overflow-hidden shadow-subtle d-none d-md-block">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th>Service Name & Details</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="fw-bold" style={{ color: 'var(--olivewood)' }}>{s.name}</div>
                        <div className="small text-muted text-truncate" style={{ maxWidth: '280px' }}>
                          {s.description}
                        </div>
                      </td>
                      <td>
                        <span className="category-chip">
                          {s.category}
                        </span>
                      </td>
                      <td className="text-nowrap">
                        <div className="d-flex align-items-center gap-1.5 small fw-medium" style={{ color: 'var(--bark)' }}>
                          <Clock size={14} style={{ color: 'var(--sage)' }} />
                          <span>{s.duration} mins</span>
                        </div>
                      </td>
                      <td className="text-nowrap">
                        <span className="fw-bold fs-6" style={{ color: 'var(--olivewood)' }}>
                          ${s.price}
                        </span>
                      </td>
                      <td className="text-nowrap">
                        <button
                          type="button"
                          className={`badge-status-pill border-0 ${s.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleStatus(s)}
                          title="Click to toggle status"
                        >
                          {s.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary-custom me-2 p-1.5"
                          onClick={() => openEditModal(s)}
                          title="Edit service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger-custom p-1.5"
                          onClick={() => openDeleteModal(s)}
                          title="Delete service"
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

          {/* Mobile Stacked Card View (<768px) */}
          <div className="d-md-none d-flex flex-column gap-3">
            {services.map(s => (
              <div key={s.id} className="custom-card p-3.5">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="category-chip">{s.category}</span>
                  <span className="fs-5 fw-bold" style={{ color: 'var(--olivewood)' }}>${s.price}</span>
                </div>
                <h5 className="font-heading fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
                  {s.name}
                </h5>
                <p className="small text-muted mb-3">{s.description}</p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-sand">
                  <div className="small fw-medium d-flex align-items-center gap-1">
                    <Clock size={13} style={{ color: 'var(--sage)' }} />
                    <span>{s.duration} mins</span>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      type="button"
                      className={`badge-status-pill border-0 ${s.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}
                      onClick={() => toggleStatus(s)}
                    >
                      {s.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary-custom p-1.5"
                      onClick={() => openEditModal(s)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-custom p-1.5"
                      onClick={() => openDeleteModal(s)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create / Edit Service Modal */}
      {isModalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(44, 46, 38, 0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-custom border-0 shadow-lg">
              <div className="modal-header border-0 pt-4 px-4 pb-0">
                <h5 className="modal-title font-heading fw-bold" style={{ color: 'var(--olivewood)' }}>
                  {editingService ? 'Edit Service Offering' : 'Create New Service Offering'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                  style={{ filter: 'opacity(0.6)' }}
                />
              </div>

              <form onSubmit={handleSaveService}>
                <div className="modal-body px-4 py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Service Name <span style={{ color: 'var(--clay)' }}>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Clinical Health Check"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description <span style={{ color: 'var(--clay)' }}>*</span></label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Describe what is covered, patient preparation, and outcomes..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category <span style={{ color: 'var(--clay)' }}>*</span></label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Healthcare">Healthcare</option>
                        <option value="Wellness & Spa">Wellness & Spa</option>
                        <option value="Dental Care">Dental Care</option>
                        <option value="Salon & Beauty">Salon & Beauty</option>
                        <option value="Fitness Coaching">Fitness Coaching</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Duration (Minutes) <span style={{ color: 'var(--clay)' }}>*</span></label>
                      <input
                        type="number"
                        min={15}
                        max={240}
                        step={5}
                        className="form-control"
                        value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Fee ($ USD) <span style={{ color: 'var(--clay)' }}>*</span></label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        className="form-control"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-check form-switch pt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActiveSwitch"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="isActiveSwitch">
                      Service is active and open for client booking
                    </label>
                  </div>
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary-custom"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom">
                    {editingService ? 'Save Changes' : 'Create Service'}
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
        title="Delete Service Offering"
        message={`Are you sure you want to remove "${serviceToDelete?.name}"? Existing appointment records will be preserved, but future bookings will be disabled.`}
        confirmLabel="Yes, Delete Service"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
      />
    </div>
  );
};
