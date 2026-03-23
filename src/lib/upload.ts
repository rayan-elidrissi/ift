import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

export function getUploadDir(): string {
  return process.env.UPLOAD_DIR ?? './uploads'
}

export async function saveUpload(file: File): Promise<string> {
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.')
  }

  const ext = extname(file.name).toLowerCase()
  if (!ALLOWED_EXT.includes(ext)) {
    throw new Error('Invalid file extension.')
  }

  const maxBytes =
    Number(process.env.UPLOAD_MAX_SIZE_MB ?? 10) * 1024 * 1024
  if (file.size > maxBytes) {
    throw new Error(
      `File too large. Maximum size is ${process.env.UPLOAD_MAX_SIZE_MB ?? 10}MB.`
    )
  }

  const filename = `${randomUUID()}${ext}`
  const dir = getUploadDir()
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()))
  return filename
}
