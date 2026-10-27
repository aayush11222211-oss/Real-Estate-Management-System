import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  MapPin,
  Bed,
  Bath,
  Sofa,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Check,
  Copy,
  MessageSquare,
  Building,
  Calendar,
  Share2
} from 'lucide-react';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.properties.getById(id);
        if (res.success && res.data) {
          setProperty(res.data);
        } else {
          setError('Property not found or has been removed.');
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-light)',
            borderTopColor: 'var(--primary-600)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}
        />
        <p style={{ color: 'var(--slate-500)' }}>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            border: '1px solid var(--border-light)',
            maxWidth: '550px',
            margin: '0 auto'
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>Property Not Found</h2>
          <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
            {error || 'The property you are looking for is no longer available.'}
          </p>
          <Link to="/properties" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to All Properties
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    propertyType,
    location,
    city,
    rent,
    bedrooms,
    bathrooms,
    furnishing,
    phone,
    imageUrl,
    description,
    amenities = [],
    ownerName,
    createdAt
  } = property;

  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rent || 0);

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <div className="property-details-page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb / Back Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        {/* Top Header: Title, Location, Badges, and Rent */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1.5rem',
            marginBottom: '1.75rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span
                className={`badge ${
                  propertyType === 'House'
                    ? 'badge-house'
                    : propertyType === 'Flat'
                    ? 'badge-flat'
                    : 'badge-apartment'
                }`}
              >
                {propertyType}
              </span>
              <span
                className={`badge ${
                  furnishing === 'Furnished'
                    ? 'badge-furnished'
                    : furnishing === 'Semi-Furnished'
                    ? 'badge-semi'
                    : 'badge-unfurnished'
                }`}
              >
                {furnishing}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--slate-900)' }}>
              {title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--slate-600)',
                fontSize: '0.95rem',
                marginTop: '0.5rem'
              }}
            >
              <MapPin size={18} color="var(--primary-600)" />
              <span>{location}{city ? `, ${city}` : ''}</span>
            </div>
          </div>

          {/* Large Rent Display Box */}
          <div
            style={{
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'right'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Monthly Rent
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1.1 }}>
              {formattedRent}
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-500)' }}> / month</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Side (Image & Specs & Description) & Right Side (Retailer Contact Card) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column (Content) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Large Image Showcase */}
            <div
              style={{
                width: '100%',
                height: '420px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                background: 'var(--slate-100)'
              }}
            >
              <img
                src={imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            {/* Quick Specs Highlight Bar */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bed size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>Bedrooms</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--slate-800)' }}>{bedrooms} BHK</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bath size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>Bathrooms</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--slate-800)' }}>{bathrooms} Baths</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sofa size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>Furnishing</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--slate-800)' }}>{furnishing}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>Property Type</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--slate-800)' }}>{propertyType}</strong>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Property Overview & Description</h2>
              <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, fontSize: '0.98rem', whiteSpace: 'pre-line' }}>
                {description || 'No detailed description provided by the retailer for this property.'}
              </p>
            </div>

            {/* Amenities Section */}
            {amenities && amenities.length > 0 && (
              <div
                style={{
                  background: 'white',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Features & Amenities</h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.85rem'
                  }}
                >
                  {amenities.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.92rem',
                        color: 'var(--slate-700)'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ecfdf5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Check size={14} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Prominent Retailer / Owner Contact Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.3rem'
                  }}
                >
                  {ownerName ? ownerName.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.15rem' }}>
                    {ownerName || 'Property Retailer'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.82rem', fontWeight: 600 }}>
                    <ShieldCheck size={15} /> Verified Property Lister
                  </div>
                </div>
              </div>

              {/* Direct Phone Number Banner */}
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Direct Contact Number
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                  {phone || 'Not available'}
                </div>
                {phone && (
                  <button
                    onClick={() => handleCopyPhone(phone)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      color: copied ? '#059669' : 'var(--slate-600)',
                      fontWeight: 600
                    }}
                  >
                    {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                    {copied ? 'Phone Number Copied!' : 'Copy Phone Number'}
                  </button>
                )}
              </div>

              {/* Action Buttons: Direct Call & WhatsApp */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <a
                  href={`tel:${cleanPhone}`}
                  className="btn btn-success"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
                >
                  <Phone size={18} /> Call Retailer Directly
                </a>

                <a
                  href={`https://wa.me/${waPhone}?text=Hi%2C+I+am+interested+in+your+rental+property%3A+${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', borderColor: '#10b981', color: '#059669' }}
                >
                  <MessageSquare size={18} /> Chat via WhatsApp
                </a>
              </div>

              {/* Safety notice */}
              <div
                style={{
                  borderTop: '1px solid var(--slate-100)',
                  paddingTop: '1rem',
                  fontSize: '0.78rem',
                  color: 'var(--slate-500)',
                  lineHeight: 1.5
                }}
              >
                💡 <strong>Renting Safety Tip:</strong> Always inspect the property in person before transferring advance deposits. Contact the owner directly at the verified phone number provided.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
