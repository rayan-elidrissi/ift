'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { Upload, X, AlertTriangle, Search } from 'lucide-react'

type FormData = {
  title: string
  content: string
  category: 'research' | 'students' | 'arts' | 'events'
}

type User = { id: string; email: string }

type Props =
  | { mode: 'create'; projectId?: never }
  | { mode: 'edit'; projectId: string }

const CATEGORIES: { value: FormData['category']; label: string }[] = [
  { value: 'research', label: 'Research' },
  { value: 'students', label: 'Students' },
  { value: 'arts', label: 'Arts' },
  { value: 'events', label: 'Events' },
]

export function ProjectForm({ mode, projectId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(mode === 'edit')
  const [previewMode, setPreviewMode] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Participants
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([])
  const [participantSearch, setParticipantSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const contentValue = watch('content', '')

  // Load users for participant picker
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAllUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  // Load project data in edit mode
  useEffect(() => {
    if (mode !== 'edit' || !projectId) return
    fetch(`/api/dashboard/projects/${projectId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => {
        setValue('title', data.title)
        setValue('content', data.content)
        setValue('category', data.category ?? 'students')
        setCoverImage(data.coverImage ?? null)
        setSelectedParticipants(data.participants ?? [])
      })
      .catch(() => {
        toast.error('Could not load project')
        router.push('/dashboard/projects')
      })
      .finally(() => setInitialLoading(false))
  }, [mode, projectId, setValue, router])

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setCoverImage(data.filename)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      !selectedParticipants.some((p) => p.id === u.id) &&
      u.email.toLowerCase().includes(participantSearch.toLowerCase())
  )

  const addParticipant = (user: User) => {
    setSelectedParticipants((prev) => [...prev, user])
    setParticipantSearch('')
    setShowUserDropdown(false)
  }

  const removeParticipant = (id: string) => {
    setSelectedParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const url =
        mode === 'create'
          ? '/api/dashboard/projects'
          : `/api/dashboard/projects/${projectId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title.trim(),
          content: data.content.trim(),
          coverImage: coverImage ?? null,
          category: data.category,
          participantIds: selectedParticipants.map((p) => p.id),
        }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Could not save')

      toast.success(
        mode === 'create'
          ? 'Project created — pending staff review.'
          : 'Project updated — visibility has been reset to pending review.'
      )
      router.push('/dashboard/projects')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-48 mb-8" />
        <div className="space-y-4">
          <div className="h-10 bg-neutral-200 rounded" />
          <div className="h-48 bg-neutral-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-serif text-neutral-900 mb-8">
        {mode === 'create' ? 'New Project' : 'Edit Project'}
      </h1>

      {mode === 'edit' && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Saving will reset this project to pending review. A staff member will need to republish it.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
            Title
          </label>
          <input
            type="text"
            className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition-colors"
            placeholder="Project title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
            Category
          </label>
          <select
            className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition-colors"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
            Cover Image
          </label>
          {coverImage ? (
            <div className="relative w-full aspect-video bg-neutral-100 overflow-hidden">
              <img
                src={`/uploads/${coverImage}`}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition-colors"
              >
                <X className="w-4 h-4 text-neutral-700" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors text-neutral-400">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
              {uploadingImage ? (
                <span className="text-sm">Uploading…</span>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Click to upload image</span>
                  <span className="text-xs mt-1">JPEG, PNG, WebP, GIF — max 10MB</span>
                </>
              )}
            </label>
          )}
        </div>

        {/* Participants */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1.5">
            Participants
          </label>

          {/* Selected chips */}
          {selectedParticipants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedParticipants.map((p) => (
                <span
                  key={p.id}
                  className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs px-2.5 py-1 rounded-full"
                >
                  {p.email}
                  <button
                    type="button"
                    onClick={() => removeParticipant(p.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <div className="flex items-center border border-neutral-200 bg-white px-3 gap-2 focus-within:border-teal-500 transition-colors">
              <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                value={participantSearch}
                onChange={(e) => {
                  setParticipantSearch(e.target.value)
                  setShowUserDropdown(true)
                }}
                onFocus={() => setShowUserDropdown(true)}
                onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
                placeholder="Search by email…"
                className="w-full py-2.5 text-sm text-neutral-900 bg-transparent focus:outline-none"
              />
            </div>

            {showUserDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-neutral-200 border-t-0 max-h-48 overflow-y-auto shadow-lg">
                {filteredUsers.slice(0, 10).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onMouseDown={() => addParticipant(u)}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                  >
                    {u.email}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Content (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setPreviewMode((p) => !p)}
              className="text-xs font-mono text-teal-600 hover:underline"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>

          {previewMode ? (
            <div className="prose prose-neutral max-w-none border border-neutral-200 p-4 min-h-[300px] bg-white text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentValue || '*Nothing to preview yet…*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              rows={14}
              className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 font-mono focus:outline-none focus:border-teal-500 transition-colors resize-y"
              placeholder="Write your project description in Markdown…"
              {...register('content', { required: 'Content is required' })}
            />
          )}
          {errors.content && !previewMode && (
            <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="bg-teal-600 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Saving…'
              : mode === 'create'
              ? 'Create Project'
              : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/projects')}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
