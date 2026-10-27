import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, retailerOnly = false }) {
  const { user, isAuthenticated, isRetailer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-light)',
              borderTopColor: 'var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Verifying session...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (retailerOnly && !isRetailer) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '600px' }}>
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Retailer Access Only</h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            You are logged in as a <strong>Tenant ({user?.name})</strong>. The property dashboard is reserved for verified retailers and property owners to list and manage rental homes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/properties" className="btn btn-outline">
              Browse Properties
            </a>
            <a href="/register" className="btn btn-primary">
              Register as Retailer
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
