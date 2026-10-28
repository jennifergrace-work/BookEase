import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Appointment, Service, SlotItem } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useToast } from '../../components/ToastNotification';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  DollarSign
} from 'lucide-react';

export const AppointmentsManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [aptToDelete, setAptToDelete] = useState<Appointment | null>(null);

  // Reschedule modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [aptToReschedule, setAptToReschedule] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Load services for filter dropdown
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.services.getAll({ all: true });
        if (res.success) setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.appointments.getAll({
        status: statusFilter === 'All' ? undefined : statusFilter,
        serviceId: serviceFilter === 'All' ? undefined : serviceFilter,
        date: dateFilter || undefined,
        search: search.trim() || undefined,
        page,
        limit: 8,
      });

      if (res.success) {
        setAppointments(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.total);
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, statusFilter, serviceFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAppointments();
  };

  const handleStatusChange = async (aptId: string, newStatus: string) => {
    try {
      const res = await api.appointments.updateStatus(aptId, newStatus);
      if (res.success) {
        showToast(`Appointment status updated to ${newStatus}`, 'success');
        fetchAppointments();
      }
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const openDeleteModal = (apt: Appointment) => {
    setAptToDelete(apt);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!aptToDelete) return;
    try {
      await api.appointments.delete(aptToDelete.id);
      showToast('Appointment record removed.', 'success');
      setDeleteModalOpen(false);
      setAptToDelete(null);
      fetchAppointments();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const openRescheduleModal = (apt: Appointment) => {
    setAptToReschedule(apt);
    setRescheduleDate(apt.date);
    setRescheduleSlot('');
    setRescheduleModalOpen(true);
    loadSlots(apt.serviceId, apt.date);
  };

  const loadSlots = async (serviceId: string, date: string) => {
    try {
      setLoadingSlots(true);
      setRescheduleSlot('');
      const res = await api.appointments.getSlots(serviceId, date);
      if (res.success) {
        setAvailableSlots(res.slots || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const confirmReschedule = async () => {
    if (!aptToReschedule || !rescheduleDate || !rescheduleSlot) {
      showToast('Please select both a date and an open slot', 'error');
      return;
    }
    try {
      const res = await api.appointments.reschedule(aptToReschedule.id, rescheduleDate, rescheduleSlot);
      if (res.success) {
        showToast('Appointment successfully rescheduled!', 'success');
        setRescheduleModalOpen(false);
        setAptToReschedule(null);
        fetchAppointments();
      }
    } catch (err: any) {
      showToast(err.message || 'Reschedule conflict', 'error');
    }
  };

  return (
    <div className="container py-4 pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge badge-status-confirmed mb-2">Central Schedule</span>
          <h1 className="font-heading fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
            All Appointments
          </h1>
          <p className="text-muted mb-0">Search, filter, update booking statuses, or reschedule client appointments.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card p-3 mb-4 shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--sand)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-lg-3 col-md-6">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--sand)',
                    color: 'var(--sage)'
                  }}
                >
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Client, email, service..."
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

            {/* Status Filter */}
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--sand)',
                  color: 'var(--olivewood)'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-show">No-show</option>
              </select>
            </div>

            {/* Service Filter */}
            <div className="col-lg-3 col-md-6">
              <select
                className="form-select form-select-sm"
                value={serviceFilter}
                onChange={e => {
                  setServiceFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--sand)',
                  color: 'var(--olivewood)'
                }}
              >
                <option value="All">All Services</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="col-lg-2 col-md-4">
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateFilter}
                onChange={e => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--sand)',
                  color: 'var(--olivewood)'
                }}
              />
            </div>

            {/* Actions */}
            <div className="col-lg-2 col-md-2 text-md-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-custom w-100"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setServiceFilter('All');
                  setDateFilter('');
                  setPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--olive-deep)' }} role="status">
            <span className="visually-hidden">Loading appointments...</span>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div
          className="card p-5 text-center my-4 shadow-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--sand)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Calendar size={40} className="mx-auto mb-3" style={{ color: 'var(--sage)' }} />
          <h4 className="font-heading fw-bold" style={{ color: 'var(--olivewood)' }}>
            No appointments match query
          </h4>
          <p className="text-muted small mb-0">Try clearing one or more filters above.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div
            className="card d-none d-md-block overflow-hidden shadow-sm mb-4"
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
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Client</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Service</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Date & Slot</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Fee</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold" style={{ color: 'var(--olivewood)' }}>Status</th>
                    <th className="py-3 px-3 text-uppercase small fw-bold text-end" style={{ color: 'var(--olivewood)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td className="px-3 py-3">
                        <div className="fw-bold" style={{ color: 'var(--olivewood)' }}>{apt.userName}</div>
                        <div className="text-muted small">{apt.userEmail}</div>
                        {apt.notes && (
                          <div
                            className="fst-italic small text-truncate"
                            style={{ maxWidth: '200px', color: 'var(--bark)' }}
                            title={apt.notes}
                          >
                            Note: "{apt.notes}"
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="fw-semibold" style={{ color: 'var(--olivewood)' }}>{apt.serviceName}</div>
                        <div className="text-muted small">{apt.serviceDuration} mins</div>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        <div className="d-flex align-items-center gap-1.5 small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                          <Calendar size={14} style={{ color: 'var(--sage)' }} />
                          <span>{apt.date}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1.5 small text-muted">
                          <Clock size={14} style={{ color: 'var(--sage)' }} />
                          <span>{apt.timeSlot}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        <span className="fw-bold" style={{ color: 'var(--olivewood)' }}>${apt.servicePrice}</span>
                      </td>
                      <td className="px-3 py-3 text-nowrap">
                        <select
                          className="form-select form-select-sm py-1"
                          style={{
                            width: '130px',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            borderColor: 'var(--sand)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--olivewood)'
                          }}
                          value={apt.status}
                          onChange={e => handleStatusChange(apt.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="No-show">No-show</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-custom me-2"
                          onClick={() => openRescheduleModal(apt)}
                          title="Reschedule appointment"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger-custom"
                          onClick={() => openDeleteModal(apt)}
                          title="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div
              className="p-3 d-flex justify-content-between align-items-center"
              style={{
                borderTop: '1px solid var(--sand)',
                backgroundColor: 'var(--surface)'
              }}
            >
              <span className="small text-muted">
                Showing page {page} of {totalPages} ({totalItems} total bookings)
              </span>
              <div className="d-flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-custom"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-custom"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="d-md-none d-flex flex-column gap-3 mb-4">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className="card p-3 shadow-sm"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--sand)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--olivewood)' }}>
                      {apt.userName}
                    </h6>
                    <span className="small text-muted">{apt.userEmail}</span>
                  </div>
                  <span className="fw-bold" style={{ color: 'var(--olivewood)' }}>
                    ${apt.servicePrice}
                  </span>
                </div>

                <div
                  className="p-2 mb-3 rounded"
                  style={{ backgroundColor: 'var(--parchment)', border: '1px solid var(--sand)' }}
                >
                  <div className="fw-semibold small" style={{ color: 'var(--olivewood)' }}>
                    {apt.serviceName}
                  </div>
                  <div className="d-flex gap-3 small text-muted mt-1">
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={13} style={{ color: 'var(--sage)' }} /> {apt.date}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={13} style={{ color: 'var(--sage)' }} /> {apt.timeSlot}
                    </span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="small fst-italic mb-3" style={{ color: 'var(--bark)' }}>
                    Note: "{apt.notes}"
                  </p>
                )}

                <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid var(--sand)' }}>
                  <div>
                    <select
                      className="form-select form-select-sm py-1"
                      style={{
                        width: '120px',
                        fontSize: '0.8rem',
                        borderColor: 'var(--sand)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--olivewood)'
                      }}
                      value={apt.status}
                      onChange={e => handleStatusChange(apt.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="No-show">No-show</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-custom"
                      onClick={() => openRescheduleModal(apt)}
                      title="Reschedule"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-custom"
                      onClick={() => openDeleteModal(apt)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            <div className="d-flex justify-content-between align-items-center p-2">
              <span className="small text-muted">
                Page {page} of {totalPages}
              </span>
              <div className="d-flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-custom"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-custom"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Appointment Record"
        message={`Are you sure you want to permanently delete appointment #${aptToDelete?.id} for ${aptToDelete?.userName}? This action cannot be reversed.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAptToDelete(null);
        }}
      />

      {/* Reschedule Modal */}
      {rescheduleModalOpen && aptToReschedule && (
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
                <div className="d-flex align-items-center gap-2">
                  <RotateCcw size={20} style={{ color: 'var(--olivewood)' }} />
                  <h5 className="modal-title font-heading fw-bold mb-0" style={{ color: 'var(--olivewood)' }}>
                    Reschedule Appointment
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRescheduleModalOpen(false)}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body px-4 py-3">
                <p className="small text-muted mb-3">
                  Rescheduling for <strong>{aptToReschedule.userName}</strong> ({aptToReschedule.serviceName}).
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                    New Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={rescheduleDate}
                    onChange={e => {
                      setRescheduleDate(e.target.value);
                      loadSlots(aptToReschedule.serviceId, e.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                    Select Open Slot:
                  </label>
                  {loadingSlots ? (
                    <div className="py-2 text-muted small">Loading available slots...</div>
                  ) : availableSlots.length === 0 ? (
                    <div
                      className="p-3 rounded small text-center"
                      style={{
                        backgroundColor: 'var(--parchment)',
                        border: '1px solid var(--sand)',
                        color: 'var(--bark)'
                      }}
                    >
                      No open slots available on this date.
                    </div>
                  ) : (
                    <div className="row g-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {availableSlots.map(s => (
                        <div key={s.time} className="col-4">
                          <button
                            type="button"
                            disabled={!s.available}
                            className={`slot-badge-btn ${rescheduleSlot === s.time ? 'selected' : ''}`}
                            onClick={() => setRescheduleSlot(s.time)}
                          >
                            {s.time}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={() => setRescheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom"
                  disabled={!rescheduleDate || !rescheduleSlot}
                  onClick={confirmReschedule}
                >
                  Update Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
