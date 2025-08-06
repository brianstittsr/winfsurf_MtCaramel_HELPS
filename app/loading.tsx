export default function Loading() {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">
          <i className="bi bi-hourglass-split me-2"></i>
          Loading Mt. Caramel H.E.L.P.S...
        </h5>
        <p className="text-muted mb-0">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
