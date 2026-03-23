import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { EditableContent } from './cms/EditableContent';
import { EditableLink } from './cms/EditableLink';
import { EditableCollection } from './cms/EditableCollection';
import { CardButtons } from './CardButtons';
import { useCMS } from '../context/CMSContext';
import { ProjectCard } from './ProjectCard';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export type ComingSoonItem = {
  id: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  tags: string[];
  image: string;
  video?: string;
  description?: string;
};

const defaultComingSoonItems: ComingSoonItem[] = [
  {
    id: 'cs1',
    title: 'Research Symposium 2026',
    authors: 'IFT Lab',
    year: '2026',
    journal: 'Save the date',
    tags: ['Research', 'Symposium', 'Keynotes'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Join us for our annual research symposium, bringing together leading scholars, industry partners, and students to showcase groundbreaking work at the intersection of HCI, AI, and creative technology.',
  },
  {
    id: 'cs2',
    title: 'Fall Art Exhibition',
    authors: 'IFT Artists',
    year: '2026',
    journal: 'Gallery opening',
    tags: ['Art', 'Exhibition', 'Installation'],
    image: 'https://images.unsplash.com/photo-1531243269053-7eb05b961734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A curated exhibition of interactive installations and generative art from our community. New works exploring the boundaries between physical and digital, human and machine.',
  },
  {
    id: 'cs3',
    title: 'Student Project Showcase',
    authors: 'Class of 2026',
    year: '2026',
    journal: 'Demo day',
    tags: ['Education', 'Student Work', 'Innovation'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'The best student projects from our graduate program. From robotics to bio-design, VR to sustainable tech—discover the next generation of innovators.',
  },
];

export const ComingSoon = () => {
  const { getContent } = useCMS();
  const [viewingItem, setViewingItem] = React.useState<ComingSoonItem | null>(null);

  const items = getContent('coming-soon-items', defaultComingSoonItems) as ComingSoonItem[];
  const displayItems = items.slice(0, 3);

  const normalizeTags = (tags: string[] | string): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map((t) => t.trim()).filter(Boolean);
    return [];
  };

  useBodyScrollLock(!!viewingItem);

  return (
    <section className="bg-white py-24 px-6 md:px-12 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <EditableContent
            id="coming-soon-label"
            defaultContent="Upcoming"
            enableProse={false}
            className="text-teal-600 text-xs font-mono tracking-widest uppercase mb-2 block [&_p]:m-0"
          />
          <EditableContent
            id="coming-soon-title"
            defaultContent="Coming Soon"
            enableProse={false}
            className="text-4xl md:text-6xl font-serif text-neutral-900 tracking-tight [&_p]:m-0"
          />
          <EditableLink
            id="coming-soon-button-url"
            defaultHref="/events"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900 hover:text-teal-600 transition-colors mt-6"
          >
            <EditableContent
              id="coming-soon-button"
              defaultContent="Stay Tuned"
              enableProse={false}
              multiline={false}
              secondaryId="coming-soon-button-url"
              secondaryDefault="/events"
              secondaryLabel="Redirection"
              secondaryPlaceholder="/events or https://..."
              className="[&_p]:m-0"
            />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </EditableLink>
        </div>

        <EditableCollection
          id="coming-soon-items"
          defaultData={defaultComingSoonItems}
          displayItems={displayItems}
          containerClassName="grid grid-cols-1 md:grid-cols-3 gap-8"
          schema={[
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'authors', label: 'Authors / Credit', type: 'text' },
            { key: 'year', label: 'Year', type: 'text' },
            { key: 'journal', label: 'Subtitle (e.g. Save the date)', type: 'text' },
            { key: 'image', label: 'Image URL', type: 'image' },
            { key: 'video', label: 'Video URL (optional)', type: 'video' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
          ]}
          renderItem={(item: ComingSoonItem, index: number) => (
            <ProjectCard
              key={item.id}
                project={{ ...item, tags: normalizeTags(item.tags) }}
                index={index}
                aspectRatio="square"
                variant="minimal"
                onClick={() => setViewingItem(item)}
              />
          )}
        />
      </div>

      {/* Modal for Item Details */}
      <AnimatePresence>
        {viewingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingItem(null)}
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
                onClick={() => setViewingItem(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-neutral-900" />
              </button>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
                {viewingItem.video ? (
                  <video
                    src={viewingItem.video}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={viewingItem.image}
                    alt={viewingItem.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-neutral-100">
                  {viewingItem.year}
                </div>
              </div>

              <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                  <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {normalizeTags(viewingItem.tags).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wider border border-teal-100 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                    {viewingItem.title}
                  </h2>

                  <div className="flex flex-col gap-1 font-mono text-xs text-neutral-500 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                    <span className="text-neutral-900 font-bold">{viewingItem.authors}</span>
                    <span>{viewingItem.journal}</span>
                  </div>

                  <div className="prose prose-neutral prose-sm max-w-none mb-8">
                    <p className="text-neutral-600 leading-relaxed text-base">
                      {viewingItem.description || 'Details coming soon.'}
                    </p>
                  </div>
                </div>
                </div>

                <CardButtons
                  item={viewingItem}
                  defaultButtons={[
                    { label: 'Notify Me', primary: true },
                    { label: 'Share', primary: false },
                  ]}
                />
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
