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

// Static list of school supply items
const STATIC_SUPPLY_ITEMS = [
  { id: 'notebooks', name: 'Notebooks', unit: 'individual', available_quantity: 100 },
  { id: 'pencils', name: 'Pencils', unit: 'box', available_quantity: 50 },
  { id: 'pens', name: 'Pens', unit: 'box', available_quantity: 30 },
  { id: 'erasers', name: 'Erasers', unit: 'individual', available_quantity: 75 },
  { id: 'rulers', name: 'Rulers', unit: 'individual', available_quantity: 40 },
  { id: 'glue-sticks', name: 'Glue Sticks', unit: 'individual', available_quantity: 60 },
  { id: 'colored-pencils', name: 'Colored Pencils', unit: 'box', available_quantity: 25 },
  { id: 'markers', name: 'Markers', unit: 'box', available_quantity: 20 },
  { id: 'copy-paper', name: 'Copy Paper', unit: 'ream', available_quantity: 15 },
  { id: 'folders', name: 'Folders', unit: 'individual', available_quantity: 80 },
  { id: 'binders', name: 'Binders', unit: 'individual', available_quantity: 35 },
  { id: 'highlighters', name: 'Highlighters', unit: 'individual', available_quantity: 45 },
  { id: 'scissors', name: 'Scissors', unit: 'individual', available_quantity: 30 },
  { id: 'staplers', name: 'Staplers', unit: 'individual', available_quantity: 20 },
  { id: 'staples', name: 'Staples', unit: 'box', available_quantity: 40 },
  { id: 'index-cards', name: 'Index Cards', unit: 'pack', available_quantity: 50 },
  { id: 'sticky-notes', name: 'Sticky Notes', unit: 'pack', available_quantity: 60 },
  { id: 'calculators', name: 'Calculators', unit: 'individual', available_quantity: 25 },
  { id: 'backpacks', name: 'Backpacks', unit: 'individual', available_quantity: 40 },
  { id: 'lunch-boxes', name: 'Lunch Boxes', unit: 'individual', available_quantity: 30 },
];

