/**
 * Maps CMS keys to resource slugs and field paths.
 * Used when migrating from key-value CMS to resource-based API.
 *
 * Structure: slug -> logical page/section; each resource has content blocks.
 * Keys like hero-title, about-intro map to slugs for migration.
 */

export const CMS_KEY_TO_SLUG: Record<string, string> = {
  // Home page
  'hero-title': 'page-home',
  'hero-blurb': 'page-home',
  'hero-button': 'page-home',
  'hero-button-url': 'page-home',
  'hero-video-url': 'page-home',
  'featured-projects-label': 'page-home',
  'featured-projects-title': 'page-home',
  'featured-projects-button': 'page-home',
  'featured-projects-button-url': 'page-home',
  'featured-project-ids': 'page-home',
  'latest-events-label': 'page-home',
  'latest-events-title': 'page-home',
  'latest-events-button': 'page-home',
  'latest-events-button-url': 'page-home',
  'latest-events': 'page-home',
  'coming-soon-label': 'page-home',
  'coming-soon-title': 'page-home',
  'coming-soon-button': 'page-home',
  'coming-soon-button-url': 'page-home',
  'coming-soon-items': 'page-home',

  // About page
  'about-title': 'page-about',
  'about-subtitle': 'page-about',
  'about-intro': 'page-about',
  'about-pillar-1-title': 'page-about',
  'about-pillar-1-desc': 'page-about',
  'about-pillar-2-title': 'page-about',
  'about-pillar-2-desc': 'page-about',
  'about-pillar-3-title': 'page-about',
  'about-pillar-3-desc': 'page-about',
  'about-campus-image': 'page-about',
  'team-title-prefix': 'page-about',
  'team-title-highlight': 'page-about',
  'team-subtitle': 'page-about',
  'team-members-core': 'page-about',
  'team-members-affiliated': 'page-about',
  'team-cta-link': 'page-about',
  'team-cta-title': 'page-about',

  // Research page
  'research-title': 'page-research',
  'research-tagline': 'page-research',
  'research-intro': 'page-research',
  'research-core-themes-label': 'page-research',
  'research-themes': 'page-research',
  'research-publications': 'page-research',
  'research-all-publications-title': 'page-research',
  'research-all-publications-desc': 'page-research',
  'research-filter-categories': 'page-research',

  // Education page
  'education-title': 'page-education',
  'education-tagline': 'page-education',
  'education-academic-tracks-label': 'page-education',
  'edu-intro': 'page-education',
  'edu-programs': 'page-education',
  'education-cursus-title': 'page-education',
  'education-cursus-innovation-title': 'page-education',
  'education-cursus-research-led-title': 'page-education',
  'education-cursus-valorization-title': 'page-education',
  'education-demo-or-die-image': 'page-education',
  'edu-philosophy-image': 'page-education',
  'edu-phil-1-title': 'page-education',
  'edu-phil-1': 'page-education',
  'edu-phil-2-title': 'page-education',
  'edu-phil-2': 'page-education',
  'edu-phil-3-title': 'page-education',
  'edu-phil-3': 'page-education',
  'edu-student-projects': 'page-education',

  // Arts page
  'arts-title': 'page-arts',
  'arts-blurb-1': 'page-arts',
  'arts-blurb-2': 'page-arts',
  'arts-hero-image': 'page-arts',
  'arts-intro': 'page-arts',
  'arts-featured-exhibitions-label': 'page-arts',
  'arts-exhibitions': 'page-arts',
  'arts-full-archive-title': 'page-arts',

  // Events page
  'events-title': 'page-events',
  'events-intro': 'page-events',
  'events-section1-title': 'page-events',
  'events-section2-title': 'page-events',
  'events-section3-title': 'page-events',
  'events-talks': 'page-events',
  'events-festivals': 'page-events',
  'events-misc': 'page-events',

  // Collaborate page
  'collaborate-title': 'page-collaborate',
  'collaborate-tagline': 'page-collaborate',
  'collaborate-pathways-label': 'page-collaborate',
  'collaborate-types': 'page-collaborate',
  'collaborate-partners-title': 'page-collaborate',
  'collaborate-partners-subtitle': 'page-collaborate',
  'collaborate-partners-prefix': 'page-collaborate',
  'collaborate-partners-highlight': 'page-collaborate',
  'collaborate-partners': 'page-collaborate',

  // Footer
  'footer-location-title': 'page-footer',
  'footer-address-line1': 'page-footer',
  'footer-address-line2': 'page-footer',
  'footer-address-line3': 'page-footer',
  'footer-connect-title': 'page-footer',
  'footer-email': 'page-footer',
  'footer-social-twitter': 'page-footer',
  'footer-social-linkedin': 'page-footer',
  'footer-social-instagram': 'page-footer',
  'footer-social-github': 'page-footer',
  'footer-legal-title': 'page-footer',
  'footer-privacy-link': 'page-footer',
  'footer-terms-link': 'page-footer',
  'footer-copyright': 'page-footer',
};

/** Get slug for a CMS key, or null if no mapping. */
export function getSlugForKey(key: string): string | null {
  return CMS_KEY_TO_SLUG[key] ?? null;
}

/** All page slugs used in the site. */
export const PAGE_SLUGS = [
  'page-home',
  'page-about',
  'page-research',
  'page-education',
  'page-arts',
  'page-events',
  'page-collaborate',
  'page-footer',
] as const;

/** Slug -> list of CMS keys (inverse of CMS_KEY_TO_SLUG). */
export const SLUG_TO_KEYS: Record<string, string[]> = (() => {
  const m: Record<string, string[]> = {};
  for (const [key, slug] of Object.entries(CMS_KEY_TO_SLUG)) {
    if (!m[slug]) m[slug] = [];
    m[slug].push(key);
  }
  return m;
})();
