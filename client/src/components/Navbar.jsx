import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, User, LogOut, PlusCircle, LayoutDashboard, Menu, X, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const { user, isRetailer, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <Building2 size={22} />
          </div>
          <span>Rent<span style={{ color: 'var(--primary-600)' }}>Nest</span></span>
          <span className="brand-badge">Rentals</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Home size={17} /> Home
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Building2 size={17} /> Browse Properties
          </NavLink>

          {isAuthenticated && isRetailer && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={17} /> Owner Dashboard
            </NavLink>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isRetailer && (
                <Link to="/dashboard?action=new" className="btn btn-primary btn-sm" style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline-flex' } }}>
                  <PlusCircle size={15} /> Add Property
                </Link>
              )}

              <div className="user-pill">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: isRetailer ? 'var(--primary-700)' : 'var(--slate-500)', fontWeight: 600 }}>
                    {isRetailer ? 'Retailer / Owner' : 'Tenant'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log out"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.4rem',
              color: 'var(--slate-700)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid var(--border-light)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="nav-link"
            style={{ padding: '0.5rem 0' }}
          >
            <Home size={18} /> Home
          </NavLink>
          <NavLink
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-link"
            style={{ padding: '0.5rem 0' }}
          >
            <Building2 size={18} /> Browse Properties
          </NavLink>
          {isAuthenticated && isRetailer && (
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link"
              style={{ padding: '0.5rem 0' }}
            >
              <LayoutDashboard size={18} /> Owner Dashboard
            </NavLink>
          )}

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{ width: '100%' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
