import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/properties';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'retailer' || loggedUser.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to fill demo account
  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
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
              <Building2 size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem' }}>
              Log in to manage or browse rental listings
            </p>
          </div>

          {/* Quick Demo Pre-fills (Great for viva/grading) */}
          <div
            style={{
              background: 'var(--slate-50)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem'
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              🚀 Quick Demo Accounts
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('retailer@example.com')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', background: 'white' }}
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('user@example.com')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', background: 'white' }}
              >
                Tenant Demo
              </button>
            </div>
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    color: 'var(--slate-800)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Password
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    color: 'var(--slate-800)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer link to register */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
