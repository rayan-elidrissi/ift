import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Edit2, Image as ImageIcon, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { Switch } from '../ui/switch';
import { EditableVideo } from './EditableVideo';
import { EditableImage } from './EditableImage';
import { CMSModal } from './CMSModal';

export interface FieldSchema {
  key: string;
  label: string;
  type: 'text' | 'image' | 'video' | 'textarea' | 'select' | 'toggle';
  options?: string[]; // For select
  /** Only render this field when formData[showWhen] is truthy */
  showWhen?: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  data: any;
  schema: FieldSchema[];
  title: string;
}

export const EditModal = ({ isOpen, onClose, onSave, data, schema, title }: EditModalProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(data || {});

  useEffect(() => {
    const raw = data || {};
    const normalized = { ...raw };
    // When schema has 'media' field, populate from image/video for backward compat
    if (schema.some(f => f.key === 'media') && !normalized.media && (normalized.image || normalized.video)) {
      normalized.media = normalized.image || normalized.video;
    }
    setFormData(normalized);
  }, [data, isOpen, schema]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const mediaSrc = (formData.media || formData.image || formData.video) as string | undefined;
  const isVideo = typeof mediaSrc === 'string' && (mediaSrc.startsWith('data:video/') || /\.(mp4|webm|ogg)(\?|$)/i.test(mediaSrc));
  const leftPanel = mediaSrc ? (
    isVideo ? (
      <video src={mediaSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
    ) : (
      <img src={mediaSrc} alt="" className="w-full h-full object-cover" />
    )
  ) : undefined;

  return (
    <CMSModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      size={leftPanel ? '5xl' : 'lg'}
      leftPanel={leftPanel}
    >
      <div className="p-6 space-y-4">
        {schema.map((field) => {
          const showWhenOk = !field.showWhen || (formData[field.showWhen] === 'true' || formData[field.showWhen] === true);
          if (!showWhenOk) return null;

          const isToggleOn = formData[field.key] === 'true' || formData[field.key] === true;

          return (
          <div key={field.key} className="space-y-2">
            {field.type === 'toggle' ? (
              <label className="flex items-center justify-between gap-4 w-full py-2 px-3 -mx-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 shrink-0">
                  {field.label}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isToggleOn}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange(field.key, e.target.checked ? 'true' : 'false');
                    }}
                    className="sr-only"
                    aria-hidden
                  />
                  <span
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                      isToggleOn ? 'bg-green-600' : 'bg-red-500'
                    }`}
                    aria-hidden
                  >
                    <span
                      className={`pointer-events-none absolute top-0.5 left-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isToggleOn ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </div>
              </label>
            ) : field.type === 'image' ? (
              <>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  {field.label}
                </label>
                <EditableImage
                  value={(formData[field.key] as string) || ''}
                  onChange={(value) => handleChange(field.key, value)}
                  label={field.label}
                  hideLabel
                />
              </>
            ) : (
              <>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[120px] text-sm"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </>
            )}
          </div>
        );
        })}
      </div>
    </CMSModal>
  );
};

interface EditableCollectionProps<T> {
  id: string;
  defaultData: T[];
  renderItem: (item: T, index: number, isEditing: boolean, openEditModal?: () => void) => React.ReactNode;
  schema: FieldSchema[];
  itemClassName?: string;
  containerClassName?: string;
  maxItems?: number;
  getItemStyle?: (item: T, index: number) => React.CSSProperties;
  /** When using displayItems (filtered view), show Add button if true. Default: false. */
  allowAddWhenFiltered?: boolean;
  /** When CMS returns empty/invalid data, use this instead. Enables fallback to defaults. */
  overrideItems?: T[];
}

