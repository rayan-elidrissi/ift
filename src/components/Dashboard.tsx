import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, LogOut, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isApiConfigured } from '../lib/api';

export const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const getRoleBadge = () => (
    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-100 flex items-center gap-1">
      <Shield className="w-3 h-3" /> Admin Access
    </span>
  );

  return (
    <section className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-serif text-neutral-900">System Administration</h1>
              {getRoleBadge()}
            </div>
            <p className="text-sm text-neutral-500 font-mono mt-1">
              {profile?.email && <span className="text-neutral-600">{profile.email}</span>}
              {!profile?.email && 'Institute for Future Technologies'}
            </p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/login'); }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-teal-200 shadow-lg p-6 rounded-lg"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Edit3 className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Edit Website Content</h2>
                <p className="text-sm text-neutral-500 mt-1">Content is stored locally in this browser.</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 hover:bg-teal-700 transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <Edit3 className="w-4 h-4" />
              Go to site & edit
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white p-6 border border-neutral-200 shadow-sm"
        >
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-purple-600" />
            Storage
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            {isApiConfigured()
              ? 'API backend configured. Content is stored in the backend.'
              : 'No database. Content and auth are stored in this browser\'s localStorage and sessionStorage. Changes are not shared across devices.'}
          </p>
          {isApiConfigured() && (
            <Link
              to="/migrate"
              className="text-sm text-teal-600 hover:underline font-medium"
            >
              Migrate localStorage to API →
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
};
