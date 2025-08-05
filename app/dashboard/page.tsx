'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { userData } = useAuth();

  const DashboardContent = () => (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                Mt. Caramel H.E.L.P.S.
              </h1>
              <p className="lead mb-4">
                Helping Everyone Learn, Progress, and Succeed
              </p>
              <p className="mb-4">
                A comprehensive suite of tools designed to support educational initiatives 
                and community outreach programs.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <span className="badge bg-light text-primary fs-6 px-3 py-2">
                  <i className="bi bi-person-badge me-1"></i>
                  {userData?.role?.toUpperCase()}
                </span>
                <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  Account Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <div className="mb-4">
                <i className="bi bi-grid-3x3-gap-fill display-6 text-primary mb-3"></i>
              </div>
              <h2 className="display-5 fw-bold text-primary mb-4">
                Available Applications
              </h2>
              <div className="mx-auto mb-4" style={{maxWidth: '100px', height: '4px', background: 'var(--primary-color)'}}></div>
              <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
                Explore our comprehensive suite of tools designed to streamline operations, 
                enhance productivity, and improve efficiency across your organization.
              </p>
              <div className="row justify-content-center mt-4">
                <div className="col-auto">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2">
                    <i className="bi bi-shield-check me-1"></i>
                    Secure
                  </span>
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2">
                    <i className="bi bi-lightning-charge me-1"></i>
                    Fast
                  </span>
                  <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                    <i className="bi bi-people me-1"></i>
                    User-Friendly
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-lg hover-lift">
                <div className="card-header bg-primary text-white text-center border-0">
                  <div className="rounded-circle overflow-hidden d-inline-block mb-2" style={{width: '80px', height: '80px'}}>
                    <img 
                      src="https://images.pexels.com/photos/8617711/pexels-photo-8617711.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
                      alt="Student with backpack" 
                      className="w-100 h-100 object-fit-cover"
                      style={{objectFit: 'cover'}}
                    />
                  </div>
                </div>
                <div className="card-body text-center p-4">
                  <h5 className="card-title fw-bold mb-3 text-primary">School Supply Tracker</h5>
                  <p className="card-text text-muted mb-4">
                    Track and manage school supply distribution with 
                    <span className="fw-semibold text-primary">digital signatures</span> and 
                    <span className="fw-semibold text-primary">real-time inventory</span> management.
                  </p>
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-pencil-square me-1"></i>
                      Digital Forms
                    </span>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-graph-up me-1"></i>
                      Real-time
                    </span>
                  </div>
                  <Link href="/supply-tracker" className="btn btn-primary btn-lg px-4 py-2">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Access Application
                  </Link>
                </div>
                <div className="card-footer bg-light border-0 text-center">
                  <small className="text-muted">
                    <i className="bi bi-people-fill me-1 text-primary"></i>
                    Available to all users
                  </small>
                </div>
              </div>
            </div>
            
            {/* User Management - Admin and Power Users only */}
            {(userData?.role === 'admin' || userData?.role === 'power_user') && (
              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <i className="bi bi-people display-4 text-primary"></i>
                    </div>
                    <h5 className="card-title">User Management</h5>
                    <p className="card-text">
                      Manage user accounts, roles, and permissions for the platform.
                    </p>
                    <button className="btn btn-secondary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reports - Admin only */}
            {userData?.role === 'admin' && (
              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <i className="bi bi-graph-up display-4 text-info"></i>
                    </div>
                    <h5 className="card-title">Reports & Analytics</h5>
                    <p className="card-text">
                      Generate detailed reports and analytics for all platform activities.
                    </p>
                    <button className="btn btn-secondary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings - Admin only */}
            {userData?.role === 'admin' && (
              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <i className="bi bi-gear-fill display-4 text-warning"></i>
                    </div>
                    <h5 className="card-title">System Settings</h5>
                    <p className="card-text">
                      Configure system preferences and administrative settings.
                    </p>
                    <button className="btn btn-secondary" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Placeholder for future applications */}
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div className="card-header bg-gradient text-white text-center border-0" style={{background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'}}>
                  <div className="rounded-circle overflow-hidden d-inline-block mb-2" style={{width: '80px', height: '80px'}}>
                    <img 
                      src="https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
                      alt="Construction tools" 
                      className="w-100 h-100 object-fit-cover"
                      style={{objectFit: 'cover'}}
                    />
                  </div>
                </div>
                <div className="card-body text-center p-4">
                  <h5 className="card-title fw-bold mb-3">
                    <span className="text-gradient">More Tools Coming Soon</span>
                    <i className="bi bi-stars text-warning ms-2"></i>
                  </h5>
                  <p className="card-text text-muted mb-4">
                    We're continuously developing 
                    <span className="fw-semibold text-info">innovative applications</span> to support 
                    educational and community initiatives.
                  </p>
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    <span className="badge bg-warning bg-opacity-10 text-warning">
                      <i className="bi bi-clock me-1"></i>
                      In Development
                    </span>
                    <span className="badge bg-info bg-opacity-10 text-info">
                      <i className="bi bi-lightbulb me-1"></i>
                      Innovation
                    </span>
                  </div>
                  <button className="btn btn-outline-secondary btn-lg px-4 py-2" disabled>
                    <i className="bi bi-hourglass-split me-2"></i>
                    Coming Soon
                  </button>
                </div>
                <div className="card-footer bg-light border-0 text-center">
                  <small className="text-muted">
                    <i className="bi bi-gear-fill me-1 text-secondary"></i>
                    Under active development
                  </small>
                </div>
                {/* Animated corner accent */}
                <div className="position-absolute top-0 end-0 p-2">
                  <span className="badge bg-warning rounded-pill pulse">
                    <i className="bi bi-plus-circle"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5 position-relative" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card border-0 shadow-lg">
                <div className="card-header bg-primary text-white text-center py-4 border-0">
                  <div className="mb-3">
                    <i className="bi bi-bullseye display-4 text-white"></i>
                  </div>
                  <h2 className="display-6 fw-bold mb-0">Our Mission</h2>
                </div>
                <div className="card-body p-5">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <p className="lead mb-4 text-muted">
                        <span className="fw-bold text-primary">Mt. Caramel H.E.L.P.S.</span> is dedicated to providing 
                        <span className="fw-semibold text-info">innovative digital solutions</span> that support 
                        educational institutions and community organizations in their mission to help everyone 
                        <span className="fw-semibold text-primary">learn, progress, and succeed</span>.
                      </p>
                      <p className="mb-4">
                        Our applications are designed with 
                        <span className="badge bg-primary bg-opacity-10 text-primary mx-1">security</span>, 
                        <span className="badge bg-primary bg-opacity-10 text-primary mx-1">efficiency</span>, and 
                        <span className="badge bg-info bg-opacity-10 text-info mx-1">user experience</span> 
                        in mind, ensuring that administrators can focus on what matters most - 
                        <span className="fw-semibold text-primary">supporting their communities</span>.
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-primary text-white px-3 py-2">
                          <i className="bi bi-shield-check me-1"></i>
                          Secure by Design
                        </span>
                        <span className="badge bg-primary text-white px-3 py-2">
                          <i className="bi bi-lightning-charge me-1"></i>
                          High Performance
                        </span>
                        <span className="badge bg-info text-white px-3 py-2">
                          <i className="bi bi-heart me-1"></i>
                          Community Focused
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 text-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                        <i className="bi bi-people-fill display-3 text-primary"></i>
                      </div>
                      <h5 className="fw-bold text-primary mb-2">Community Impact</h5>
                      <p className="text-muted mb-0">Empowering organizations to serve their communities better</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light border-0 text-center py-3">
                  <small className="text-muted">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    Committed to excellence in digital solutions
                    <i className="bi bi-star-fill text-warning ms-1"></i>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
