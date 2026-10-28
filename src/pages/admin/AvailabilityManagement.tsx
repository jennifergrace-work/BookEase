import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Service, Availability } from '../../types';
import { useToast } from '../../components/ToastNotification';
import {
  Clock,
  Calendar,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  Coffee,
  Ban,
  Check
} from 'lucide-react';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AvailabilityManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [availability, setAvailability] = useState<Availability>({
    serviceId: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    blockedDates: [],
  });

  const [newBlockedDate, setNewBlockedDate] = useState('');

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const res = await api.services.getAll({ all: true });
        if (res.success && res.data.length > 0) {
          setServices(res.data);
          setSelectedServiceId(res.data[0].id);
        }
      } catch (err: any) {
        showToast(err.message || 'Error fetching services', 'error');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      if (!selectedServiceId) return;
      try {
        const res = await api.availability.getByService(selectedServiceId);
        if (res.success && res.data) {
          setAvailability(res.data);
        } else {
          setAvailability({
            serviceId: selectedServiceId,
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            startTime: '09:00',
            endTime: '17:00',
            breakStart: '13:00',
            breakEnd: '14:00',
            blockedDates: [],
          });
        }
      } catch (err: any) {
        showToast(err.message || 'Error loading schedule', 'error');
      }
    }
    loadAvailability();
  }, [selectedServiceId]);

  const toggleDay = (day: string) => {
    setAvailability(prev => {
      const exists = prev.workingDays.includes(day);
      const updated = exists ? prev.workingDays.filter(d => d !== day) : [...prev.workingDays, day];
      return { ...prev, workingDays: updated };
    });
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (availability.blockedDates.includes(newBlockedDate)) {
      showToast('Date is already blocked', 'error');
      return;
    }
    setAvailability(prev => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate].sort(),
    }));
    setNewBlockedDate('');
    showToast(`Added ${newBlockedDate} to blocked dates`, 'info');
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    setAvailability(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(d => d !== dateToRemove),
    }));
    showToast(`Removed ${dateToRemove} from blocked dates`, 'info');
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (availability.workingDays.length === 0) {
      showToast('Please select at least one active working day', 'error');
      return;
    }

    if (availability.startTime >= availability.endTime) {
      showToast('Opening time must be earlier than closing time', 'error');
      return;
    }

    if (availability.breakStart >= availability.breakEnd) {
      showToast('Break start time must be before break end time', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await api.availability.save({
        ...availability,
        serviceId: selectedServiceId,
      });

      if (res.success) {
        showToast('Availability schedule saved and recalculated for all slots!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save availability schedule', 'error');
    } finally {
      setSaving(false);
    }
  };

  const selectedService = services.find(s => s.id === selectedServiceId);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="container py-4 py-lg-5">
      {/* Header */}
      <div className="mb-4">
        <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--olive-deep)' }}>
          Working Hours & Rules
        </span>
        <h1 className="font-heading fw-bold mt-1 mb-1" style={{ color: 'var(--olivewood)' }}>
          Provider Availability Engine
        </h1>
        <p className="mb-0" style={{ color: 'var(--bark)' }}>
          Configure active workdays, daily consultation windows, lunch breaks, and holiday blackout dates.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" style={{ color: 'var(--olive-deep)' }}>
            <span className="visually-hidden">Loading schedule configurations...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Service Selector Sidebar */}
          <div className="col-lg-4">
            <div className="custom-card p-4 mb-4">
              <h5 className="font-heading fw-bold mb-3" style={{ color: 'var(--olivewood)' }}>
                Select Service
              </h5>
              <div className="d-flex flex-column gap-2">
                {services.map(s => {
                  const isSelected = selectedServiceId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`btn text-start p-3 rounded-3 transition-all ${isSelected ? 'btn-primary-custom' : 'btn-surface'}`}
                      onClick={() => setSelectedServiceId(s.id)}
                    >
                      <div className="fw-semibold">{s.name}</div>
                      <div className="small opacity-75">{s.duration} mins &bull; {s.category}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="custom-card p-4" style={{ backgroundColor: 'var(--parchment)' }}>
              <h6 className="font-heading fw-bold mb-2" style={{ color: 'var(--olivewood)' }}>
                Real-Time Recalculation
              </h6>
              <p className="small mb-0" style={{ color: 'var(--bark)', lineHeight: '1.6' }}>
                Any change to operating windows or break intervals updates client slot availability immediately. Double-booking conflicts are automatically blocked.
              </p>
            </div>
          </div>

          {/* Schedule Configuration Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSaveSchedule}>
              <div className="custom-card p-4 p-md-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-sand">
                  <h5 className="font-heading fw-bold mb-0" style={{ color: 'var(--olivewood)' }}>
                    Schedule: {selectedService?.name}
                  </h5>
                  <span className="badge-confirmed py-0.5 px-2.5" style={{ fontSize: '0.74rem' }}>
                    Live Synchronized
                  </span>
                </div>

                {/* Working Days Checkboxes as Pill Buttons */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                    Active Working Days <span style={{ color: 'var(--clay)' }}>*</span>
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {ALL_DAYS.map(day => {
                      const isSelected = availability.workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${isSelected ? 'btn-olive-cta' : 'btn-secondary-custom'}`}
                          style={{ fontSize: '0.82rem' }}
                          onClick={() => toggleDay(day)}
                        >
                          {isSelected && <Check size={14} className="me-1 inline" />}
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--olivewood)' }}>
                    Daily Operating Window <span style={{ color: 'var(--clay)' }}>*</span>
                  </label>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="input-group">
                        <span className="input-group-text bg-white small" style={{ borderColor: 'var(--sand)', color: 'var(--bark)' }}>Start:</span>
                        <input
                          type="time"
                          className="form-control"
                          value={availability.startTime}
                          onChange={e => setAvailability({ ...availability, startTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="input-group">
                        <span className="input-group-text bg-white small" style={{ borderColor: 'var(--sand)', color: 'var(--bark)' }}>End:</span>
                        <input
                          type="time"
                          className="form-control"
                          value={availability.endTime}
                          onChange={e => setAvailability({ ...availability, endTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Break Window */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold d-flex align-items-center gap-1.5" style={{ color: 'var(--olivewood)' }}>
                    <Coffee size={15} style={{ color: 'var(--bark)' }} />
                    <span>Daily Lunch / Break Interval (Slots will NOT be offered during this window)</span>
                  </label>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="input-group">
                        <span className="input-group-text bg-white small" style={{ borderColor: 'var(--sand)', color: 'var(--bark)' }}>Break Start:</span>
                        <input
                          type="time"
                          className="form-control"
                          value={availability.breakStart}
                          onChange={e => setAvailability({ ...availability, breakStart: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="input-group">
                        <span className="input-group-text bg-white small" style={{ borderColor: 'var(--sand)', color: 'var(--bark)' }}>Break End:</span>
                        <input
                          type="time"
                          className="form-control"
                          value={availability.breakEnd}
                          onChange={e => setAvailability({ ...availability, breakEnd: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Holiday / Blocked Dates */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold d-flex align-items-center gap-1.5" style={{ color: 'var(--olivewood)' }}>
                    <Ban size={15} style={{ color: 'var(--clay)' }} />
                    <span>Holiday & Blackout Dates</span>
                  </label>
                  <div className="input-group mb-3" style={{ maxWidth: '360px' }}>
                    <input
                      type="date"
                      min={todayStr}
                      className="form-control"
                      value={newBlockedDate}
                      onChange={e => setNewBlockedDate(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary-custom d-flex align-items-center gap-1"
                      onClick={handleAddBlockedDate}
                    >
                      <Plus size={15} />
                      Block
                    </button>
                  </div>

                  {availability.blockedDates.length === 0 ? (
                    <div className="small text-muted">No blackout dates configured. Provider operates on all scheduled weekdays.</div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {availability.blockedDates.map(dateStr => (
                        <div
                          key={dateStr}
                          className="badge-cancelled py-1 px-2.5 rounded-pill d-inline-flex align-items-center gap-2"
                        >
                          <Calendar size={13} />
                          <span>{dateStr}</span>
                          <button
                            type="button"
                            className="btn-close btn-close-sm"
                            style={{ fontSize: '0.65rem' }}
                            onClick={() => handleRemoveBlockedDate(dateStr)}
                            aria-label="Remove blocked date"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-top border-sand d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-olive-cta d-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving ? 'Saving Schedule...' : 'Save Availability Schedule'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
