import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import {
  Search,
  Building2,
  Home,
  Building,
  PhoneCall,
  ShieldCheck,
  Zap,
  ArrowRight,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [recentProperties, setRecentProperties] = useState([]);
  const [stats, setStats] = useState({ total: 0, houses: 0, flats: 0, apartments: 0 });
  const [loading, setLoading] = useState(true);

  // Search hero inputs
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recentRes, statsRes] = await Promise.all([
          api.properties.getRecent(),
          api.properties.getStats()
        ]);

        if (recentRes.success) setRecentProperties(recentRes.data);
        if (statsRes.success) setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    if (selectedType && selectedType !== 'All') params.append('type', selectedType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at top right, #dbeafe 0%, #eff6ff 40%, #f8fafc 100%)',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid var(--border-light)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'white',
                padding: '0.35rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-700)'
              }}
            >
              <Zap size={16} color="var(--primary-600)" />
              Direct Owner Connections • Zero Brokerage Fees
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.4rem)',
                fontWeight: 800,
                color: 'var(--slate-900)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '1.25rem'
              }}
            >
              Find Your Ideal Rental Home in{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Minutes
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--slate-600)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '650px',
                margin: '0 auto 2.5rem'
              }}
            >
              Browse verified houses, modern flats, and luxury apartments. Contact retailers and property owners directly via phone.
            </p>

            {/* Quick Hero Search Box */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                background: 'white',
                padding: '0.75rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                textAlign: 'left'
              }}
            >
              {/* Keyword / Location */}
              <div
                style={{
                  flex: '2 1 250px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <Search size={20} color="var(--slate-400)" />
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                    Location or Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city, locality (e.g., Bandra, Powai)..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'var(--slate-800)'
                    }}
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div
                style={{
                  flex: '1 1 180px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <Building2 size={20} color="var(--slate-400)" />
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--slate-800)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="All">All Types</option>
                    <option value="House">Houses</option>
                    <option value="Flat">Flats</option>
                    <option value="Apartment">Apartments</option>
                  </select>
                </div>
              </div>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '0.9rem 1.85rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Search size={18} /> Search Properties
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Live Numbers & Categories Bar */}
      <section style={{ padding: '3.5rem 0 2rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explore by Property Category</h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '1rem' }}>
              Select a category to view verified rental options tailored to your lifestyle
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            {/* Category: Houses */}
            <Link
              to="/properties?type=House"
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-normal)',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ height: '170px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                  alt="Independent Houses"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>Independent Houses</h3>
                  <span className="badge badge-house">{stats.houses} Listed</span>
                </div>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Spacious standalone houses, villas, and independent floors with private parking and gardens.
                </p>
                <span style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Browse Houses <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Category: Flats */}
            <Link
              to="/properties?type=Flat"
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-normal)',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ height: '170px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Flats"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>Modern Flats</h3>
                  <span className="badge badge-flat">{stats.flats} Listed</span>
                </div>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  1 BHK, 2 BHK and 3 BHK flats near key transit hubs, metro stations, and workplaces.
                </p>
                <span style={{ color: 'var(--teal-600)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Browse Flats <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Category: Apartments */}
            <Link
              to="/properties?type=Apartment"
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-normal)',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ height: '170px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                  alt="Luxury Apartments"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>High-Rise Apartments</h3>
                  <span className="badge badge-apartment">{stats.apartments} Listed</span>
                </div>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Gated communities with clubhouses, swimming pools, 24/7 security, and power backup.
                </p>
                <span style={{ color: 'var(--primary-700)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Browse Apartments <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Recently Listed Properties Grid */}
      <section style={{ padding: '2rem 0 4rem', background: 'var(--slate-50)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Fresh on the Market
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>Recently Listed Properties</h2>
            </div>
            <Link to="/properties" className="btn btn-outline">
              View All Properties ({stats.total}) <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid var(--border-light)',
                  borderTopColor: 'var(--primary-600)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}
              />
              <p style={{ color: 'var(--slate-500)' }}>Loading latest listings...</p>
            </div>
          ) : (
            <div className="grid-cards">
              {recentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Rent Through RentNest (User Benefits) */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Why Rent Through RentNest?</h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '1rem' }}>
              Designed to make renting simple, fast, and transparent for college students, families, and professionals.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <PhoneCall size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Direct Owner Contact</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every listing includes the retailer or property owner's real phone number. Call directly or send a WhatsApp message without waiting.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: '#eff6ff',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Zero Brokerage</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Say goodbye to hefty middleman commissions. Deal directly with owners and retailers for maximum savings and honest pricing.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Clear Furnishing Details</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Filter easily between Fully Furnished, Semi-Furnished, and Unfurnished rentals so you know exactly what is included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Owner Call To Action Banner */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--slate-900) 0%, var(--slate-800) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              color: 'white',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', marginBottom: '1rem' }}>
                Property Owners & Retailers
              </span>
              <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.85rem' }}>
                Have a vacant property to rent out?
              </h2>
              <p style={{ color: 'var(--slate-300)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Create a retailer account, list your houses, flats, or apartments with custom photos, rent details, and your direct contact phone number.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <PlusCircle size={20} /> Register as Retailer
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'var(--slate-600)' }}>
                Owner Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
