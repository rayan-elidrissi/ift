import React from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { isGateConfigured } from './PasswordGate';
import { isApiConfigured, getApiBase } from '../lib/api';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/';
  const error = searchParams.get('error');
  const apiBase = getApiBase();

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 shadow-2xl border border-neutral-200"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-neutral-900 mb-2">IFT Portal</h1>
            <p className="text-sm text-neutral-500 font-sans">
              {isApiConfigured() ? 'Resource CMS with API' : 'Local CMS — no cloud auth'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              Login failed: {error}
            </div>
          )}

          <div className="space-y-6">
            {isApiConfigured() ? (
              <>
                <a
                  href={`${apiBase}/auth/login?next=${encodeURIComponent(next)}`}
                  className="block w-full flex items-center justify-center gap-2 bg-neutral-900 text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-teal-600 transition-colors no-underline"
                >
                  <Lock className="w-4 h-4" />
                  Sign in with OAuth
                </a>
                <p className="text-xs text-neutral-500 text-center">
                  You will be redirected to the authentication provider.
                </p>
              </>
            ) : (
            <div className="bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700">
              <p className="mb-2">
                This site uses <strong>local storage</strong> for CMS content. No database or cloud auth.
              </p>
              {isGateConfigured() ? (
                <p>
                  You&apos;ll see a password prompt on the homepage. Enter it to get edit access.
                </p>
              ) : (
                <p>
                  For edit access, set <code className="text-xs bg-neutral-200 px-1">VITE_GATE_PASSWORD</code> and <code className="text-xs bg-neutral-200 px-1">VITE_ADMIN_EMAIL</code> in your .env file.
                </p>
              )}
            </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 py-4 uppercase text-xs font-bold tracking-widest hover:bg-neutral-100 transition-colors"
            >
              Back to site
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
