import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id?: string;
  title: string;
  authors?: string;
  year?: string;
  journal?: string;
  tags?: string[];
  image?: string;
  video?: string;
}

interface ProjectCardProps {
  project?: Project;
  title?: string;
  subtitle?: string;
  year?: string;
  date?: string;
  image?: string;
  video?: string;
  tags?: string[];
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'video';
  accentColor?: string;
  onClick?: () => void;
  index?: number;
  className?: string;
  variant?: 'geometric' | 'minimal' | 'bordered';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  title: propTitle,
  subtitle: propSubtitle,
  year: propYear,
  date,
  image: propImage,
  video: propVideo,
  tags: propTags = [],
  aspectRatio = 'video',
  accentColor = 'text-teal-600',
  onClick,
  index = 0,
  className = '',
  variant = 'minimal'
}) => {
  // Use project props if available, otherwise use individual props
  const title = project?.title || propTitle || '';
  const subtitle = propSubtitle || project?.journal;
  const year = project?.year || propYear;
  const image = project?.image || propImage;
  const video = project?.video || propVideo;
  const tags = project?.tags || propTags;
  const authors = project?.authors;

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    video: 'aspect-video'
  };

  const renderGeometricOverlay = () => (
    <div className="absolute inset-0 bg-black/30 hover:bg-black/50 transition-colors duration-300 p-4 sm:p-6 flex flex-col justify-between z-10">
      {/* Corner Borders */}
      <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-white/50"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-white/50"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-white/50"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-white/50"></div>
      
      {/* Content */}
      <div className="flex items-center gap-2 mb-2">
         <svg className="w-8 h-8 bg-none text-white fill-current shrink-0" viewBox="0 0 32 33" xmlns="http://www.w3.org/2000/svg">
           <path d="M10.0811 8.4182L5.83462 0.190918H2.99992L9.67261 13.1182C10.5858 12.4441 10.9873 10.1747 10.0811 8.4182Z"></path>
           <path d="M15.718 2.23543L13.1494 7.23357C13.1494 7.23357 10.7002 3.40679 11.9444 1.22143C12.9961 -0.412105 14.5318 0.34164 14.7541 0.518363C14.9764 0.694577 15.652 1.06534 15.718 2.23543Z"></path>
           <path d="M4.56792 32.1182H0.919922V16.5902H4.56792V32.1182Z"></path>
           <path d="M18.2125 19.4222H12.3325V22.7822H17.9245V25.5662H12.3325V32.1182H8.68448V16.5902H18.2125V19.4222Z"></path>
           <path d="M31.774 19.4222H27.67V32.1182H23.998V19.4222H19.894V16.5902H31.774V19.4222Z"></path>
         </svg>
      </div>

      <div>
         {(subtitle || year || date) && (
           <span className={`${accentColor} font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-2 block`}>
             {subtitle || year || date}
           </span>
         )}
         <h3 className="text-white text-base sm:text-lg md:text-xl font-light leading-tight font-serif">{title}</h3>
      </div>
    </div>
  );

  const renderMinimalOverlay = () => (
    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300" />
  );

  const renderBorderedCard = () => (
    <>
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-100 -mr-4 -mt-4 rotate-45 transform group-hover:bg-teal-500 transition-colors z-20"></div>
      
      {/* Year badge */}
      {year && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-900 border border-neutral-200 z-10">
          {year}
        </div>
      )}
      
      {/* Connector Line */}
      <div className="absolute bottom-0 left-6 w-px h-0 bg-neutral-200 group-hover:h-full group-hover:bg-teal-500/20 transition-all duration-500"></div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={variant === 'geometric' ? { y: -20, rotate: index % 2 === 0 ? 1 : -1 } : variant === 'minimal' ? { y: -8 } : {}}
      onClick={onClick}
      className={`flex flex-col gap-4 sm:gap-5 ${className}`}
    >
      <div className={`relative ${aspectClasses[aspectRatio]} group cursor-pointer touch-pan-y min-w-0 flex-shrink-0`}>
      <div className={`absolute inset-0 ${
        variant === 'bordered' 
          ? 'bg-white border border-neutral-200 hover:border-teal-500 shadow-sm hover:shadow-2xl' 
          : 'bg-neutral-100 shadow-lg hover:shadow-2xl border border-neutral-200'
      } overflow-hidden transition-all duration-500`}>
        
        {/* Media */}
        {video ? (
          <video 
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          />
        ) : (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
          />
        )}
        
        {/* Overlay based on variant */}
        {variant === 'geometric' && renderGeometricOverlay()}
        {variant === 'minimal' && renderMinimalOverlay()}
        {variant === 'bordered' && renderBorderedCard()}

        {/* Arrow icon for minimal variant */}
        {variant === 'minimal' && (
          <div className="absolute top-4 right-4 bg-white text-neutral-900 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Tags for bordered variant inside card */}
      {variant === 'bordered' && tags && tags.length > 0 && (
        <div className="absolute top-16 left-3 flex flex-wrap gap-2 z-10">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-teal-600 font-mono uppercase tracking-wider bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-sm border border-neutral-200">
              {tag}
            </span>
          ))}
        </div>
      )}
      </div>

      {/* Below card content for minimal and bordered variants - in normal flow for proper mobile stacking */}
      {(variant === 'minimal' || variant === 'bordered') && (
        <div className="px-1 min-w-0">
          <div className="flex items-baseline justify-between mb-2 gap-2">
            <span className={`${accentColor} text-xs font-mono uppercase tracking-widest truncate`}>
              {tags[0] || subtitle}
            </span>
            {year && <span className="text-neutral-400 text-xs font-mono shrink-0">{year}</span>}
          </div>
          <h3 className="text-base sm:text-xl font-sans font-medium leading-tight text-neutral-900 group-hover:text-teal-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
      )}
    </motion.div>
  );
};