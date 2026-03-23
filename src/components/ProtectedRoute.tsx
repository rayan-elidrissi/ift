import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

/**
 * Protects routes requiring authentication (and optionally admin role).
 * When requireAdmin is true, only users with role === 'admin' can access.
 * Redirects to /login?redirect=... when not authenticated.
 */
export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500 font-mono">Loading...</p>
      </div>
    );
  }

  if (!user) {
    const from = location.pathname + location.search;
    const to = from && from !== '/login' ? `/login?redirect=${encodeURIComponent(from)}` : '/login';
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6">
        <p className="text-neutral-700 font-medium mb-2">Access denied</p>
        <p className="text-sm text-neutral-500 max-w-md text-center">
          You must be an administrator to access this page. Contact your system admin to request access.
        </p>
        <a href="/" className="mt-6 text-teal-600 hover:text-teal-700 text-sm font-bold uppercase tracking-wider">
          Return to site
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
