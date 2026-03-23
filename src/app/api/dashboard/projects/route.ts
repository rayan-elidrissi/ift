import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import type { Session } from 'next-auth'
import {
  getDashboardProjects,
  createProject,
} from '@/services/projects.service'

type SessionUser = { id: string; email: string; role: string }

function getSessionUser(session: Session | null): SessionUser | undefined {
  return session?.user as SessionUser | undefined
}

export async function GET() {
  const user = getSessionUser(await auth())
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await getDashboardProjects(
      user.id,
      user.role
    )
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = getSessionUser(await auth())
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

    const project = await createProject(user.id, user.role, {
      title: title.trim(),
      content: content.trim(),
      coverImage: coverImage ?? undefined,
      category,
      participantIds: Array.isArray(participantIds) ? participantIds : [],
    })
    return NextResponse.json(project, { status: 201 })
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e?.status) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
