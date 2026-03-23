/**
 * Unifies research publications, student projects, and art exhibitions
 * into a single pool for Featured Projects on the home page.
 */

export type FeaturedProjectSource = 'publication' | 'student' | 'art';

export interface UnifiedProject {
  id: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  tags: string[];
  image: string;
  video?: string;
  sourceType: FeaturedProjectSource;
  description?: string;
  abstract?: string;
  materials?: string;
  /** Button config (from Research/Arts) – passed to CardButtons */
  button1_show?: unknown;
  button1_label?: string;
  button1_url?: string;
  button2_show?: unknown;
  button2_label?: string;
  button2_url?: string;
}

/** Normalize a research publication to unified format */
function normalizePublication(pub: {
  id: string;
  title: string;
  authors?: string;
  year?: string;
  journal?: string;
  tags?: string[];
  image?: string;
  media?: string;
  video?: string;
  abstract?: string;
  button1_show?: unknown;
  button1_label?: string;
  button1_url?: string;
  button2_show?: unknown;
  button2_label?: string;
  button2_url?: string;
}): UnifiedProject {
  return {
    id: `pub-${pub.id}`,
    title: pub.title,
    authors: pub.authors || '',
    year: pub.year || '',
    journal: pub.journal || '',
    tags: Array.isArray(pub.tags) ? pub.tags : [],
    image: pub.media || pub.video || pub.image || '',
    sourceType: 'publication',
    abstract: pub.abstract,
    button1_show: pub.button1_show,
    button1_label: pub.button1_label,
    button1_url: pub.button1_url,
    button2_show: pub.button2_show,
    button2_label: pub.button2_label,
    button2_url: pub.button2_url,
  };
}

/** Normalize a student project to unified format */
function normalizeStudentProject(proj: {
  id: string;
  title: string;
  student?: string;
  year?: string;
  image?: string;
  video?: string;
  tags?: string[];
  team?: string[];
  supervisor?: string | string[];
  description?: string;
}): UnifiedProject {
  const teamStr = Array.isArray(proj.team) ? proj.team.join(', ') : (typeof proj.team === 'string' ? proj.team : '');
  const supervisorStr = Array.isArray(proj.supervisor)
    ? proj.supervisor.join(', ')
    : typeof proj.supervisor === 'string' ? proj.supervisor : '';
  const authors = [teamStr, supervisorStr].filter(Boolean).join(' | ') || proj.student || '';
  return {
    id: `stu-${proj.id}`,
    title: proj.title,
    authors,
    year: proj.student || proj.year || '',
    journal: 'Student Project',
    tags: Array.isArray(proj.tags) ? proj.tags : [],
    image: proj.image || '',
    video: proj.video || '',
    sourceType: 'student',
    description: proj.description,
  };
}

/** Normalize an art exhibition to unified format */
function normalizeExhibition(exh: {
  id: number | string;
  title: string;
  artist?: string;
  year?: string;
  location?: string;
  image?: string;
  tags?: string[];
  description?: string;
  materials?: string;
  button1_show?: unknown;
  button1_label?: string;
  button1_url?: string;
  button2_show?: unknown;
  button2_label?: string;
  button2_url?: string;
}): UnifiedProject {
  return {
    id: `art-${exh.id}`,
    title: exh.title,
    authors: exh.artist || '',
    year: exh.year || '',
    journal: exh.location || '',
    tags: Array.isArray(exh.tags) ? exh.tags : [],
    image: exh.image || '',
    sourceType: 'art',
    description: exh.description,
    materials: exh.materials,
    button1_show: exh.button1_show,
    button1_label: exh.button1_label,
    button1_url: exh.button1_url,
    button2_show: exh.button2_show,
    button2_label: exh.button2_label,
    button2_url: exh.button2_url,
  };
}

export function buildFeaturedProjectPool(
  publications: Array<{
    id: string;
    title: string;
    authors?: string;
    year?: string;
    journal?: string;
    tags?: string[];
    image?: string;
    media?: string;
    video?: string;
    abstract?: string;
    button1_show?: unknown;
    button1_label?: string;
    button1_url?: string;
    button2_show?: unknown;
    button2_label?: string;
    button2_url?: string;
  }>,
  studentProjects: Array<{
    id: string;
    title: string;
    student?: string;
    year?: string;
    image?: string;
    video?: string;
    tags?: string[];
    team?: string[];
    supervisor?: string | string[];
    description?: string;
    visible?: string;
  }>,
  exhibitions: Array<{
    id: number | string;
    title: string;
    artist?: string;
    year?: string;
    location?: string;
    image?: string;
    tags?: string[];
    description?: string;
    materials?: string;
    button1_show?: unknown;
    button1_label?: string;
    button1_url?: string;
    button2_show?: unknown;
    button2_label?: string;
    button2_url?: string;
  }>
): UnifiedProject[] {
  const pubList = publications.map(normalizePublication);
  const stuList = studentProjects
    .filter((p) => (p.visible ?? 'shown') !== 'hidden')
    .map(normalizeStudentProject);
  const artList = exhibitions.map(normalizeExhibition);
  return [...pubList, ...stuList, ...artList];
}
