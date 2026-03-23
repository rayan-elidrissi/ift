import prisma from '@/lib/prisma'

export type ResourceData = {
  slug: string
  content: Record<string, unknown>
  version: string
  updatedAt: Date
}

export async function getResource(
  slug: string,
  version?: string
): Promise<ResourceData | null> {
  const row = await prisma.resource.findUnique({ where: { slug } })
  if (!row) return null
  if (version && row.version !== version) return null
  return {
    slug: row.slug,
    content: row.content as Record<string, unknown>,
    version: row.version,
    updatedAt: row.updatedAt,
  }
}

export async function getResourceAny(slug: string): Promise<ResourceData | null> {
  const row = await prisma.resource.findUnique({ where: { slug } })
  if (!row) return null
  return {
    slug: row.slug,
    content: row.content as Record<string, unknown>,
    version: row.version,
    updatedAt: row.updatedAt,
  }
}

export async function upsertResource(
  slug: string,
  content: Record<string, unknown>
): Promise<ResourceData> {
  const row = await prisma.resource.upsert({
    where: { slug },
    update: { content: content as never, version: 'Draft' },
    create: { slug, content: content as never, version: 'Draft' },
  })
  return {
    slug: row.slug,
    content: row.content as Record<string, unknown>,
    version: row.version,
    updatedAt: row.updatedAt,
  }
}

export async function publishResource(slug: string): Promise<ResourceData> {
  const row = await prisma.resource.update({
    where: { slug },
    data: { version: 'Published' },
  })
  return {
    slug: row.slug,
    content: row.content as Record<string, unknown>,
    version: row.version,
    updatedAt: row.updatedAt,
  }
}
