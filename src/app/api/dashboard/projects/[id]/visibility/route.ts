import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { setProjectVisibility } from '@/services/projects.service'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  const user = session?.user as { id: string; role: string } | undefined
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json().catch(() => ({}))
    const { visibility } = body

    if (!['pending', 'hidden', 'visible'].includes(visibility)) {
      return NextResponse.json(
        { error: 'visibility must be pending, hidden, or visible' },
        { status: 400 }
      )
    }

    const project = await setProjectVisibility(params.id, user.role, visibility)
    return NextResponse.json(project)
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e?.status) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
