import React from 'react';
import ReactDOM from 'react-dom';
import { X, Save } from 'lucide-react';

interface CMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '5xl';
  showSave?: boolean;
  saveText?: string;
  cancelText?: string;
  saveDisabled?: boolean;
  /** Optional left panel (e.g. image) - when set, uses 2-col wide layout like Education modal */
  leftPanel?: React.ReactNode;
}

export const CMSModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  size = 'lg',
  showSave = true,
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  saveDisabled = false,
  leftPanel
}: CMSModalProps) => {
  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    onSave?.();
    onClose();
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '5xl': 'max-w-5xl'
  };

  const contentArea = (
    <>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 bg-neutral-50 shrink-0">
        <h3 className="font-bold text-neutral-900 text-lg">{title}</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content - stopPropagation prevents clicks from closing modal or being captured by parent */}
      <div className="flex-grow min-h-0 overflow-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>

      {/* Footer */}
      {showSave && (
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-neutral-600 hover:text-neutral-900 uppercase tracking-wider transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            disabled={saveDisabled}
            className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-teal-600 transition-colors flex items-center gap-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saveText}
          </button>
        </div>
      )}
    </>
  );

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: 2147483647, isolation: 'isolate' }}
    >
      <div
        className={`relative z-10 bg-white w-full ${sizeClasses[leftPanel ? '5xl' : size]} rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${leftPanel ? 'md:flex-row' : ''}`}
      >
        {leftPanel ? (
          <>
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto md:min-h-0 bg-neutral-100 relative flex-shrink-0 overflow-hidden">
              {leftPanel}
            </div>
            <div className="flex-1 flex flex-col min-h-0 md:min-w-0">
              {contentArea}
            </div>
          </>
        ) : (
          contentArea
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};
