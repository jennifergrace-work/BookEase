import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Service } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Award,
  Zap,
  Lock,
  CalendarCheck,
  KeyRound,
  Check,
  Home,
  HeartPulse,
  Flower2,
  Smile,
  Scissors
} from 'lucide-react';

const heroForestImage = new URL('../../01_hero_forest_landscape.jpg', import.meta.url).href;
const calendarClockIllustration = new URL('../../02_calendar_clock_illustration.jpg', import.meta.url).href;
const leafAccentImage = new URL('../../13_botanical_leaf_element.jpg', import.meta.url).href;
const organicBgImage = new URL('../../17_organic_background_shapes.jpg', import.meta.url).href;
const footerCtaBackground = new URL('../../12_forest_footer_background.jpg', import.meta.url).href;

export const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Interactive booking preview states (Panel 1)
  const [previewDateIdx, setPreviewDateIdx] = useState<number>(1); // default Friday 30
  const [previewSlotIdx, setPreviewSlotIdx] = useState<number>(1); // default 10:30 AM

  useEffect(() => {
    async function loadFeaturedServices() {
      try {
        setLoadingServices(true);
        const res = await api.services.getAll({});
        if (res.success && res.data) {
          setServices(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured services', err);
      } finally {
        setLoadingServices(false);
      }
    }
    loadFeaturedServices();
  }, []);

  const handleQuickLogin = async (role: 'Admin' | 'User') => {
    try {
      if (role === 'Admin') {
        await login({ email: 'admin@bookease.com', password: 'Admin@123' });
        showToast('Logged in as Dr. Sarah Mitchell (Provider / Admin)', 'success');
        navigate('/admin/dashboard');
      } else {
        await login({ email: 'john.doe@example.com', password: 'User@123' });
        showToast('Logged in as John Doe (Client)', 'success');
        navigate('/my-appointments');
      }
    } catch (err: any) {
      showToast(err.message || 'Quick login failed', 'error');
    }
  };

  const previewDates = [
    { day: 'THU', num: '29', dateStr: '2026-10-29' },
    { day: 'FRI', num: '30', dateStr: '2026-10-30' },
    { day: 'SAT', num: '31', dateStr: '2026-10-31' },
    { day: 'MON', num: '02', dateStr: '2026-11-02' },
  ];

  const previewSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '01:30 PM', available: false },
  ];

  // Curated photographic mappings for popular services
  const getServicePhoto = (category: string, name: string) => {
    const cat = (category + ' ' + name).toLowerCase();
    if (cat.includes('health') || cat.includes('medic') || cat.includes('doctor')) {
      return new URL('../../04_healthcare_stethoscope.jpg', import.meta.url).href;
    }
    if (cat.includes('massage') || cat.includes('spa') || cat.includes('wellness') || cat.includes('therapy')) {
      return new URL('../../10_massage_service.jpg', import.meta.url).href;
    }
    if (cat.includes('dental') || cat.includes('teeth') || cat.includes('oral')) {
      return new URL('../../06_dental_care.jpg', import.meta.url).href;
    }
    if (cat.includes('beauty') || cat.includes('salon') || cat.includes('skincare')) {
      return new URL('../../07_salon_skincare.jpg', import.meta.url).href;
    }
    return new URL('../../05_spa_still_life.jpg', import.meta.url).href;
  };

  return (
    <div style={{ backgroundColor: '#F8F5ED', minHeight: '100vh' }}>
      {/* =========================================================================
          PANEL 1: HERO SECTION – Nature-Inspired Editorial with Mountain Pine Arch
          ========================================================================= */}
      <section className="hero-editorial position-relative overflow-hidden" style={{ backgroundColor: '#F8F5ED' }}>
        <div className="container hero-container position-relative">
          <div className="row hero-layout align-items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="col-lg-5 hero-copy">
              <div className="badge-nature-pill mb-3.5">
                <span style={{ fontSize: '1rem' }}>✦</span>
                <span className="fw-semibold" style={{ letterSpacing: '0.02em', color: '#123D2C' }}>
                  Modern scheduling for calmer days
                </span>
              </div>

              <h1
                className="hero-title display-4 fw-bold mb-3"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#123D2C',
                  lineHeight: '1.12',
                  letterSpacing: '-0.03em',
                }}
              >
                Flexible care, booked <br />
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#123D2C',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  without the friction.
                </span>
              </h1>

              <p
                className="hero-description lead mb-4"
                style={{
                  color: '#47584E',
                  fontSize: '1.06rem',
                  lineHeight: '1.7',
                  maxWidth: '540px',
                }}
              >
                Simplify appointment booking for healthcare, wellness, and specialist consultations with secure scheduling, instant availability, and a streamlined client experience.
              </p>

              {/* Action Buttons matching Panel 1 */}
              <div className="hero-actions d-flex flex-wrap align-items-center gap-3 mb-4">
                <Link
                  to="/book"
                  className="btn btn-forest px-4 py-3 d-inline-flex align-items-center gap-2 text-decoration-none shadow-sm"
                  style={{ fontSize: '0.98rem' }}
                >
                  <Calendar size={18} />
                  Book Appointment Now →
                </Link>

                <Link
                  to="/services"
                  className="btn btn-outline-sand px-4 py-3 d-inline-flex align-items-center gap-2 text-decoration-none"
                  style={{ fontSize: '0.98rem' }}
                >
                  Explore Services
                </Link>
              </div>

              {/* 3 Trust Badges below buttons */}
              <div className="hero-trust row g-3 pt-3 border-top" style={{ borderColor: '#E8E2D5' }}>
                <div className="col-auto d-flex align-items-center gap-2.5">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                  >
                    <Home size={16} />
                  </div>
                  <div>
                    <div className="fw-bold small" style={{ color: '#123D2C', lineHeight: '1.2' }}>Trusted Providers</div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>Verified & professional</div>
                  </div>
                </div>

                <div className="col-auto d-flex align-items-center gap-2.5">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                  >
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="fw-bold small" style={{ color: '#123D2C', lineHeight: '1.2' }}>Real-time Scheduling</div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>Live slot availability</div>
                  </div>
                </div>

                <div className="col-auto d-flex align-items-center gap-2.5">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                  >
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="fw-bold small" style={{ color: '#123D2C', lineHeight: '1.2' }}>Secure & Reliable</div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>No double bookings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Misty Mountain Pine Arch with Floating Interactive Booking Card */}
            <div className="col-lg-7 hero-visual-column">
              <div className="hero-visual position-relative">
                <div className="hero-organic-shape" aria-hidden="true" />
                <div className="hero-sage-shape" aria-hidden="true" />
                <div
                  className="hero-photo position-relative shadow-sm"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(18,61,44,0.10), rgba(18,61,44,0.30)), url("${heroForestImage}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 52%',
                  }}
                >
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      borderRadius: 'inherit',
                      background: 'linear-gradient(180deg, rgba(18, 61, 44, 0.10) 0%, rgba(18, 61, 44, 0.45) 100%)',
                    }}
                  />
                </div>

                <img className="hero-botanical hero-botanical-top" src={leafAccentImage} alt="" aria-hidden="true" />
                <img className="hero-botanical hero-botanical-bottom" src={leafAccentImage} alt="" aria-hidden="true" />

                <div
                  className="hero-booking-card position-absolute card border-0 p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '22px',
                    boxShadow: '0 18px 38px rgba(18, 61, 44, 0.16)',
                    zIndex: 10,
                  }}
                >
                  {/* Card Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom" style={{ borderColor: '#ECE5D8' }}>
                    <div>
                      <h5 className="font-heading fw-bold mb-0" style={{ color: '#123D2C', fontSize: '1.15rem' }}>
                        Executive Health Checkup
                      </h5>
                      <span className="small text-muted">Comprehensive Consultation</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold fs-5" style={{ color: '#123D2C' }}>$120</div>
                      <div className="small text-muted" style={{ fontSize: '0.78rem' }}>45 mins</div>
                    </div>
                  </div>

                  {/* Date Selector Row */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold mb-2" style={{ color: '#123D2C' }}>
                      Select Consultation Date:
                    </label>
                    <div className="d-flex gap-2">
                      {previewDates.map((item, idx) => {
                        const isSelected = previewDateIdx === idx;
                        return (
                          <div
                            key={item.day}
                            className={`date-selector-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => setPreviewDateIdx(idx)}
                          >
                            <div className="day-label small text-uppercase" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                              {item.day}
                            </div>
                            <div className="fw-bold" style={{ fontSize: '1.05rem', lineHeight: '1.2' }}>
                              {item.num}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slot Windows */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold mb-2" style={{ color: '#123D2C' }}>
                      Available Time Windows:
                    </label>
                    <div className="d-flex gap-2">
                      {previewSlots.map((slot, sIdx) => {
                        const isSelected = previewSlotIdx === sIdx && slot.available;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            className={`slot-chip flex-fill ${isSelected ? 'active' : ''} ${!slot.available ? 'unavailable' : ''}`}
                            disabled={!slot.available}
                            onClick={() => slot.available && setPreviewSlotIdx(sIdx)}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Proceed to schedule CTA button */}
                  <Link
                    to={`/book?date=${previewDates[previewDateIdx].dateStr}`}
                    className="btn btn-forest w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 fw-semibold text-decoration-none shadow-sm"
                  >
                    <CalendarCheck size={18} />
                    Proceed to Schedule
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PANEL 2: SYSTEM CAPABILITIES & ARCHITECTURE
          ========================================================================= */}
      <section className="py-5" style={{ backgroundColor: '#F8F5ED', borderTop: '1px solid #E8E2D5' }}>
        <div className="container py-3">
          <div className="row align-items-center g-4 mb-4">
            <div className="col-lg-8">
              <div className="badge-nature-pill mb-2">
                <span style={{ fontSize: '0.9rem' }}>✦</span>
                <span className="fw-semibold" style={{ color: '#123D2C' }}>System reliability</span>
              </div>
              <h2 className="display-6 font-heading fw-bold mb-2" style={{ color: '#123D2C' }}>
                Built for dependable scheduling.
              </h2>
              <p className="lead mb-0 text-muted" style={{ fontSize: '1.02rem', maxWidth: '620px' }}>
                Designed to prevent conflicts and keep every appointment, role, and status aligned in one place.
              </p>
            </div>

            <div className="col-lg-4 d-none d-lg-block text-end">
              <div
                className="d-inline-flex align-items-center justify-content-center position-relative shadow-sm"
                style={{
                  width: '220px',
                  height: '110px',
                  padding: '12px',
                  borderRadius: '24px',
                  backgroundImage: `linear-gradient(135deg, rgba(168,182,154,0.08), rgba(255,255,255,0.82)), url("${organicBgImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(18, 61, 44, 0.08)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '18px',
                    backgroundImage: `url("${calendarClockIllustration}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 4 Architecture Cards */}
          <div className="row g-4 pt-2">
            {/* Card 1: Conflict-Free Engine */}
            <div className="col-md-6 col-lg-3">
              <div className="card custom-card hover-lift h-100 p-4 border-0 d-flex flex-column" style={{ backgroundColor: '#FFFEFA' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '46px', height: '46px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                >
                  <Zap size={22} />
                </div>
                <h5 className="font-heading fw-bold mb-2" style={{ color: '#123D2C', fontSize: '1.15rem' }}>
                  Conflict-Free Engine
                </h5>
                <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
                  Dynamic availability calculation factors in working hours, operating days, and buffer periods to eliminate collision risks.
                </p>
                <div className="pt-2">
                  <span className="fw-bold" style={{ color: '#123D2C' }}>→</span>
                </div>
              </div>
            </div>

            {/* Card 2: Role-Based Access */}
            <div className="col-md-6 col-lg-3">
              <div className="card custom-card hover-lift h-100 p-4 border-0 d-flex flex-column" style={{ backgroundColor: '#FFFEFA' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '46px', height: '46px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                >
                  <Users size={22} />
                </div>
                <h5 className="font-heading fw-bold mb-2" style={{ color: '#123D2C', fontSize: '1.15rem' }}>
                  Role-Based Access
                </h5>
                <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
                  Isolated views and permissions for Service Providers and Clients, protected by JWT bearer authentication.
                </p>
                <div className="pt-2">
                  <span className="fw-bold" style={{ color: '#123D2C' }}>→</span>
                </div>
              </div>
            </div>

            {/* Card 3: Full Lifecycle Status */}
            <div className="col-md-6 col-lg-3">
              <div className="card custom-card hover-lift h-100 p-4 border-0 d-flex flex-column" style={{ backgroundColor: '#FFFEFA' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '46px', height: '46px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                >
                  <Clock size={22} />
                </div>
                <h5 className="font-heading fw-bold mb-2" style={{ color: '#123D2C', fontSize: '1.15rem' }}>
                  Full Lifecycle Status
                </h5>
                <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
                  Seamlessly track and transition appointments from Pending to Confirmed, Completed, Cancelled, or No-Show.
                </p>
                <div className="pt-2">
                  <span className="fw-bold" style={{ color: '#123D2C' }}>→</span>
                </div>
              </div>
            </div>

            {/* Card 4: Dual-Tier Validation */}
            <div className="col-md-6 col-lg-3">
              <div className="card custom-card hover-lift h-100 p-4 border-0 d-flex flex-column" style={{ backgroundColor: '#FFFEFA' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '46px', height: '46px', backgroundColor: '#EFECE2', color: '#123D2C' }}
                >
                  <Lock size={22} />
                </div>
                <h5 className="font-heading fw-bold mb-2" style={{ color: '#123D2C', fontSize: '1.15rem' }}>
                  Dual-Tier Validation
                </h5>
                <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
                  Real-time client input guidance paired with rigorous server-side express-validator schemas on every route.
                </p>
                <div className="pt-2">
                  <span className="fw-bold" style={{ color: '#123D2C' }}>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PANEL 3: POPULAR SERVICES (4 Photographic Cards with Arched Headers)
          ========================================================================= */}
      <section className="py-5" style={{ backgroundColor: '#F8F5ED', borderTop: '1px solid #E8E2D5' }}>
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <div className="badge-nature-pill mb-2">
                <span style={{ fontSize: '0.9rem' }}>🌿</span>
                <span className="fw-semibold" style={{ color: '#123D2C' }}>Featured Catalog</span>
              </div>
              <h2 className="display-6 font-heading fw-bold mb-1" style={{ color: '#123D2C' }}>
                Popular Services
              </h2>
              <p className="text-muted mb-0">Browse top services available for instant online scheduling.</p>
            </div>
            <Link
              to="/services"
              className="btn btn-outline-sand mt-3 mt-md-0 d-inline-flex align-items-center gap-2 text-decoration-none"
            >
              View All Services →
            </Link>
          </div>

          <div className="row g-4">
            {loadingServices ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border" style={{ color: '#123D2C' }} role="status">
                  <span className="visually-hidden">Loading services...</span>
                </div>
              </div>
            ) : services.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No services found in database.</p>
              </div>
            ) : (
              services.map((service, index) => {
                const photoUrl = getServicePhoto(service.category, service.name);
                return (
                  <div key={service.id} className="col-md-6 col-lg-3">
                    <div
                      className="card custom-card hover-lift h-100 border-0 d-flex flex-column overflow-hidden"
                      style={{ backgroundColor: '#FFFEFA' }}
                    >
                      {/* Photographic Arched Container */}
                      <div className="p-3 pb-0">
                        <div
                          className="w-100 position-relative shadow-sm"
                          style={{
                            height: '140px',
                            borderRadius: '80px 80px 14px 14px',
                            backgroundImage: `url("${photoUrl}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      </div>

                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span
                            className="badge rounded-pill px-2.5 py-1 small"
                            style={{ backgroundColor: '#EFECE2', color: '#123D2C', fontWeight: 600 }}
                          >
                            {service.category}
                          </span>
                          <span className="fw-bold fs-5" style={{ color: '#123D2C' }}>
                            ${service.price}
                          </span>
                        </div>

                        <h5 className="font-heading fw-bold mb-2" style={{ color: '#123D2C', fontSize: '1.1rem' }}>
                          {service.name}
                        </h5>
                        <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: '1.55' }}>
                          {service.description}
                        </p>

                        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto" style={{ borderColor: '#ECE5D8' }}>
                          <span className="small text-muted d-flex align-items-center gap-1.5">
                            <Clock size={14} style={{ color: '#123D2C' }} />
                            {service.duration} mins
                          </span>
                          <Link
                            to={`/book?serviceId=${service.id}`}
                            className="btn btn-sm btn-forest px-3 py-1 text-decoration-none"
                            style={{ fontSize: '0.82rem' }}
                          >
                            Book
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          PANEL 6 (TOP HALF): READY TO STREAMLINE YOUR SCHEDULING? (CTA BANNER)
          ========================================================================= */}
      <section
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          backgroundColor: '#123D2C',
          backgroundImage: `linear-gradient(rgba(18, 61, 44, 0.88), rgba(18, 61, 44, 0.94)), url("${footerCtaBackground}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container py-4 text-center position-relative" style={{ zIndex: 2 }}>
          <div className="d-inline-flex align-items-center gap-2 mb-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#D5C4A1',
                color: '#123D2C',
                borderRadius: '9px',
              }}
            >
              <Calendar size={18} strokeWidth={2.4} />
            </div>
            <span className="font-heading fw-bold fs-5 text-white">BookEase</span>
          </div>

          <h2 className="display-6 font-heading fw-bold mb-3 text-white">
            Ready to Streamline Your Scheduling?
          </h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '620px', color: '#D2DDD7', fontSize: '1.05rem' }}>
            Join clients and service providers enjoying frictionless booking, instant slot reservations, and automated schedule tracking.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              to="/book"
              className="btn btn-sand px-4 py-2.5 text-decoration-none shadow-sm"
              style={{ color: '#123D2C', fontWeight: 600 }}
            >
              Book Your Appointment
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-light px-4 py-2.5 text-decoration-none"
              style={{ borderRadius: '9999px' }}
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
