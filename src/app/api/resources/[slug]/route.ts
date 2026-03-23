import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/permissions'
import {
  getResource,
  getResourceAny,
  upsertResource,
} from '@/services/resources.service'

type Params = { params: { slug: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const version = req.nextUrl.searchParams.get('version') ?? undefined

  let resource
  if (version) {
    resource = await getResource(params.slug, version)
    if (!resource) {
      // Fallback: try the other version
      resource = await getResourceAny(params.slug)
    }
  } else {
    resource = await getResourceAny(params.slug)
  }

  if (!resource) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(resource)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  const user = session?.user as { role: string } | undefined

  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const content = body.content ?? body

    const resource = await upsertResource(params.slug, content)
    return NextResponse.json(resource)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
