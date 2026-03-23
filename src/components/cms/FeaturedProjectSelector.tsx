import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { CMSModal } from './CMSModal';

interface Project {
  id: string;
  title: string;
  authors?: string;
  year: string;
  journal?: string;
  tags: string[];
  image: string;
  [key: string]: any;
}

interface FeaturedProjectSelectorProps {
  allProjects: Project[];
  contentId: string;
  /** Default IDs when none saved (e.g. one from each source: pub, student, art) */
  defaultSelectedIds?: string[];
}

export const FeaturedProjectSelector: React.FC<FeaturedProjectSelectorProps> = ({ 
  allProjects, 
  contentId,
  defaultSelectedIds 
}) => {
  const { getContent, updateContent, isEditing, canEditKey } = useCMS();
  const editable = isEditing && canEditKey(contentId);
  const [isOpen, setIsOpen] = useState(false);
  
  const fallbackIds = defaultSelectedIds ?? allProjects.slice(0, 3).map(p => p.id);
  const selectedIds = getContent(contentId, fallbackIds) as string[];
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

  const handleToggleProject = (projectId: string) => {
    setTempSelectedIds(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleSave = () => {
    updateContent(contentId, tempSelectedIds);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedIds);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setTempSelectedIds(selectedIds);
    setIsOpen(true);
  };

  if (!editable) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="mb-8 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        <span>Select Featured Projects ({selectedIds.length})</span>
      </button>

      <CMSModal
        isOpen={isOpen}
        onClose={handleCancel}
        onSave={handleSave}
        title="Select Featured Projects"
        size="xl"
      >
        <div className="p-6 bg-neutral-50">
          <p className="text-sm text-neutral-600 mb-6">
            Select which projects should appear in the Featured Projects section. Projects are sourced from Research publications, Student projects (Education), and Art exhibitions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {allProjects.map((project) => {
              const isSelected = tempSelectedIds.includes(project.id);
              
              return (
                <div
                  key={project.id}
                  onClick={() => handleToggleProject(project.id)}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    isSelected 
                      ? 'border-teal-600 shadow-lg' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {/* Selection Indicator */}
                  <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-teal-600 border-teal-600' 
                      : 'bg-white border-neutral-300'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Project Image */}
                  <div className="relative h-40 overflow-hidden bg-neutral-100">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Project Info */}
                  <div className="p-4 bg-white min-h-[120px]">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-xs font-mono text-teal-600 uppercase flex-shrink-0">
                        {project.sourceType === 'publication' ? 'Research' : project.sourceType === 'student' ? 'Student' : project.sourceType === 'art' ? 'Art' : (project.id?.startsWith('pub-') ? 'Research' : project.id?.startsWith('stu-') ? 'Student' : 'Art')}
                      </span>
                      <span className="text-xs font-mono text-neutral-400 flex-shrink-0">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm text-neutral-900 mb-2 leading-tight min-h-[2.5rem]">
                      {project.title}
                    </h3>
                    {project.authors && (
                      <p className="text-xs text-neutral-500 truncate">
                        {project.authors}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-800">
              <strong>{tempSelectedIds.length} project{tempSelectedIds.length !== 1 ? 's' : ''} selected.</strong> 
              {tempSelectedIds.length === 0 && ' Select at least one project to display.'}
            </p>
          </div>
        </div>
      </CMSModal>
    </>
  );
};