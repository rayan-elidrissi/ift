import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  ArrowRight,
  Check,
  Code,
  Cpu,
  PenTool,
  Globe,
  Rocket,
  Zap,
  Microscope,
  Layers,
  Briefcase,
  X,
  ExternalLink,
  Users,
  Edit2,
  Save,
} from "lucide-react";
import { EditableContent } from "./cms/EditableContent";
import { EditableCollection } from "./cms/EditableCollection";
import { EditableImageSingle } from "./cms/EditableImageSingle";
import { useCMS } from "../context/CMSContext";

const educationPrograms = [
  {
    id: "01",
    title: "Engineer Track",
    description:
      "Master advanced system architectures, functional analysis, and large-scale manufacturing. Tailored for students with an engineering background from ESILV.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1080&auto=format&fit=crop",
    tags: ["Systems", "Architecture", "ESILV"],
  },
  {
    id: "02",
    title: "Designer Track",
    description:
      "Focus on product design, user experience analysis, and technology management. Designed for students with a creative background from IIM.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1080&auto=format&fit=crop",
    tags: ["UX/UI", "Product Design", "IIM"],
  },
  {
    id: "03",
    title: "PhD Program",
    description:
      "Push the boundaries of knowledge in Human-Computer Interaction, AI, and Soft Robotics. Join a world-class research lab and contribute to scientific publications.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1080&auto=format&fit=crop",
    tags: ["Research", "Publication", "Innovation"],
  },
];

export const defaultStudentProjects = [
  {
    id: "p1",
    title: "Bionic Prosthetics",
    student: "Class of 2024",
    image:
      "https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    video: "",
    description: "Advanced bionic prosthetic limbs featuring neural interface technology for natural movement control. This project combines cutting-edge robotics with biomedical engineering to create accessible, affordable prosthetics.",
    tags: ["Biomedical", "Robotics", "AI"],
    team: ["Sarah Chen", "Marcus Johnson"],
    supervisor: "Dr. Lisa Badr",
    visible: "shown",
  },
  {
    id: "p2",
    title: "Interactive Light Field",
    student: "Class of 2025",
    image:
      "https://images.unsplash.com/photo-1768026058295-caf3636c61ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    video: "",
    description: "An immersive light field display system that creates volumetric 3D projections without the need for special glasses. This breakthrough in display technology opens new possibilities for collaborative design and visualization.",
    tags: ["Display Tech", "3D", "Optics"],
    team: ["Alex Rivera", "Kim Park"],
    supervisor: "Prof. Marc Teyssier",
    visible: "shown",
  },
  {
    id: "p3",
    title: "Sustainable Wearables",
    student: "Class of 2023",
    image:
      "https://images.unsplash.com/photo-1762768727350-7f2b1d559a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    video: "",
    description: "Biodegradable smart wearables made from sustainable materials. These devices monitor health metrics while minimizing environmental impact through innovative material science and circular design principles.",
    tags: ["Sustainability", "Wearables", "Materials"],
    team: ["Jordan Lee", "Emma Wilson"],
    supervisor: "Dr. Sarah Chen",
    visible: "shown",
  },
  {
    id: "p4",
    title: "Bio-Material Research",
    student: "Class of 2024",
    image:
      "https://images.unsplash.com/photo-1755401641824-6d2dee89e576?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    video: "",
    description: "Exploring living materials that can self-heal and adapt to their environment. This research combines synthetic biology with material science to create responsive, sustainable building materials.",
    tags: ["Bio-Materials", "Synthetic Biology", "Innovation"],
    team: ["Michael Zhang"],
    supervisor: "Dr. Lisa Badr",
    visible: "shown",
  },
  {
    id: "p5",
    title: "VR Education Platform",
    student: "Class of 2025",
    image:
      "https://images.unsplash.com/photo-1459550532302-ba13832edcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    video: "",
    description: "An immersive virtual reality platform designed to make complex scientific concepts accessible through interactive 3D visualizations. Students can explore molecular structures, physics simulations, and historical events in unprecedented detail.",
    tags: ["VR", "Education", "Interaction"],
    team: ["Taylor Brown", "Chris Anderson"],
    supervisor: "Prof. Antoine Prouzeau",
    visible: "shown",
  },
  {
    id: "p6",
    title: "Future Mobility",
    student: "Class of 2024",
    image:
      "https://images.unsplash.com/photo-1709492402208-51e6723ab513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    video: "",
    description: "Autonomous urban mobility system that combines electric vehicles, AI navigation, and sustainable infrastructure. This project reimagines city transportation for the carbon-neutral future.",
    tags: ["Mobility", "AI", "Sustainability"],
    team: ["Jamie Martinez", "Sam Taylor"],
    supervisor: "Dr. Kevin Lee",
    visible: "shown",
  },
];

