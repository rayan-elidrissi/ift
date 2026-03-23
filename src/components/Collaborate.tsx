import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Briefcase, Palette, FlaskConical, GraduationCap, Sparkles, Handshake } from 'lucide-react';
import { EditableContent } from './cms/EditableContent';
import { EditableCollection } from './cms/EditableCollection';
import { useCMS } from '../context/CMSContext';

type PartnerItem = {
  name: string;
  href?: string;
  logo?: string;
};
const LOGO_PLACEHOLDER = 'https://placehold.co/320x320/ffffff/a3a3a3?text=Upload+Logo';

const partners: PartnerItem[] = [
  { name: 'NVIDIA', href: 'https://www.nvidia.com/en-us/' },
  { name: 'OpenAI', href: 'https://openai.com/' },
  { name: 'ETH Zurich', href: 'https://ethz.ch/en.html' },
  { name: 'Hugging Face', href: 'https://huggingface.co/' },
  { name: 'AWS', href: 'https://aws.amazon.com/' },
  { name: 'Maxon', href: 'https://www.maxongroup.com/en' },
  { name: 'Verity', href: 'https://www.verity.net/' },
  { name: 'RIVR', href: 'https://www.rivr.ai/' },
  { name: 'Mimic Robotics', href: 'https://www.mimicrobotics.com/' },
  { name: 'LOKI Robotics', href: 'https://lokirobotics.co/' },
  { name: 'Orca', href: 'https://www.orcahand.com/' },
  { name: 'AGILE X', href: 'https://global.agilex.ai/' },
];

const collaborationTypes = [
  {
    id: '01',
    title: 'Research Collaboration',
    icon: <FlaskConical className="w-5 h-5" />,
    subtitle: 'For Research Institutions',
    description: 'Collaborate on EU projects, joint publications, and shared infrastructure. Let\'s push the boundaries of Human-Computer Interaction together through visiting scholar programs and joint supervision.',
    points: ['H2020 / Horizon Europe', 'Visiting Scholar Program', 'Shared Equipment Access', 'Joint PhD Supervision'],
    cta: 'Initiate Collaboration',
    image: 'https://images.unsplash.com/photo-1729314034609-3992728d74a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  {
    id: '02',
    title: 'Artistic Residencies',
    icon: <Palette className="w-5 h-5" />,
    subtitle: 'For Creative Visionaries',
    description: 'Our labs are your studio. Access cutting-edge robotics, AI, and fabrication tools to realize ambitious installations and performances with engineering support and exhibition opportunities.',
    points: ['3-6 Month Residencies', 'Engineering Support Team', 'Exhibition Opportunities', 'Production Grants'],
    cta: 'Apply for Residency',
    image: 'https://images.unsplash.com/photo-1764866127860-1da95e9c74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  {
    id: '03',
    title: 'Student Programs',
    icon: <GraduationCap className="w-5 h-5" />,
    subtitle: 'For Future Leaders',
    description: 'Join a community of makers and thinkers. Whether you\'re looking for a PhD position, summer school, internship, or hackathon opportunity, this is your home to build the future.',
    points: ['MSc & PhD Admissions', 'Summer Schools', 'Internship Opportunities', 'Hackathon Access'],
    cta: 'Join the Institute',
    image: 'https://images.unsplash.com/photo-1622295024745-079082431f1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    },
  {
    id: '04',
    title: 'Industry Partnerships',
    icon: <Briefcase className="w-5 h-5" />,
    subtitle: 'For Enterprise Partners',
    description: 'Partner with IFT to solve complex R&D challenges. We bridge the gap between academic research and market-ready solutions through sponsored research, student project sourcing, and technology transfer.',
    points: ['Sponsored Research Chairs', 'Student Project Sourcing', 'Executive Education & Training', 'Technology Transfer'],
    cta: 'Become a Partner',
    image: 'https://images.unsplash.com/photo-1600068485133-e0ef65324a22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    }
];

const CollaborateSkeleton = () => (
  <div className="bg-white min-h-screen animate-pulse">
    <section className="max-w-[1920px] mx-auto min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-6 lg:p-12 xl:p-20 pt-16 md:pt-20 lg:pt-24 flex flex-col justify-center">
        <div className="mb-6">
          <div className="h-12 md:h-16 bg-neutral-200 rounded w-60 mb-4" />
          <div className="space-y-2 mb-12 max-w-xl">
            <div className="h-5 bg-neutral-100 rounded w-full" />
            <div className="h-5 bg-neutral-100 rounded w-3/4" />
          </div>
          <div className="h-4 bg-neutral-100 rounded w-48 mb-2" />
        </div>
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-8 border-t border-neutral-200 flex items-baseline gap-8 px-4">
              <div className="h-4 w-6 bg-neutral-100 rounded" />
              <div className="h-7 bg-neutral-200 rounded w-52" />
            </div>
          ))}
          <div className="border-t border-neutral-200" />
        </div>
      </div>
      <div className="lg:w-1/2 lg:h-screen bg-neutral-100 hidden lg:block" />
    </section>
  </div>
);

