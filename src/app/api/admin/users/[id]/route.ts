import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/permissions'
import { softDeleteUser } from '@/services/users.service'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  const user = session?.user as { id: string; role: string } | undefined
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await softDeleteUser(params.id, user.id, user.role)
    return NextResponse.json({ message: 'Deleted' })
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e?.status) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
