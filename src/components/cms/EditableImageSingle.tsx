import React, { useState, useRef } from 'react';
import { Upload, Edit2 } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadImage } from '@/lib/uploadClient';

interface EditableImageSingleProps {
  id: string;
  defaultImage: string;
  alt?: string;
  className?: string;
}

export const EditableImageSingle = ({ id, defaultImage, alt = '', className = '' }: EditableImageSingleProps) => {
  const { isEditing, getContent, updateContent, canEditKey } = useCMS();
  const editable = isEditing && canEditKey(id);
  const imageUrl = getContent(id, defaultImage) as string;
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setUploading(true);
    uploadImage(file)
      .then((url) => { updateContent(id, url); setUploading(false); })
      .catch((err) => { alert(err.message); setUploading(false); });
  };

  if (editable) {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[1.5s]"
        />
        
        {/* Upload overlay - always visible on mobile (no hover), hover on desktop */}
        <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-xl font-medium"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Change Image
              </>
            )}
          </button>
        </div>

        {/* Edit indicator badge - always visible on mobile */}
        <div className="absolute top-3 right-3 bg-teal-600 text-white p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg">
          <Edit2 className="w-4 h-4" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[1.5s]"
    />
  );
};