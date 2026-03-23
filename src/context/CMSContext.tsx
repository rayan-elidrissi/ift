'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'
import { PAGE_SLUGS, getSlugForKey } from '@/lib/resourceMapping'

const LEGACY_BLOCK_TYPE = 'legacy_cms'

type CMSContextType = {
  isEditing: boolean
  toggleEditMode: () => void
  getContent: (key: string, defaultContent: unknown) => unknown
  updateContent: (key: string, newContent: unknown) => void
  getResource: (slug: string, version?: string) => Promise<ResourceData | null>
  saveChanges: (slug: string, content: Record<string, unknown>) => Promise<boolean>
  sendForReview: (slug: string) => Promise<boolean>
  publish: (slug: string) => Promise<boolean>
  canEdit: boolean
  canEditKey: (key: string) => boolean
  isLoading: boolean
  isApiConfigured: boolean
  hasCache: boolean
  reloadData: () => Promise<void>
}

type ResourceData = {
  slug: string
  content: Record<string, unknown>
  version: string
  updatedAt: string
}

const CMSContext = createContext<CMSContextType | undefined>(undefined)

const fallbackCMS: CMSContextType = {
  isEditing: false,
  toggleEditMode: () => {},
  getContent: (_key, defaultContent) => defaultContent,
  updateContent: async () => {},
  getResource: async () => null,
  saveChanges: async () => false,
  sendForReview: async () => false,
  publish: async () => false,
  canEdit: false,
  canEditKey: () => false,
  isLoading: false,
  isApiConfigured: false,
  hasCache: false,
  reloadData: async () => {},
}

export const useCMS = () => useContext(CMSContext) ?? fallbackCMS

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  return res.json()
}

export const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const { canEditAny, canEditKey } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState<Record<string, unknown>>({})
  const [isLoading, setIsLoading] = useState(true)
  const hasCache = Object.keys(data).length > 0
  const canEdit = canEditAny

  const loadData = useCallback(async () => {
    try {
      const results = await Promise.allSettled(
        PAGE_SLUGS.map((slug) =>
          fetch(`/api/resources/${encodeURIComponent(slug)}`).then((r) =>
            r.ok ? r.json() : null
          )
        )
      )

      const merged: Record<string, unknown> = {}
      for (const result of results) {
        if (result.status !== 'fulfilled' || !result.value?.content) continue
        const content = result.value.content
        // Support both the legacy block format and flat key-value format
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block?.type === LEGACY_BLOCK_TYPE && block.data) {
              Object.assign(merged, block.data)
            }
          }
        } else if (typeof content === 'object') {
          Object.assign(merged, content)
        }
      }
      setData(merged)
    } catch {
      // Silently fail — default content will be used
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleEditMode = () => {
    if (canEdit) setIsEditing((prev) => !prev)
  }

  useEffect(() => {
    if (!canEdit) setIsEditing(false)
  }, [canEdit])

  const getContent = (key: string, defaultContent: unknown) =>
    data[key] !== undefined ? data[key] : defaultContent

  const updateContent = async (key: string, newContent: unknown) => {
    if (!canEditKey(key)) {
      toast.error(`You don't have permission to edit "${key}"`)
      return
    }
    setData((prev) => ({ ...prev, [key]: newContent }))

    const slug = getSlugForKey(key)
    if (!slug) {
      toast.error(`No resource mapping for "${key}"`)
      return
    }

    try {
      // Fetch current content, merge new key, save
      const existing = await fetch(`/api/resources/${encodeURIComponent(slug)}`)
        .then((r) => (r.ok ? r.json() : null))

      let content: Record<string, unknown> = {}
      if (existing?.content) {
        if (Array.isArray(existing.content)) {
          // Legacy block format — find and merge into the block
          const blocks = [...existing.content] as Array<Record<string, unknown>>
          let found = false
          for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i]
            if (b?.type === LEGACY_BLOCK_TYPE) {
              blocks[i] = { ...b, data: { ...(b.data as Record<string, unknown>), [key]: newContent } }
              found = true
              break
            }
          }
          if (!found) {
            blocks.push({ type: LEGACY_BLOCK_TYPE, data: { [key]: newContent } })
          }
          content = { blocks }
        } else {
          content = { ...existing.content, [key]: newContent }
        }
      } else {
        content = { [key]: newContent }
      }

      await fetch(`/api/resources/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      toast.success('Saved')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save')
      loadData()
    }
  }

  const getResource = async (slug: string, version?: string) => {
    try {
      const url = version
        ? `/api/resources/${encodeURIComponent(slug)}?version=${version}`
        : `/api/resources/${encodeURIComponent(slug)}`
      const res = await fetch(url)
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  const saveChanges = async (slug: string, content: Record<string, unknown>) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit")
      return false
    }
    try {
      await apiFetch(`/api/resources/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      toast.success('Saved')
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save')
      return false
    }
  }

  const sendForReview = async (_slug: string) => {
    toast.info('Visibility is managed by staff in the dashboard')
    return false
  }

  const publish = async (slug: string) => {
    try {
      await apiFetch(`/api/publish_resources/${encodeURIComponent(slug)}`)
      toast.success('Published')
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not publish')
      return false
    }
  }

  const reloadData = useCallback(async () => {
    await loadData()
  }, [loadData])

  return (
    <CMSContext.Provider
      value={{
        isEditing,
        toggleEditMode,
        getContent,
        updateContent,
        getResource,
        saveChanges,
        sendForReview,
        publish,
        canEdit,
        canEditKey,
        isLoading,
        isApiConfigured: true,
        hasCache,
        reloadData,
      }}
    >
      {children}
    </CMSContext.Provider>
  )
}
