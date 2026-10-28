import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Service } from '../types';
import { useToast } from '../components/ToastNotification';
import { CardSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Search, Clock, ArrowRight, Filter } from 'lucide-react';

const serviceCardBackground = new URL('../../19_service_card_background.jpg', import.meta.url).href;

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'duration'>('name');
  const { showToast } = useToast();

  const categories = ['All', 'Healthcare', 'Wellness & Spa', 'Dental Care', 'Salon & Beauty'];

  const getServicePhoto = (category: string, name: string) => {
    const cat = (category + ' ' + name).toLowerCase();
    if (cat.includes('health') || cat.includes('medic') || cat.includes('doctor')) {
      return new URL('../../04_healthcare_stethoscope.jpg', import.meta.url).href;
    }
    if (cat.includes('massage') || cat.includes('therapy')) {
      return new URL('../../10_massage_service.jpg', import.meta.url).href;
    }
    if (cat.includes('spa') || cat.includes('wellness') || cat.includes('stones')) {
      return new URL('../../05_spa_still_life.jpg', import.meta.url).href;
    }
    if (cat.includes('dental') || cat.includes('teeth') || cat.includes('oral')) {
      return new URL('../../06_dental_care.jpg', import.meta.url).href;
    }
    if (cat.includes('beauty') || cat.includes('salon') || cat.includes('skincare')) {
      return new URL('../../07_salon_skincare.jpg', import.meta.url).href;
    }
    return new URL('../../19_service_card_background.jpg', import.meta.url).href;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.services.getAll({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: search.trim() || undefined,
        all: false,
      });
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'duration') return a.duration - b.duration;
    return a.name.localeCompare(b.name);
  });

  return (
    <div
      className="container py-4 py-lg-5"
      style={{
        minHeight: '85vh',
        backgroundImage: `radial-gradient(circle at top, rgba(168,182,154,0.10), transparent 35%), url("${serviceCardBackground}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Page Header */}
      <div className="mb-4">
        <div className="badge-nature-pill mb-2">
          <span>🌿</span>
          <span className="fw-semibold" style={{ color: '#123D2C' }}>Offerings & Treatments</span>
        </div>
        <h1 className="font-heading fw-bold mt-1 mb-2" style={{ color: '#123D2C' }}>
          Explore Services & Consultations
        </h1>
        <p className="mb-0 text-muted" style={{ maxWidth: '600px' }}>
          Select from certified health, wellness, and therapeutic consultations with transparent pricing and instant slot reservation.
        </p>
      </div>

      {/* Sticky Search and Filter Toolbar */}
      <div
        className="custom-card p-3 mb-4 sticky-top shadow-sm border-0"
        style={{ top: '75px', zIndex: 1010, backgroundColor: '#FFFEFA' }}
      >
        <div className="row g-3 align-items-center">
          {/* Keyword Search */}
          <div className="col-lg-5 col-md-6">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderColor: '#E3DAC9', color: '#123D2C' }}>
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-forest ms-2">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Category Filter Chips */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-1.5 overflow-x-auto py-1">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className="btn btn-sm text-nowrap rounded-pill"
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.85rem',
                      backgroundColor: isActive ? '#123D2C' : '#EFECE2',
                      color: isActive ? '#FFFFFF' : '#18342B',
                      border: '1px solid ' + (isActive ? '#123D2C' : '#DFD9CB'),
                      fontWeight: 600,
                    }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="col-lg-3 col-md-12 text-md-end">
            <div className="d-flex align-items-center justify-content-lg-end gap-2">
              <span className="small text-muted text-nowrap">Sort:</span>
              <select
                className="form-select form-select-sm w-auto"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                style={{ fontSize: '0.82rem' }}
              >
                <option value="name">Name (A–Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Duration: Shortest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="row g-4">
          <div className="col-lg-4 col-md-6"><CardSkeleton /></div>
          <div className="col-lg-4 col-md-6"><CardSkeleton /></div>
          <div className="col-lg-4 col-md-6"><CardSkeleton /></div>
        </div>
      ) : sortedServices.length === 0 ? (
        <EmptyState
          title="No services match your filters"
          description="Try adjusting your search query or selecting a different category."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="row g-4">
          {sortedServices.map(service => {
            const photoUrl = getServicePhoto(service.category, service.name);
            return (
              <div key={service.id} className="col-lg-4 col-md-6">
                <div
                  className="card custom-card hover-lift h-100 border-0 d-flex flex-column overflow-hidden"
                  style={{ backgroundColor: '#FFFEFA' }}
                >
                  {/* Arched Photo Header */}
                  <div className="p-3 pb-0">
                    <div
                      className="w-100 position-relative shadow-sm"
                      style={{
                        height: '150px',
                        borderRadius: '90px 90px 14px 14px',
                        backgroundImage: `linear-gradient(180deg, rgba(18,61,44,0.10), rgba(18,61,44,0.04)), url("${photoUrl}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid rgba(18,61,44,0.08)',
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
                      <span className="fs-5 fw-bold" style={{ color: '#123D2C' }}>
                        ${service.price}
                      </span>
                    </div>

                    <h4 className="font-heading fw-bold mb-2" style={{ color: '#123D2C', fontSize: '1.2rem' }}>
                      {service.name}
                    </h4>

                    <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: '1.55' }}>
                      {service.description}
                    </p>

                    <div className="border-top pt-3 d-flex justify-content-between align-items-center" style={{ borderColor: '#ECE5D8' }}>
                      <div className="d-flex align-items-center gap-1.5 small text-muted">
                        <Clock size={15} style={{ color: '#123D2C' }} />
                        <span>{service.duration} mins</span>
                      </div>

                      <div className="d-flex gap-2">
                        <Link
                          to={`/services/${service.id}`}
                          className="btn btn-sm btn-outline-sand px-3 py-1"
                          style={{ fontSize: '0.82rem' }}
                        >
                          Details
                        </Link>
                        <Link
                          to={`/book?serviceId=${service.id}`}
                          className="btn btn-sm btn-forest px-3.5 py-1 d-flex align-items-center gap-1"
                          style={{ fontSize: '0.82rem' }}
                        >
                          Book
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
