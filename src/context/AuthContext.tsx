'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { canEditKey as checkCanEditKey, canEditAny as checkCanEditAny, CMSRole } from '@/lib/cmsPermissions'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: CMSRole | null
  updated_at: string | null
}

type AuthContextType = {
  user: { id: string } | null
  profile: Profile | null
  loading: boolean
  profileError: string | null
  role: CMSRole | null
  isAdmin: boolean
  canEditKey: (key: string) => boolean
  canEditAny: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileError: null,
  role: null,
  isAdmin: false,
  canEditKey: () => false,
  canEditAny: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const loading = status === 'loading'

  const sessionUser = session?.user as
    | { id: string; email: string; role: string }
    | undefined

  const role = (sessionUser?.role as CMSRole) ?? null

  const user = sessionUser ? { id: sessionUser.id } : null

  const profile: Profile | null = sessionUser
    ? {
        id: sessionUser.id,
        email: sessionUser.email ?? null,
        full_name: null,
        avatar_url: null,
        role,
        updated_at: null,
      }
    : null

  const isAdmin = role === 'admin'
  const canEditAny = checkCanEditAny(role)
  const canEditKeyFn = useMemo(
    () => (key: string) => checkCanEditKey(key, role),
    [role]
  )

  const signOut = async () => {
    // Handled directly by next-auth signOut in components
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileError: null,
        role,
        isAdmin,
        canEditKey: canEditKeyFn,
        canEditAny,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
