'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import { 
  getAllUsers, 
  updateUserRole, 
  getUserStats,
  UserWithId 
} from '@/lib/userManagement';

export default function Admin() {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    clients: 0,
    powerUsers: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingUser(userId);
      setError('');
      setSuccess('');

      await updateUserRole(userId, newRole);
      setSuccess('User role updated successfully!');
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'power_user':
        return 'bg-warning';
      case 'client':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  const AdminContent = () => (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Admin Panel</h1>

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

          {/* User Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-primary">Total Users</h5>
                  <p className="card-text display-6">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-info">Clients</h5>
                  <p className="card-text display-6">{stats.clients}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-warning">Power Users</h5>
                  <p className="card-text display-6">{stats.powerUsers}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-danger">Admins</h5>
                  <p className="card-text display-6">{stats.admins}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">User Management</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-muted">No users found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Current Role</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                              {user.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{user.createdAt instanceof Date ? user.createdAt.toLocaleDateString() : user.createdAt.toDate().toLocaleDateString()}</td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                disabled={updatingUser === user.id}
                              >
                                {updatingUser === user.id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                    Updating...
                                  </>
                                ) : (
                                  'Change Role'
                                )}
                              </button>
                              <ul className="dropdown-menu">
                                {(['client', 'power_user', 'admin'] as UserRole[]).map(role => (
                                  <li key={role}>
                                    <button
                                      className={`dropdown-item ${user.role === role ? 'active' : ''}`}
                                      onClick={() => handleRoleUpdate(user.id, role)}
                                      disabled={user.role === role}
                                    >
                                      {role.replace('_', ' ').toUpperCase()}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Role Descriptions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <h6 className="text-primary">Client</h6>
                  <ul className="list-unstyled">
                    <li>• Submit supply pickup forms</li>
                    <li>• View their own submission history</li>
                    <li>• Basic access to the system</li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h6 className="text-warning">Power User</h6>
                  <ul className="list-unstyled">
                    <li>• All client permissions</li>
                    <li>• View all pickup submissions</li>
                    <li>• Manage inventory items</li>
                    <li>• Assist with administrative duties</li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h6 className="text-danger">Admin</h6>
                  <ul className="list-unstyled">
                    <li>• All power user permissions</li>
                    <li>• Manage user accounts</li>
                    <li>• Assign and modify user roles</li>
                    <li>• Full system access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">System Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Application Status</h6>
                  <p className="text-success">
                    <i className="bi bi-check-circle me-2"></i>
                    System is operational
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Database Connection</h6>
                  <p className="text-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Connected to Firebase
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
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
