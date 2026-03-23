import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import { uploadImage } from '@/lib/uploadClient';

interface EditableMediaProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** When true, do not render the label (parent provides it). Default: false. */
  hideLabel?: boolean;
  /** Accepted file types. For now: 'image' only. Extensible for 'video' later. */
  accept?: 'image' | 'video';
}

const ACCEPT_MAP = {
  image: 'image/*',
  video: 'video/*',
} as const;

const isVideoUrl = (url: string): boolean =>
  url.startsWith('data:video/') || /\.(mp4|webm|ogg)(\?|$)/i.test(url);

export const EditableMedia = ({
  value,
  onChange,
  label,
  hideLabel = false,
  accept = 'image',
}: EditableMediaProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }
    if (accept === 'image' && !isImage) {
      alert('Please select an image file');
      return;
    }
    if (accept === 'video' && !isVideo) {
      alert('Please select a video file');
      return;
    }

    setUploading(true);
    if (isImage) {
      uploadImage(file)
        .then((url) => { onChange(url); setUploading(false); })
        .catch((err) => { alert(err.message); setUploading(false); });
    } else {
      // Video: base64 fallback until streaming upload is implemented
      const reader = new FileReader();
      reader.onload = (e) => { onChange((e.target?.result as string) || ''); setUploading(false); };
      reader.onerror = () => { alert('Error reading file'); setUploading(false); };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            {isVideoUrl(value) ? (
              <video src={value} controls className="w-full h-full object-cover" />
            ) : (
              <img src={value} alt={label} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Replace
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
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragOver ? 'border-teal-500 bg-teal-50' : 'border-neutral-300 hover:border-teal-400 hover:bg-neutral-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                <p className="text-sm font-medium text-neutral-700">
                  Drop media here or click to browse
                </p>
                <p className="text-xs text-neutral-500">
                  {accept === 'image' ? 'Supports JPG, PNG, GIF, WebP' : 'Supports MP4, WebM'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="pt-2 border-t border-neutral-200">
        <label className="block text-xs font-medium text-neutral-600 mb-1">Or paste URL:</label>
        <input
          type="text"
          value={value && !value.startsWith('data:') ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={accept === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
