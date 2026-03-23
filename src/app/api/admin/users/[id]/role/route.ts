import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/permissions'
import { changeRole } from '@/services/users.service'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  const user = session?.user as { id: string; role: string } | undefined
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { role: newRole } = body

    const updated = await changeRole(params.id, newRole, user.id, user.role)
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e?.status) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
