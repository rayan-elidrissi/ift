import prisma from '@/lib/prisma'
import {
  canEditProject,
  canDeleteProject,
  canToggleVisibility,
} from '@/lib/permissions'

export type ProjectWithAuthor = {
  id: string
  title: string
  content: string
  coverImage: string | null
  visibility: 'pending' | 'hidden' | 'visible'
  category: 'research' | 'students' | 'arts' | 'events'
  authorId: string
  authorEmail: string | null
  participants: { id: string; email: string }[]
  createdAt: Date
  updatedAt: Date
}

const projectInclude = {
  author: { select: { email: true, deletedAt: true } },
  participants: { select: { id: true, email: true } },
} as const

function mapProject(p: {
  id: string
  title: string
  content: string
  coverImage: string | null
  visibility: string
  category: string
  authorId: string
  author: { email: string; deletedAt: Date | null }
  participants: { id: string; email: string }[]
  createdAt: Date
  updatedAt: Date
}): ProjectWithAuthor {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    coverImage: p.coverImage,
    visibility: p.visibility as ProjectWithAuthor['visibility'],
    category: p.category as ProjectWithAuthor['category'],
    authorId: p.authorId,
    authorEmail: p.author.deletedAt ? null : p.author.email,
    participants: p.participants,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

export async function getPublicProjects(): Promise<ProjectWithAuthor[]> {
  const rows = await prisma.project.findMany({
    where: { deletedAt: null, visibility: 'visible' },
    include: projectInclude,
    orderBy: { updatedAt: 'desc' },
  })
  return rows.map(mapProject)
}

export async function getPublicProject(id: string): Promise<ProjectWithAuthor | null> {
  const row = await prisma.project.findFirst({
    where: { id, deletedAt: null, visibility: 'visible' },
    include: projectInclude,
  })
  return row ? mapProject(row) : null
}

export async function getDashboardProjects(
  userId: string,
  role: string
): Promise<ProjectWithAuthor[]> {
  const where =
    role === 'student'
      ? {
          deletedAt: null,
          OR: [
            { authorId: userId },
            { participants: { some: { id: userId } } },
          ],
        }
      : { deletedAt: null }

  const rows = await prisma.project.findMany({
    where,
    include: projectInclude,
    orderBy: { updatedAt: 'desc' },
  })
  return rows.map(mapProject)
}

export async function getDashboardProject(
  id: string,
  userId: string,
  role: string
): Promise<ProjectWithAuthor | null> {
  const row = await prisma.project.findFirst({
    where: { id, deletedAt: null },
    include: projectInclude,
  })
  if (!row) return null
  if (!canEditProject(userId, row.authorId, role)) return null
  return mapProject(row)
}

export async function createProject(
  userId: string,
  role: string,
  data: {
    title: string
    content: string
    coverImage?: string
    category: string
    participantIds?: string[]
  }
): Promise<ProjectWithAuthor> {
  if (role === 'student') {
    const existing = await prisma.project.count({
      where: {
        deletedAt: null,
        OR: [{ authorId: userId }, { participants: { some: { id: userId } } }],
      },
    })
    if (existing >= 1) {
      throw Object.assign(new Error('Students can only create one project'), { status: 403 })
    }
  }

  const row = await prisma.project.create({
    data: {
      title: data.title,
      content: data.content,
      coverImage: data.coverImage ?? null,
      visibility: 'pending',
      category: data.category as 'research' | 'students' | 'arts' | 'events',
      authorId: userId,
      participants: data.participantIds?.length
        ? { connect: data.participantIds.map((id) => ({ id })) }
        : undefined,
    },
    include: projectInclude,
  })
  return mapProject(row)
}

export async function updateProject(
  id: string,
  userId: string,
  role: string,
  data: {
    title: string
    content: string
    coverImage?: string | null
    category: string
    participantIds?: string[]
  }
): Promise<ProjectWithAuthor> {
  const existing = await prisma.project.findFirst({
    where: { id, deletedAt: null },
  })
  if (!existing) throw Object.assign(new Error('Not found'), { status: 404 })
  if (!canEditProject(userId, existing.authorId, role)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }

  const row = await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      coverImage: data.coverImage ?? null,
      visibility: 'pending',
      category: data.category as 'research' | 'students' | 'arts' | 'events',
      participants: {
        set: (data.participantIds ?? []).map((pid) => ({ id: pid })),
      },
    },
    include: projectInclude,
  })
  return mapProject(row)
}

export async function setProjectVisibility(
  id: string,
  role: string,
  visibility: 'pending' | 'hidden' | 'visible'
): Promise<ProjectWithAuthor> {
  if (!canToggleVisibility(role)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }

  const existing = await prisma.project.findFirst({
    where: { id, deletedAt: null },
  })
  if (!existing) throw Object.assign(new Error('Not found'), { status: 404 })

  const row = await prisma.project.update({
    where: { id },
    data: { visibility },
    include: projectInclude,
  })
  return mapProject(row)
}

export async function softDeleteProject(
  id: string,
  userId: string,
  role: string
): Promise<void> {
  const existing = await prisma.project.findFirst({
    where: { id, deletedAt: null },
  })
  if (!existing) throw Object.assign(new Error('Not found'), { status: 404 })
  if (!canDeleteProject(userId, existing.authorId, role)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }

  await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}
