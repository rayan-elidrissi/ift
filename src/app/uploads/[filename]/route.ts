import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import { getUploadDir } from '@/lib/upload'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Strip any path traversal attempts — only allow a bare filename
  const filename = basename(params.filename)
  const ext = extname(filename).toLowerCase()
  const mime = MIME[ext]

  if (!mime) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const buffer = await readFile(join(getUploadDir(), filename))
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
