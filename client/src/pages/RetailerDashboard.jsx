import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Phone,
  Sofa,
  ExternalLink,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';

export default function RetailerDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);

  // Form State
  const initialFormState = {
    title: '',
    propertyType: 'Apartment',
    location: '',
    city: '',
    rent: '',
    bedrooms: '2',
    bathrooms: '2',
    furnishing: 'Furnished',
    phone: user?.phone || '',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    description: '',
    amenities: 'Water Supply, Car Parking, Security'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Sample Image Presets for quick selection
  const imagePresets = [
    { label: 'Luxury Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Modern Villa House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Cozy City Flat', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80' },
    { label: 'High-Rise Living', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Studio Flat', url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80' }
  ];

  // Fetch properties listed by this owner
  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const res = await api.properties.getMyListings();
      if (res.success) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error('Error fetching retailer properties:', err);
      setFeedback({ type: 'error', message: 'Failed to load your property listings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();

    // Check if ?action=new was passed in URL
    if (searchParams.get('action') === 'new') {
      openAddModal();
    }
  }, []);

  const openAddModal = () => {
    setEditingPropertyId(null);
    setFormData({
      ...initialFormState,
      phone: user?.phone || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prop) => {
    setEditingPropertyId(prop._id);
    setFormData({
      title: prop.title || '',
      propertyType: prop.propertyType || 'Apartment',
      location: prop.location || '',
      city: prop.city || '',
      rent: prop.rent || '',
      bedrooms: String(prop.bedrooms || '2'),
      bathrooms: String(prop.bathrooms || '2'),
      furnishing: prop.furnishing || 'Furnished',
      phone: prop.phone || user?.phone || '',
      imageUrl: prop.imageUrl || '',
      description: prop.description || '',
      amenities: Array.isArray(prop.amenities) ? prop.amenities.join(', ') : (prop.amenities || '')
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPropertyId(null);
    setSearchParams({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: onlyDigits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.rent || !formData.phone) {
      setFeedback({ type: 'error', message: 'Please fill in all mandatory fields.' });
      return;
    }

    const cleanPhone = (formData.phone || '').toString().replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setFeedback({ type: 'error', message: 'Contact phone number must be exactly 10 digits (e.g. 9876543210).' });
      return;
    }

    try {
      setActionLoading(true);
      setFeedback(null);

      if (editingPropertyId) {
        // Update property
        const res = await api.properties.update(editingPropertyId, formData);
        if (res.success) {
          setFeedback({ type: 'success', message: 'Property updated successfully!' });
          closeModal();
          fetchMyProperties();
        }
      } else {
        // Create new property
        const res = await api.properties.create(formData);
        if (res.success) {
          setFeedback({ type: 'success', message: 'New property listed successfully!' });
          closeModal();
          fetchMyProperties();
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProperty = async (propId, propTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${propTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setActionLoading(true);
      const res = await api.properties.delete(propId);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Property deleted successfully.' });
        fetchMyProperties();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete property.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Dashboard Stats Calculations
  const totalRentValue = properties.reduce((acc, p) => acc + (Number(p.rent) || 0), 0);
  const houseCount = properties.filter((p) => p.propertyType === 'House').length;
  const flatCount = properties.filter((p) => p.propertyType === 'Flat').length;
  const apartmentCount = properties.filter((p) => p.propertyType === 'Apartment').length;

  return (
    <div className="retailer-dashboard" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase' }}>
              Retailer Management Portal
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--slate-900)' }}>
              Owner Property Dashboard
            </h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
              Welcome back, <strong>{user?.name}</strong>. Manage your rental listings, update phone numbers, and add new properties.
            </p>
          </div>

          <button onClick={openAddModal} className="btn btn-primary btn-lg">
            <PlusCircle size={20} /> Add New Property
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            style={{
              padding: '0.9rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: feedback.type === 'success' ? '#ecfdf5' : '#fee2e2',
              color: feedback.type === 'success' ? '#065f46' : '#b91c1c',
              border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} style={{ color: 'inherit' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Active Listings
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {properties.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Visible to home seekers</span>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Total Monthly Rent
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '0.25rem' }}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRentValue)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Combined portfolio rent</span>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Listing Breakdown
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <span className="badge badge-house">{houseCount} Houses</span>
              <span className="badge badge-flat">{flatCount} Flats</span>
              <span className="badge badge-apartment">{apartmentCount} Apts</span>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>
              Your Properties ({properties.length})
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              All changes sync instantly to the live website
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
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
              <p style={{ color: 'var(--slate-500)' }}>Loading your properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Building2 size={48} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Properties Listed Yet</h3>
              <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                You have not added any properties yet. Click the button below to publish your first rental listing with photos and contact details.
              </p>
              <button onClick={openAddModal} className="btn btn-primary">
                <PlusCircle size={18} /> Add Your First Property
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {properties.map((prop) => (
                <div
                  key={prop._id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--slate-100)',
                    gap: '1.25rem',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slate-50)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  {/* Left: Thumbnail & Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1 1 340px' }}>
                    <img
                      src={prop.imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80'}
                      alt={prop.title}
                      style={{
                        width: '90px',
                        height: '75px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        flexShrink: 0
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80';
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span
                          className={`badge ${
                            prop.propertyType === 'House'
                              ? 'badge-house'
                              : prop.propertyType === 'Flat'
                              ? 'badge-flat'
                              : 'badge-apartment'
                          }`}
                        >
                          {prop.propertyType}
                        </span>
                        <span
                          className={`badge ${
                            prop.furnishing === 'Furnished'
                              ? 'badge-furnished'
                              : prop.furnishing === 'Semi-Furnished'
                              ? 'badge-semi'
                              : 'badge-unfurnished'
                          }`}
                        >
                          {prop.furnishing}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
                        {prop.title}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                        <MapPin size={13} color="var(--primary-600)" />
                        <span>{prop.location}{prop.city ? `, ${prop.city}` : ''}</span>
                        <span style={{ margin: '0 0.35rem' }}>•</span>
                        <Bed size={13} /> {prop.bedrooms} BHK
                        <span style={{ margin: '0 0.35rem' }}>•</span>
                        <Phone size={13} /> {prop.phone}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Rent */}
                  <div style={{ textAlign: 'right', flex: '0 0 140px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      ₹{prop.rent?.toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>per month</span>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                      to={`/properties/${prop._id}`}
                      target="_blank"
                      className="btn btn-outline btn-sm"
                      title="View public page"
                    >
                      <ExternalLink size={15} />
                    </Link>

                    <button
                      onClick={() => openEditModal(prop)}
                      className="btn btn-secondary btn-sm"
                      title="Edit property details"
                    >
                      <Edit3 size={15} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProperty(prop._id, prop.title)}
                      className="btn btn-danger btn-sm"
                      title="Delete property"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Property Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                background: 'white',
                zIndex: 10
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--slate-900)' }}>
                  {editingPropertyId ? 'Edit Property Listing' : 'List New Rental Property'}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                  {editingPropertyId ? 'Update details and contact number' : 'Enter details to display on the public catalog'}
                </span>
              </div>
              <button
                onClick={closeModal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--slate-600)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Property Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Spacious 3BHK Apartment with Balcony"
                  value={formData.title}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Property Type & Furnishing Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      background: 'white'
                    }}
                    required
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="House">House</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Furnishing Status *
                  </label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      background: 'white'
                    }}
                    required
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Monthly Rent & Contact Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    name="rent"
                    placeholder="e.g. 25000"
                    value={formData.rent}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                    required
                    min="1000"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number (e.g. 9876543210)"
                    value={formData.phone}
                    onChange={handleFormChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '0.2rem', display: 'block' }}>
                    Must be exactly 10 digits (e.g. 9876543210)
                  </span>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Bedrooms (BHK) *
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      background: 'white'
                    }}
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Bathrooms *
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      background: 'white'
                    }}
                  >
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4+ Bathrooms</option>
                  </select>
                </div>
              </div>

              {/* Location & City */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Address / Locality *
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Bandra West, Near Metro Station"
                    value={formData.location}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Property Image URL with Sample Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Property Image URL
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Quick Presets Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>Quick Presets:</span>
                  {imagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--slate-100)',
                        color: 'var(--slate-700)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Property Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe the rooms, views, connectivity, water schedule, etc."
                  value={formData.description}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Amenities (comma-separated) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  name="amenities"
                  placeholder="Water Supply, Car Parking, Security, Gym, Balcony"
                  value={formData.amenities}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1.25rem',
                  marginTop: '0.5rem'
                }}
              >
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-primary">
                  {actionLoading ? 'Saving...' : editingPropertyId ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
