'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { FolderOpen, Users, PlusCircle, LogOut } from 'lucide-react'

type SessionUser = { id: string; email: string; role: string }

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const user = session?.user as SessionUser | undefined
  const role = user?.role ?? 'student'

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  const navItem = (href: string, label: string, icon: React.ReactNode) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded transition-colors ${
        pathname.startsWith(href)
          ? 'bg-teal-50 text-teal-700 font-medium'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-neutral-200">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-teal-600 transition-colors"
          >
            ← IFT
          </Link>
          <h2 className="mt-3 text-lg font-serif text-neutral-900">Dashboard</h2>
          <p className="text-xs text-neutral-500 mt-1 font-mono truncate">
            {user?.email ?? '…'}
          </p>
          <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
            {role}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItem(
            '/dashboard/projects',
            role === 'student' ? 'My Projects' : 'All Projects',
            <FolderOpen className="w-4 h-4" />
          )}
          {navItem(
            '/dashboard/projects/new',
            'New Project',
            <PlusCircle className="w-4 h-4" />
          )}
          {(role === 'admin') &&
            navItem(
              '/dashboard/users',
              'Users',
              <Users className="w-4 h-4" />
            )}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-500 hover:text-red-600 transition-colors w-full rounded"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
