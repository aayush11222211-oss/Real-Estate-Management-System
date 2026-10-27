import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import { Building2, Frown, Sparkles } from 'lucide-react';

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL search params if present
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'All',
    furnishing: searchParams.get('furnishing') || 'All',
    bedrooms: searchParams.get('bedrooms') || 'All',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    const newType = searchParams.get('type');
    const newSearch = searchParams.get('search');
    const newFurnishing = searchParams.get('furnishing');

    if (newType && newType !== filters.type) {
      setFilters((prev) => ({ ...prev, type: newType }));
    }
    if (newSearch && newSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: newSearch }));
    }
    if (newFurnishing && newFurnishing !== filters.furnishing) {
      setFilters((prev) => ({ ...prev, furnishing: newFurnishing }));
    }
  }, [searchParams]);

  // Fetch properties whenever filters change
  useEffect(() => {
    const fetchFilteredProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.properties.getAll(filters);
        if (res.success) {
          setProperties(res.data);
        } else {
          setError('Failed to load properties.');
        }
      } catch (err) {
        console.error('Fetch properties error:', err);
        setError('Could not connect to the server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      furnishing: 'All',
      bedrooms: 'All',
      minRent: '',
      maxRent: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  return (
    <div className="properties-page" style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Building2 size={16} /> Rental Catalog
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--slate-900)' }}>
            Available Rental Properties
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '1rem', marginTop: '0.25rem' }}>
            Filter by property type, rent budget, furnishing status, and location.
          </p>
        </div>

        {/* Filter Bar Component */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          totalResults={properties.length}
        />

        {/* Content State: Loading, Error, or Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-light)',
                borderTopColor: 'var(--primary-600)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.25rem'
              }}
            />
            <p style={{ color: 'var(--slate-500)', fontSize: '1rem' }}>
              Finding matching rental properties...
            </p>
          </div>
        ) : error ? (
          <div
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              margin: '2rem 0'
            }}
          >
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '4rem 2rem',
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              maxWidth: '600px',
              margin: '2rem auto'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--slate-100)',
                color: 'var(--slate-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <Frown size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No Properties Found</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              We could not find any properties matching your current filter selection. Try adjusting your rent range or resetting filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              <Sparkles size={16} /> Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid-cards">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
