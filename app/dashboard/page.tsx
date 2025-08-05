'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { userData } = useAuth();

  const DashboardContent = () => (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Dashboard</h1>
          <p className="lead">
            Welcome back! You are logged in as a <strong>{userData?.role}</strong>.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Supply Tracker Card - Available to all users */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-box-seam me-2"></i>
                Supply Tracker
              </h5>
              <p className="card-text">
                {userData?.role === 'client' 
                  ? 'Submit supply pickup forms and view your submission history.'
                  : 'Manage supply pickups, view all submissions, and track inventory.'
                }
              </p>
              <Link href="/supply-tracker" className="btn btn-primary">
                Access Application
              </Link>
            </div>
          </div>
        </div>

        {/* Inventory Management - Power Users and Admins */}
        {userData?.role !== 'client' && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-boxes me-2"></i>
                  Inventory Management
                </h5>
                <p className="card-text">
                  Manage supply items, adjust quantities, and track low-stock items.
                </p>
                <Link href="/inventory" className="btn btn-primary">
                  Manage Inventory
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* User Management - Admins only */}
        {userData?.role === 'admin' && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-people me-2"></i>
                  User Management
                </h5>
                <p className="card-text">
                  Manage user accounts, assign roles, and oversee system access.
                </p>
                <Link href="/admin" className="btn btn-primary">
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Reports - Power Users and Admins */}
        {userData?.role !== 'client' && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Reports
                </h5>
                <p className="card-text">
                  View pickup reports, inventory analytics, and usage statistics.
                </p>
                <button className="btn btn-secondary" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-3">Quick Overview</h3>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">Your Role</h5>
              <p className="card-text display-6">{userData?.role}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">Account Status</h5>
              <p className="card-text display-6">Active</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">Applications</h5>
              <p className="card-text display-6">1</p>
              <small className="text-muted">Available</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">Support</h5>
              <p className="card-text">
                <button className="btn btn-outline-warning btn-sm">
                  Contact Help
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
