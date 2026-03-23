import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useCMS } from '../../context/CMSContext';
import { Edit2 } from 'lucide-react';
import { CMSModal } from './CMSModal';

interface EditableContentProps {
  id: string;
  defaultContent: string;
  className?: string;
  multiline?: boolean;
  enableProse?: boolean;
  /** Optional second field stored under its own CMS id (e.g. button redirection URL) */
  secondaryId?: string;
  secondaryDefault?: string;
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
}

export const EditableContent = ({
  id,
  defaultContent,
  className = '',
  multiline = true,
  enableProse = true,
  secondaryId,
  secondaryDefault = '',
  secondaryLabel = 'Redirection',
  secondaryPlaceholder = '/page or https://...'
}: EditableContentProps) => {
  const { isEditing, getContent, updateContent, canEditKey } = useCMS();
  const editable = isEditing && canEditKey(id);
  const content = getContent(id, defaultContent) as string;
  const secondaryContent = (secondaryId ? getContent(secondaryId, secondaryDefault) : '') as string;
  const [tempContent, setTempContent] = useState(content);
  const [tempSecondary, setTempSecondary] = useState(secondaryContent || '');
  const [localEditing, setLocalEditing] = useState(false);

  useEffect(() => {
    setTempContent(content);
  }, [content]);

  useEffect(() => {
    if (secondaryId) {
      setTempSecondary(secondaryContent || '');
    }
  }, [secondaryContent, secondaryId]);

  const handleSave = async () => {
    try {
      await updateContent(id, tempContent);
      if (secondaryId) {
        await updateContent(secondaryId, tempSecondary);
      }
    } catch (e) {
      toast.error('Save failed');
      console.error('[EditableContent] Save error:', e);
    } finally {
      setLocalEditing(false);
    }
  };

  const handleCancel = () => {
    setTempContent(content);
    if (secondaryId) {
      setTempSecondary(secondaryContent || '');
    }
    setLocalEditing(false);
  };

  const markdownClass = enableProse ? "prose prose-neutral max-w-none" : "w-full h-full [&>p]:m-0";
  /** When enableProse is false, render p as span to avoid invalid nesting (p inside p/div inside p) */
  const markdownComponents = enableProse ? undefined : { p: ({ children }: { children?: React.ReactNode }) => <span className="block">{children}</span> };

  if (editable) {
    return (
      <div className={`relative group ${localEditing ? 'z-50' : ''}`}>
        {!localEditing ? (
          <div 
            onClick={() => setLocalEditing(true)}
            className={`cursor-pointer outline-2 outline-dashed outline-teal-500/50 hover:bg-teal-50/50 p-1 rounded transition-all ${className}`}
          >
            <div className={markdownClass}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
            <div className="absolute -top-3 -right-3 bg-teal-600 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-3 h-3" />
            </div>
          </div>
        ) : (
          <CMSModal
            isOpen={localEditing}
            onClose={handleCancel}
            onSave={handleSave}
            title="Edit Content"
            size={multiline ? "lg" : "md"}
          >
            <div className="p-6 bg-neutral-50">
              {multiline ? (
                <>
                  <textarea
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                    placeholder="Enter Markdown content..."
                    autoFocus
                  />
                  <div className="mt-3 text-xs text-neutral-500 flex justify-between items-center">
                    <span className="font-medium">GitHub Flavored Markdown supported</span>
                    <a
                      href="https://www.markdownguide.org/cheat-sheet/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                    >
                      Formatting Help →
                    </a>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={tempContent}
                      onChange={(e) => setTempContent(e.target.value)}
                      className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                      placeholder="Enter text..."
                      autoFocus
                    />
                  </div>

                  {secondaryId && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                        {secondaryLabel}
                      </label>
                      <input
                        type="text"
                        value={tempSecondary}
                        onChange={(e) => setTempSecondary(e.target.value)}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                        placeholder={secondaryPlaceholder}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CMSModal>
        )}
      </div>
    );
  }

  // Use span as root when enableProse is false to allow valid nesting inside <p> (div cannot be descendant of p)
  const Root = enableProse ? 'div' : 'span';
  const Wrapper = enableProse ? 'div' : 'span';

  return (
    <Root className={className} style={enableProse ? undefined : { display: 'block' }}>
      <Wrapper className={markdownClass} style={enableProse ? undefined : { display: 'block' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </Wrapper>
    </Root>
  );
};