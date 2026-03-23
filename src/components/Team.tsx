import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, ArrowUpRight, X } from 'lucide-react';
import { EditableCollection } from './cms/EditableCollection';
import { EditableContent } from './cms/EditableContent';
import { useCMS } from '../context/CMSContext';
import { EditableLink } from './cms/EditableLink';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
// Placeholder image (replace with real assets when ready)
const PLACEHOLDER_AVATAR = 'https://placehold.co/300x400/f5f5f5/999?text=Photo';

const xiaoXiaoImage = PLACEHOLDER_AVATAR;
const marcImage = PLACEHOLDER_AVATAR;
const marianaImage = PLACEHOLDER_AVATAR;
const paulPeterImage = PLACEHOLDER_AVATAR;
const vivienImage = PLACEHOLDER_AVATAR;
const thomasImage = PLACEHOLDER_AVATAR;
const louisImage = PLACEHOLDER_AVATAR;
const gaelImage = PLACEHOLDER_AVATAR;
const antoineImage = PLACEHOLDER_AVATAR;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  details: string;
  bio: string;
  image: string;
}

const coreTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Xiao Xiao",
    role: "Director",
    details: "HCI Researcher, Creative Technologist, Thereminist",
    bio: "Leads interdisciplinary research connecting human-computer interaction, creative technology, and performative practices.",
    image: xiaoXiaoImage
  },
  {
    id: "2",
    name: "Marc Teyssier",
    role: "Deputy Director",
    details: "Future Interfaces & Bioengineering",
    bio: "Explores the frontier of interactive systems and bioengineering to design new forms of embodied interaction.",
    image: marcImage
  },
  {
    id: "3",
    name: "Mariana Tamashiro",
    role: "Postdoc Researcher",
    details: "Technology, Learning, Emotions",
    bio: "Investigates how technology can support learning experiences while accounting for emotional and social dimensions.",
    image: marianaImage
  },
  {
    id: "4",
    name: "Paul-Peter Arslan",
    role: "PhD Student",
    details: "Neurosciences & AI",
    bio: "Researches the intersection of neuroscience and AI for adaptive and human-centered intelligent systems.",
    image: paulPeterImage
  },
  {
    id: "5",
    name: "Vivien Roussel",
    role: "PhD Student",
    details: "Art & Bioengineering",
    bio: "Develops experimental practices that merge artistic creation with bioengineering methods and materials.",
    image: vivienImage
  },
  {
    id: "6",
    name: "Thomas Juldo",
    role: "PhD Student",
    details: "Swarm Robotics",
    bio: "Designs collective robotic systems with a focus on resilience, coordination, and real-world applications.",
    image: thomasImage
  },
  {
    id: "7",
    name: "Louis Badr",
    role: "PhD Student",
    details: "Haptics & Interaction",
    bio: "Builds tactile interaction paradigms that enrich digital experiences through advanced haptic feedback.",
    image: louisImage
  },
  {
    id: "10",
    name: "Rayan El Idrissi",
    role: "Graduate Research Student",
    details: "",
    bio: "Graduate research student contributing to human-centered technology projects and collaborative lab initiatives.",
    image: PLACEHOLDER_AVATAR
  },
];

const affiliatedTeamMembers: TeamMember[] = [
  {
    id: "8",
    name: "Gaël Musquet",
    role: "Principal Advisor",
    details: "Crisis Management & Disaster Response Technology",
    bio: "Advises on technology strategies for crisis preparedness and disaster response in complex operational contexts.",
    image: gaelImage
  },
  {
    id: "9",
    name: "Antoine Pradoura",
    role: "Principal Advisor",
    details: "Strategic Development & Innovation",
    bio: "Supports strategic growth and innovation pathways connecting research, education, and industry partnerships.",
    image: antoineImage
  },
];

