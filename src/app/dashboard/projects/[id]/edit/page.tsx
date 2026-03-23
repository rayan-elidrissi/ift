'use client'

import { useParams } from 'next/navigation'
import { ProjectForm } from '@/components/dashboard/ProjectForm'

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  return <ProjectForm mode="edit" projectId={id} />
}
