import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/permissions'
import { publishResource } from '@/services/resources.service'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  const user = session?.user as { role: string } | undefined

  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const resource = await publishResource(params.slug)
    return NextResponse.json(resource)
  } catch {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }
}
