/**
 * CMS key → section mapping for role-based permissions.
 * admin: all | staff: about, research, arts, education, events | students: education only
 */

export type CMSSection =
  | 'hero'
  | 'featured'
  | 'coming_soon'
  | 'latest_events'
  | 'about'
  | 'research'
  | 'arts'
  | 'education'
  | 'events'
  | 'collaborate'
  | 'footer';

export type CMSRole = 'admin' | 'staff' | 'student';

// Order matters: more specific prefixes first
const SECTION_BY_KEY_PREFIX: Array<{ prefix: string; section: CMSSection }> = [
  { prefix: 'hero-', section: 'hero' },
  { prefix: 'featured-', section: 'featured' },
  { prefix: 'coming-soon', section: 'coming_soon' },
  { prefix: 'latest-events', section: 'latest_events' },
  { prefix: 'about-', section: 'about' },
  { prefix: 'team-', section: 'about' },
  { prefix: 'research-', section: 'research' },
  { prefix: 'arts-', section: 'arts' },
  { prefix: 'edu-', section: 'education' },
  { prefix: 'education-', section: 'education' },
  { prefix: 'events-', section: 'events' },
  { prefix: 'collaborate-', section: 'collaborate' },
  { prefix: 'footer-', section: 'footer' },
];

function getSectionForKey(key: string): CMSSection | null {
  for (const { prefix, section } of SECTION_BY_KEY_PREFIX) {
    if (key === prefix || key.startsWith(prefix)) return section;
  }
  return null;
}

const ROLE_SECTIONS: Record<CMSRole, CMSSection[]> = {
  admin: [
    'hero',
    'featured',
    'coming_soon',
    'latest_events',
    'about',
    'research',
    'arts',
    'education',
    'events',
    'collaborate',
    'footer',
  ],
  staff: ['about', 'research', 'arts', 'education', 'events'],
  student: ['education'],
};

export function canEditKey(key: string, role: CMSRole | null): boolean {
  if (!role) return false;
  const section = getSectionForKey(key);
  if (!section) return role === 'admin'; // admin can edit unknown keys
  return ROLE_SECTIONS[role]?.includes(section) ?? false;
}

export function canEditAny(role: CMSRole | null): boolean {
  return role === 'admin' || role === 'staff' || role === 'student';
}
