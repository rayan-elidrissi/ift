'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Edit2, Trash2, Eye, EyeOff, Clock, Plus } from 'lucide-react'

type Project = {
  id: string
  title: string
  visibility: 'pending' | 'hidden' | 'visible'
  category: 'research' | 'students' | 'arts' | 'events'
  authorId: string
  authorEmail: string | null
  participants: { id: string; email: string }[]
  createdAt: string
  updatedAt: string
}

type SessionUser = { id: string; email: string; role: string }

const CATEGORIES = ['research', 'students', 'arts', 'events'] as const
const CATEGORY_LABELS: Record<typeof CATEGORIES[number], string> = {
  research: 'Research',
  students: 'Students',
  arts: 'Arts',
  events: 'Events',
}

function StatusBadge({ visibility }: { visibility: Project['visibility'] }) {
  if (visibility === 'visible') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-teal-50 text-teal-700 border-teal-100">
        <Eye className="w-3 h-3" /> Shown
      </span>
    )
  }
  if (visibility === 'hidden') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-500 border-neutral-200">
        <EyeOff className="w-3 h-3" /> Hidden
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-100">
      <Clock className="w-3 h-3" /> À valider
    </span>
  )
}

export default function DashboardProjectsPage() {
  const { data: session } = useSession()
  const user = session?.user as SessionUser | undefined
  const role = user?.role ?? 'student'

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = () => {
    setLoading(true)
    fetch('/api/dashboard/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Could not load projects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    const res = await fetch(`/api/dashboard/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Project deleted')
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } else {
      const body = await res.json()
      toast.error(body.error ?? 'Could not delete')
    }
  }

  const handleSetVisibility = async (id: string, visibility: Project['visibility']) => {
    const res = await fetch(`/api/dashboard/projects/${id}/visibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility }),
    })
    if (res.ok) {
      const updated: Project = await res.json()
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, visibility: updated.visibility } : p))
      )
      const label = visibility === 'visible' ? 'Published' : visibility === 'hidden' ? 'Hidden' : 'Reset to pending'
      toast.success(label)
    } else {
      const body = await res.json()
      toast.error(body.error ?? 'Could not update visibility')
    }
  }

  const canToggle = role === 'staff' || role === 'admin'
  const canDelete = (p: Project) => user?.id === p.authorId || role === 'admin'
  const isAdmin = role === 'staff' || role === 'admin'

  const isStudentProject = (p: Project) =>
    p.authorId === user?.id || p.participants.some((pt) => pt.id === user?.id)

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-neutral-900">
            {isAdmin ? 'All Projects' : 'My Projects'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-neutral-200 rounded" />
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-20 text-neutral-400">
          <p className="font-serif text-lg">No projects yet.</p>
          <Link
            href="/dashboard/projects/new"
            className="mt-4 inline-block text-sm text-teal-600 hover:underline"
          >
            Create your first project
          </Link>
        </div>
      )}

      {/* Admin view: grouped by category */}
      {!loading && isAdmin && projects.length > 0 && (
        <div className="space-y-10">
          {CATEGORIES.map((cat) => {
            const catProjects = projects.filter((p) => p.category === cat)
            if (catProjects.length === 0) return null
            return (
              <div key={cat}>
                <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 pb-2 border-b border-neutral-200">
                  {CATEGORY_LABELS[cat]} — {catProjects.length} project{catProjects.length !== 1 ? 's' : ''}
                </h2>
                <div className="bg-white border border-neutral-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-mono uppercase tracking-widest text-neutral-400">
                        <th className="text-left px-6 py-3">Title</th>
                        <th className="text-left px-4 py-3">Author</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Updated</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {catProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-neutral-900 max-w-xs truncate">
                            {project.title}
                          </td>
                          <td className="px-4 py-4 text-neutral-500 font-mono text-xs truncate max-w-[180px]">
                            {project.authorEmail ?? 'Deleted user'}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge visibility={project.visibility} />
                          </td>
                          <td className="px-4 py-4 text-neutral-400 font-mono text-xs">
                            {new Date(project.updatedAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 justify-end">
                              <Link
                                href={`/dashboard/projects/${project.id}/edit`}
                                className="p-1.5 text-neutral-400 hover:text-teal-600 transition-colors rounded"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              {canToggle && (
                                <>
                                  {project.visibility !== 'visible' && (
                                    <button
                                      onClick={() => handleSetVisibility(project.id, 'visible')}
                                      className="p-1.5 text-neutral-400 hover:text-teal-600 transition-colors rounded"
                                      title="Publish"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  )}
                                  {project.visibility !== 'hidden' && (
                                    <button
                                      onClick={() => handleSetVisibility(project.id, 'hidden')}
                                      className="p-1.5 text-neutral-400 hover:text-orange-500 transition-colors rounded"
                                      title="Hide"
                                    >
                                      <EyeOff className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                              {canDelete(project) && (
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Student view: all their projects (author or participant) */}
      {!loading && !isAdmin && projects.length > 0 && (
        <div className="bg-white border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-mono uppercase tracking-widest text-neutral-400">
                <th className="text-left px-6 py-3">Title</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const isOwner = project.authorId === user?.id
                return (
                  <tr
                    key={project.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-900 max-w-xs truncate">
                      {project.title}
                    </td>
                    <td className="px-4 py-4 text-neutral-500 font-mono text-xs capitalize">
                      {CATEGORY_LABELS[project.category]}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        isOwner
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-purple-50 text-purple-700 border-purple-100'
                      }`}>
                        {isOwner ? 'Author' : 'Participant'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge visibility={project.visibility} />
                    </td>
                    <td className="px-4 py-4 text-neutral-400 font-mono text-xs">
                      {new Date(project.updatedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {isOwner && (
                          <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="p-1.5 text-neutral-400 hover:text-teal-600 transition-colors rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        )}
                        {canDelete(project) && (
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
