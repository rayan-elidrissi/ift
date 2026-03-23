import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { saveUpload } from '@/lib/upload'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const filename = await saveUpload(file)
    return NextResponse.json({
      filename,
      url: `/uploads/${filename}`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