export default function SupplyTracker() {
  const { user, userData } = useAuth();
  const signaturePadRef = useRef<SignaturePadRef>(null);
  
  // Form state
  const [orgName, setOrgName] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  
  // Supply items list for the current request
  const [requestedItems, setRequestedItems] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }>>([]);
  
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
    // Use static items first, fallback to dynamic items
    const item = STATIC_SUPPLY_ITEMS.find(i => i.id === itemId) || supplyItems.find(i => i.id === itemId);
    if (item) {
      setUnit(item.unit);
    }
  };

  const addItemToRequest = () => {
    if (!selectedItem || quantity <= 0) return;
    
    // Use static items first, fallback to dynamic items
    const item = STATIC_SUPPLY_ITEMS.find(i => i.id === selectedItem) || supplyItems.find(i => i.id === selectedItem);
    if (!item) return;
    
    // Check if item already exists in the request
    const existingItemIndex = requestedItems.findIndex(ri => ri.id === selectedItem);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...requestedItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setRequestedItems(updatedItems);
    } else {
      // Add new item to request
      const newItem = {
        id: selectedItem,
        name: item.name,
        quantity: quantity,
        unit: unit
      };
      setRequestedItems([...requestedItems, newItem]);
    }
    
    // Reset form fields
    setSelectedItem('');
    setQuantity(1);
    setUnit('');
  };

  const removeItemFromRequest = (itemId: string) => {
    setRequestedItems(requestedItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromRequest(itemId);
      return;
    }
    
    setRequestedItems(requestedItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
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

      // Validate that there are items in the request
      if (requestedItems.length === 0) {
        setError('Please add at least one supply item to your request');
        setSubmitting(false);
        return;
      }

      // Validate availability for all requested items
      for (const requestedItem of requestedItems) {
        const item = supplyItems.find(i => i.id === requestedItem.id);
        if (!item) {
          setError(`Supply item '${requestedItem.name}' is no longer available`);
          setSubmitting(false);
          return;
        }
        if (requestedItem.quantity > item.available_quantity) {
          setError(`Not enough ${item.name} available. Requested: ${requestedItem.quantity}, Available: ${item.available_quantity}`);
          setSubmitting(false);
          return;
        }
      }

      // Get signature blob
      const signatureBlob = await signaturePadRef.current.toBlob();

      // Submit pickup for each item (this could be optimized to submit as a batch)
      for (const requestedItem of requestedItems) {
        const pickupData = {
          org_name: orgName,
          supply_item_id: requestedItem.id,
          supply_item_name: requestedItem.name,
          quantity: requestedItem.quantity,
          unit: requestedItem.unit,
          issued_by: user.uid,
          issued_by_email: user.email || '',
          signature_url: '', // This will be set in submitSupplyPickup
        };

        await submitSupplyPickup(pickupData, signatureBlob);
      }

      // Reset form
      setOrgName('');
      setSelectedItem('');
      setQuantity(1);
      setUnit('');
      setRequestedItems([]);
      signaturePadRef.current.clear();

      setSuccess(`Supply pickup submitted successfully! ${requestedItems.length} item(s) processed.`);
      
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
                              Organization Name
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id="orgName"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              placeholder="Enter organization name"
                              required
                            />
                          </div>

                          {/* Supply Items Management */}
                          <div className="mb-4">
                            <h5 className="fw-bold text-primary mb-3">
                              <i className="bi bi-person-backpack me-2"></i>
                              Supply Items Request
                            </h5>
                            
                            {/* Add Item Section */}
                            <div className="card border-primary border-2 mb-4">
                              <div className="card-header bg-primary bg-opacity-10">
                                <h6 className="mb-0 fw-semibold text-white">
                                  <i className="bi bi-plus-circle me-2"></i>
                                  Add Supply Item
                                </h6>
                              </div>
                              <div className="card-body">
                                <div className="row g-3">
                                  <div className="col-md-5">
                                    <label htmlFor="supplyItem" className="form-label fw-semibold">
                                      Supply Item <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      className="form-select border-2"
                                      id="supplyItem"
                                      value={selectedItem}
                                      onChange={(e) => handleItemChange(e.target.value)}
                                    >
                                      <option value="">🔍 Select a supply item...</option>
                                      {STATIC_SUPPLY_ITEMS.map(item => (
                                        <option key={item.id} value={item.id}>
                                          📦 {item.name} (Available: {item.available_quantity} {item.unit})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-3">
                                    <label htmlFor="quantity" className="form-label fw-semibold">
                                      Quantity <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control border-2"
                                      id="quantity"
                                      value={quantity}
                                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                      min="1"
                                      placeholder="Qty"
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label htmlFor="unit" className="form-label fw-semibold">
                                      Unit
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border-2 bg-light"
                                      id="unit"
                                      value={unit}
                                      placeholder="Unit"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2 d-flex align-items-end">
                                    <button
                                      type="button"
                                      className="btn btn-primary w-100"
                                      onClick={addItemToRequest}
                                      disabled={!selectedItem || quantity <= 0}
                                    >
                                      <i className="bi bi-plus-lg me-1"></i>
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Requested Items List */}
                            {requestedItems.length > 0 && (
                              <div className="card border-success border-2">
                                <div className="card-header bg-success bg-opacity-10">
                                  <h6 className="mb-0 fw-semibold text-success">
                                    <i className="bi bi-list-check me-2"></i>
                                    Requested Items ({requestedItems.length})
                                  </h6>
                                </div>
                                <div className="card-body p-0">
                                  <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                      <thead className="bg-light">
                                        <tr>
                                          <th className="fw-semibold">Item</th>
                                          <th className="fw-semibold text-center">Quantity</th>
                                          <th className="fw-semibold">Unit</th>
                                          <th className="fw-semibold text-center">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {requestedItems.map((item, index) => (
                                          <tr key={item.id}>
                                            <td className="fw-medium">
                                              <i className="bi bi-box-seam me-2 text-primary"></i>
                                              {item.name}
                                            </td>
                                            <td className="text-center">
                                              <div className="d-flex align-items-center justify-content-center">
                                                <button
                                                  type="button"
                                                  className="btn btn-outline-secondary btn-sm me-2"
                                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                >
                                                  <i className="bi bi-dash"></i>
                                                </button>
                                                <span className="fw-bold text-primary px-3">{item.quantity}</span>
                                                <button
                                                  type="button"
                                                  className="btn btn-outline-secondary btn-sm ms-2"
                                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                >
                                                  <i className="bi bi-plus"></i>
                                                </button>
                                              </div>
                                            </td>
                                            <td>
                                              <span className="badge bg-secondary">{item.unit}</span>
                                            </td>
                                            <td className="text-center">
                                              <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeItemFromRequest(item.id)}
                                                title="Remove item"
                                              >
                                                <i className="bi bi-trash"></i>
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )}

                            {requestedItems.length === 0 && (
                              <div className="alert alert-info d-flex align-items-center">
                                <i className="bi bi-info-circle me-2"></i>
                                <div>No items added yet. Use the form above to add supply items to your request.</div>
                              </div>
                            )}
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
