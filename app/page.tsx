'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
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
              {!user ? (
                <div className="d-flex gap-3 justify-content-center">
                  <Link href="/auth/signup" className="btn btn-light btn-lg">
                    Get Started
                  </Link>
                  <Link href="/auth/signin" className="btn btn-outline-light btn-lg">
                    Sign In
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard" className="btn btn-light btn-lg">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="fw-bold">Available Applications</h2>
              <p className="text-muted">
                Explore our suite of tools designed to streamline operations and improve efficiency.
              </p>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-box-seam display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">School Supply Tracker</h5>
                  <p className="card-text">
                    Track and manage school supply distribution with digital signatures 
                    and real-time inventory management.
                  </p>
                  {user ? (
                    <Link href="/supply-tracker" className="btn btn-primary">
                      Access Application
                    </Link>
                  ) : (
                    <Link href="/auth/signin" className="btn btn-outline-primary">
                      Sign In to Access
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Placeholder for future applications */}
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-tools display-4 text-secondary"></i>
                  </div>
                  <h5 className="card-title">More Tools Coming Soon</h5>
                  <p className="card-text">
                    We're continuously developing new applications to support 
                    educational and community initiatives.
                  </p>
                  <button className="btn btn-secondary" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-4">Our Mission</h2>
              <p className="lead">
                Mt. Caramel H.E.L.P.S. is dedicated to providing innovative digital solutions 
                that support educational institutions and community organizations in their 
                mission to help everyone learn, progress, and succeed.
              </p>
              <p>
                Our applications are designed with security, efficiency, and user experience 
                in mind, ensuring that administrators can focus on what matters most - 
                supporting their communities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