export const Team = () => {
  const { isEditing } = useCMS();
  const [activeMember, setActiveMember] = React.useState<TeamMember | null>(null);

  useBodyScrollLock(!!activeMember);

  return (
    <section className="pt-16 pb-24 md:pt-20 md:pb-24 bg-neutral-950 text-white relative font-serif overflow-hidden">
      {/* Divider with breathing room above */}
      <div className="absolute top-0 left-0 right-0 w-full h-px bg-neutral-800" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto px-6">
        
          {/* Simple Header */}
          <div className="mb-12 text-center">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
             >
                <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] uppercase mb-4">
                  <EditableContent 
                    id="team-title-prefix"
                    defaultContent="The"
                    enableProse={false}
                    className="[&_p]:inline [&_p]:m-0"
                  />{' '}
                  <span className="text-teal-500 italic">
                    <EditableContent 
                      id="team-title-highlight"
                      defaultContent="Team"
                      enableProse={false}
                      className="[&_p]:inline [&_p]:m-0"
                    />
                  </span>
                </h3>
                <EditableContent 
                  id="team-subtitle"
                  defaultContent="Visionaries, Engineers, and Artists"
                  enableProse={false}
                  className="font-sans text-neutral-400 text-sm tracking-wide uppercase [&_p]:m-0"
                />
             </motion.div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-sans uppercase tracking-widest text-neutral-500">Core Team</h4>
          </div>
          <EditableCollection
            id="team-members-core"
            defaultData={coreTeamMembers}
            containerClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-x-4 md:gap-y-8"
            schema={[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'role', label: 'Role/Title', type: 'text' },
              { key: 'details', label: 'Details', type: 'text' },
              { key: 'bio', label: 'Bio', type: 'textarea' },
              { key: 'image', label: 'Image', type: 'image' },
            ]}
            renderItem={(member, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                className="group relative cursor-pointer"
                onClick={() => !isEditing && setActiveMember(member as TeamMember)}
              >
                <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-neutral-900 rounded-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button className="bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-teal-500 transition-colors">
                      <Linkedin className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-left min-w-0">
                  <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{member.name}</h4>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-neutral-500 group-hover:text-teal-500 transition-colors">{member.role}</p>
                </div>
              </motion.div>
            )}
          />

          <div className="mt-12 mb-6">
            <h4 className="text-sm font-sans uppercase tracking-widest text-neutral-500">Affiliated</h4>
          </div>
          <EditableCollection
            id="team-members-affiliated"
            defaultData={affiliatedTeamMembers}
            containerClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-x-4 md:gap-y-8"
            schema={[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'role', label: 'Role/Title', type: 'text' },
              { key: 'details', label: 'Details', type: 'text' },
              { key: 'bio', label: 'Bio', type: 'textarea' },
              { key: 'image', label: 'Image', type: 'image' },
            ]}
            renderItem={(member, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                className="group relative cursor-pointer"
                onClick={() => !isEditing && setActiveMember(member as TeamMember)}
              >
                <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-neutral-900 rounded-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button className="bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-teal-500 transition-colors">
                      <Linkedin className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-left min-w-0">
                  <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{member.name}</h4>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-neutral-500 group-hover:text-teal-500 transition-colors">{member.role}</p>
                </div>
              </motion.div>
            )}
          />

          {/* Join Us Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <EditableLink
              id="team-cta-link"
              defaultHref="/collaborate"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-teal-500 transition-colors group"
            >
              <EditableContent
                id="team-cta-title"
                defaultContent="Interested in joining our team?"
                enableProse={false}
              />
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </EditableLink>
          </motion.div>
      </div>

      <AnimatePresence>
        {activeMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMember(null)}
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
                onClick={() => setActiveMember(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/60 hover:bg-white rounded-full transition-colors"
                aria-label="Close team member details"
              >
                <X className="w-5 h-5 text-neutral-900" />
              </button>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto bg-neutral-100">
                <img
                  src={activeMember.image}
                  alt={activeMember.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto text-neutral-900">
                <p className="text-xs font-mono uppercase tracking-widest text-teal-700 mb-3">
                  Team Member
                </p>
                <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-2">
                  {activeMember.name}
                </h3>
                <p className="text-sm font-sans uppercase tracking-wider text-neutral-500 mb-4">
                  {activeMember.role}
                </p>
                {activeMember.details && (
                  <p className="text-sm text-neutral-600 mb-6 border-l-2 border-teal-500 pl-4">
                    {activeMember.details}
                  </p>
                )}
                <p className="text-base leading-relaxed text-neutral-700 whitespace-pre-line">
                  {activeMember.bio || 'Bio coming soon.'}
                </p>
              </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};