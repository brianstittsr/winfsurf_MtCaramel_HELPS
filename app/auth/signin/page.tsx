'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from '@/lib/auth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Side - Branding */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" 
               style={{background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'}}>
            <div className="text-center text-white p-5">
              <div className="mb-4">
                <Image 
                  src="/logo.avif" 
                  alt="Mt. Caramel H.E.L.P.S. Logo" 
                  width={120} 
                  height={120} 
                  className="mb-4"
                  priority
                />
              </div>
              <h1 className="display-4 fw-bold mb-4">Mt. Caramel H.E.L.P.S.</h1>
              <p className="lead mb-4 opacity-90">
                School Supply Tracking and Accountability Application
              </p>
              <div className="row text-center mt-5">
                <div className="col-4">
                  <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                    <i className="bi bi-shield-check display-6"></i>
                  </div>
                  <h6 className="fw-semibold">Secure</h6>
                  <small className="opacity-75">Protected access</small>
                </div>
                <div className="col-4">
                  <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                    <i className="bi bi-speedometer2 display-6"></i>
                  </div>
                  <h6 className="fw-semibold">Fast</h6>
                  <small className="opacity-75">Quick tracking</small>
                </div>
                <div className="col-4">
                  <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                    <i className="bi bi-people display-6"></i>
                  </div>
                  <h6 className="fw-semibold">Collaborative</h6>
                  <small className="opacity-75">Team focused</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{maxWidth: '400px'}}>
              {/* Mobile Logo */}
              <div className="text-center mb-4 d-lg-none">
                <Image 
                  src="/logo.avif" 
                  alt="Mt. Caramel H.E.L.P.S. Logo" 
                  width={80} 
                  height={80} 
                  className="mb-3"
                  priority
                />
                <h3 className="fw-bold text-primary">Mt. Caramel H.E.L.P.S.</h3>
              </div>

              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-2">Welcome Back!</h2>
                    <p className="text-muted">Please sign in to your account</p>
                  </div>
              
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}
              
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2 text-primary"></i>
                        Email Address
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-at text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <i className="bi bi-lock me-2 text-primary"></i>
                        Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-key text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control border-start-0 ps-0"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="rememberMe" />
                          <label className="form-check-label text-muted" htmlFor="rememberMe">
                            Remember me
                          </label>
                        </div>
                        <Link href="#" className="text-decoration-none small">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 mb-3"
                      disabled={loading}
                      style={{padding: '0.75rem 1.5rem'}}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In to Dashboard
                        </>
                      )}
                    </button>
                  </form>
              
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link href="/auth/signup" className="text-decoration-none fw-semibold">
                        Create Account
                      </Link>
                    </p>
                  </div>

                  {/* Demo Credentials */}
                  <div className="mt-4 p-3 bg-light rounded-3">
                    <h6 className="fw-semibold text-muted mb-2">
                      <i className="bi bi-info-circle me-2"></i>
                      Demo Credentials
                    </h6>
                    <div className="small text-muted">
                      <div className="mb-1">
                        <strong>Email:</strong> admin@mtcaramelhelps.com
                      </div>
                      <div>
                        <strong>Password:</strong> admin123
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="bi bi-shield-lock me-1"></i>
                  Your data is protected with enterprise-grade security
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
