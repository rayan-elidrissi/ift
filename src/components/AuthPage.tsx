'use client'

/**
 * AuthPage — previously a PasswordGate overlay.
 * Replaced by Auth.js (next-auth) credentials-based authentication.
 * The old VITE_GATE_PASSWORD / VITE_ADMIN_EMAIL env vars are no longer used.
 * Authentication now lives at /login and /register; dashboard is protected
 * by src/middleware.ts.
 */
export const AuthPage = () => null
