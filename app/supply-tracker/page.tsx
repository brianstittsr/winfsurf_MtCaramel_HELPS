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
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                Submit Pickup
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Pickup History
              </button>
            </li>
            {userData?.role !== 'client' && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  Current Inventory
                </button>
              </li>
            )}
          </ul>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Submit Pickup Form */}
              {activeTab === 'form' && (
                <div className="row">
                  <div className="col-lg-8">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="mb-0">Supply Pickup Form</h5>
                      </div>
                      <div className="card-body">
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                        
                        {success && (
                          <div className="alert alert-success" role="alert">
                            {success}
                          </div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label htmlFor="orgName" className="form-label">Organization Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="orgName"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="supplyItem" className="form-label">Supply Item</label>
                            <select
                              className="form-select"
                              id="supplyItem"
                              value={selectedItem}
                              onChange={(e) => handleItemChange(e.target.value)}
                              required
                            >
                              <option value="">Select a supply item...</option>
                              {supplyItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name} (Available: {item.available_quantity} {item.unit})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="quantity"
                                  value={quantity}
                                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                  min="1"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label htmlFor="unit" className="form-label">Unit</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="unit"
                                  value={unit}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Electronic Signature</label>
                            <SignaturePad ref={signaturePadRef} width={400} height={150} />
                            <div className="form-text">
                              Please sign above to confirm the pickup.
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Submitting...
                              </>
                            ) : (
                              'Submit Pickup'
                            )}
                          </button>
                        </form>
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
