'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

type User = {
  id: string
  email: string
  role: string
  createdAt: string
}

type SessionUser = { id: string; email: string; role: string }

const ROLES = ['student', 'staff', 'admin'] as const

export default function UsersPage() {
  const { data: session, status } = useSession()
  const user = session?.user as SessionUser | undefined

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!user || user.role !== 'admin') {
      redirect('/dashboard/projects')
    }
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false))
  }, [status, user])

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      const updated: User = await res.json()
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u))
      )
      toast.success('Role updated')
    } else {
      const body = await res.json()
      toast.error(body.error ?? 'Could not update role')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user? Their projects will be retained.')) return
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('User deleted')
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } else {
      const body = await res.json()
      toast.error(body.error ?? 'Could not delete user')
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <h1 className="text-2xl font-serif text-neutral-900 mb-8">Users</h1>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-neutral-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Users</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {users.length} user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-mono uppercase tracking-widest text-neutral-400">
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-neutral-900 max-w-[200px] truncate">
                  {u.email}
                  {u.id === user?.id && (
                    <span className="ml-2 text-[10px] text-teal-600">(you)</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white text-neutral-900 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-neutral-400 font-mono text-xs">
                  {new Date(u.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-4">
                  {u.id !== user?.id && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
