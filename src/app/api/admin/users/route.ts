import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/permissions'
import { listUsers } from '@/services/users.service'

export async function GET() {
  const session = await auth()
  const user = session?.user as { role: string } | undefined
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const users = await listUsers()
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
