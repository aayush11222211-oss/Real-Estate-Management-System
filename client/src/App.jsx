import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RetailerDashboard from './pages/RetailerDashboard';

// Helper to scroll to top whenever the URL path changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 404 Component
function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--slate-900)', marginBottom: '1rem' }}>404</h1>
      <p style={{ color: 'var(--slate-500)', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Oops! The page you are looking for does not exist.
      </p>
      <a href="/" className="btn btn-primary">
        Return to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* 1. Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* 2. Properties Catalog Page */}
              <Route path="/properties" element={<PropertiesPage />} />

              {/* 3. Property Details Page */}
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />

              {/* 4. Login Page */}
              <Route path="/login" element={<LoginPage />} />

              {/* 5. Register Page */}
              <Route path="/register" element={<RegisterPage />} />

              {/* 6. Retailer / Owner Dashboard (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute retailerOnly>
                    <RetailerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
