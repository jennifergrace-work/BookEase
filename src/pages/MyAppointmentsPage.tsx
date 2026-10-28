import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Appointment, SlotItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../components/ToastNotification';
import { EmptyState } from '../components/EmptyState';
import {
  Calendar,
  Clock,
  CalendarCheck,
  RotateCcw,
  Ban,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MyAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.appointments.getAll({ search: search.trim() || undefined });
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Error fetching appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppointments = appointments.filter(
    a => a.date >= todayStr && a.status !== 'Cancelled' && a.status !== 'Completed'
  );

  const pastAppointments = appointments.filter(
    a => a.date < todayStr || a.status === 'Cancelled' || a.status === 'Completed'
  );

  const currentList = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const handleOpenCancel = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    try {
      const res = await api.appointments.updateStatus(selectedAppointment.id, 'Cancelled');
      if (res.success) {
        showToast('Appointment was successfully cancelled.', 'success');
        setCancelModalOpen(false);
        setSelectedAppointment(null);
        fetchAppointments();
      }
    } catch (err: any) {
      showToast(err.message || 'Cancellation failed', 'error');
    }
  };

  const handleOpenReschedule = async (apt: Appointment) => {
    setSelectedAppointment(apt);
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dStr = d.toISOString().split('T')[0];
    setNewDate(dStr);
    setNewSlot('');
    setRescheduleModalOpen(true);
    loadRescheduleSlots(apt.serviceId, dStr);
  };

  const loadRescheduleSlots = async (serviceId: string, date: string) => {
    try {
      setLoadingSlots(true);
      setNewSlot('');
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
    if (!selectedAppointment || !newDate || !newSlot) {
      showToast('Please select both a date and an available slot', 'error');
      return;
    }
    try {
      const res = await api.appointments.reschedule(selectedAppointment.id, newDate, newSlot);
      if (res.success) {
        showToast('Appointment successfully rescheduled! Status set to Pending review.', 'success');
        setRescheduleModalOpen(false);
        setSelectedAppointment(null);
        fetchAppointments();
      }
    } catch (err: any) {
      showToast(err.message || 'Reschedule conflict encountered', 'error');
    }
  };

  const formatMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    } catch {
      return '';
    }
  };

  const formatDay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.getDate();
    } catch {
      return '';
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Title & Action */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--olive-deep)' }}>
            Client Portal
          </span>
          <h1 className="font-heading fw-bold mt-1 mb-1" style={{ color: 'var(--olivewood)' }}>
            My Appointments
          </h1>
          <p className="mb-0" style={{ color: 'var(--bark)' }}>
            Review your upcoming bookings, reschedule dates, or view past appointment history.
          </p>
        </div>

        <Link to="/book" className="btn btn-olive-cta">
          <CalendarCheck size={17} />
          Book New Session
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="custom-card p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          {/* Pill Tabs */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold ${activeTab === 'upcoming' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
              onClick={() => setActiveTab('upcoming')}
              style={{ fontSize: '0.85rem' }}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold ${activeTab === 'past' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
              onClick={() => setActiveTab('past')}
              style={{ fontSize: '0.85rem' }}
            >
              Past & Cancelled ({pastAppointments.length})
            </button>
          </div>

          {/* Search */}
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0" style={{ borderColor: 'var(--sand)', color: 'var(--sage)' }}>
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search bookings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchAppointments()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" style={{ color: 'var(--olive-deep)' }}>
            <span className="visually-hidden">Loading appointments...</span>
          </div>
        </div>
      ) : currentList.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} appointments found`}
          description={activeTab === 'upcoming' ? "You don't have any sessions scheduled in the future." : 'No past or cancelled appointments in your record.'}
          actionLabel={activeTab === 'upcoming' ? 'Schedule an Appointment' : undefined}
          actionHref="/book"
        />
      ) : (
        <div className="row g-4">
          {currentList.map(apt => (
            <div key={apt.id} className="col-lg-6">
              <div className="custom-card custom-card-hover p-3.5 p-sm-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-start gap-3 mb-3">
                    {/* Date Block on Left: Big Day Number + Month */}
                    <div
                      className="d-flex flex-column align-items-center justify-content-center flex-shrink-0 text-center rounded-3 p-2"
                      style={{
                        width: '68px',
                        height: '70px',
                        backgroundColor: 'var(--parchment)',
                        border: '1px solid var(--sand)',
                      }}
                    >
                      <span className="fw-bold font-heading fs-4 mb-0" style={{ color: 'var(--olivewood)', lineHeight: '1' }}>
                        {formatDay(apt.date)}
                      </span>
                      <span className="small text-uppercase fw-semibold" style={{ color: 'var(--olive-deep)', fontSize: '0.72rem' }}>
                        {formatMonth(apt.date)}
                      </span>
                    </div>

                    {/* Service & Details */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <StatusBadge status={apt.status} />
                        <span className="fs-5 fw-bold" style={{ color: 'var(--olivewood)' }}>
                          ${apt.servicePrice}
                        </span>
                      </div>
                      <h5 className="font-heading fw-bold mb-1" style={{ color: 'var(--olivewood)', fontSize: '1.15rem' }}>
                        {apt.serviceName}
                      </h5>
                      <div className="d-flex align-items-center gap-2 small" style={{ color: 'var(--bark)' }}>
                        <Clock size={14} style={{ color: 'var(--sage)' }} />
                        <span>{apt.timeSlot} HRS ({apt.serviceDuration} mins)</span>
                      </div>
                    </div>
                  </div>

                  {apt.notes && (
                    <div
                      className="small p-2.5 rounded-2 mb-3 d-flex align-items-start gap-2"
                      style={{ backgroundColor: 'var(--parchment)', color: 'var(--bark)', border: '1px solid var(--sand)' }}
                    >
                      <FileText size={15} className="flex-shrink-0 mt-0.5 text-muted" />
                      <span>{apt.notes}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {activeTab === 'upcoming' && apt.status !== 'Cancelled' && (
                  <div className="border-top border-sand pt-3 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary-custom d-flex align-items-center gap-1.5"
                      onClick={() => handleOpenReschedule(apt)}
                    >
                      <RotateCcw size={13} />
                      Reschedule
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-custom d-flex align-items-center gap-1.5"
                      onClick={() => handleOpenCancel(apt)}
                    >
                      <Ban size={13} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your session for "${selectedAppointment?.serviceName}" on ${selectedAppointment?.date} at ${selectedAppointment?.timeSlot}? The slot will be reopened for other clients.`}
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Appointment"
        isDestructive={true}
        onConfirm={confirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
      />

      {/* Reschedule Modal */}
      {rescheduleModalOpen && selectedAppointment && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(44, 46, 38, 0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-custom border-0 shadow-lg">
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
                  style={{ filter: 'opacity(0.6)' }}
                />
              </div>

              <div className="modal-body px-4 py-3">
                <p className="small mb-3" style={{ color: 'var(--bark)' }}>
                  Moving <strong>{selectedAppointment.serviceName}</strong> (Currently scheduled for{' '}
                  {selectedAppointment.date} at {selectedAppointment.timeSlot}).
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">New Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newDate}
                    min={todayStr}
                    onChange={e => {
                      setNewDate(e.target.value);
                      loadRescheduleSlots(selectedAppointment.serviceId, e.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Select Open Slot:</label>
                  {loadingSlots ? (
                    <div className="py-2 small text-muted">Calculating open slots...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="alert p-2.5 small" style={{ backgroundColor: 'var(--sand-soft)', color: 'var(--olivewood)' }}>
                      No slots available on this date.
                    </div>
                  ) : (
                    <div className="row g-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {availableSlots.map(s => (
                        <div key={s.time} className="col-4">
                          <button
                            type="button"
                            disabled={!s.available}
                            className={`slot-chip ${newSlot === s.time ? 'selected' : ''}`}
                            onClick={() => setNewSlot(s.time)}
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
                  className="btn btn-secondary-custom"
                  onClick={() => setRescheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom"
                  disabled={!newDate || !newSlot}
                  onClick={confirmReschedule}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
