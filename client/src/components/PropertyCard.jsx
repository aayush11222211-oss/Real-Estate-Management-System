import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Sofa, Phone, ArrowUpRight } from 'lucide-react';

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    _id,
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
    ownerName
  } = property;

  // Format currency
  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rent || 0);

  // Type badge class
  const typeBadgeClass =
    propertyType === 'House'
      ? 'badge-house'
      : propertyType === 'Flat'
      ? 'badge-flat'
      : 'badge-apartment';

  // Furnishing badge class
  const furnishingBadgeClass =
    furnishing === 'Furnished'
      ? 'badge-furnished'
      : furnishing === 'Semi-Furnished'
      ? 'badge-semi'
      : 'badge-unfurnished';

  const displayPhone = phone && phone.length === 10
    ? `${phone.slice(0, 5)} ${phone.slice(5)}`
    : (phone || 'Call Retailer');

  return (
    <div className="property-card">
      {/* Property Image & Overlays */}
      <div className="card-image-wrapper">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges on top of card */}
        <div className="card-badges-top">
          <span className={`badge ${typeBadgeClass}`}>{propertyType}</span>
          <span className={`badge ${furnishingBadgeClass}`}>{furnishing}</span>
        </div>

        {/* Rent tag on bottom-left */}
        <div className="card-rent-tag">
          {formattedRent} <span>/mo</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="card-body">
        <h3 className="card-title" title={title}>
          <Link to={`/properties/${_id}`}>{title}</Link>
        </h3>

        <div className="card-location">
          <MapPin size={15} color="var(--primary-600)" />
          <span>{location}{city ? `, ${city}` : ''}</span>
        </div>

        {/* Specs: Bedrooms, Bathrooms, Furnishing */}
        <div className="card-specs">
          <div className="spec-item" title="Bedrooms">
            <Bed size={16} color="var(--slate-500)" />
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="spec-item" title="Bathrooms">
            <Bath size={16} color="var(--slate-500)" />
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="spec-item" title="Furnishing">
            <Sofa size={16} color="var(--slate-500)" />
            <span>{furnishing}</span>
          </div>
        </div>

        {/* Card Footer: Retailer Phone & View Details */}
        <div className="card-footer">
          <a
            href={`tel:${phone}`}
            className="card-phone-btn"
            title="Call Retailer / Owner"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={14} />
            <span>{displayPhone}</span>
          </a>

          <Link to={`/properties/${_id}`} className="btn btn-outline btn-sm">
            Details <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
