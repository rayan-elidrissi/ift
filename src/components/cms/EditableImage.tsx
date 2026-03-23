import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { uploadImage } from '@/lib/uploadClient';

interface EditableImageProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** When true, do not render the label (parent provides it). Default: false. */
  hideLabel?: boolean;
}

export const EditableImage = ({ value, onChange, label, hideLabel = false }: EditableImageProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
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
      .then((url) => { onChange(url); setUploading(false); })
      .catch((err) => { alert(err.message); setUploading(false); });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </label>
      )}

      {value ? (
        <div className="space-y-2">
          <div className="relative aspect-video bg-neutral-100 rounded overflow-hidden border border-neutral-200">
            <img 
              src={value} 
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Replace Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${dragOver 
              ? 'border-teal-500 bg-teal-50' 
              : 'border-neutral-300 hover:border-teal-400 hover:bg-neutral-50'
            }
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-neutral-600 font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Drop media here or click to browse
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Supports JPG, PNG, GIF, WebP
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL Input Option */}
      <div className="pt-2 border-t border-neutral-200">
        <label className="block text-xs font-medium text-neutral-600 mb-1">
          Or paste image URL:
        </label>
        <input
          type="text"
          value={value && !value.startsWith('data:') ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
