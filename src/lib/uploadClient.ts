/** Upload an image file to /api/upload. Returns the public URL (/uploads/<uuid>.ext). */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Upload failed')
  return data.url as string
}
