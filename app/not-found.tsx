import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
        </div>
        <h1 className="display-4 fw-bold text-primary mb-3">404</h1>
        <h2 className="h4 mb-3">Page Not Found</h2>
        <p className="lead text-muted mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/" className="btn btn-primary btn-lg">
            <i className="bi bi-house-fill me-2"></i>
            Go Home
          </Link>
          <Link href="/dashboard" className="btn btn-outline-primary btn-lg">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
