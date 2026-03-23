import { NextResponse } from 'next/server'
import { getPublicProjects } from '@/services/projects.service'

export async function GET() {
  try {
    const projects = await getPublicProjects()
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
