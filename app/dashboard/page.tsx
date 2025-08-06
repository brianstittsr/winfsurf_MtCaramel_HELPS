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
                  {userData?.role?.toUpperCase()}
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
                <div className="card-body text-center p-5">
                  <h4 className="card-title fw-bold mb-4 text-primary fs-3">School Supply Tracker</h4>
                  <p className="card-text text-muted mb-4 fs-5">
                    Track and manage school supply distribution with 
                    <span className="fw-semibold text-primary">digital signatures</span> and 
                    <span className="fw-semibold text-primary">real-time inventory</span> management.
                  </p>
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <span className="badge bg-primary bg-opacity-10 text-primary fs-6 px-3 py-2">
                      <i className="bi bi-pencil-square me-2"></i>
                      Digital Forms
                    </span>
                    <span className="badge bg-primary bg-opacity-10 text-primary fs-6 px-3 py-2">
                      <i className="bi bi-graph-up me-2"></i>
                      Real-time
                    </span>
                  </div>
                  <Link href="/supply-tracker" className="btn btn-primary btn-lg px-5 py-3 fs-5">
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
                  <div className="card-body text-center p-5">
                    <div className="mb-4">
                      <i className="bi bi-people display-3 text-primary"></i>
                    </div>
                    <h4 className="card-title fs-3 mb-4">User Management</h4>
                    <p className="card-text fs-5 mb-4">
                      Manage user accounts, roles, and permissions for the platform.
                    </p>
                    <button className="btn btn-secondary btn-lg px-4 py-3 fs-5" disabled>
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
                  <div className="card-body text-center p-5">
                    <div className="mb-4">
                      <i className="bi bi-graph-up display-3 text-info"></i>
                    </div>
                    <h4 className="card-title fs-3 mb-4">Reports & Analytics</h4>
                    <p className="card-text fs-5 mb-4">
                      Generate detailed reports and analytics for all platform activities.
                    </p>
                    <button className="btn btn-secondary btn-lg px-4 py-3 fs-5" disabled>
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
                  <div className="card-body text-center p-5">
                    <div className="mb-4">
                      <i className="bi bi-gear-fill display-3 text-warning"></i>
                    </div>
                    <h4 className="card-title fs-3 mb-4">System Settings</h4>
                    <p className="card-text fs-5 mb-4">
                      Configure system preferences and administrative settings.
                    </p>
                    <button className="btn btn-secondary btn-lg px-4 py-3 fs-5" disabled>
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
                <div className="card-body text-center p-5">
                  <h4 className="card-title fw-bold mb-4 fs-3">
                    <span className="text-gradient">More Tools Coming Soon</span>
                    <i className="bi bi-stars text-warning ms-2"></i>
                  </h4>
                  <p className="card-text text-muted mb-4 fs-5">
                    We're continuously developing 
                    <span className="fw-semibold text-info">innovative applications</span> to support 
                    educational and community initiatives.
                  </p>
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <span className="badge bg-warning bg-opacity-10 text-warning fs-6 px-3 py-2">
                      <i className="bi bi-clock me-2"></i>
                      In Development
                    </span>
                    <span className="badge bg-info bg-opacity-10 text-info fs-6 px-3 py-2">
                      <i className="bi bi-lightbulb me-2"></i>
                      Innovation
                    </span>
                  </div>
                  <button className="btn btn-outline-secondary btn-lg px-5 py-3 fs-5" disabled>
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


    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
