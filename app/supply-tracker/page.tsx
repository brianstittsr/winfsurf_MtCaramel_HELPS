'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SignaturePad, { SignaturePadRef } from '@/components/SignaturePad';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getSupplyItems, 
  submitSupplyPickup, 
  getSupplyPickups, 
  initializeDefaultSupplyItems,
  SupplyItem, 
  SupplyPickup 
} from '@/lib/supplyTracker';

export default function SupplyTracker() {
  const { user, userData } = useAuth();
  const signaturePadRef = useRef<SignaturePadRef>(null);
  
  // Form state
  const [orgName, setOrgName] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  
  // Data state
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([]);
  const [pickups, setPickups] = useState<SupplyPickup[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('form');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [user, userData]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Initialize default items if needed
      await initializeDefaultSupplyItems();
      
      // Load supply items
      const items = await getSupplyItems();
      setSupplyItems(items);
      
      // Load pickups based on user role
      const pickupData = userData?.role === 'client' 
        ? await getSupplyPickups(user.uid)
        : await getSupplyPickups();
      setPickups(pickupData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (itemId: string) => {
    setSelectedItem(itemId);
    const item = supplyItems.find(i => i.id === itemId);
    if (item) {
      setUnit(item.unit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !signaturePadRef.current) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate signature
      if (signaturePadRef.current.isEmpty()) {
        setError('Please provide a signature');
        setSubmitting(false);
        return;
      }

      // Get selected item details
      const item = supplyItems.find(i => i.id === selectedItem);
      if (!item) {
        setError('Please select a valid supply item');
        setSubmitting(false);
        return;
      }

      // Check if enough quantity is available
      if (quantity > item.available_quantity) {
        setError(`Not enough ${item.name} available. Current stock: ${item.available_quantity}`);
        setSubmitting(false);
        return;
      }

      // Get signature blob
      const signatureBlob = await signaturePadRef.current.toBlob();

      // Submit pickup
      const pickupData = {
        org_name: orgName,
        supply_item_id: selectedItem,
        supply_item_name: item.name,
        quantity: quantity,
        unit: unit,
        issued_by: user.uid,
        issued_by_email: user.email || '',
        signature_url: '', // This will be set in submitSupplyPickup
      };

      await submitSupplyPickup(pickupData, signatureBlob);

      // Reset form
      setOrgName('');
      setSelectedItem('');
      setQuantity(1);
      setUnit('');
      signaturePadRef.current.clear();

      setSuccess('Supply pickup submitted successfully!');
      
      // Reload data
      await loadData();
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error: any) {
      setError(error.message || 'Failed to submit pickup');
    } finally {
      setSubmitting(false);
    }
  };

  const SupplyTrackerContent = () => (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Supply Tracker</h1>
          
          {/* Navigation Tabs */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-0">
              <ul className="nav nav-pills nav-justified bg-light rounded-3 p-2 mb-0">
                <li className="nav-item">
                  <button 
                    className={`nav-link rounded-3 fw-semibold d-flex align-items-center justify-content-center py-3 ${
                      activeTab === 'form' ? 'active' : 'text-muted'
                    }`}
                    onClick={() => setActiveTab('form')}
                  >
                    <i className="bi bi-clipboard-plus me-2"></i>
                    Submit Pickup
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link rounded-3 fw-semibold d-flex align-items-center justify-content-center py-3 ${
                      activeTab === 'history' ? 'active' : 'text-muted'
                    }`}
                    onClick={() => setActiveTab('history')}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Pickup History
                    {pickups.length > 0 && (
                      <span className="badge bg-secondary ms-2">{pickups.length}</span>
                    )}
                  </button>
                </li>
                {userData?.role !== 'client' && (
                  <li className="nav-item">
                    <button 
                      className={`nav-link rounded-3 fw-semibold d-flex align-items-center justify-content-center py-3 ${
                        activeTab === 'inventory' ? 'active' : 'text-muted'
                      }`}
                      onClick={() => setActiveTab('inventory')}
                    >
                      <i className="bi bi-boxes me-2"></i>
                      Current Inventory
                      {supplyItems.length > 0 && (
                        <span className="badge bg-secondary ms-2">{supplyItems.length}</span>
                      )}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">
                <i className="bi bi-hourglass-split me-2"></i>
                Loading supply data...
              </h5>
              <p className="text-muted mb-0">Please wait while we fetch the latest information</p>
            </div>
          ) : (
            <>
              {/* Submit Pickup Form */}
              {activeTab === 'form' && (
                <div className="row justify-content-center">
                  <div className="col-xl-10">
                    <div className="card shadow-lg border-0">
                      <div className="card-header bg-primary text-white py-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clipboard-check-fill me-3 fs-4"></i>
                          <h4 className="mb-0 fw-bold">Supply Pickup Request</h4>
                        </div>
                        <p className="mb-0 mt-2 opacity-75">Complete the form below to request school supplies</p>
                      </div>
                      <div className="card-body p-4">
                        {error && (
                          <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{error}</div>
                          </div>
                        )}
                        
                        {success && (
                          <div className="alert alert-success d-flex align-items-center" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <div>{success}</div>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                          {/* Organization Name */}
                          <div className="mb-4">
                            <label htmlFor="orgName" className="form-label fw-semibold">
                              <i className="bi bi-building me-2 text-primary"></i>
                              Organization Name
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg border-2"
                              id="orgName"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              placeholder="Enter your organization or school name"
                              required
                            />
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Please provide the full name of your organization
                            </div>
                          </div>

                          {/* Supply Item Selection */}
                          <div className="mb-4">
                            <label htmlFor="supplyItem" className="form-label fw-semibold">
                              <i className="bi bi-person-backpack me-2 text-primary"></i>
                              Supply Item
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select form-select-lg border-2"
                              id="supplyItem"
                              value={selectedItem}
                              onChange={(e) => handleItemChange(e.target.value)}
                              required
                            >
                              <option value="">🔍 Select a supply item...</option>
                              {supplyItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  📦 {item.name} (Available: {item.available_quantity} {item.unit})
                                </option>
                              ))}
                            </select>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Choose from available school supplies
                            </div>
                          </div>

                          {/* Quantity and Unit Row */}
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label htmlFor="quantity" className="form-label fw-semibold">
                                <i className="bi bi-123 me-2 text-primary"></i>
                                Quantity
                                <span className="text-danger">*</span>
                              </label>
                              <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light border-2">
                                  <i className="bi bi-hash"></i>
                                </span>
                                <input
                                  type="number"
                                  className="form-control border-2"
                                  id="quantity"
                                  value={quantity}
                                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                  min="1"
                                  placeholder="Enter quantity"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="unit" className="form-label fw-semibold">
                                <i className="bi bi-rulers me-2 text-primary"></i>
                                Unit of Measurement
                              </label>
                              <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light border-2">
                                  <i className="bi bi-tag"></i>
                                </span>
                                <input
                                  type="text"
                                  className="form-control border-2 bg-light"
                                  id="unit"
                                  value={unit}
                                  placeholder="Unit will auto-fill"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          {/* Signature Section */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-pen me-2 text-primary"></i>
                              Electronic Signature
                              <span className="text-danger">*</span>
                            </label>
                            <div className="border rounded-3 p-3 bg-light">
                              <SignaturePad ref={signaturePadRef} width={400} height={150} />
                              <div className="d-flex justify-content-between align-items-center mt-2">
                                <div className="form-text">
                                  <i className="bi bi-info-circle me-1"></i>
                                  Please sign above to confirm the pickup request
                                </div>
                                <button 
                                  type="button" 
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => signaturePadRef.current?.clear()}
                                >
                                  <i className="bi bi-arrow-clockwise me-1"></i>
                                  Clear
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="d-grid gap-2">
                            <button 
                              type="submit" 
                              className="btn btn-primary btn-lg py-3 fw-semibold"
                              disabled={submitting}
                            >
                              {submitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  <i className="bi bi-clock me-2"></i>
                                  Processing Request...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-send-fill me-2"></i>
                                  Submit Pickup Request
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="card-footer bg-light text-center py-3">
                        <small className="text-muted">
                          <i className="bi bi-shield-check me-1"></i>
                          All requests are securely processed and tracked
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup History */}
              {activeTab === 'history' && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      {userData?.role === 'client' ? 'Your Pickup History' : 'All Pickup Records'}
                    </h5>
                  </div>
                  <div className="card-body">
                    {pickups.length === 0 ? (
                      <p className="text-muted">No pickup records found.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Organization</th>
                              <th>Item</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              {userData?.role !== 'client' && <th>Issued By</th>}
                              <th>Signature</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pickups.map(pickup => (
                              <tr key={pickup.id}>
                                <td>{pickup.timestamp.toDate().toLocaleDateString()}</td>
                                <td>{pickup.org_name}</td>
                                <td>{pickup.supply_item_name}</td>
                                <td>{pickup.quantity}</td>
                                <td>{pickup.unit}</td>
                                {userData?.role !== 'client' && (
                                  <td>{pickup.issued_by_email}</td>
                                )}
                                <td>
                                  <a 
                                    href={pickup.signature_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    View
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Current Inventory */}
              {activeTab === 'inventory' && userData?.role !== 'client' && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Current Inventory</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Available Quantity</th>
                            <th>Unit</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplyItems.map(item => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.available_quantity}</td>
                              <td>{item.unit}</td>
                              <td>
                                <span className={`badge ${
                                  item.available_quantity === 0 
                                    ? 'bg-danger' 
                                    : item.available_quantity < 10 
                                    ? 'bg-warning' 
                                    : 'bg-success'
                                }`}>
                                  {item.available_quantity === 0 
                                    ? 'Out of Stock' 
                                    : item.available_quantity < 10 
                                    ? 'Low Stock' 
                                    : 'In Stock'
                                  }
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <SupplyTrackerContent />
    </ProtectedRoute>
  );
}
