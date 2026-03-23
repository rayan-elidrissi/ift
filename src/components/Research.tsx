import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Share2, Filter, ArrowUpRight, Download, Calendar, X, Edit2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { EditableCollection, EditModal, type FieldSchema } from './cms/EditableCollection';
import { EditableContent } from './cms/EditableContent';
import { CardButtons } from './CardButtons';
import { CMSModal } from './cms/CMSModal';
import { useCMS } from '../context/CMSContext';
import { defaultPublications } from '../lib/defaultPublications';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

/** Re-export for backward compatibility (e.g. cached chunks, lazy imports) */
export { defaultPublications };

const researchThemes = [
  {
    id: '01',
    title: 'Human-Computer Interaction',
    description: 'Redefining the boundary between physical and digital worlds through haptics, VR, and embodied interaction. We investigate how technology can seamlessly integrate with human perception.',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1080&auto=format&fit=crop',
    tags: ['Haptics', 'VR', 'Embodiment']
  },
  {
    id: '02',
    title: 'Artificial Intelligence & Ethics',
    description: 'Investigating the societal impact of AI while developing creative tools that augment human potential. Our work focuses on the intersection of generative algorithms and human creativity.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1080&auto=format&fit=crop',
    tags: ['Ethics', 'Generative AI', 'Society']
  },
  {
    id: '03',
    title: 'Sustainable Engineering',
    description: 'Designing resilient technological systems that prioritize ecological balance and long-term sustainability. We explore bio-materials, swarm intelligence for disaster recovery, and green energy systems.',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1080&auto=format&fit=crop',
    tags: ['Sustainability', 'Green Tech', 'Systems']
  }
];

// Default filter categories (label + comma-separated keywords; empty keywords = match all)
const defaultFilterCategories = [
  { id: 'all', label: 'All', keywords: '' },
  { id: 'hci', label: 'HCI', keywords: 'hci,vr,ar,haptics,ux,interfaces,web' },
  { id: 'bio', label: 'Bioengineering', keywords: 'bio,health,materials,living' },
  { id: 'robotics', label: 'Robotics', keywords: 'robotics,drone,automation' },
];

// Helper to check if publication tags match a category (category has { label, keywords })
const matchesCategory = (
  tags: string[] | string | undefined,
  category: { label: string; keywords: string }
) => {
  const keywords = (category.keywords || '').trim();
  if (!keywords) return true; // "All" or empty = match everything
  const arr = Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const lowerTags = arr.map(t => t.toLowerCase());
  const lowerKeywords = keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
  return lowerTags.some(t => lowerKeywords.some(k => t.includes(k)));
};

type FilterCategory = { id?: string; label: string; keywords: string };

interface CategoriesEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterCategory[];
  onSave: (newCategories: FilterCategory[]) => void;
}

