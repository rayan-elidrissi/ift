import prisma from '@/lib/prisma'
import { isAdmin } from '@/lib/permissions'
import { Role } from '@prisma/client'

export type UserSummary = {
  id: string
  email: string
  role: string
  createdAt: Date
}

export async function listUsers(): Promise<UserSummary[]> {
  const rows = await prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return rows
}

export async function changeRole(
  targetId: string,
  newRole: string,
  requesterId: string,
  requesterRole: string
): Promise<UserSummary> {
  if (!isAdmin(requesterRole)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }

  if (!Object.values(Role).includes(newRole as Role)) {
    throw Object.assign(new Error('Invalid role'), { status: 400 })
  }

  if (newRole !== 'admin' && requesterId === targetId) {
    throw Object.assign(new Error('Cannot downgrade your own admin account'), { status: 409 })
  }

  const row = await prisma.user.update({
    where: { id: targetId },
    data: { role: newRole as Role },
    select: { id: true, email: true, role: true, createdAt: true },
  })
  return row
}

export async function softDeleteUser(
  targetId: string,
  requesterId: string,
  requesterRole: string
): Promise<void> {
  if (!isAdmin(requesterRole)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }
  if (targetId === requesterId) {
    throw Object.assign(new Error('Cannot delete your own account'), {
      status: 409,
    })
  }

  const user = await prisma.user.findFirst({
    where: { id: targetId, deletedAt: null },
  })
  if (!user) throw Object.assign(new Error('Not found'), { status: 404 })

  await prisma.user.update({
    where: { id: targetId },
    data: { deletedAt: new Date() },
  })
}
