/**
 * Auth helpers – client-side equivalents of server requireAuth/requireAdmin.
 * Use ProtectedRoute for route-level guards; these hooks for component-level checks.
 */

import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/** Build login URL with redirect param for post-login navigation */
export function buildLoginRedirect(from: string): string {
  return from && from !== '/login'
    ? `/login?redirect=${encodeURIComponent(from)}`
    : '/login';
}

/**
 * Ensures user is authenticated; redirects to login if not.
 * Use when a component needs user but isn't wrapped in ProtectedRoute.
 */
export function useRequireAuth(redirectTo?: string) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(buildLoginRedirect(redirectTo || window.location.pathname), { replace: true });
    }
  }, [user, loading, redirectTo, navigate]);

  return { user, loading };
}

/**
 * Ensures user is admin; for use inside ProtectedRoute or after useRequireAuth.
 * Access denied is shown by ProtectedRoute when requireAdmin is true.
 */
export function useRequireAdmin() {
  const { user, isAdmin, loading } = useAuth();
  return { user, isAdmin, loading };
}