const CategoriesEditModal = ({ isOpen, onClose, categories, onSave }: CategoriesEditModalProps) => {
  const [localCategories, setLocalCategories] = useState<FilterCategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalCategories(categories.map(c => ({ ...c, id: c.id || `cat-${Date.now()}-${Math.random().toString(36).slice(2)}` })));
    }
  }, [isOpen, categories]);

  const handleChange = (index: number, field: 'label' | 'keywords', value: string) => {
    setLocalCategories(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAdd = () => {
    setLocalCategories(prev => [...prev, { id: `cat-${Date.now()}`, label: 'New Category', keywords: '' }]);
  };

  const handleDelete = (index: number) => {
    if (localCategories.length <= 1) return;
    if (confirm('Remove this category?')) {
      setLocalCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localCategories.length) return;
    setLocalCategories(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = () => {
    onSave(localCategories);
    onClose();
  };

  return (
    <CMSModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Edit Filter Categories"
      size="lg"
    >
      <div className="p-6 space-y-4">
        <p className="text-sm text-neutral-500 mb-4">
          Categories filter papers by matching their tags to keywords. Use comma-separated keywords (e.g. hci,vr,haptics). Leave keywords empty for &quot;All&quot;.
        </p>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          {localCategories.map((cat, index) => (
            <div
              key={cat.id ?? index}
              className="flex gap-2 items-start p-3 border border-neutral-200 rounded-lg bg-neutral-50/50"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={cat.label}
                    onChange={(e) => handleChange(index, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. HCI"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={cat.keywords || ''}
                    onChange={(e) => handleChange(index, 'keywords', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. hci,vr,haptics (empty = All)"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4 text-neutral-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === localCategories.length - 1}
                  className="p-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4 text-neutral-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  disabled={localCategories.length <= 1}
                  className="p-1.5 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 w-full py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-teal-500 hover:text-teal-600 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
    </CMSModal>
  );
};

const ResearchSkeleton = () => (
  <div className="bg-white min-h-screen animate-pulse">
    <section className="max-w-[1920px] mx-auto min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-6 lg:p-12 xl:p-20 pt-16 md:pt-20 lg:pt-24 flex flex-col justify-center border-r border-neutral-200">
        <div className="mb-6">
          <div className="h-12 md:h-16 bg-neutral-200 rounded w-56 mb-4" />
          <div className="space-y-2 mb-12 max-w-xl">
            <div className="h-5 bg-neutral-100 rounded w-full" />
            <div className="h-5 bg-neutral-100 rounded w-3/4" />
          </div>
          <div className="h-4 bg-neutral-100 rounded w-44 mb-2" />
        </div>
        <div className="space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-8 border-t border-neutral-200 flex items-baseline gap-8 px-4">
              <div className="h-4 w-6 bg-neutral-100 rounded" />
              <div className="h-7 bg-neutral-200 rounded w-64" />
            </div>
          ))}
          <div className="border-t border-neutral-200" />
        </div>
      </div>
      <div className="lg:w-1/2 lg:h-screen bg-neutral-100 hidden lg:block" />
    </section>
  </div>
);

export const Research = () => {
  const { getContent, updateContent, isEditing, canEditKey, isApiConfigured, reloadData, isLoading, hasCache } = useCMS();

  // Re-fetch CMS data when visiting Research (helps if initial load missed page-research)
  useEffect(() => {
    if (isApiConfigured) reloadData();
  }, [isApiConfigured, reloadData]);
  const allPublications = getContent('research-publications', defaultPublications) as typeof defaultPublications;
  const filterCategories = getContent('research-filter-categories', defaultFilterCategories) as typeof defaultFilterCategories;
  const themesFromCMS = getContent('research-themes', researchThemes) as typeof researchThemes;
  const researchThemesList = useMemo(() => {
    const raw = Array.isArray(themesFromCMS) && themesFromCMS.length > 0 ? themesFromCMS : researchThemes;
    const defaults = researchThemes;
    return raw.map((t: any, i: number) => {
      const def = defaults[i] || {};
      const tags = Array.isArray(t.tags) ? t.tags
        : typeof t.tags === 'string' ? t.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (def.tags || []);
      return {
        ...def,
        ...t,
        id: t.id || def.id || String(i + 1).padStart(2, '0'),
        tags: tags.length > 0 ? tags : (def.tags || []),
      };
    });
  }, [themesFromCMS]);

  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(filterCategories[0]?.label ?? 'All');
  const [activeTheme, setActiveTheme] = useState(researchThemesList[0]);

  // Sync activeTheme when researchThemesList changes (e.g. CMS load)
  useEffect(() => {
    if (researchThemesList.length > 0 && (!activeTheme || !researchThemesList.some((t: any) => t.id === activeTheme.id))) {
      setActiveTheme(researchThemesList[0]);
    }
  }, [researchThemesList]);
  const [viewingPaper, setViewingPaper] = useState<typeof allPublications[0] | null>(null);
  
  const [isHoveringList, setIsHoveringList] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const canEditCategories = isEditing && canEditKey('research-filter-categories');
  const canEditPublications = isEditing && canEditKey('research-publications');
  const [editingPaperInModal, setEditingPaperInModal] = useState(false);

  const researchPublicationSchema: FieldSchema[] = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'authors', label: 'Authors', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'journal', label: 'Journal/Conference', type: 'text' },
    { key: 'abstract', label: 'Abstract', type: 'textarea' },
    { key: 'media', label: 'Media', type: 'image' },
    { key: 'tags', label: 'Tags (comma separated array)', type: 'text' },
    { key: 'featured', label: 'Featured', type: 'toggle' },
    { key: 'button1_show', label: 'Show button 1', type: 'toggle' },
    { key: 'button1_label', label: 'Button 1 - Text', type: 'text', showWhen: 'button1_show' },
    { key: 'button1_url', label: 'Button 1 - URL', type: 'text', showWhen: 'button1_show' },
    { key: 'button2_show', label: 'Show button 2', type: 'toggle' },
    { key: 'button2_label', label: 'Button 2 - Text', type: 'text', showWhen: 'button2_show' },
    { key: 'button2_url', label: 'Button 2 - URL', type: 'text', showWhen: 'button2_show' },
  ];

  const handleSavePaperEdit = (updated: any) => {
    if (!viewingPaper) return;
    const pubs = Array.isArray(allPublications) ? [...allPublications] : [];
    const idx = pubs.findIndex((p: any) => (p.id && p.id === viewingPaper.id) || p === viewingPaper);
    if (idx === -1) return;
    const tagsVal = updated.tags;
    const item = {
      ...viewingPaper,
      ...updated,
      tags: typeof tagsVal === 'string' ? tagsVal.split(',').map((s: string) => s.trim()).filter(Boolean) : tagsVal,
    };
    pubs[idx] = item;
    updateContent('research-publications', pubs);
    setViewingPaper(item);
    setEditingPaperInModal(false);
  };

  // Reset selected category if it was removed from the list
  useEffect(() => {
    const exists = filterCategories.some(c => c.label === selectedCategory);
    if (!exists && filterCategories.length > 0) {
      setSelectedCategory(filterCategories[0].label);
    }
  }, [filterCategories, selectedCategory]);

  useBodyScrollLock(!!viewingPaper);

  

  // Reset selected category if it was removed from the list
  useEffect(() => {
    const exists = filterCategories.some(c => c.label === selectedCategory);
    if (!exists && filterCategories.length > 0) {
      setSelectedCategory(filterCategories[0].label);
    }
  }, [filterCategories, selectedCategory]);

  // Extract unique years and sort descending (guard against undefined year in empty cards)
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(allPublications.map((p: any) => p.year ?? '')));
    return ['All', ...uniqueYears.filter(Boolean).sort((a: any, b: any) => String(b).localeCompare(String(a)))];
  }, [allPublications]);

  // Filter full publications (guard against undefined year in empty cards)
  const filteredPublications = useMemo(() => {
    let pubs = [...allPublications].sort((a: any, b: any) => String(b.year ?? '').localeCompare(String(a.year ?? '')));
    
    // Filter by Year
    if (selectedYear !== 'All') {
      pubs = pubs.filter(p => p.year === selectedYear);
    }

    // Filter by Category
    const cat = filterCategories.find(c => c.label === selectedCategory);
    if (cat && (cat.keywords || '').trim()) {
      pubs = pubs.filter(p => matchesCategory(p.tags, cat));
    }

    return pubs;
  }, [selectedYear, selectedCategory, filterCategories, allPublications]);

  if (isLoading && !hasCache) {
    return <ResearchSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900 relative font-sans selection:bg-teal-200 selection:text-black">
      

      {/* FEATURED THEMES SECTION */}
      <section className="max-w-[1920px] mx-auto min-h-screen flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT COLUMN: List */}
        <div className="lg:w-1/2 p-6 lg:p-12 xl:p-20 pt-16 md:pt-20 lg:pt-24 flex flex-col justify-center bg-white/95 backdrop-blur-sm border-r border-neutral-200">
          
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-neutral-900 leading-[0.9] uppercase"
              role="heading"
              aria-level={1}
            >
              <EditableContent
                id="research-title"
                defaultContent="Research"
                enableProse={false}
                className="[&_p]:m-0"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-neutral-500 font-serif italic mb-12 max-w-xl leading-relaxed"
            >
              <EditableContent
                id="research-tagline"
                defaultContent="We explore the intersection of humanity and technology, designing systems that are not just functional, but meaningful, ethical, and sustainable."
                enableProse={false}
                className="[&_p]:m-0"
              />
            </motion.div>

            <div className="font-mono text-sm uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <EditableContent
                id="research-core-themes-label"
                defaultContent="Core Research Themes"
                enableProse={false}
                className="[&_p]:inline [&_p]:m-0"
              />
            </div>
          </div>

          <div
            onMouseEnter={() => setIsHoveringList(true)}
            onMouseLeave={() => setIsHoveringList(false)}
          >
            <EditableCollection
              id="research-themes"
              defaultData={researchThemes}
              overrideItems={researchThemesList}
              containerClassName="space-y-0 min-h-[300px]"
              schema={[
                { key: 'title', label: 'Theme Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'image', label: 'Image', type: 'image' },
                { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
              ]}
              renderItem={(theme: any, index: number) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setActiveTheme(theme)}
                  className={`py-8 border-t border-neutral-200 cursor-pointer transition-all duration-300 ${activeTheme.id === theme.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <div className="flex items-baseline justify-between relative z-10 px-4">
                    <div className="flex items-baseline gap-8">
                       <span className={`font-mono text-xs transition-colors duration-300 ${activeTheme.id === theme.id ? 'text-teal-600' : 'text-neutral-400'}`}>
                          {String(index + 1).padStart(2, '0')}
                       </span>
                       <h3 className="text-2xl md:text-3xl font-light group-hover:translate-x-4 transition-transform duration-500 ease-out text-neutral-900">
                         {theme.title}
                       </h3>
                    </div>
                  </div>

                  {activeTheme.id === theme.id && (
                    <motion.div
                      layoutId="activeLine"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-teal-600"
                    />
                  )}
                </motion.div>
              )}
            />
            <div className="border-t border-neutral-200" />
          </div>

        </div>

        {/* RIGHT COLUMN: Preview (Sticky) */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-neutral-100 relative overflow-hidden hidden lg:block">
           
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTheme.id}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
               className="absolute inset-0 z-0"
             >
                <img 
                  src={activeTheme.image} 
                  alt={activeTheme.title}
                  className="w-full h-full object-cover opacity-100 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20" />
             </motion.div>
           </AnimatePresence>

           <div className="absolute inset-0 z-10 p-12 lg:p-20 flex flex-col justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                   key={activeTheme.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                   className="bg-white/90 backdrop-blur-md p-8 md:p-12 border border-white/50 shadow-2xl"
                >
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(Array.isArray(activeTheme.tags) ? activeTheme.tags : (activeTheme.tags || '').split(',')).map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 border border-teal-200 bg-teal-50 rounded-full text-[10px] uppercase tracking-wider text-teal-800">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6 text-neutral-900">
                    {activeTheme.title}
                  </h2>

                  <p className="text-neutral-700 font-sans leading-relaxed text-sm md:text-base mb-4 border-l-2 border-teal-600 pl-6">
                    {activeTheme.description}
                  </p>
                </motion.div>
              </AnimatePresence>
           </div>

        </div>
        
        <style>{`
          .writing-vertical-rl {
            writing-mode: vertical-rl;
          }
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
          
        `}</style>
      </section>

      {/* FULL PUBLICATIONS LIST SECTION */}
      <section className="bg-neutral-50 py-24 px-6 md:px-12 xl:px-20 relative z-10 border-t border-neutral-200">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
               <div>
                  <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
                    <EditableContent
                      id="research-all-publications-title"
                      defaultContent="All Publications"
                      enableProse={false}
                      multiline={false}
                      className="[&_p]:m-0"
                    />
                  </h2>
                  <div className="text-neutral-500 font-sans mb-8">
                    <EditableContent
                      id="research-all-publications-desc"
                      defaultContent="Chronological archive of all published research."
                      enableProse={false}
                      multiline={false}
                      className="[&_p]:m-0"
                    />
                  </div>

                  {/* Year Filter */}
                  <div className="flex items-center gap-6 text-sm font-mono uppercase tracking-widest overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-neutral-500 flex items-center gap-2 flex-shrink-0">
                      <Filter className="w-3 h-3" />
                      Filter:
                    </span>
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`relative transition-colors duration-300 hover:text-black whitespace-nowrap ${selectedYear === year ? 'text-teal-600' : 'text-neutral-400'}`}
                      >
                        {year}
                        {selectedYear === year && (
                          <motion.div 
                            layoutId="activeYear"
                            className="absolute -bottom-1 left-0 right-0 h-px bg-teal-600"
                          />
                        )}
                      </button>
                    ))}
                  </div>
               </div>
               
               {/* Category Filter (CMS-editable via pen button modal) */}
               <div className="md:text-right">
                  <div className={`flex flex-wrap md:justify-end gap-3 items-center relative ${canEditCategories ? 'group outline-2 outline-dashed outline-teal-500/50 hover:bg-teal-50/50 rounded-lg p-3 transition-all' : ''}`}>
                    {canEditCategories && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowCategoriesModal(true); }}
                        className="absolute -top-3 -right-3 bg-teal-600 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-lg hover:bg-teal-700"
                        title="Edit categories"
                        aria-label="Edit filter categories"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {filterCategories.map((cat: { id?: string; label: string; keywords: string }) => (
                      <button
                        key={cat.id ?? cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all duration-300 relative overflow-hidden ${
                          selectedCategory === cat.label 
                            ? 'bg-teal-600 border-teal-600 text-white shadow-lg' 
                            : 'bg-white border-neutral-300 text-neutral-600 hover:border-teal-400 hover:shadow-md'
                        }`}
                      >
                        {selectedCategory === cat.label && (
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></span>
                        )}
                        <span className="relative z-10">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
            </div>

            <div className="mt-12">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                   <EditableCollection
                      id="research-publications"
                      defaultData={defaultPublications}
                      displayItems={filteredPublications}
                      allowAddWhenFiltered
                      schema={researchPublicationSchema}
                      containerClassName="contents"
                      renderItem={(pub: any, index: number, isEditing: boolean, openEditModal) => (
                         <motion.div 
                           key={`pub-${pub.id}`}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: 0.05 }}
                           onClick={(e) => {
                             if (isEditing && openEditModal) {
                               e.stopPropagation();
                               openEditModal();
                             } else {
                               setViewingPaper(pub);
                             }
                           }}
                           className="group bg-white border border-neutral-200 hover:border-teal-500 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col shadow-sm hover:shadow-2xl relative touch-pan-y min-w-0"
                         >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-100 -mr-4 -mt-4 rotate-45 transform group-hover:bg-teal-500 transition-colors z-20"></div>

                            {/* Media (image or video) */}
                            <div className="w-full aspect-video bg-neutral-100 overflow-hidden relative">
                               {(() => {
                                 const src = pub.media || pub.video || pub.image;
                                 const isVideo = typeof src === 'string' && (src.startsWith('data:video/') || /\.(mp4|webm|ogg)(\?|$)/i.test(src));
                                 return isVideo ? (
                                   <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none" />
                                 ) : (
                                   <img src={src} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none" />
                                 );
                               })()}
                               <div className="absolute top-3 left-3 flex items-center gap-2">
                                 <span className="bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-900 border border-neutral-200">
                                    {pub.year}
                                 </span>
                               </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-4 sm:p-6 flex flex-col flex-grow relative">
                               {/* Connector Line */}
                               <div className="absolute top-0 left-6 w-px h-6 bg-neutral-200 group-hover:h-full group-hover:bg-teal-500/20 transition-all duration-500"></div>

                               <div className="flex flex-wrap gap-2 mb-4 pl-4">
                                 {(Array.isArray(pub.tags) ? pub.tags : (pub.tags || '').split(',')).slice(0, 3).map((tag: string) => (
                                   <span key={tag} className="text-[10px] text-teal-600 font-mono uppercase tracking-wider bg-teal-50 px-1.5 py-0.5 rounded-sm">
                                     {tag}
                                   </span>
                                 ))}
                               </div>

                               <h3 className="text-xl font-serif text-neutral-900 mb-3 pl-4 leading-tight group-hover:text-teal-700 transition-colors">
                                  {pub.title}
                               </h3>
                               
                               <div className="mt-auto pl-4 border-l border-neutral-100 pt-4">
                                  <div className="flex justify-between items-end">
                                     <div className="text-neutral-400 text-xs font-mono">
                                        <span className="block text-neutral-500 mb-1">{pub.authors}</span>
                                        <span className="uppercase tracking-widest text-[9px]">{pub.journal}</span>
                                     </div>
                                     <div className="w-8 h-8 border border-neutral-200 flex items-center justify-center rounded-full group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-white transition-all">
                                       <ArrowUpRight className="w-4 h-4" />
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                      )}
                   />
               </div>
               
               {filteredPublications.length === 0 && (
                  <div className="py-24 text-center">
                     <div className="inline-block p-4 border border-dashed border-neutral-300 rounded-full mb-4">
                        <Filter className="w-6 h-6 text-neutral-400" />
                     </div>
                     <p className="text-neutral-500 font-mono text-sm">No research found for these filters.</p>
                     <button 
                        onClick={() => {setSelectedYear('All'); setSelectedCategory(filterCategories[0]?.label ?? 'All');}}
                        className="mt-4 text-teal-600 hover:underline text-xs uppercase tracking-widest font-bold"
                      >
                        Clear Filters
                     </button>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* Modal for Paper Details */}
      <AnimatePresence>
        {viewingPaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPaper(null)}
              onTouchMove={(e) => e.preventDefault()}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {canEditPublications && (
                  <button 
                    onClick={() => setEditingPaperInModal(true)}
                    className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors text-teal-700"
                    title="Edit publication"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => { setViewingPaper(null); setEditingPaperInModal(false); }}
                  className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-900" />
                </button>
              </div>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              {/* Media Section - Left Side (Landscape/Rectangular) */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
                {(() => {
                  const vp = viewingPaper as { media?: string; video?: string; image?: string };
                  const src = vp.media || vp.video || vp.image;
                  const isVideo = typeof src === 'string' && (src.startsWith('data:video/') || /\.(mp4|webm|ogg)(\?|$)/i.test(src));
                  return isVideo ? (
                    <video src={src} controls autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={src} alt={viewingPaper.title} className="w-full h-full object-cover" />
                  );
                })()}
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-neutral-100">
                  {viewingPaper.year}
                </div>
              </div>

              {/* Content Section - Right Side (single scroll container on mobile) */}
              <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Array.isArray(viewingPaper.tags) ? viewingPaper.tags : []).map((tag: any) => (
                        <span key={tag} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wider border border-teal-100 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                      {viewingPaper.title}
                    </h2>

                    <div className="flex flex-col gap-1 font-mono text-xs text-neutral-500 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                      <span className="text-neutral-900 font-bold">{viewingPaper.authors}</span>
                      <span>Published in {viewingPaper.journal}</span>
                    </div>

                    <div className="prose prose-neutral prose-sm max-w-none mb-8">
                      <p className="text-neutral-600 leading-relaxed text-base whitespace-pre-line">
                        {viewingPaper.abstract?.trim() || 'No abstract available.'}
                      </p>
                    </div>
                  </div>
                </div>

                <CardButtons
                  item={viewingPaper}
                  defaultButtons={[]}
                />
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EditModal
        isOpen={editingPaperInModal}
        onClose={() => setEditingPaperInModal(false)}
        onSave={handleSavePaperEdit}
        data={viewingPaper || {}}
        schema={researchPublicationSchema}
        title="Edit Publication"
      />

      {/* Categories Edit Modal */}
      <CategoriesEditModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        categories={filterCategories}
        onSave={(newCategories) => {
          updateContent('research-filter-categories', newCategories);
          setShowCategoriesModal(false);
        }}
      />
    </div>
  );
};