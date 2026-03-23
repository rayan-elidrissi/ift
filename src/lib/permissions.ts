const ROLE_WEIGHT: Record<string, number> = {
  student: 0,
  staff: 1,
  admin: 2,
}

export function isStaff(role: string): boolean {
  return (ROLE_WEIGHT[role] ?? 0) >= 1
}

export function isAdmin(role: string): boolean {
  return (ROLE_WEIGHT[role] ?? 0) >= 2
}

export function canEditProject(
  userId: string,
  authorId: string,
  role: string
): boolean {
  return userId === authorId || isStaff(role)
}

export function canDeleteProject(
  userId: string,
  authorId: string,
  role: string
): boolean {
  return userId === authorId || isAdmin(role)
}

export function canToggleVisibility(role: string): boolean {
  return isStaff(role)
}
