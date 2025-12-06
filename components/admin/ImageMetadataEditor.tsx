'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Trash2, GripVertical, Edit2, Check, X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Location, ImageMetadata } from '@/types';
import BeforeAfterPairingDialog from './BeforeAfterPairingDialog';

interface ImageMetadataEditorProps {
  location: Location;
  onUpdate: (id: string, field: keyof Location, value: any) => void;
}

export default function ImageMetadataEditor({ location, onUpdate }: ImageMetadataEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pairingImageIndex, setPairingImageIndex] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ImageMetadata>>({
    url: '',
    caption: '',
    description: '',
    photographer: '',
    category: 'general',
  });

  // Declare images first before using in callbacks
  const images = useMemo(() => location.images || [], [location.images]);

  const uploadSingleFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('locationId', location.id);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const errorData = await response.json();
        toast.error('Upload failed', {
          description: errorData.message || errorData.error
        });
        return null;
      }
    } catch (error) {
      toast.error('Upload failed', {
        description: 'An error occurred while uploading the file'
      });
      console.error(error);
      return null;
    }
  }, [location.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadSingleFile(file);
    if (url) {
      setFormData({ ...formData, url });
      toast.success('Image uploaded successfully');
    }
    setUploading(false);
  };

  // Drag-drop handler for batch upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    toast.info(`Uploading ${acceptedFiles.length} image(s)...`);

    const uploadPromises = acceptedFiles.map(file => uploadSingleFile(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];

    if (successfulUploads.length > 0) {
      // Add all successfully uploaded images to the location
      const newImages: ImageMetadata[] = successfulUploads.map(url => ({
        url,
        category: 'general',
      }));

      onUpdate(location.id, 'images', [...images, ...newImages]);
      toast.success(`Successfully uploaded ${successfulUploads.length} image(s)`, {
        description: 'You can now add captions and metadata to each image.'
      });
    }

    setUploading(false);
  }, [location.id, images, onUpdate, uploadSingleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  });

  const resetForm = () => {
    setFormData({
      url: '',
      caption: '',
      description: '',
      photographer: '',
      category: 'general',
    });
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const addImage = () => {
    if (!formData.url) {
      toast.warning('Image URL is required');
      return;
    }

    const newImage: ImageMetadata = {
      url: formData.url,
      caption: formData.caption || undefined,
      description: formData.description || undefined,
      photographer: formData.photographer || undefined,
      dateTaken: formData.dateTaken || undefined,
      category: formData.category || 'general',
    };

    onUpdate(location.id, 'images', [...images, newImage]);
    toast.success('Image added successfully');
    resetForm();
  };

  const updateImage = (index: number) => {
    if (!formData.url) {
      toast.warning('Image URL is required');
      return;
    }

    const updatedImages = images.map((img, idx) => {
      if (idx === index) {
        return {
          ...img,
          url: formData.url!,
          caption: formData.caption || undefined,
          description: formData.description || undefined,
          photographer: formData.photographer || undefined,
          dateTaken: formData.dateTaken || undefined,
          category: formData.category || 'general',
        };
      }
      return img;
    });

    onUpdate(location.id, 'images', updatedImages);
    toast.success('Image updated successfully');
    resetForm();
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    onUpdate(location.id, 'images', updatedImages);
    toast.success('Image removed');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];

    onUpdate(location.id, 'images', updatedImages);
  };

  const startEdit = (index: number) => {
    const img = images[index];
    setFormData({
      url: img.url,
      caption: img.caption || '',
      description: img.description || '',
      photographer: img.photographer || '',
      dateTaken: img.dateTaken || '',
      category: img.category || 'general',
    });
    setEditingIndex(index);
    setShowAddForm(false);
  };

  const startPairing = (index: number) => {
    if (images.length < 2) {
      toast.warning('Need at least 2 images to create a before/after pair');
      return;
    }
    setPairingImageIndex(index);
  };

  const handlePairingConfirm = (index1: number, index2: number) => {
    const updatedImages = images.map((img, idx) => {
      if (idx === index1) {
        return {
          ...img,
          isBeforeAfter: true,
          beforeAfterPair: images[index2].url,
        };
      }
      if (idx === index2) {
        return {
          ...img,
          isBeforeAfter: true,
          beforeAfterPair: images[index1].url,
        };
      }
      return img;
    });

    onUpdate(location.id, 'images', updatedImages);
    toast.success('Before/after pair created successfully');
    setPairingImageIndex(null);
  };

  const getCategoryColor = (category?: ImageMetadata['category']) => {
    switch (category) {
      case 'before':
        return 'bg-red-100 text-red-700';
      case 'during':
        return 'bg-orange-100 text-orange-700';
      case 'after':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag-Drop Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
          isDragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-stone-300 hover:border-orange-400 hover:bg-orange-50/50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <Upload size={32} className={isDragActive ? 'text-orange-600' : 'text-stone-400'} />
          {isDragActive ? (
            <p className="text-sm font-medium text-orange-700">Drop images here...</p>
          ) : (
            <>
              <p className="text-sm font-medium text-stone-700">
                Drag & drop images here, or click to select
              </p>
              <p className="text-xs text-stone-500">
                Supports JPG, PNG, WebP (max 10MB per file)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image List */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-stone-50 border border-stone-200 rounded-lg p-4"
            >
              <div className="flex gap-4">
                {/* Reorder Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <GripVertical size={16} />
                  </button>
                  <span className="text-xs text-stone-500 font-mono">#{index}</span>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <GripVertical size={16} />
                  </button>
                </div>

                {/* Image Preview */}
                <div className="relative w-32 h-24 flex-shrink-0">
                  <Image
                    src={img.url}
                    alt={img.caption || `Image ${index + 1}`}
                    fill
                    className="object-cover rounded border border-stone-300"
                    sizes="128px"
                  />
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(img.category)}`}>
                      {img.category || 'general'}
                    </span>
                    {img.isBeforeAfter && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Before/After
                      </span>
                    )}
                  </div>

                  {img.caption && (
                    <p className="text-sm font-medium text-stone-900 mb-1">{img.caption}</p>
                  )}
                  {img.description && (
                    <p className="text-xs text-stone-600 mb-2 line-clamp-2">{img.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    {img.photographer && (
                      <span>📷 {img.photographer}</span>
                    )}
                    {img.dateTaken && (
                      <span>📅 {new Date(img.dateTaken).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => startEdit(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => startPairing(index)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors text-xs"
                    title="Pair as Before/After"
                  >
                    B/A
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-400 border-2 border-dashed border-stone-200 rounded-lg">
          <p className="text-sm">No images yet. Add your first image below.</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingIndex !== null) ? (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
          <h4 className="text-sm font-bold text-stone-900 mb-3">
            {editingIndex !== null ? `Edit Image #${editingIndex}` : 'Add New Image'}
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Image URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/image.jpg or upload below"
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <label className={`px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                  uploading ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-stone-300 hover:border-orange-500 hover:bg-orange-50 text-stone-700'
                }`}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.url && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-stone-200">
                  <Image
                    src={formData.url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Brief caption"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ImageMetadata['category'] })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="general">General</option>
                  <option value="before">Before</option>
                  <option value="during">During Construction</option>
                  <option value="after">After</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Longer description of the image..."
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Photographer
                </label>
                <input
                  type="text"
                  value={formData.photographer}
                  onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Date Taken
                </label>
                <input
                  type="date"
                  value={formData.dateTaken}
                  onChange={(e) => setFormData({ ...formData, dateTaken: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editingIndex !== null ? (
                <>
                  <button
                    onClick={() => updateImage(editingIndex)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    <Check size={16} />
                    Save Changes
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={addImage}
                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    Add Image
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone-300 hover:border-orange-400 hover:bg-orange-50 rounded-lg text-stone-600 hover:text-orange-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          Add Image
        </button>
      )}

      {/* Before/After Pairing Dialog */}
      {pairingImageIndex !== null && (
        <BeforeAfterPairingDialog
          images={images}
          initialIndex={pairingImageIndex}
          onConfirm={handlePairingConfirm}
          onCancel={() => setPairingImageIndex(null)}
        />
      )}
    </div>
  );
}
