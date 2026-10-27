import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Mail, Lock, Phone, ArrowRight, Home, KeyRound } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'tenant' // 'tenant' or 'retailer'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phone: onlyDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, role } = formData;

    if (!name || !email || !password || !phone) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const cleanPhone = phone.toString().replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Phone number must be exactly 10 digits (e.g. 9876543210).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const newUser = await register({ name, email, password, phone: cleanPhone, role });
      if (newUser.role === 'retailer' || newUser.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/properties');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <KeyRound size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
              Create an Account
            </h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem' }}>
              Join RentNest as a Tenant or Property Owner
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
                borderLeft: '4px solid #dc2626'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Account Role Selector Cards */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                I am registering as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {/* Tenant Card */}
                <div
                  onClick={() => handleRoleSelect('tenant')}
                  style={{
                    border: formData.role === 'tenant' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                    background: formData.role === 'tenant' ? 'var(--primary-50)' : 'white',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Home size={20} color={formData.role === 'tenant' ? 'var(--primary-600)' : 'var(--slate-500)'} style={{ margin: '0 auto 0.35rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'tenant' ? 'var(--primary-700)' : 'var(--slate-800)' }}>
                    Tenant
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                    Looking to rent a home
                  </div>
                </div>

                {/* Retailer Card */}
                <div
                  onClick={() => handleRoleSelect('retailer')}
                  style={{
                    border: formData.role === 'retailer' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                    background: formData.role === 'retailer' ? 'var(--primary-50)' : 'white',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Building2 size={20} color={formData.role === 'retailer' ? 'var(--primary-600)' : 'var(--slate-500)'} style={{ margin: '0 auto 0.35rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'retailer' ? 'var(--primary-700)' : 'var(--slate-800)' }}>
                    Property Owner
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                    List & manage rentals
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Full Name / Business Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  background: 'white'
                }}
              >
                <User size={18} color="var(--slate-400)" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem', color: 'var(--slate-800)' }}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  background: 'white'
                }}
              >
                <Mail size={18} color="var(--slate-400)" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem', color: 'var(--slate-800)' }}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Contact Phone Number
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  background: 'white'
                }}
              >
                <Phone size={18} color="var(--slate-400)" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number (e.g. 9876543210)"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem', color: 'var(--slate-800)' }}
                  required
                />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '0.25rem', display: 'block' }}>
                Must be exactly 10 digits without country code or spaces (e.g. 9876543210).
              </span>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Password (min 6 characters)
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  background: 'white'
                }}
              >
                <Lock size={18} color="var(--slate-400)" />
                <input
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem', color: 'var(--slate-800)' }}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer link to login */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
