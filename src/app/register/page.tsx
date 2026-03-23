'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type FormData = {
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const password = watch('password')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      })

      const body = await res.json()

      if (!res.ok) {
        toast.error(body.error ?? 'Registration failed')
        return
      }

      toast.success('Account created! Signing you in…')

      const result = await signIn('credentials', {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Could not sign in automatically. Please log in manually.')
        router.push('/login')
        return
      }

      router.push('/dashboard/projects')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-neutral-900">Create account</h1>
          <p className="text-sm text-neutral-500 mt-2">
            Restricted to{' '}
            <span className="font-mono">@devinci.fr</span> or{' '}
            <span className="font-mono">@edu.devinci.fr</span> email addresses
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="you@devinci.fr or you@edu.devinci.fr"
              {...register('email', {
                required: 'Email is required',
                validate: (v) => {
                  const e = v.trim().toLowerCase()
                  return e.endsWith('@devinci.fr') || e.endsWith('@edu.devinci.fr') || 'Must be a @devinci.fr or @edu.devinci.fr address'
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="Min. 8 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) =>
                  v === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-500 text-center">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-teal-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  )
}
