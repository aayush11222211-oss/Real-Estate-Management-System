import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onReset, totalResults = 0 }) {
  const handleTypeChange = (type) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const handleFurnishingChange = (e) => {
    setFilters((prev) => ({ ...prev, furnishing: e.target.value }));
  };

  const handleBedroomsChange = (e) => {
    setFilters((prev) => ({ ...prev, bedrooms: e.target.value }));
  };

  const handleRentPresetChange = (e) => {
    const val = e.target.value;
    if (val === 'all') {
      setFilters((prev) => ({ ...prev, minRent: '', maxRent: '' }));
    } else if (val === 'under20k') {
      setFilters((prev) => ({ ...prev, minRent: '', maxRent: '20000' }));
    } else if (val === '20k-40k') {
      setFilters((prev) => ({ ...prev, minRent: '20000', maxRent: '40000' }));
    } else if (val === '40k-70k') {
      setFilters((prev) => ({ ...prev, minRent: '40000', maxRent: '70000' }));
    } else if (val === 'above70k') {
      setFilters((prev) => ({ ...prev, minRent: '70000', maxRent: '' }));
    }
  };

  const getRentPresetValue = () => {
    if (!filters.minRent && !filters.maxRent) return 'all';
    if (!filters.minRent && filters.maxRent === '20000') return 'under20k';
    if (filters.minRent === '20000' && filters.maxRent === '40000') return '20k-40k';
    if (filters.minRent === '40000' && filters.maxRent === '70000') return '40k-70k';
    if (filters.minRent === '70000' && !filters.maxRent) return 'above70k';
    return 'custom';
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}
    >
      {/* Top row: Search input & Property Type tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'var(--slate-50)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '0.55rem 0.95rem',
            flex: '1 1 300px',
            minWidth: '240px'
          }}
        >
          <Search size={18} color="var(--slate-400)" />
          <input
            type="text"
            placeholder="Search by title, location (e.g. Bandra, Indiranagar)..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '0.92rem',
              color: 'var(--slate-800)'
            }}
          />
        </div>

        {/* Property Type Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'House', 'Flat', 'Apartment'].map((t) => {
            const isActive = (filters.type || 'All') === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  background: isActive ? 'var(--primary-600)' : 'var(--slate-100)',
                  color: isActive ? 'white' : 'var(--slate-700)',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                {t === 'All' ? 'All Types' : `${t}s`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second row: Dropdown filters for Furnishing, Bedrooms, Rent Range, and Sort */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.85rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--slate-100)'
        }}
      >
        {/* Furnishing Status */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Furnishing
          </label>
          <select
            value={filters.furnishing || 'All'}
            onChange={handleFurnishingChange}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'white',
              fontSize: '0.88rem',
              color: 'var(--slate-700)',
              outline: 'none'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Bedrooms
          </label>
          <select
            value={filters.bedrooms || 'All'}
            onChange={handleBedroomsChange}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'white',
              fontSize: '0.88rem',
              color: 'var(--slate-700)',
              outline: 'none'
            }}
          >
            <option value="All">Any Bedrooms</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4+">4+ BHK</option>
          </select>
        </div>

        {/* Rent Range */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Rent Range
          </label>
          <select
            value={getRentPresetValue()}
            onChange={handleRentPresetChange}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'white',
              fontSize: '0.88rem',
              color: 'var(--slate-700)',
              outline: 'none'
            }}
          >
            <option value="all">Any Rent</option>
            <option value="under20k">Under ₹20,000</option>
            <option value="20k-40k">₹20,000 - ₹40,000</option>
            <option value="40k-70k">₹40,000 - ₹70,000</option>
            <option value="above70k">Above ₹70,000</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sort By
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'white',
              fontSize: '0.88rem',
              color: 'var(--slate-700)',
              outline: 'none'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="rent_asc">Rent: Low to High</option>
            <option value="rent_desc">Rent: High to Low</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline"
            style={{ width: '100%', padding: '0.52rem 0.75rem', fontSize: '0.85rem' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Results counter & active tags indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          fontSize: '0.84rem',
          color: 'var(--slate-500)',
          borderTop: '1px dashed var(--slate-200)',
          paddingTop: '0.75rem'
        }}
      >
        <span>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'property' : 'properties'} available
        </span>
        {(filters.type !== 'All' || filters.furnishing !== 'All' || filters.bedrooms !== 'All' || filters.minRent || filters.maxRent || filters.search) && (
          <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
            Filters Active
          </span>
        )}
      </div>
    </div>
  );
}
