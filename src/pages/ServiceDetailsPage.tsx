import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Service } from '../types';
import { useToast } from '../components/ToastNotification';
import {
  Clock,
  CalendarCheck,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';

const getServiceDetailImage = (category?: string, name?: string) => {
  const text = ((category || '') + ' ' + (name || '')).toLowerCase();
  if (text.includes('health') || text.includes('medic') || text.includes('doctor')) {
    return new URL('../../04_healthcare_stethoscope.jpg', import.meta.url).href;
  }
  if (text.includes('massage') || text.includes('therapy')) {
    return new URL('../../10_massage_service.jpg', import.meta.url).href;
  }
  if (text.includes('spa') || text.includes('wellness') || text.includes('stones')) {
    return new URL('../../05_spa_still_life.jpg', import.meta.url).href;
  }
  if (text.includes('dental') || text.includes('teeth')) {
    return new URL('../../06_dental_care.jpg', import.meta.url).href;
  }
  if (text.includes('beauty') || text.includes('salon') || text.includes('skincare')) {
    return new URL('../../07_salon_skincare.jpg', import.meta.url).href;
  }
  return new URL('../../19_service_card_background.jpg', import.meta.url).href;
};

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadService() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.services.getById(id);
        if (res.success && res.data) {
          setService(res.data);
        } else {
          showToast('Service could not be located', 'error');
          navigate('/services');
        }
      } catch (err: any) {
        showToast(err.message || 'Error loading service details', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" style={{ color: 'var(--olive-deep)' }}>
          <span className="visually-hidden">Loading details...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5 text-center">
        <h4 className="font-heading" style={{ color: 'var(--olivewood)' }}>Service Not Found</h4>
        <Link to="/services" className="btn btn-primary-custom mt-3">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 py-lg-5">
      <Link to="/services" className="btn btn-sm btn-secondary-custom mb-4 d-inline-flex align-items-center gap-1.5">
        <ArrowLeft size={15} />
        Back to All Services
      </Link>

      <div className="row g-4">
        {/* Main Details */}
        <div className="col-lg-8">
          <div className="custom-card p-4 p-md-5">
            <div
              className="w-100 mb-4 rounded-4 overflow-hidden shadow-sm"
              style={{
                height: '220px',
                backgroundImage: `linear-gradient(180deg, rgba(18,61,44,0.08), rgba(18,61,44,0.16)), url("${getServiceDetailImage(service.category, service.name)}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-label={`${service.name} service image`}
            />
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="category-chip">{service.category}</span>
              <span className="badge-confirmed py-0.5 px-2.5" style={{ fontSize: '0.74rem' }}>
                Verified Specialist
              </span>
            </div>

            <h1 className="font-heading fw-bold mb-3" style={{ color: 'var(--olivewood)' }}>
              {service.name}
            </h1>

            <p className="lead mb-4" style={{ color: 'var(--bark)', lineHeight: '1.7', fontSize: '1.1rem' }}>
              {service.description}
            </p>

            {/* Inclusions */}
            <div className="p-4 rounded-3 mb-4" style={{ backgroundColor: 'var(--parchment)', border: '1px solid var(--sand)' }}>
              <h5 className="font-heading fw-bold mb-3" style={{ color: 'var(--olivewood)' }}>
                Session Inclusions & Care Standards
              </h5>
              <div className="row g-3 small">
                <div className="col-sm-6 d-flex align-items-center gap-2" style={{ color: 'var(--bark)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--olive-deep)' }} />
                  <span>Licensed and verified specialist practitioner</span>
                </div>
                <div className="col-sm-6 d-flex align-items-center gap-2" style={{ color: 'var(--bark)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--olive-deep)' }} />
                  <span>Sanitized, peaceful consultation room</span>
                </div>
                <div className="col-sm-6 d-flex align-items-center gap-2" style={{ color: 'var(--bark)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--olive-deep)' }} />
                  <span>Digital consultation summary & follow-up roadmap</span>
                </div>
                <div className="col-sm-6 d-flex align-items-center gap-2" style={{ color: 'var(--bark)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--olive-deep)' }} />
                  <span>Hassle-free rescheduling up to 24h prior</span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 small text-muted">
              <ShieldCheck size={18} style={{ color: 'var(--sage)' }} />
              <span>Real-time appointment synchronization protected with instant lock guarantee.</span>
            </div>
          </div>
        </div>

        {/* Sticky Pricing Card */}
        <div className="col-lg-4">
          <div className="custom-card p-4 sticky-top shadow-md" style={{ top: '80px' }}>
            <h5 className="font-heading fw-bold mb-3" style={{ color: 'var(--olivewood)' }}>
              Session Summary
            </h5>

            <div className="d-flex justify-content-between align-items-baseline mb-3 pb-3 border-bottom border-sand">
              <span style={{ color: 'var(--bark)' }}>Standard Fee:</span>
              <span className="fs-3 fw-bold" style={{ color: 'var(--olivewood)' }}>
                ${service.price}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-sand">
              <span className="d-flex align-items-center gap-1.5" style={{ color: 'var(--bark)' }}>
                <Clock size={16} style={{ color: 'var(--sage)' }} />
                Duration:
              </span>
              <span className="fw-semibold" style={{ color: 'var(--olivewood)' }}>
                {service.duration} Minutes
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-sand">
              <span className="d-flex align-items-center gap-1.5" style={{ color: 'var(--bark)' }}>
                <Award size={16} style={{ color: 'var(--sage)' }} />
                Category:
              </span>
              <span className="fw-semibold text-truncate ms-2" style={{ color: 'var(--olivewood)' }}>
                {service.category}
              </span>
            </div>

            <Link
              to={`/book?serviceId=${service.id}`}
              className="btn btn-olive-cta w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-2"
            >
              <CalendarCheck size={18} />
              Book Appointment Now
            </Link>

            <div className="text-center small text-muted">
              Select date & time slot on next step
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
