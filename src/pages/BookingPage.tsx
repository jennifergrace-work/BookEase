import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import { api } from '../services/api';
import { Service, SlotItem, Appointment } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Check,
  ArrowRight
} from 'lucide-react';

const botanicalBookingBackground = new URL('../../08_botanical_booking_background.jpg', import.meta.url).href;
const calendarVisual = new URL('../../20_calendar_visual.jpg', import.meta.url).href;
const floralAccent = new URL('../../18_hand_drawn_botanical_illustration.jpg', import.meta.url).href;
const bookingSuccessGraphic = new URL('../../11_booking_success_graphic.jpg', import.meta.url).href;

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId') || '';
  const preselectedDate = searchParams.get('date') || '';
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (preselectedDate) return preselectedDate;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [slotReason, setSlotReason] = useState<string | null>(null);

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Confirmed appointment state for Panel 5 celebratory view
  const [confirmedBooking, setConfirmedBooking] = useState<{
    serviceName: string;
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoadingServices(true);
        const res = await api.services.getAll({ all: false });
        if (res.success && res.data) {
          setServices(res.data);
          if (!selectedServiceId && res.data.length > 0) {
            setSelectedServiceId(res.data[0].id);
          }
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load services', 'error');
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedServiceId || !selectedDate) return;
      try {
        setLoadingSlots(true);
        setSelectedSlot('');
        setSlotReason(null);
        const res = await api.appointments.getSlots(selectedServiceId, selectedDate);
        if (res.success) {
          setSlots(res.slots || []);
          if (res.reason) {
            setSlotReason(res.reason);
          }
        }
      } catch (err: any) {
        showToast(err.message || 'Error checking slot availability', 'error');
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedServiceId, selectedDate]);

  const selectedService = services.find(s => s.id === selectedServiceId);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Helper to generate dynamic quick date chips (Panel 4)
  const generateDatePills = () => {
    const list = [];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    for (let i = 1; i <= 4; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      const dayNum = String(d.getDate()).padStart(2, '0');
      list.push({ dayName, dayNum, iso });
    }
    return list;
  };

  const quickDates = generateDatePills();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in or use demo login to confirm reservation', 'error');
      return;
    }

    if (!selectedServiceId) {
      showToast('Please select a service', 'error');
      return;
    }

    if (!selectedDate) {
      showToast('Please select a valid date', 'error');
      return;
    }

    if (!selectedSlot) {
      showToast('Please pick an available time slot', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.appointments.book({
        serviceId: selectedServiceId,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes,
      });

      if (res.success) {
        showToast('Appointment confirmed successfully!', 'success');
        // Show celebratory confirmation view (Panel 5)
        setConfirmedBooking({
          serviceName: selectedService ? selectedService.name : 'Consultation',
          date: selectedDate,
          time: selectedSlot,
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Booking conflict encountered. Please choose another slot.', 'error');
      const slotRes = await api.appointments.getSlots(selectedServiceId, selectedDate);
      if (slotRes.success) setSlots(slotRes.slots);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickClientLogin = async () => {
    try {
      await login({ email: 'john.doe@example.com', password: 'User@123' });
      showToast('Logged in as demo client: John Doe', 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  // Curated photo mapping
  const getServicePhoto = (category?: string, name?: string) => {
    const text = ((category || '') + ' ' + (name || '')).toLowerCase();
    if (text.includes('massage') || text.includes('therapy')) {
      return new URL('../../10_massage_service.jpg', import.meta.url).href;
    }
    if (text.includes('spa') || text.includes('wellness') || text.includes('stones')) {
      return new URL('../../05_spa_still_life.jpg', import.meta.url).href;
    }
    if (text.includes('health') || text.includes('doctor') || text.includes('medic') || text.includes('checkup')) {
      return new URL('../../04_healthcare_stethoscope.jpg', import.meta.url).href;
    }
    if (text.includes('dental') || text.includes('teeth')) {
      return new URL('../../06_dental_care.jpg', import.meta.url).href;
    }
    if (text.includes('beauty') || text.includes('salon') || text.includes('skincare')) {
      return new URL('../../07_salon_skincare.jpg', import.meta.url).href;
    }
    return new URL('../../19_service_card_background.jpg', import.meta.url).href;
  };

  // =========================================================================
  // PANEL 5: CELEBRATORY CONFIRMATION SCREEN
  // =========================================================================
  if (confirmedBooking) {
    const dObj = new Date(confirmedBooking.date + 'T00:00:00');
    const formattedDate = dObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <div
        className="container py-5 text-center position-relative"
        style={{
          maxWidth: '780px',
          backgroundImage: `radial-gradient(circle at top, rgba(168,182,154,0.12), transparent 38%), url("${bookingSuccessGraphic}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="badge-nature-pill mb-3">
          <span>🌿</span>
          <span className="fw-semibold" style={{ color: '#123D2C' }}>Appointment Confirmed!</span>
        </div>

        <div className="position-relative d-inline-flex justify-content-center align-items-center my-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: '116px',
              height: '116px',
              backgroundColor: '#123D2C',
              color: '#FFFFFF',
              border: '5px solid #ECE7DB',
            }}
          >
            <Check size={52} strokeWidth={3} />
          </div>
          <div
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              border: '1px solid rgba(18, 61, 44, 0.08)',
              borderRadius: '50%',
              transform: 'scale(1.2)',
            }}
          />
        </div>

        <h2 className="font-heading fw-bold mt-2 mb-2" style={{ color: '#123D2C', fontSize: '1.85rem' }}>
          You're all set! Your appointment has been successfully booked.
        </h2>
        <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
          We have reserved your slot and sent an email confirmation to your registered address.
        </p>

        {/* Confirmation Summary Card matching Panel 5 */}
        <div
          className="card custom-card p-4 mx-auto mb-4 text-start shadow-sm border-0"
          style={{ maxWidth: '520px', backgroundColor: '#FFFEFA' }}
        >
          <div className="row g-3">
            <div className="col-12 d-flex align-items-center gap-3 pb-3 border-bottom" style={{ borderColor: '#ECE5D8' }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', backgroundColor: '#EFECE2', color: '#123D2C' }}
              >
                <Clock size={18} />
              </div>
              <div>
                <div className="small text-muted" style={{ fontSize: '0.78rem' }}>Service</div>
                <div className="fw-bold" style={{ color: '#123D2C', fontSize: '1.05rem' }}>
                  {confirmedBooking.serviceName}
                </div>
              </div>
            </div>

            <div className="col-sm-6 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', backgroundColor: '#EFECE2', color: '#123D2C' }}
              >
                <CalendarIcon size={18} />
              </div>
              <div>
                <div className="small text-muted" style={{ fontSize: '0.78rem' }}>Date</div>
                <div className="fw-bold" style={{ color: '#123D2C' }}>
                  {formattedDate}
                </div>
              </div>
            </div>

            <div className="col-sm-6 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', backgroundColor: '#EFECE2', color: '#123D2C' }}
              >
                <Clock size={18} />
              </div>
              <div>
                <div className="small text-muted" style={{ fontSize: '0.78rem' }}>Time</div>
                <div className="fw-bold" style={{ color: '#123D2C' }}>
                  {confirmedBooking.time}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4" style={{ color: '#123D2C', fontWeight: 600 }}>
          Thank you for choosing BookEase.
        </div>

        {/* Dual action buttons */}
        <div className="d-flex justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-forest px-4 py-2.5 text-decoration-none shadow-sm"
            onClick={() => navigate('/my-appointments')}
          >
            View My Appointments
          </button>
          <button
            type="button"
            className="btn btn-outline-sand px-4 py-2.5 text-decoration-none"
            onClick={() => {
              setConfirmedBooking(null);
              setSelectedSlot('');
            }}
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PANEL 4: CHOOSE DATE & TIME (BOOKING FLOW)
  // =========================================================================
  return (
    <div
      className="container py-4 py-lg-5 position-relative"
      style={{
        minHeight: '85vh',
        backgroundImage: `linear-gradient(180deg, rgba(248,245,237,0.68), rgba(248,245,237,0.82)), url("${botanicalBookingBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Multi-step progress indicator matching Panel 4 */}
      <div className="d-flex justify-content-center align-items-center mb-5">
        <div className="d-flex align-items-center gap-2">
          {/* Step 1: Active */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '28px', height: '28px', backgroundColor: '#123D2C', color: '#FFFFFF', fontSize: '0.85rem' }}
          >
            1
          </div>
          <span className="fw-bold small" style={{ color: '#123D2C' }}>Date & Time</span>
          <span className="mx-2 text-muted">—</span>

          {/* Step 2 */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '28px', height: '28px', backgroundColor: '#EFECE2', color: '#6B7C72', fontSize: '0.85rem' }}
          >
            2
          </div>
          <span className="small text-muted">Personal Details</span>
          <span className="mx-2 text-muted">—</span>

          {/* Step 3 */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '28px', height: '28px', backgroundColor: '#EFECE2', color: '#6B7C72', fontSize: '0.85rem' }}
          >
            3
          </div>
          <span className="small text-muted">Confirm</span>
        </div>
      </div>

      {/* Guest Notice */}
      {!user && (
        <div
          className="alert p-3 mb-4 rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 shadow-sm"
          style={{ backgroundColor: '#FFFEFA', border: '1px solid #ECE5D8' }}
        >
          <div className="d-flex align-items-center gap-2">
            <UserCheck size={18} style={{ color: '#123D2C' }} />
            <span className="small fw-medium" style={{ color: '#123D2C' }}>
              Booking as guest. Please sign in or use evaluation client login to lock your slot:
            </span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-sand py-1 px-3 text-nowrap"
              onClick={handleQuickClientLogin}
            >
              1-Click Demo Client
            </button>
            <Link to="/login" className="btn btn-sm btn-outline-forest py-1 px-3 text-nowrap">
              Sign In
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleBooking}>
        <div className="row g-5">
          {/* Left Column: Service Presentation matching Panel 4 */}
          <div className="col-lg-5">
            <div className="custom-card p-4 border-0 shadow-sm" style={{ backgroundColor: '#FFFEFA' }}>
              {/* Service Arch Photo */}
              <div
                className="w-100 mb-3 shadow-sm"
                style={{
                  height: '180px',
                  borderRadius: '100px 100px 16px 16px',
                  backgroundImage: `url("${getServicePhoto(selectedService?.category, selectedService?.name)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {loadingServices ? (
                <div className="py-3 text-center">
                  <div className="spinner-border spinner-border-sm" role="status" style={{ color: '#123D2C' }} />
                </div>
              ) : (
                <div className="mb-3">
                  <span
                    className="badge rounded-pill px-2.5 py-1 mb-2"
                    style={{ backgroundColor: '#EFECE2', color: '#123D2C', fontWeight: 600 }}
                  >
                    {selectedService?.category || 'Wellness & Spa'}
                  </span>

                  <div className="d-flex justify-content-between align-items-baseline mb-2">
                    <h4 className="font-heading fw-bold mb-0" style={{ color: '#123D2C' }}>
                      {selectedService?.name || 'Therapeutic Deep Tissue Massage'}
                    </h4>
                    <div className="text-end ps-2">
                      <span className="fs-4 fw-bold" style={{ color: '#123D2C' }}>
                        ${selectedService?.price || 95}
                      </span>
                      <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                        {selectedService?.duration || 60} mins
                      </div>
                    </div>
                  </div>

                  <p className="text-muted small mb-3" style={{ lineHeight: '1.55' }}>
                    {selectedService?.description || 'Targeted myofascial therapy focusing on chronic muscle tension, structural realignment, and accelerated recovery.'}
                  </p>

                  {/* Care Benefits Checklist matching Panel 4 */}
                  <div className="d-flex flex-column gap-2 mb-4 pt-2 border-top" style={{ borderColor: '#ECE5D8' }}>
                    <div className="d-flex align-items-center gap-2 small" style={{ color: '#18342B' }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '18px', height: '18px', backgroundColor: '#123D2C', color: '#FFFFFF' }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>Targeted myofascial therapy</span>
                    </div>

                    <div className="d-flex align-items-center gap-2 small" style={{ color: '#18342B' }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '18px', height: '18px', backgroundColor: '#123D2C', color: '#FFFFFF' }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>Deep muscle relaxation</span>
                    </div>

                    <div className="d-flex align-items-center gap-2 small" style={{ color: '#18342B' }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '18px', height: '18px', backgroundColor: '#123D2C', color: '#FFFFFF' }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>Personalized care plan</span>
                    </div>
                  </div>

                  {/* Service Switcher Dropdown */}
                  <div className="pt-2 border-top" style={{ borderColor: '#ECE5D8' }}>
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Switch Service:
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedServiceId}
                      onChange={e => setSelectedServiceId(e.target.value)}
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.duration} mins (${s.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Date & Slot Picker matching Panel 4 */}
          <div className="col-lg-7 position-relative">
            <div
              className="position-absolute d-none d-xl-block"
              style={{
                right: '-18px',
                top: '20px',
                width: '120px',
                height: '120px',
                opacity: 0.75,
                backgroundImage: `url("${floralAccent}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            <div
              className="custom-card p-4 p-md-4 border-0 shadow-sm"
              style={{
                backgroundColor: '#FFFEFA',
                backgroundImage: `linear-gradient(135deg, rgba(168,182,154,0.08), rgba(255,255,255,0.8)), url("${calendarVisual}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h3 className="font-heading fw-bold mb-1" style={{ color: '#123D2C' }}>
                Choose Date & Time
              </h3>
              <p className="text-muted small mb-4">
                Select your preferred date and available time slot.
              </p>

              {/* Quick Date Chips matching Panel 4 */}
              <div className="mb-4">
                <label className="form-label small fw-semibold mb-2" style={{ color: '#123D2C' }}>
                  Select Consultation Date:
                </label>
                <div className="d-flex gap-2 mb-2.5">
                  {quickDates.map(item => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <div
                        key={item.iso}
                        className={`date-selector-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedDate(item.iso)}
                      >
                        <div className="day-label small text-uppercase" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                          {item.dayName}
                        </div>
                        <div className="fw-bold" style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>
                          {item.dayNum}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calendar fallback input */}
                <div className="input-group input-group-sm mt-2">
                  <span className="input-group-text bg-white" style={{ borderColor: '#E3DAC9', color: '#123D2C' }}>
                    <CalendarIcon size={15} />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    min={todayStr}
                    max={maxDateStr}
                    onChange={e => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Time Slots matching Panel 4 */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-semibold mb-0" style={{ color: '#123D2C' }}>
                    Available Time Slots:
                  </label>
                  <span className="small text-muted" style={{ fontSize: '0.78rem' }}>
                    {slots.filter(s => s.available).length} open
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-4 text-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status" style={{ color: '#123D2C' }} />
                    <span className="small text-muted">Checking real-time practitioner availability...</span>
                  </div>
                ) : slotReason ? (
                  <div
                    className="alert p-3 small d-flex align-items-center gap-2 rounded-3"
                    style={{ backgroundColor: '#F8F5ED', color: '#123D2C', border: '1px solid #ECE5D8' }}
                  >
                    <AlertCircle size={18} className="flex-shrink-0" style={{ color: '#7A6854' }} />
                    <span>{slotReason}</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-4 text-center rounded-3" style={{ backgroundColor: '#F8F5ED', border: '1px solid #ECE5D8' }}>
                    <AlertCircle size={22} className="mx-auto mb-2 text-muted" />
                    <div className="small fw-semibold" style={{ color: '#123D2C' }}>No open slots on this date</div>
                    <div className="small text-muted">Please select another date on the calendar.</div>
                  </div>
                ) : (
                  <div className="row g-2">
                    {slots.map(slot => (
                      <div key={slot.time} className="col-4 col-sm-4">
                        <button
                          type="button"
                          disabled={!slot.available}
                          className={`slot-chip w-100 ${selectedSlot === slot.time ? 'active' : ''} ${!slot.available ? 'unavailable' : ''}`}
                          onClick={() => setSelectedSlot(slot.time)}
                        >
                          <div>{slot.time}</div>
                          {!slot.available && (
                            <span style={{ fontSize: '0.68rem', opacity: 0.75, display: 'block' }}>
                              Booked
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consultation Notes */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Consultation Notes (Optional):
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Share any special instructions or focus areas..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  maxLength={500}
                />
              </div>

              {/* Bottom Row: Botanical Branch with Script note + Continue Button */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pt-3 border-top gap-3" style={{ borderColor: '#ECE5D8' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="font-script fs-4" style={{ color: '#123D2C' }}>
                    Take care of yourself ♡
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-forest px-4 py-2.5 d-flex align-items-center justify-content-center gap-2 fw-semibold text-decoration-none shadow-sm"
                  disabled={submitting || !selectedSlot || !selectedServiceId}
                  style={{ minWidth: '160px' }}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : null}
                  {submitting ? 'Confirming...' : 'Continue →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
