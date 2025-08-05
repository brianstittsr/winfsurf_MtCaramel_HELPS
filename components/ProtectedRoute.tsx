'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/auth/signin'
}) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && userData?.role !== requiredRole) {
        // Check role hierarchy
        const roleHierarchy: Record<UserRole, number> = {
          client: 1,
          power_user: 2,
          admin: 3,
        };

        const userRoleLevel = roleHierarchy[userData?.role || 'client'];
        const requiredRoleLevel = roleHierarchy[requiredRole];

        if (userRoleLevel < requiredRoleLevel) {
          router.push('/dashboard');
          return;
        }
      }
    }
  }, [user, userData, loading, requiredRole, router, redirectTo]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && userData?.role) {
    const roleHierarchy: Record<UserRole, number> = {
      client: 1,
      power_user: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[userData.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="container mt-5">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Access Denied</h4>
            <p>You don't have permission to access this page.</p>
            <hr />
            <p className="mb-0">
              Required role: <strong>{requiredRole}</strong> | 
              Your role: <strong>{userData.role}</strong>
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