export const Collaborate = () => {
  const { getContent, isEditing, isLoading, hasCache } = useCMS();

  const allCollabTypes = getContent('collaborate-types', collaborationTypes.map(({icon, ...rest}) => rest)) as Array<Omit<typeof collaborationTypes[0], 'icon'>>;
  const rawPartners = getContent('collaborate-partners', partners);
  const allPartners: PartnerItem[] = (Array.isArray(rawPartners) ? rawPartners : partners).map((p: unknown) => {
    if (typeof p === 'string') return { name: p };
    if (p && typeof p === 'object') {
      const obj = p as { name?: string; href?: string; logo?: string };
      return { name: obj.name ?? '', href: obj.href, logo: obj.logo };
    }
    return { name: '' };
  }).filter((p) => p.name);
  const iconMap: Record<string, React.ReactNode> = {
    '01': <FlaskConical className="w-5 h-5" />,
    '02': <Palette className="w-5 h-5" />,
    '03': <GraduationCap className="w-5 h-5" />,
    '04': <Briefcase className="w-5 h-5" />,
  };
  const collabTypesWithIcons = allCollabTypes.map(t => {
    const pts = t.points as string[] | string | undefined;
    const pointsArr = Array.isArray(pts) ? pts : (typeof pts === 'string' ? pts.split(',').map((s: string) => s.trim()) : []);
    return { ...t, icon: iconMap[t.id] || <Sparkles className="w-5 h-5" />, points: pointsArr };
  });
  const [activeType, setActiveType] = useState(collabTypesWithIcons[0]);
  const [isHoveringList, setIsHoveringList] = useState(false);

  if (isLoading && !hasCache) {
    return <CollaborateSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900 font-sans selection:bg-teal-200 selection:text-black pb-8 overflow-x-hidden">

      {/* COLLABORATION TYPES HERO SECTION */}
      <section className="max-w-[1920px] mx-auto min-h-screen flex flex-col lg:flex-row relative z-10">
        {/* LEFT COLUMN: List */}
        <div className="lg:w-1/2 p-6 lg:p-12 xl:p-20 pt-16 md:pt-20 lg:pt-24 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-neutral-900 leading-[0.9] uppercase"
              role="heading"
              aria-level={1}
            >
              <EditableContent
                id="collaborate-title"
                defaultContent="Collaborate"
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
                id="collaborate-tagline"
                defaultContent="Building the future together. Select your profile to discover how we can collaborate and create meaningful impact through technology."
                enableProse={false}
                className="[&_p]:m-0"
              />
            </motion.div>

            <div className="font-mono text-sm uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <EditableContent
                id="collaborate-pathways-label"
                defaultContent="Collaboration Pathways"
                enableProse={false}
                className="[&_p]:inline [&_p]:m-0"
              />
            </div>
          </div>

          <div
            className="space-y-0 min-h-[300px]"
            onMouseEnter={() => setIsHoveringList(true)}
            onMouseLeave={() => setIsHoveringList(false)}
          >
            <EditableCollection
              id="collaborate-types"
              defaultData={collaborationTypes.map(({ icon, ...rest }) => rest)}
              containerClassName="space-y-0 min-h-[300px]"
              schema={[
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'subtitle', label: 'Subtitle', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'points', label: 'Points (comma separated)', type: 'text' },
                { key: 'cta', label: 'CTA Button Text', type: 'text' },
                { key: 'cta_url', label: 'CTA URL (/page or https://...)', type: 'text' },
                { key: 'image', label: 'Image', type: 'image' },
              ]}
              renderItem={(type: any, index: number, _isEditing: boolean) => {
                const icon = iconMap[type.id] || <Sparkles className="w-5 h-5" />;
                const typeWithIcon = {
                  ...type,
                  icon,
                  points: Array.isArray(type.points)
                    ? type.points
                    : typeof type.points === 'string'
                      ? type.points.split(',').map((s: string) => s.trim())
                      : [],
                };
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setActiveType(typeWithIcon)}
                    className={`group relative py-8 border-t border-neutral-200 cursor-pointer transition-all duration-300 ${
                      activeType.id === type.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <div className="flex items-baseline justify-between relative z-10 px-4">
                      <div className="flex items-baseline gap-8">
                        <span
                          className={`font-mono text-xs transition-colors duration-300 ${
                            activeType.id === type.id ? 'text-teal-600' : 'text-neutral-400'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-4">
                          <span
                            className={`transition-colors duration-300 ${
                              activeType.id === type.id ? 'text-teal-600' : 'text-neutral-400'
                            }`}
                          >
                            {icon}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-light group-hover:translate-x-4 transition-transform duration-500 ease-out text-neutral-900">
                            {type.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {activeType.id === type.id && (
                      <motion.div
                        layoutId="activeLine"
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-teal-600"
                      />
                    )}
                  </motion.div>
                );
              }}
            />
            <div className="border-t border-neutral-200" />
          </div>
        </div>

        {/* RIGHT COLUMN: Preview (Sticky) */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-neutral-100 relative overflow-hidden hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={activeType.image}
                  alt={activeType.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content Card */}
              <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-16">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-2xl"
                >
                  {/* Glass Card */}
                  <div className="bg-white/95 backdrop-blur-md p-8 xl:p-10 border border-white/50 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 border border-teal-200 bg-teal-50 text-teal-800 text-[10px] font-mono uppercase tracking-widest rounded-full">
                        {activeType.subtitle}
                      </span>
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-serif font-light mb-4 leading-tight text-neutral-900">
                      {activeType.title}
                    </h2>

                    <p className="text-neutral-600 font-sans leading-relaxed text-sm mb-6 border-l-2 border-teal-600 pl-6">
                      {activeType.description}
                    </p>

                    <div className="grid grid-cols-1 gap-3 mb-8">
                      {activeType.points.map((point, i) => (
                        <div key={i} className="flex items-start gap-3 text-neutral-600">
                          <Sparkles className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-mono tracking-wide">{point}</span>
                        </div>
                      ))}
                    </div>

                    <motion.a
                      href="mailto:ift@devinci.fr"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-neutral-900 text-white px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-teal-600 transition-all duration-300 flex items-center gap-3 w-fit group shadow-lg hover:shadow-2xl hover:shadow-teal-500/20 relative overflow-hidden"
                    >
                      <span className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-700 ease-out"></span>
                      <span className="relative z-10">{activeType.cta}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform relative z-10" />
                    </motion.a>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* PARTNERS SECTION (Team-style) */}
      <section className="pt-16 pb-24 md:pt-20 md:pb-32 bg-neutral-950 text-white relative font-serif overflow-hidden">
        <div className="absolute top-0 left-0 right-0 w-full h-px bg-neutral-800" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Simple Header - matches Team */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] uppercase mb-4">
                <EditableContent
                  id="collaborate-partners-prefix"
                  defaultContent="The"
                  enableProse={false}
                  className="[&_p]:inline [&_p]:m-0"
                />{' '}
                <span className="text-teal-500 italic">
                  <EditableContent
                    id="collaborate-partners-highlight"
                    defaultContent="Partners"
                    enableProse={false}
                    className="[&_p]:inline [&_p]:m-0"
                  />
                </span>
              </h3>
              <EditableContent
                id="collaborate-partners-subtitle"
                defaultContent="Institutions, Labs, and Industry Leaders"
                enableProse={false}
                className="font-sans text-neutral-400 text-sm tracking-wide uppercase [&_p]:m-0"
              />
            </motion.div>
          </div>

          <EditableCollection
            id="collaborate-partners"
            defaultData={partners.map((p, i) => ({ id: String(i), name: p.name, href: p.href ?? '', logo: p.logo ?? '' }))}
            containerClassName="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8"
            schema={[
              { key: 'name', label: 'Partner Name', type: 'text' },
              { key: 'href', label: 'Partner URL', type: 'text' },
              { key: 'logo', label: 'Logo Image', type: 'image' },
            ]}
            renderItem={(partner: any, index: number) => (
              <motion.a
                href={isEditing ? undefined : (partner.href || '#')}
                onClick={isEditing ? (e) => e.preventDefault() : undefined}
                target={partner.href && !isEditing ? '_blank' : undefined}
                rel={partner.href && !isEditing ? 'noopener noreferrer' : undefined}
                aria-label={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                className="group relative cursor-pointer block min-w-0"
              >
                <div className="relative aspect-square mb-3 overflow-hidden bg-neutral-900 rounded-sm">
                  <img
                    src={partner.logo || LOGO_PLACEHOLDER}
                    alt={partner.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-4 transition-all duration-700 ease-out transform group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  {!partner.logo && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="text-[10px] uppercase tracking-wide font-sans text-neutral-500 text-center">Upload logo</span>
                    </div>
                  )}
                </div>
              </motion.a>
            )}
          />
        </div>
      </section>
    </div>
  );
};