'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  getSupplyItems, 
  addSupplyItem, 
  updateSupplyItemQuantity,
  SupplyItem 
} from '@/lib/supplyTracker';

export default function Inventory() {
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Edit quantity state
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);

  useEffect(() => {
    loadSupplyItems();
  }, []);

  const loadSupplyItems = async () => {
    try {
      setLoading(true);
      const items = await getSupplyItems();
      setSupplyItems(items);
    } catch (error) {
      setError('Failed to load supply items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await addSupplyItem({
        name: newItemName,
        unit: newItemUnit,
        available_quantity: newItemQuantity,
      });

      setSuccess('Supply item added successfully!');
      setNewItemName('');
      setNewItemUnit('');
      setNewItemQuantity(0);
      setShowAddForm(false);
      await loadSupplyItems();
    } catch (error: any) {
      setError(error.message || 'Failed to add supply item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string) => {
    try {
      await updateSupplyItemQuantity(itemId, editQuantity);
      setEditingItem(null);
      setSuccess('Quantity updated successfully!');
      await loadSupplyItems();
    } catch (error: any) {
      setError(error.message || 'Failed to update quantity');
    }
  };

  const startEditing = (item: SupplyItem) => {
    setEditingItem(item.id);
    setEditQuantity(item.available_quantity);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditQuantity(0);
  };

  const InventoryContent = () => (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Inventory Management</h1>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add New Item'}
            </button>
          </div>

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

          {/* Add New Item Form */}
          {showAddForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Add New Supply Item</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddItem}>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="itemName" className="form-label">Item Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="itemName"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="itemUnit" className="form-label">Unit</label>
                        <select
                          className="form-select"
                          id="itemUnit"
                          value={newItemUnit}
                          onChange={(e) => setNewItemUnit(e.target.value)}
                          required
                        >
                          <option value="">Select unit...</option>
                          <option value="individual">Individual</option>
                          <option value="box">Box</option>
                          <option value="case">Case</option>
                          <option value="pack">Pack</option>
                          <option value="ream">Ream</option>
                          <option value="set">Set</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="itemQuantity" className="form-label">Initial Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          id="itemQuantity"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 0)}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : (
                      'Add Item'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Current Inventory</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : supplyItems.length === 0 ? (
                <p className="text-muted">No supply items found. Add some items to get started.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Unit</th>
                        <th>Available Quantity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.unit}</td>
                          <td>
                            {editingItem === item.id ? (
                              <div className="d-flex align-items-center gap-2">
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  style={{ width: '100px' }}
                                  value={editQuantity}
                                  onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                                  min="0"
                                />
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleUpdateQuantity(item.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              item.available_quantity
                            )}
                          </td>
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
                          <td>
                            {editingItem !== item.id && (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => startEditing(item)}
                              >
                                Edit Quantity
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-primary">Total Items</h5>
                  <p className="card-text display-6">{supplyItems.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-success">In Stock</h5>
                  <p className="card-text display-6">
                    {supplyItems.filter(item => item.available_quantity > 10).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-warning">Low Stock</h5>
                  <p className="card-text display-6">
                    {supplyItems.filter(item => item.available_quantity > 0 && item.available_quantity <= 10).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-danger">Out of Stock</h5>
                  <p className="card-text display-6">
                    {supplyItems.filter(item => item.available_quantity === 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute requiredRole="power_user">
      <InventoryContent />
    </ProtectedRoute>
  );
}
