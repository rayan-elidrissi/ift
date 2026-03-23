'use client'

import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

type FormData = {
  email: string
  password: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard/projects'

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
        return
      }

      router.push(redirect)
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
          <h1 className="text-3xl font-serif text-neutral-900">Sign in</h1>
          <p className="text-sm text-neutral-500 mt-2">
            Use your <span className="font-mono">@devinci.fr</span> or <span className="font-mono">@edu.devinci.fr</span> account
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
              autoComplete="current-password"
              className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-500 text-center">
          No account?{' '}
          <Link
            href="/register"
            className="text-teal-600 hover:underline font-medium"
          >
            Register here
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
