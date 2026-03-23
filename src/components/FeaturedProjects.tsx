import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { EditableContent } from './cms/EditableContent';
import { CardButtons } from './CardButtons';
import { EditableLink } from './cms/EditableLink';
import { FeaturedProjectSelector } from './cms/FeaturedProjectSelector';
import { useCMS } from '../context/CMSContext';
import { buildFeaturedProjectPool, type UnifiedProject } from '../lib/featuredProjectUtils';
import { defaultPublications } from '../lib/defaultPublications';
import { defaultStudentProjects } from './Education';
import { defaultExhibitions } from './Arts';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

const FeaturedProjectsSkeleton = () => (
  <section className="bg-white py-24 px-6 md:px-12 border-b border-neutral-200 animate-pulse">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="h-3 bg-neutral-100 rounded w-20 mb-2" />
        <div className="h-10 md:h-14 bg-neutral-200 rounded w-72 mb-4" />
        <div className="h-4 bg-neutral-100 rounded w-36 mt-6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-neutral-200 overflow-hidden">
            <div className="w-full aspect-video bg-neutral-200" />
            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                <div className="h-3 w-12 bg-neutral-100 rounded" />
                <div className="h-3 w-10 bg-neutral-100 rounded" />
              </div>
              <div className="h-5 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-100 rounded w-1/2 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FeaturedProjects = () => {
  const { getContent, isLoading, hasCache } = useCMS();

  // Fetch from all three CMS sources
  const publications = getContent('research-publications', defaultPublications) as typeof defaultPublications;
  const studentProjects = getContent('edu-student-projects', defaultStudentProjects) as typeof defaultStudentProjects;
  const exhibitions = getContent('arts-exhibitions', defaultExhibitions) as typeof defaultExhibitions;

  const [viewingProject, setViewingProject] = React.useState<UnifiedProject | null>(null);

  // Build unified pool from research publications, student projects, and art exhibitions
  const allProjects = React.useMemo(
    () => buildFeaturedProjectPool(publications, studentProjects, exhibitions),
    [publications, studentProjects, exhibitions]
  );

  useBodyScrollLock(!!viewingProject);

  if (isLoading && !hasCache) {
    return <FeaturedProjectsSkeleton />;
  }

  // Get selected project IDs from CMS (default: one from each source)
  const defaultIds = ['pub-01', 'stu-p1', 'art-1'];
  const selectedProjectIds = getContent('featured-project-ids', defaultIds) as string[];

  // Filter projects based on selected IDs and maintain order
  const featuredProjects = selectedProjectIds
    .map((id) => allProjects.find((p) => p.id === id))
    .filter(Boolean) as UnifiedProject[];

  const getSourceLine = (p: UnifiedProject) => {
    if (p.sourceType === 'publication') return `Published in ${p.journal}`;
    if (p.sourceType === 'student') return p.journal;
    return `Exhibited at ${p.journal}`;
  };

  const getModalDescription = (p: UnifiedProject) => {
    const text = p.description || p.abstract;
    if (text) return text;
    const tags = Array.isArray(p.tags) ? p.tags : ((p.tags as unknown as string) || '').split(',').map((t: string) => t.trim()).filter(Boolean);
    return `This project explores innovative approaches in ${tags[0] || 'technology'}, contributing to the broader field.`;
  };

  const getDefaultButtons = (p: UnifiedProject) => {
    if (p.sourceType === 'publication') return [{ label: 'Read PDF', primary: true }, { label: 'Cite', primary: false }];
    if (p.sourceType === 'art') return [{ label: 'View Portfolio', primary: true }, { label: 'Share', primary: false }];
    return [{ label: 'Learn More', primary: true }, { label: 'Share', primary: false }];
  };

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <EditableContent
            id="featured-projects-label"
            defaultContent="Featured"
            enableProse={false}
            className="text-teal-600 text-xs font-mono tracking-widest uppercase mb-2 block [&_p]:m-0"
          />
          <EditableContent
            id="featured-projects-title"
            defaultContent="Featured Projects"
            enableProse={false}
            className="text-4xl md:text-6xl font-serif text-neutral-900 tracking-tight [&_p]:m-0"
          />
          <EditableLink
            id="featured-projects-button-url"
            defaultHref="/research"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900 hover:text-teal-600 transition-colors mt-6"
          >
            <EditableContent
              id="featured-projects-button"
              defaultContent="View All Research"
              enableProse={false}
              multiline={false}
              secondaryId="featured-projects-button-url"
              secondaryDefault="/research"
              secondaryLabel="Redirection"
              secondaryPlaceholder="/research or https://..."
              className="[&_p]:m-0"
            />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </EditableLink>
        </div>

        <FeaturedProjectSelector
          allProjects={allProjects}
          contentId="featured-project-ids"
          defaultSelectedIds={defaultIds}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              onClick={() => setViewingProject(project)}
              className="group bg-white border border-neutral-200 hover:border-teal-500 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col shadow-sm hover:shadow-2xl relative touch-pan-y min-w-0"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-100 -mr-4 -mt-4 rotate-45 transform group-hover:bg-teal-500 transition-colors z-20"></div>

              {/* Image or Video */}
              <div className="w-full aspect-video bg-neutral-100 overflow-hidden relative">
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                  />
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-900 border border-neutral-200">
                  {project.year}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 left-6 w-px h-6 bg-neutral-200 group-hover:h-full group-hover:bg-teal-500/20 transition-all duration-500"></div>

                {project.sourceType !== 'student' && (
                  <div className="flex flex-wrap gap-2 mb-4 pl-4">
                    {(Array.isArray(project.tags) ? project.tags : ((project.tags as unknown as string) || '').split(',')).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] text-teal-600 font-mono uppercase tracking-wider bg-teal-50 px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-xl font-serif text-neutral-900 mb-3 pl-4 leading-tight group-hover:text-teal-700 transition-colors">
                  {project.title}
                </h3>

                <div className="mt-auto pl-4 border-l border-neutral-100 pt-4">
                  <div className="flex justify-between items-end">
                    <div className="text-neutral-400 text-xs font-mono">
                      <span className="block text-neutral-500 mb-1">{project.authors}</span>
                      <span className="uppercase tracking-widest text-[9px]">{getSourceLine(project)}</span>
                    </div>
                    <div className="w-8 h-8 border border-neutral-200 flex items-center justify-center rounded-full group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Project Details */}
      <AnimatePresence>
        {viewingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingProject(null)}
            onTouchMove={(e) => e.preventDefault()}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl"
          >
            <button
              onClick={() => setViewingProject(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-neutral-900" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
            {/* Media Section - Left Side (Landscape/Rectangular) */}
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
              {viewingProject.video ? (
                <video
                  src={viewingProject.video}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={viewingProject.image}
                  alt={viewingProject.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-neutral-100">
                {viewingProject.year}
              </div>
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                <div className="mb-6">
                {viewingProject.sourceType !== 'student' && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(viewingProject.tags) ? viewingProject.tags : ((viewingProject.tags as unknown as string) || '').split(',')).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wider border border-teal-100 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                  {viewingProject.title}
                </h2>

                <div className="flex flex-col gap-1 font-mono text-xs text-neutral-500 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                  <span className="text-neutral-900 font-bold">{viewingProject.authors}</span>
                  <span>{getSourceLine(viewingProject)}</span>
                </div>

                <div className="prose prose-neutral prose-sm max-w-none mb-8">
                  <p className="text-neutral-600 leading-relaxed text-base">
                    {getModalDescription(viewingProject)}
                  </p>
                </div>

                {viewingProject.sourceType === 'art' && viewingProject.materials && (
                  <div className="bg-neutral-50 p-6 border border-neutral-100 mb-8">
                    <span className="block text-xs uppercase text-neutral-400 mb-2 font-mono">
                      Materials / Technologies
                    </span>
                    <p className="font-mono text-sm text-neutral-700">{viewingProject.materials}</p>
                  </div>
                )}
              </div>
              </div>

              {viewingProject.sourceType !== 'student' && (
                <CardButtons
                  item={viewingProject as unknown as Record<string, unknown>}
                  defaultButtons={getDefaultButtons(viewingProject)}
                />
              )}
            </div>
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </section>
  );
};
