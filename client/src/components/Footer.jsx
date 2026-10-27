import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>
                Rent<span style={{ color: 'var(--primary-500)' }}>Nest</span>
              </span>
            </div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              A simple, transparent rental property platform connecting home seekers directly with verified property retailers and owners. Zero middlemen fees.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
              <ShieldCheck size={18} /> Direct Owner Phone Verification
            </div>
          </div>

          {/* Quick Browse */}
          <div className="footer-col">
            <h4>Browse Rentals</h4>
            <ul className="footer-links">
              <li><Link to="/properties?type=Apartment">Apartments for Rent</Link></li>
              <li><Link to="/properties?type=Flat">Flats for Rent</Link></li>
              <li><Link to="/properties?type=House">Independent Houses</Link></li>
              <li><Link to="/properties?furnishing=Furnished">Fully Furnished Homes</Link></li>
              <li><Link to="/properties">All Listings</Link></li>
            </ul>
          </div>

          {/* Owners & Retailers */}
          <div className="footer-col">
            <h4>For Property Owners</h4>
            <ul className="footer-links">
              <li><Link to="/register">Create Retailer Account</Link></li>
              <li><Link to="/login">Owner Login</Link></li>
              <li><Link to="/dashboard">Property Dashboard</Link></li>
              <li><Link to="/dashboard?action=new">List a New Property</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="footer-col">
            <h4>Direct Contact</h4>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Have questions about listing or finding your next rental home?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-300)', fontSize: '0.85rem' }}>
                <Phone size={16} color="var(--primary-500)" /> +91 98765 43210
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-300)', fontSize: '0.85rem' }}>
                <Mail size={16} color="var(--primary-500)" /> support@rentnest.example.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RentNest Rental Property Portal. College Project Submission.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with React.js, Node.js & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
}
