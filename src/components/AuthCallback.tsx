/**
 * OAuth callback placeholder.
 * With local-only auth, this just redirects to home or dashboard.
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const SAFE_PATHS = ['/', '/about', '/research', '/education', '/events', '/arts', '/collaborate', '/contact', '/login', '/dashboard'];

function isSafeRedirect(path: string | null): path is string {
  if (!path || !path.startsWith('/')) return false;
  const withoutQuery = path.split('?')[0];
  return SAFE_PATHS.some((p) => withoutQuery === p || withoutQuery.startsWith(p + '/'));
}

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');

  useEffect(() => {
    const target = isSafeRedirect(next) ? next : '/';
    navigate(target, { replace: true });
  }, [next, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-sm text-neutral-500 font-mono">Redirecting...</p>
    </div>
  );
};
