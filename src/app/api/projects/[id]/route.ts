import { NextRequest, NextResponse } from 'next/server'
import { getPublicProject } from '@/services/projects.service'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getPublicProject(params.id)
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
