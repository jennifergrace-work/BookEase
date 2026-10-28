import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../components/ToastNotification';
import {
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Briefcase,
  DollarSign,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.stats.get();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" style={{ color: 'var(--olive-deep)' }}>
          <span className="visually-hidden">Loading dashboard analytics...</span>
        </div>
      </div>
    );
  }

  const s = stats || {
    totalAppointments: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    totalUsers: 0,
    totalServices: 0,
    totalRevenue: 0,
    statusCounts: { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0, 'No-show': 0 },
    recentActivity: [],
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--olive-deep)' }}>
            Practitioner Control Center
          </span>
          <h1 className="font-heading fw-bold mt-1 mb-1" style={{ color: 'var(--olivewood)' }}>
            Operations & Analytics
          </h1>
          <p className="mb-0" style={{ color: 'var(--bark)' }}>
            Monitor booking volume, upcoming client pipelines, and practitioner availability schedules.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/admin/services" className="btn btn-sm btn-primary-custom">
            <PlusCircle size={14} />
            Add Service
          </Link>
        </div>
      </div>

      {/* 4-Column Stat Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total Appointments */}
        <div className="col-sm-6 col-lg-3">
          <div className="custom-card p-3.5 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--bark)', fontSize: '0.75rem' }}>
                Total Bookings
              </span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--sand-soft)', color: 'var(--olivewood)' }}
              >
                <Calendar size={18} strokeWidth={1.8} />
              </div>
            </div>
            <div>
              <div className="display-6 fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
                {s.totalAppointments}
              </div>
              <div className="small d-flex align-items-center gap-1" style={{ color: 'var(--olive-deep)' }}>
                <TrendingUp size={13} />
                <span>All scheduled slots</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Action */}
        <div className="col-sm-6 col-lg-3">
          <div className="custom-card p-3.5 h-100 d-flex flex-column justify-content-between" style={{ borderLeft: '4px solid var(--bark)' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--bark)', fontSize: '0.75rem' }}>
                Pending Review
              </span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--sand)', color: 'var(--bark)' }}
              >
                <Clock size={18} strokeWidth={1.8} />
              </div>
            </div>
            <div>
              <div className="display-6 fw-bold mb-1" style={{ color: 'var(--bark)' }}>
                {s.pending}
              </div>
              <div className="small text-muted">Awaiting confirmation</div>
            </div>
          </div>
        </div>

        {/* Card 3: Confirmed */}
        <div className="col-sm-6 col-lg-3">
          <div className="custom-card p-3.5 h-100 d-flex flex-column justify-content-between" style={{ borderLeft: '4px solid var(--olive-deep)' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--bark)', fontSize: '0.75rem' }}>
                Confirmed
              </span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--olive-soft)', color: 'var(--olive-deep)' }}
              >
                <CheckCircle size={18} strokeWidth={1.8} />
              </div>
            </div>
            <div>
              <div className="display-6 fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
                {s.confirmed}
              </div>
              <div className="small d-flex align-items-center gap-1" style={{ color: 'var(--olive-deep)' }}>
                <span>Locked in schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="col-sm-6 col-lg-3">
          <div className="custom-card p-3.5 h-100 d-flex flex-column justify-content-between" style={{ borderLeft: '4px solid var(--olivewood)' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small text-uppercase tracking-wider fw-bold" style={{ color: 'var(--bark)', fontSize: '0.75rem' }}>
                Gross Booked
              </span>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--olivewood-soft)', color: 'var(--olivewood)' }}
              >
                <DollarSign size={18} strokeWidth={1.8} />
              </div>
            </div>
            <div>
              <div className="display-6 fw-bold mb-1" style={{ color: 'var(--olivewood)' }}>
                ${s.totalRevenue}
              </div>
              <div className="small text-muted">{s.totalServices} active services</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Breakdown & Recent Activity */}
      <div className="row g-4 mb-4">
        {/* Status Distribution Bars */}
        <div className="col-lg-7">
          <div className="custom-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="font-heading fw-bold mb-0" style={{ color: 'var(--olivewood)' }}>
                  Appointment Status Distribution
                </h5>
                <span className="small text-muted">Pipeline breakdown across all scheduled bookings</span>
              </div>
              <span className="badge-confirmed py-0.5 px-2.5" style={{ fontSize: '0.75rem' }}>
                Active
              </span>
            </div>

            <div className="d-flex flex-column gap-3.5 mb-4">
              {/* Confirmed */}
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1" style={{ color: 'var(--olivewood)' }}>
                  <span className="d-flex align-items-center gap-1.5">
                    <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: 'var(--olive-deep)' }} />
                    Confirmed ({s.confirmed})
                  </span>
                  <span>{s.totalAppointments ? Math.round((s.confirmed / s.totalAppointments) * 100) : 0}%</span>
                </div>
                <div className="progress" style={{ height: '7px', backgroundColor: 'var(--sand-soft)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${s.totalAppointments ? (s.confirmed / s.totalAppointments) * 100 : 0}%`,
                      backgroundColor: 'var(--olive-deep)',
                    }}
                  />
                </div>
              </div>

              {/* Pending */}
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1" style={{ color: 'var(--bark)' }}>
                  <span className="d-flex align-items-center gap-1.5">
                    <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: 'var(--sand)' }} />
                    Pending ({s.pending})
                  </span>
                  <span>{s.totalAppointments ? Math.round((s.pending / s.totalAppointments) * 100) : 0}%</span>
                </div>
                <div className="progress" style={{ height: '7px', backgroundColor: 'var(--sand-soft)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${s.totalAppointments ? (s.pending / s.totalAppointments) * 100 : 0}%`,
                      backgroundColor: 'var(--sand)',
                    }}
                  />
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1" style={{ color: 'var(--olivewood)' }}>
                  <span className="d-flex align-items-center gap-1.5">
                    <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: 'var(--olivewood)' }} />
                    Completed ({s.completed})
                  </span>
                  <span>{s.totalAppointments ? Math.round((s.completed / s.totalAppointments) * 100) : 0}%</span>
                </div>
                <div className="progress" style={{ height: '7px', backgroundColor: 'var(--sand-soft)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${s.totalAppointments ? (s.completed / s.totalAppointments) * 100 : 0}%`,
                      backgroundColor: 'var(--olivewood)',
                    }}
                  />
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1" style={{ color: 'var(--clay)' }}>
                  <span className="d-flex align-items-center gap-1.5">
                    <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: 'var(--clay)' }} />
                    Cancelled ({s.cancelled})
                  </span>
                  <span>{s.totalAppointments ? Math.round((s.cancelled / s.totalAppointments) * 100) : 0}%</span>
                </div>
                <div className="progress" style={{ height: '7px', backgroundColor: 'var(--sand-soft)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${s.totalAppointments ? (s.cancelled / s.totalAppointments) * 100 : 0}%`,
                      backgroundColor: 'var(--clay)',
                    }}
                  />
                </div>
              </div>

              {/* No-Show */}
              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1" style={{ color: 'var(--sage)' }}>
                  <span className="d-flex align-items-center gap-1.5">
                    <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: 'var(--sage)' }} />
                    No-Show ({s.noShow})
                  </span>
                  <span>{s.totalAppointments ? Math.round((s.noShow / s.totalAppointments) * 100) : 0}%</span>
                </div>
                <div className="progress" style={{ height: '7px', backgroundColor: 'var(--sand-soft)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${s.totalAppointments ? (s.noShow / s.totalAppointments) * 100 : 0}%`,
                      backgroundColor: 'var(--sage)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-top border-sand d-flex justify-content-between align-items-center">
              <span className="small text-muted">Manage all bookings in table</span>
              <Link to="/admin/appointments" className="btn btn-sm btn-secondary-custom">
                Open Appointments Table &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="col-lg-5">
          <div className="custom-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="font-heading fw-bold mb-3" style={{ color: 'var(--olivewood)' }}>
                Recent Booking Activity
              </h5>

              <div className="d-flex flex-column gap-2.5">
                {s.recentActivity.map(act => (
                  <div
                    key={act.id}
                    className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                    style={{ backgroundColor: 'var(--parchment)', border: '1px solid var(--sand)' }}
                  >
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--olivewood)' }}>
                        {act.title}
                      </div>
                      <div className="small text-muted" style={{ fontSize: '0.74rem' }}>
                        {new Date(act.time).toLocaleDateString()} at {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <StatusBadge status={act.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-top border-sand">
              <Link to="/admin/availability" className="btn btn-sm btn-outline-custom w-100 justify-content-center">
                Configure Working Days & Hours &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