const EducationSkeleton = () => (
  <div className="bg-white min-h-screen text-neutral-900 font-sans animate-pulse">
    <section className="max-w-[1920px] mx-auto min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-6 lg:p-12 xl:p-20 pt-16 md:pt-20 lg:pt-24 flex flex-col justify-center border-r border-neutral-200">
        <div className="mb-6">
          <div className="h-12 md:h-16 bg-neutral-200 rounded w-64 mb-4" />
          <div className="space-y-2 mb-12 max-w-xl">
            <div className="h-5 bg-neutral-100 rounded w-full" />
            <div className="h-5 bg-neutral-100 rounded w-3/4" />
          </div>
          <div className="h-4 bg-neutral-100 rounded w-36 mb-2" />
        </div>
        <div className="space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-8 border-t border-neutral-200 flex items-baseline gap-8 px-4">
              <div className="h-4 w-6 bg-neutral-100 rounded" />
              <div className="h-7 bg-neutral-200 rounded w-48" />
            </div>
          ))}
          <div className="border-t border-neutral-200" />
        </div>
      </div>
      <div className="lg:w-1/2 lg:h-screen bg-neutral-100 hidden lg:block" />
    </section>
  </div>
);

export const Education = () => {
  const { isEditing, getContent, updateContent, isLoading, hasCache } = useCMS();

  const allPrograms = getContent('edu-programs', educationPrograms) as typeof educationPrograms;
  const allProjects = getContent('edu-student-projects', defaultStudentProjects) as typeof defaultStudentProjects;
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const activeProgram = (activeProgramId ? allPrograms.find(p => p.id === activeProgramId) : null) ?? allPrograms[0] ?? educationPrograms[0];
  const [isHoveringList, setIsHoveringList] = useState(false);
  const [viewingProject, setViewingProject] = useState<typeof defaultStudentProjects[0] | null>(null);
  const [editingProjectInModal, setEditingProjectInModal] = useState(false);
  const [editProjectForm, setEditProjectForm] = useState<Record<string, unknown>>({});
  const [isProjectDescriptionExpanded, setIsProjectDescriptionExpanded] = useState(false);
  const [hasProjectDescriptionOverflow, setHasProjectDescriptionOverflow] = useState(false);
  const projectDescriptionRef = useRef<HTMLDivElement | null>(null);

  useBodyScrollLock(!!viewingProject);

  React.useEffect(() => {
    if (viewingProject) {
      setIsProjectDescriptionExpanded(false);
    }
  }, [viewingProject]);

  React.useEffect(() => {
    if (editingProjectInModal && viewingProject) {
      setEditProjectForm({
        ...viewingProject,
        tags: Array.isArray(viewingProject.tags) ? viewingProject.tags.join(", ") : (viewingProject.tags || ""),
        team: Array.isArray(viewingProject.team) ? viewingProject.team.join(", ") : (viewingProject.team || ""),
        supervisor: Array.isArray(viewingProject.supervisor) ? viewingProject.supervisor.join(", ") : (viewingProject.supervisor || ""),
      });
    } else {
      setEditingProjectInModal(false);
    }
  }, [editingProjectInModal, viewingProject]);

  const handleSaveProjectEdit = () => {
    if (!viewingProject) return;
    const tagsVal = editProjectForm.tags;
    const teamVal = editProjectForm.team;
    const supervisorVal = editProjectForm.supervisor;
    const updated = {
      ...viewingProject,
      ...editProjectForm,
      tags: (typeof tagsVal === "string" ? tagsVal.split(",").map((s: string) => s.trim()).filter(Boolean) : tagsVal) as string[],
      team: (typeof teamVal === "string" ? teamVal.split(",").map((s: string) => s.trim()).filter(Boolean) : teamVal) as string[],
      supervisor: (typeof supervisorVal === "string" ? supervisorVal.split(",").map((s: string) => s.trim()).filter(Boolean) : supervisorVal) as string[],
    };
    const newProjects = allProjects.map((p) => (p.id === viewingProject.id ? updated : p));
    updateContent("edu-student-projects", newProjects);
    setViewingProject(updated as unknown as typeof defaultStudentProjects[0]);
    setEditingProjectInModal(false);
  };

  React.useEffect(() => {
    if (!viewingProject || isProjectDescriptionExpanded) {
      setHasProjectDescriptionOverflow(false);
      return;
    }

    const checkOverflow = () => {
      const el = projectDescriptionRef.current;
      if (!el) return;
      setHasProjectDescriptionOverflow(el.scrollHeight > el.clientHeight + 1);
    };

    const frame = requestAnimationFrame(checkOverflow);
    window.addEventListener("resize", checkOverflow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [viewingProject, isProjectDescriptionExpanded]);

  if (isLoading && !hasCache) {
    return <EducationSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900 font-sans selection:bg-teal-200 selection:text-black pb-8 overflow-x-hidden">

      {/* FEATURED PROGRAMS HERO SECTION */}
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
                id="education-title"
                defaultContent="Education"
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
                id="education-tagline"
                defaultContent="Where Engineering meets Design. We train the next generation of creative technologists to build the tools that shape the future."
                enableProse={false}
                className="[&_p]:m-0"
              />
            </motion.div>

            <div className="font-mono text-sm uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <EditableContent
                id="education-academic-tracks-label"
                defaultContent="Academic Tracks"
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
              id="edu-programs"
              defaultData={educationPrograms}
              containerClassName="space-y-0 min-h-[300px]"
              schema={[
                { key: 'title', label: 'Program Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'image', label: 'Image', type: 'image' },
                { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
                { key: 'link', label: 'Learn More URL (optional)', type: 'text' },
              ]}
              renderItem={(program: any, index: number) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setActiveProgramId(program.id)}
                  className={`py-8 border-t border-neutral-200 cursor-pointer transition-all duration-300 ${activeProgram.id === program.id ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  <div className="flex items-baseline justify-between relative z-10 px-4">
                    <div className="flex items-baseline gap-8">
                      <span
                        className={`font-mono text-xs transition-colors duration-300 ${activeProgram.id === program.id ? "text-teal-600" : "text-neutral-400"}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-light group-hover:translate-x-4 transition-transform duration-500 ease-out text-neutral-900">
                        {program.title}
                      </h3>
                    </div>
                  </div>

                  {activeProgram.id === program.id && (
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
              key={activeProgram.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeProgram.image}
                alt={activeProgram.title}
                className="w-full h-full object-cover opacity-100 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-10 p-12 lg:p-20 flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProgram.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white/90 backdrop-blur-md p-8 md:p-12 border border-white/50 shadow-2xl"
              >
                {(() => {
                  const tagList = Array.isArray(activeProgram.tags)
                    ? activeProgram.tags
                    : ((activeProgram.tags as unknown as string) || "")
                      .split(",")
                      .map((t: string) => t.trim())
                      .filter(Boolean);
                  return tagList.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tagList.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 border border-teal-200 bg-teal-50 rounded-full text-[10px] uppercase tracking-wider text-teal-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null;
                })()}

                <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-6 text-neutral-900">
                  {activeProgram.title}
                </h2>

                <p className="text-neutral-700 font-sans leading-relaxed text-sm md:text-base mb-4 border-l-2 border-teal-600 pl-6">
                  {activeProgram.description}
                </p>

                {(activeProgram as { link?: string }).link && (
                  <a
                    href={(activeProgram as { link?: string }).link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal-800 hover:text-teal-600 transition-colors"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-8 right-8 font-mono text-[100px] leading-none text-white/20 font-bold z-0 mix-blend-overlay">
            {String((allPrograms.findIndex((p) => p.id === activeProgram.id) ?? 0) + 1).padStart(2, "0")}
          </div>
        </div>

        <style>{`
          .writing-vertical-rl {
            writing-mode: vertical-rl;
          }
        `}</style>
      </section>

      {/* CURSUS & METHODOLOGY */}
      <section className="pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-12 xl:px-20 max-w-[1920px] mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-neutral-200 relative overflow-hidden">
              <div className="absolute inset-0">
                <EditableImageSingle
                  id="education-demo-or-die-image"
                  defaultImage="https://images.unsplash.com/photo-1755053757912-a63da9d6e0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Demo or Die - Student Prototyping"
                  className="h-full w-full [&_img]:object-cover [&_img]:transition-all [&_img]:duration-700"
                />
              </div>
              <div className="absolute bottom-6 left-6 bg-white/90 p-4 backdrop-blur shadow-lg z-10">
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-1">
                  Methodology
                </p>
                <p className="font-serif text-xl text-neutral-900">
                  Demo or Die
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="text-4xl md:text-6xl font-serif mb-8 text-neutral-900" role="heading" aria-level={2}>
              <EditableContent
                id="education-cursus-title"
                defaultContent="Cursus & Philosophy"
                enableProse={false}
                className="[&_p]:m-0"
              />
            </div>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="relative w-12 h-12 flex-shrink-0 bg-teal-50 text-teal-700 flex items-center justify-center rounded-full">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold mb-2" role="heading" aria-level={3}>
                    <EditableContent
                      id="education-cursus-innovation-title"
                      defaultContent="Innovation & Autonomy"
                      enableProse={false}
                      className="[&_p]:m-0"
                    />
                  </div>
                  <div className="text-neutral-600 leading-relaxed">
                    <EditableContent
                      id="edu-phil-1"
                      defaultContent="One primary goal is to develop learning methods and strategies to foster autonomy. Every course's evaluation is related to a project development: conducting research, large-scale manufacturing with a Kickstarter campaign, or developing disruptive innovations."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="relative w-12 h-12 flex-shrink-0 bg-teal-50 text-teal-700 flex items-center justify-center rounded-full">
                  <Microscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <EditableContent
                      id="education-cursus-research-led-title"
                      defaultContent="Research-Led Groups"
                      enableProse={false}
                      className="[&_p]:m-0"
                    />
                  </h3>
                  <div className="text-neutral-600 leading-relaxed">
                    <EditableContent
                      id="edu-phil-2"
                      defaultContent="Each student is part of an innovative group leaded by a Principal Investigator who follows their work on a daily basis. Our researchers come from MIT, Royal College of London, EPFL, Google, and Formlabs."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="relative w-12 h-12 flex-shrink-0 bg-teal-50 text-teal-700 flex items-center justify-center rounded-full">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <EditableContent
                      id="education-cursus-valorization-title"
                      defaultContent="Real-World Valorization"
                      enableProse={false}
                      className="[&_p]:m-0"
                    />
                  </h3>
                  <div className="text-neutral-600 leading-relaxed">
                    <EditableContent
                      id="edu-phil-3"
                      defaultContent="Every student's production is valorized in research publications, press communications, company partnerships, or startups. Inspired by the MIT Media Lab leitmotiv 'Demo or Die', students maintain an operational project demonstration at all times."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT PROJECTS GALLERY — extra top spacing from Learning at IFT above, bottom for floating edit button */}
      <section className="bg-neutral-900 text-white pt-32 md:pt-40 pb-24 md:pb-32 z-10 relative">
        <div className="px-6 md:px-12 xl:px-20 max-w-[1920px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif mb-4">
                Featured Student Projects
              </h2>
              <p className="text-neutral-400 font-mono">
                MADE_AT_IFT
              </p>
            </div>
            {/* <button className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:text-teal-400 transition-colors">
                  View All Projects <ArrowRight className="w-4 h-4" />
               </button> */}
          </div>

          <EditableCollection
            id="edu-student-projects"
            defaultData={defaultStudentProjects}
            containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            schema={[
              {
                key: "title",
                label: "Project Title",
                type: "text",
              },
              {
                key: "student",
                label: "Student / Class",
                type: "text",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
              },
              {
                key: "tags",
                label: "Tags (comma separated)",
                type: "text",
              },
              {
                key: "team",
                label: "Team - Students (comma separated)",
                type: "text",
              },
              {
                key: "supervisor",
                label: "Supervisor - Staff (comma separated)",
                type: "text",
              },
              {
                key: "image",
                label: "Image",
                type: "image",
              },
              {
                key: "video",
                label: "Video (Optional)",
                type: "video",
              },
              {
                key: "visible",
                label: "Visibility (shown / hidden)",
                type: "text",
              },
            ]}
          renderItem={(project: any, index: number, isEditingCollection: boolean) => {
            const isVisible = (project.visible ?? "shown") !== "hidden";
            if (!isVisible && !isEditingCollection) {
              return null;
            }
            return (
              <div 
                className={`group relative aspect-[4/3] overflow-hidden cursor-pointer h-full min-w-0 touch-pan-y ${
                  isVisible ? "bg-neutral-800" : "bg-neutral-900/50 opacity-60"
                }`}
                onClick={() => setViewingProject(project)}
              >
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 pointer-events-none"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 pointer-events-none select-none"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-teal-400 font-mono text-xs uppercase tracking-widest mb-1">
                    {project.student}
                  </p>
                  <h3 className="text-xl font-serif text-white">
                    {project.title}
                  </h3>
                  {!isVisible && isEditing && (
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-red-300">
                      Hidden
                    </p>
                  )}
                </div>
              </div>
            );
          }}
          />
        </div>
      </section>

      {/* Modal for Student Project Details */}
      <AnimatePresence>
        {viewingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setViewingProject(null);
                setEditingProjectInModal(false);
              }}
              onTouchMove={(e) => e.preventDefault()}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {isEditing && !editingProjectInModal && (
                  <button
                    onClick={() => setEditingProjectInModal(true)}
                    className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors text-teal-700"
                    title="Edit project"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewingProject(null);
                    setEditingProjectInModal(false);
                  }}
                  className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-900" />
                </button>
              </div>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              {/* Media Section - Left Side */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
                {viewingProject.video ? (
                  <video
                    src={viewingProject.video}
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
                  Student Project
                </div>
              </div>

              {/* Content Section - Right Side */}
              <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
                {editingProjectInModal ? (
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
                    {["title", "student", "description", "tags", "team", "supervisor"].map((key) => (
                      <div key={key}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          {key === "tags" ? "Tags (comma separated)" : key === "team" ? "Team - Students (comma separated)" : key === "supervisor" ? "Supervisor - Staff (comma separated)" : key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        {key === "description" ? (
                          <textarea
                            value={(editProjectForm[key] as string) || ""}
                            onChange={(e) => setEditProjectForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full p-3 border border-neutral-300 rounded-lg text-sm min-h-[120px]"
                            placeholder={key === "description" ? "Project description..." : ""}
                          />
                        ) : (
                          <input
                            type="text"
                            value={(editProjectForm[key] as string) || ""}
                            onChange={(e) => setEditProjectForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full p-3 border border-neutral-300 rounded-lg text-sm"
                            placeholder={key === "tags" ? "Biomedical, Robotics, AI" : key === "team" ? "Student 1, Student 2" : key === "supervisor" ? "Dr. Name, Prof. Name" : ""}
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProjectEdit}
                        className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingProjectInModal(false)}
                        className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                      <div className="mb-6">
                        <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                          {viewingProject.title}
                        </h2>

                        <div className="flex flex-col gap-2 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                          <div className="flex items-center gap-2 text-sm text-neutral-600 font-mono">
                            <Users className="w-4 h-4 text-teal-600" />
                            <span className="font-bold text-neutral-900">{viewingProject.student}</span>
                          </div>
                        </div>

                        <div className="prose prose-neutral prose-sm max-w-none mb-8">
                          <div className="relative">
                            <div
                              ref={projectDescriptionRef}
                              className={`text-neutral-600 leading-relaxed text-base transition-all ${
                                isProjectDescriptionExpanded ? "max-h-64 overflow-y-auto pr-2" : "max-h-28 overflow-hidden"
                              }`}
                            >
                              <p>{viewingProject.description?.trim() || "No description available."}</p>
                            </div>

                            {!isProjectDescriptionExpanded && hasProjectDescriptionOverflow && (
                              <>
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/95 to-transparent" />
                                <button
                                  type="button"
                                  onClick={() => setIsProjectDescriptionExpanded(true)}
                                  className="absolute bottom-1 right-1 font-mono text-sm text-teal-700 hover:text-teal-500 transition-colors"
                                  aria-label="Show full description"
                                >
                                  ...
                                </button>
                              </>
                            )}
                          </div>

                          {(() => {
                            const teamList = Array.isArray(viewingProject.team)
                              ? viewingProject.team
                              : (typeof viewingProject.team === "string" ? viewingProject.team : "")
                                  .split(",")
                                  .map((s: string) => s.trim())
                                  .filter(Boolean);
                            const supervisorList = Array.isArray(viewingProject.supervisor)
                              ? viewingProject.supervisor
                              : (typeof viewingProject.supervisor === "string" ? viewingProject.supervisor : "")
                                  .split(",")
                                  .map((s: string) => s.trim())
                                  .filter(Boolean);
                            return (
                              <>
                                {teamList.length > 0 && (
                                  <>
                                    <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-3">Project Team</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {teamList.map((member: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">
                                          {member}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                )}
                                {supervisorList.length > 0 && (
                                  <>
                                    <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-3">Supervisor</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {supervisorList.map((member: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-teal-50 text-teal-800 text-sm rounded-full border border-teal-200">
                                          {member}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};