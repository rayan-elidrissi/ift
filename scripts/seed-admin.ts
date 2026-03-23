/**
 * One-time script to create the first admin user.
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running, or edit below.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@devinci.fr'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.error('Set ADMIN_PASSWORD env var before running this script.')
    process.exit(1)
  }

  const normalized = email.trim().toLowerCase()
  if (!normalized.endsWith('@devinci.fr')) {
    console.error('Admin email must end with @devinci.fr')
    process.exit(1)
  }

  const existing = await prisma.user.findFirst({ where: { email: normalized, deletedAt: null } })
  if (existing) {
    console.log(`User ${normalized} already exists (role: ${existing.role}). Promoting to admin.`)
    await prisma.user.update({ where: { id: existing.id }, data: { role: 'admin' } })
    console.log('Done.')
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { email: normalized, passwordHash, role: 'admin' },
  })
  console.log(`Admin user created: ${normalized}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
