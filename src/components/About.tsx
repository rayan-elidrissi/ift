import React from "react";
import { motion } from "motion/react";
import { Team } from "./Team";
import { EditableContent } from "./cms/EditableContent";
import { EditableImageSingle } from "./cms/EditableImageSingle";
import { useCMS } from "../context/CMSContext";
// Placeholder image (replace with real asset when ready)
const aboutImage = 'https://placehold.co/800x600/f5f5f5/999?text=About';

const AboutSkeleton = () => (
  <section className="relative pt-16 md:pt-20 lg:pt-24 pb-24 lg:pb-32 bg-white animate-pulse">
    <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
        <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
          <div>
            <div className="h-12 md:h-16 bg-neutral-200 rounded w-80 mb-4" />
            <div className="h-5 bg-neutral-100 rounded w-48" />
          </div>
          <div className="space-y-2 border-l-2 border-neutral-200 pl-6 max-w-xl">
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-full" />
            <div className="h-4 bg-neutral-100 rounded w-3/4" />
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-48" />
                <div className="h-3 bg-neutral-100 rounded w-full" />
                <div className="h-3 bg-neutral-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7 min-h-[280px] bg-neutral-200 rounded" />
      </div>
    </div>
  </section>
);

export const About = () => {
  const { isLoading, hasCache } = useCMS();

  if (isLoading && !hasCache) {
    return <AboutSkeleton />;
  }

  return (
    <>
      <section
        id="about"
        className="relative pt-16 md:pt-20 lg:pt-24 pb-24 lg:pb-32 bg-white text-neutral-900 overflow-hidden font-serif"
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
          {/* Laptop display: left = Title + Subtitle + Intro + Pillars, right = Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 lg:items-stretch">
            {/* Left column: Title, Subtitle, Intro, Pillars */}
            <motion.div
              className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-neutral-900 leading-[0.9] uppercase"
                  role="heading"
                  aria-level={1}
                >
                  <EditableContent id="about-title" defaultContent="INSTITUTE FOR FUTURE TECHNOLOGIES" enableProse={false} />
                </motion.div>
                <div className="text-lg md:text-xl text-neutral-500 font-serif italic leading-relaxed max-w-xl mt-1">
                  <EditableContent id="about-subtitle" defaultContent="De Vinci Higher Education" enableProse={false} />
                </div>
              </div>
              <div className="text-lg md:text-xl text-neutral-500 font-serif italic leading-relaxed border-l-2 border-neutral-200 pl-6 max-w-xl">
                <EditableContent id="about-intro" defaultContent="We prepare students to navigate and transform uncertain futures by cultivating how they think, build, and adapt alongside mentors and peers. At IFT, knowledge is constructed through making between and beyond disciplines, in direct engagement with a global ecosystem of research, art, and innovation." />
              </div>
              <div className="space-y-8 font-sans">
                <div className="group">
                  <div className="flex items-center gap-3 font-bold text-neutral-900 mb-2 uppercase tracking-widest text-xs sm:text-sm" role="heading" aria-level={4}>
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0"></span>
                    <EditableContent id="about-pillar-1-title" defaultContent="TRANSFORMATIVE EDUCATION" enableProse={false} />
                  </div>
                  <div className="text-neutral-500 text-sm pl-4.5 leading-relaxed">
                    <EditableContent id="about-pillar-1-desc" defaultContent="We cultivate orientation, vision, creation, adaptation, collaboration, and disciplined self-awareness. Students learn to consciously shape their own &quot;human operating system,&quot; aligning what matters to them with what the world needs." />
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 font-bold text-neutral-900 mb-2 uppercase tracking-widest text-xs sm:text-sm" role="heading" aria-level={4}>
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0"></span>
                    <EditableContent id="about-pillar-2-title" defaultContent="DEMO & DEPLOY" enableProse={false} />
                  </div>
                  <div className="text-neutral-500 text-sm pl-4.5 leading-relaxed">
                    <EditableContent id="about-pillar-2-desc" defaultContent="Students transform original, boundary-pushing concepts into working prototypes and bring them beyond the lab through research publication, exhibition, and real-world deployment." />
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 font-bold text-neutral-900 mb-2 uppercase tracking-widest text-xs sm:text-sm" role="heading" aria-level={4}>
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0"></span>
                    <EditableContent id="about-pillar-3-title" defaultContent="COMMUNITY OF EXPLORERS" enableProse={false} />
                  </div>
                  <div className="text-neutral-500 text-sm pl-4.5 leading-relaxed">
                    <EditableContent id="about-pillar-3-desc" defaultContent="IFT brings together ambitious and curious minds in a shared culture of experimentation. Work is shared in progress and sharpened through catalytic exchange, refining both thought and practice." />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column: Large image - matches left column height via grid items-stretch */}
            <motion.div
              className="lg:col-span-7 flex flex-col min-h-[280px] lg:min-h-0 overflow-hidden order-2 lg:self-stretch"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <div className="w-full flex-1 min-h-[280px] lg:min-h-0 overflow-hidden flex">
                <EditableImageSingle id="about-campus-image" defaultImage={aboutImage} alt="IFT Lecture Hall - Beyond the Digital Frontiers" className="h-full w-full" />
              </div>
            </motion.div>
          </div>
        </div>

      </section>
      <Team />
    </>
  );
};