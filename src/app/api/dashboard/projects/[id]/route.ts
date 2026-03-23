import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import type { Session } from 'next-auth'
import {
  getDashboardProject,
  updateProject,
  softDeleteProject,
} from '@/services/projects.service'

type Params = { params: { id: string } }

function getSessionUser(session: Session | null) {
  const user = session?.user as
    | { id: string; email: string; role: string }
    | undefined
  return user
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  const user = getSessionUser(session)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const project = await getDashboardProject(params.id, user.id, user.role)
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  const user = getSessionUser(session)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { title, content, coverImage, category, participantIds } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const project = await updateProject(params.id, user.id, user.role, {
      title: title.trim(),
      content: content.trim(),
      coverImage: coverImage ?? null,
      category,
      participantIds: Array.isArray(participantIds) ? participantIds : [],
    })
    return NextResponse.json(project)
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e?.status) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  const user = getSessionUser(session)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await softDeleteProject(params.id, user.id, user.role)
    return NextResponse.json({ message: 'Deleted' })
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e?.status) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
