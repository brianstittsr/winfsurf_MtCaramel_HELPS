'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
        </div>
        <h1 className="display-4 fw-bold text-danger mb-3">Oops!</h1>
        <h2 className="h4 mb-3">Something went wrong</h2>
        <p className="lead text-muted mb-4">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button
            onClick={reset}
            className="btn btn-primary btn-lg"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>
          <a href="/" className="btn btn-outline-primary btn-lg">
            <i className="bi bi-house-fill me-2"></i>
            Go Home
          </a>
        </div>
        {error.digest && (
          <div className="mt-4">
            <small className="text-muted">Error ID: {error.digest}</small>
          </div>
        )}
      </div>
    </div>
  );
}
