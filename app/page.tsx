'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <section className="hero-section position-relative overflow-hidden">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-8">
              <div className="mb-4">
                <Image 
                  src="/logo.avif" 
                  alt="Mount Carmel HELPS Logo" 
                  width={180} 
                  height={180} 
                  className="mb-3"
                  priority
                />
              </div>
              <h1 className="display-3 fw-bold text-white mb-4">
                Mount Carmel HELPS Inc.
              </h1>
              <h2 className="display-6 text-white mb-4 opacity-90">
                Helping Every Lacking Person Succeed
              </h2>
              <p className="lead text-white mb-4 opacity-85">
                A 501(c)(3) nonprofit corporation dedicated to improving and enhancing 
                the standard of living for the people of North Carolina since 1997.
              </p>
              {!user ? (
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/auth/signup" className="btn btn-light btn-lg px-4 py-3">
                    <i className="bi bi-person-plus me-2"></i>
                    Get Started
                  </Link>
                  <Link href="/auth/signin" className="btn btn-outline-light btn-lg px-4 py-3">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard" className="btn btn-light btn-lg px-4 py-3">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Go to Dashboard
                </Link>
              )}
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                <i className="bi bi-heart-fill display-1 text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Are About Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">What We Are About</h2>
              <div className="mx-auto" style={{maxWidth: '100px', height: '4px', background: 'var(--primary-color)'}}></div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <p className="lead mb-4">
                    Mount Carmel Helps, Inc is a duly authorized 501(c)(3) nonprofit corporation, 
                    licensed in the State of North Carolina, established in 1997. We are dedicated 
                    to improving and enhancing the standard of living for the people of North Carolina.
                  </p>
                  <p className="mb-4">
                    In our community development initiative, we focus on revitalizing neighborhoods 
                    and providing quality affordable housing. We believe in partnerships, working 
                    with various agencies to combat hunger and homelessness. Our commitment extends 
                    to helping families with bill payments and support during natural disasters. 
                    Excitingly, we are also in the process of opening a daycare to further serve 
                    our community needs.
                  </p>
                  <p className="mb-0 fw-semibold text-primary">
                    We are passionate about making a change in our community by changing the lives 
                    of the people who live here. If we can effectively meet the needs of our neighbors, 
                    then other communities, cities, states, and countries can meet the needs of their 
                    people as well.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Mount Carmel HELPS Inc. Provides...</h2>
              <div className="mx-auto" style={{maxWidth: '100px', height: '4px', background: 'var(--primary-color)'}}></div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-house-door fs-1 text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Housing</h5>
                  <p className="text-muted">Quality affordable housing solutions for families in need</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-key fs-1 text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Housing Deposit Assistance</h5>
                  <p className="text-muted">Financial support for housing deposits and moving costs</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-receipt fs-1 text-warning"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Bill Assistance</h5>
                  <p className="text-muted">Help with utility bills and essential monthly expenses</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-shield-exclamation fs-1 text-danger"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Disaster Assistance</h5>
                  <p className="text-muted">Emergency support during natural disasters and crises</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-basket fs-1 text-info"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Food Assistance</h5>
                  <p className="text-muted">Nutritional support and food security programs</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-secondary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-person-backpack fs-1 text-secondary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Supply Tracking</h5>
                  <p className="text-muted">Digital tools for managing and tracking supply distribution</p>
                  {user ? (
                    <Link href="/supply-tracker" className="btn btn-primary btn-sm mt-2">
                      Access Tracker
                    </Link>
                  ) : (
                    <Link href="/auth/signin" className="btn btn-outline-primary btn-sm mt-2">
                      Sign In to Access
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-4">Our Mission</h2>
              <p className="lead mb-0 opacity-90">
                Mount Carmel HELPS Inc.'s Mission: Helping Every Lacking Person Succeed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Get Involved</h2>
              <p className="lead mb-4">
                Mount Carmel HELPS Inc. is dedicated to making a difference in the lives 
                of those in need. Join us in our mission to provide essential support and 
                resources to those facing challenges.
              </p>
              <p className="mb-4">
                Your contribution can help transform lives and bring hope to our community.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-primary btn-lg px-4 py-3">
                  <i className="bi bi-heart-fill me-2"></i>
                  Donate Now
                </button>
                <button className="btn btn-outline-primary btn-lg px-4 py-3">
                  <i className="bi bi-people-fill me-2"></i>
                  Volunteer
                </button>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-light rounded-3 p-4">
                <i className="bi bi-camera display-1 text-muted mb-3"></i>
                <h6 className="text-muted">See Us In Action</h6>
                <p className="text-muted mb-0">Impacting Our Community, Positively</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h5 className="fw-bold mb-3">
                    <Image 
                      src="/logo.avif" 
                      alt="Mount Carmel HELPS Logo" 
                      width={40} 
                      height={40} 
                      className="me-2"
                    />
                    Mount Carmel HELPS Inc.
                  </h5>
                  <div className="mb-3">
                    <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                    <span>
                      2734 Commerce Road<br/>
                      Jacksonville, NC 28546
                    </span>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-telephone-fill me-2 text-primary"></i>
                    <a href="tel:9102227475" className="text-white text-decoration-none">
                      (910) 222-7475
                    </a>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-envelope-fill me-2 text-primary"></i>
                    <a href="mailto:admin@mchelps.org" className="text-white text-decoration-none">
                      admin@mchelps.org
                    </a>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <h5 className="fw-bold mb-3">Follow Us</h5>
                  <div className="mb-3">
                    <a href="#" className="text-white text-decoration-none d-flex align-items-center">
                      <i className="bi bi-facebook me-2 fs-4 text-primary"></i>
                      <div>
                        <div>Follow Us on Facebook</div>
                        <small className="text-muted">for our Current Activities</small>
                      </div>
                    </a>
                  </div>
                  <div className="mt-4">
                    <h6 className="fw-semibold">God's House of Deliverance</h6>
                    <p className="text-muted mb-0">Praise Worship</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-3 p-4">
                <i className="bi bi-heart-fill display-4 text-primary mb-3"></i>
                <h5 className="fw-bold mb-3">Make a Difference</h5>
                <p className="mb-3">Every contribution helps us serve our community better</p>
                <button className="btn btn-primary">
                  <i className="bi bi-gift-fill me-2"></i>
                  Donate Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