export const EditableCollection = <T extends { id?: string }>({ 
  id, 
  defaultData, 
  renderItem, 
  schema,
  itemClassName = "",
  containerClassName = "",
  maxItems,
  getItemStyle,
  allowAddWhenFiltered = false,
  displayItems,
  overrideItems,
}: EditableCollectionProps<T> & { displayItems?: T[] }) => {
  const { isEditing, getContent, updateContent, canEditKey } = useCMS();
  const editable = isEditing && canEditKey(id);
  const rawItems = getContent(id, defaultData) as T[];
  const items = overrideItems !== undefined ? overrideItems : rawItems;
  
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Use displayItems if provided, otherwise use all items.
  // When not editing, filter out hidden items; when editing, show all (including hidden) so user can unhide.
  const baseItems = displayItems || items;
  const itemsToRender = editable ? baseItems : baseItems.filter((i: T & { hidden?: boolean }) => !i.hidden);

  const handleSaveItem = (itemData: T) => {
    let newItems = [...items];
    
    if (editingItem) {
      // Update existing
      const index = newItems.findIndex(i => (i.id && i.id === editingItem.id) || i === editingItem);
      if (index !== -1) {
        newItems[index] = { ...newItems[index], ...itemData };
      }
    } else {
      // This path shouldn't be reached for existing items, but just in case
    }
    
    updateContent(id, newItems);
    setEditingItem(null);
  };

  const handleAddItem = (itemData: T) => {
    const newItem = { ...itemData, id: Date.now().toString(), hidden: true } as T & { hidden?: boolean }; // New cards hidden by default
    const newItems = [...items, newItem];
    updateContent(id, newItems);
    setIsAdding(false);
  };

  const handleToggleHidden = (item: T & { hidden?: boolean }) => {
    const index = items.findIndex(i => (i.id && i.id === item.id) || i === item);
    if (index === -1) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], hidden: !(newItems[index] as T & { hidden?: boolean }).hidden } as T;
    updateContent(id, newItems);
  };

  const handleDeleteItem = (itemToDelete: T) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const newItems = items.filter(i => (i.id && i.id !== itemToDelete.id) || i !== itemToDelete);
      updateContent(id, newItems);
    }
  };

  const handleMoveItem = (itemToMove: T, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(i => (i.id && i.id === itemToMove.id) || i === itemToMove);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [removed] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, removed);
    updateContent(id, newItems);
  };

  return (
    <>
      <div className={containerClassName}>
        {itemsToRender.map((item, index) => (
          <div key={item.id || index} className={`relative group ${itemClassName} ${editable && (item as T & { hidden?: boolean }).hidden ? 'opacity-70' : ''}`} style={getItemStyle ? getItemStyle(item, index) : undefined}>
            {renderItem(item, index, editable, () => setEditingItem(item))}
            
            {editable && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); handleMoveItem(item, 'up'); }}
                  className="bg-neutral-800 text-white p-1.5 rounded-full hover:bg-neutral-900 shadow-lg"
                  title="Move up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleMoveItem(item, 'down'); }}
                  className="bg-neutral-800 text-white p-1.5 rounded-full hover:bg-neutral-900 shadow-lg"
                  title="Move down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingItem(item); }}
                  className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 shadow-lg"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleToggleHidden(item as T & { hidden?: boolean }); }}
                  className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 shadow-lg"
                  title={(item as T & { hidden?: boolean }).hidden ? 'Unhide (show on site)' : 'Hide (hide from site)'}
                >
                  {(item as T & { hidden?: boolean }).hidden ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteItem(item); }}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
        
        {editable && (!maxItems || items.length < maxItems) && (!displayItems || allowAddWhenFiltered) && (
          <button
            onClick={() => setIsAdding(true)}
            className={`flex items-center justify-center border-2 border-dashed border-neutral-300 hover:border-teal-500 hover:text-teal-600 text-neutral-400 rounded-lg transition-colors p-8 min-h-[200px] w-full ${itemClassName}`}
          >
            <div className="flex flex-col items-center gap-2">
              <Plus className="w-8 h-8" />
              <span className="font-bold uppercase tracking-widest text-sm">Add Item</span>
            </div>
          </button>
        )}
      </div>

      <EditModal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
        data={editingItem || {}}
        schema={schema}
        title="Edit Item"
      />

      <EditModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSave={handleAddItem}
        data={{}}
        schema={schema}
        title="Add New Item"
      />
    </>
  );
};