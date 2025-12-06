'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Upload, Trash2, Search, Image as ImageIcon, Grid, List, CheckSquare, Square, X, Edit3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
import Footer from '@/components/Footer';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  tags?: string[];
  description?: string;
  category?: 'before' | 'after' | 'general';
  locationId?: string;
  locationName?: string;
  mediaType?: 'image' | 'video';
}

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  preview?: string;
  tags: string[];
  category: 'before' | 'after' | 'general';
  locationId?: string;
  locationName?: string;
  description?: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadedFile[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [bulkTags, setBulkTags] = useState('');
  const [bulkCategory, setBulkCategory] = useState<'before' | 'after' | 'general'>('general');
  const [bulkLocation, setBulkLocation] = useState('');

  // Filters and sorting
  const [filterCategory, setFilterCategory] = useState<'all' | 'before' | 'after' | 'general'>('all');
  const [filterMediaType, setFilterMediaType] = useState<'all' | 'image' | 'video'>('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'>('date-desc');

  // Drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // Multi-select for bulk editing
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [bulkEditCategory, setBulkEditCategory] = useState<'before' | 'after' | 'general' | ''>('');
  const [bulkEditLocation, setBulkEditLocation] = useState('');
  const [bulkEditTags, setBulkEditTags] = useState('');
  const [bulkEditMode, setBulkEditMode] = useState<'replace' | 'add'>('add');

  // Helper function to check if URL is YouTube or Vimeo and convert to embed URL
  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    // Vimeo
    if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    // Descript - convert /view/ to /embed/
    if (url.includes('share.descript.com')) {
      return url.replace('/view/', '/embed/');
    }
    // For other embeddable URLs, return as-is
    return url;
  };

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    }
    return null;
  };

  // Import/sync existing images from siteData
  const importExistingMedia = useCallback(async (currentMedia: MediaItem[] = [], showToast: boolean = true) => {
    try {
      const { siteData } = await import('@/lib/siteData');
      const existingMedia: MediaItem[] = [];

      // Extract all images and videos from all locations
      siteData.locations.forEach(location => {
        // Add images
        location.images?.forEach((img, index) => {
          const filename = img.url.split('/').pop() || `image-${index}`;
          const locationName = location.title.toLowerCase().replace(/\s+/g, '-');
          existingMedia.push({
            id: `imported-${location.id}-img-${index}`,
            url: img.url,
            filename: filename,
            uploadedAt: new Date().toISOString(),
            tags: [locationName, location.type || 'general', img.category || 'general'],
            description: `${location.title} - ${img.category || 'general'}`,
            category: (img.category as 'before' | 'after' | 'general') || 'general',
            locationId: location.id,
            locationName: location.title,
            mediaType: 'image'
          });
        });

        // Add videos
        location.videos?.forEach((vid, index) => {
          const filename = vid.url.split('/').pop() || `video-${index}`;
          const locationName = location.title.toLowerCase().replace(/\s+/g, '-');
          existingMedia.push({
            id: `imported-${location.id}-vid-${index}`,
            url: vid.url,
            filename: filename,
            uploadedAt: new Date().toISOString(),
            tags: [locationName, location.type || 'general', 'video'],
            description: vid.title || `${location.title} video`,
            category: 'general',
            locationId: location.id,
            locationName: location.title,
            mediaType: 'video'
          });
        });
      });

      // Also scan the media-library folder for orphaned files on disk
      try {
        const scanResponse = await fetch('/api/scan-media');
        if (scanResponse.ok) {
          const { files } = await scanResponse.json();
          files.forEach((file: { filename: string; url: string; mediaType: string }) => {
            existingMedia.push({
              id: `scanned-${file.filename}`,
              url: file.url,
              filename: file.filename,
              uploadedAt: new Date().toISOString(),
              tags: ['uploaded'],
              description: 'Uploaded file',
              category: 'general',
              locationName: 'Media Library',
              mediaType: file.mediaType as 'image' | 'video'
            });
          });
        }
      } catch (scanError) {
        console.error('Failed to scan media folder:', scanError);
      }

      // Merge with existing media, avoiding duplicates by URL
      const existingUrls = new Set(currentMedia.map(m => m.url));
      const newMedia = existingMedia.filter(m => !existingUrls.has(m.url));

      // Always set media state - even if no new items, we need to load the existing data
      if (newMedia.length > 0) {
        setMedia([...currentMedia, ...newMedia]);
        if (showToast) {
          toast.success(`Synced ${newMedia.length} new items from locations`);
        }
      } else {
        // Still set the current media even if no new items to sync
        setMedia(currentMedia);
        if (showToast) {
          toast.info('All location media already synced');
        }
      }
      return newMedia.length;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to sync media from locations');
      }
      console.error(error);
      return 0;
    }
  }, []);

  // Load from localStorage and always sync with siteData on load
  useEffect(() => {
    const loadAndSync = async () => {
      let loadedMedia: MediaItem[] = [];

      // Try to load from localStorage first
      const saved = localStorage.getItem('picc-media-library');
      if (saved) {
        try {
          loadedMedia = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved media', e);
        }
      }

      // Always sync with siteData to catch any new images added to locations
      // Silent sync on page load - no toast spam
      await importExistingMedia(loadedMedia, false);
    };

    loadAndSync();
  }, [importExistingMedia]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('picc-media-library', JSON.stringify(media));
  }, [media]);

  // Handle adding files to upload queue
  const handleFilesSelected = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const id = `upload-${Date.now()}-${i}`;
      const url = URL.createObjectURL(file);
      const isImage = file.type.startsWith('image/');

      newFiles.push({
        id,
        file,
        url,
        preview: isImage ? url : undefined,
        tags: [],
        category: 'general',
        description: ''
      });
    }

    setUploadQueue([...uploadQueue, ...newFiles]);
    toast.success(`Added ${newFiles.length} file(s) to upload queue`);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesSelected(files);
    }
  };

  // Remove file from queue
  const removeFromQueue = (id: string) => {
    const file = uploadQueue.find(f => f.id === id);
    if (file?.url) {
      URL.revokeObjectURL(file.url);
    }
    setUploadQueue(uploadQueue.filter(f => f.id !== id));
  };

  // Update individual file in queue
  const updateQueueFile = (id: string, updates: Partial<UploadedFile>) => {
    setUploadQueue(uploadQueue.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Apply bulk tags to all files in queue
  const applyBulkTags = () => {
    const tagsArray = bulkTags.split(',').map(t => t.trim()).filter(Boolean);
    setUploadQueue(uploadQueue.map(f => ({
      ...f,
      tags: [...new Set([...f.tags, ...tagsArray])],
      category: bulkCategory,
      locationName: bulkLocation || f.locationName
    })));
    toast.success('Bulk tags applied to all files');
  };

  // Process the upload queue
  const processUploadQueue = async () => {
    if (uploadQueue.length === 0) return;

    setUploading(true);
    const uploadedItems: MediaItem[] = [];

    for (const queueItem of uploadQueue) {
      try {
        const formData = new FormData();
        formData.append('file', queueItem.file);
        formData.append('locationId', queueItem.locationId || 'media-library');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();

          // Determine media type
          const mediaType = queueItem.file.type.startsWith('video/') ? 'video' : 'image';

          uploadedItems.push({
            id: `media-${Date.now()}-${queueItem.id}`,
            url: data.url,
            filename: queueItem.file.name,
            uploadedAt: new Date().toISOString(),
            tags: queueItem.tags,
            description: queueItem.description,
            category: queueItem.category,
            locationName: queueItem.locationName,
            locationId: queueItem.locationId,
            mediaType
          });

          // Clean up object URL
          URL.revokeObjectURL(queueItem.url);
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        toast.error(`Failed to upload ${queueItem.file.name}`);
        console.error(error);
      }
    }

    setMedia([...uploadedItems, ...media]);
    setUploadQueue([]);
    setShowUploadDialog(false);
    setUploading(false);
    setBulkTags('');
    setBulkCategory('general');
    setBulkLocation('');
    toast.success(`Uploaded ${uploadedItems.length} file(s)`);
  };

  const deleteMedia = (id: string) => {
    if (confirm('Are you sure you want to delete this media?')) {
      setMedia(media.filter(m => m.id !== id));
      toast.success('Media deleted');
    }
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMedia(media.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Media updated');
  };

  // Toggle item selection
  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Select all visible items
  const selectAllVisible = () => {
    const newSelected = new Set(selectedItems);
    filteredMedia.forEach(item => newSelected.add(item.id));
    setSelectedItems(newSelected);
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  // Exit select mode
  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedItems(new Set());
  };

  // Apply bulk edits
  const applyBulkEdits = () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    setMedia(media.map(item => {
      if (!selectedItems.has(item.id)) return item;

      const updates: Partial<MediaItem> = {};

      // Update category if specified
      if (bulkEditCategory) {
        updates.category = bulkEditCategory;
      }

      // Update location if specified
      if (bulkEditLocation.trim()) {
        updates.locationName = bulkEditLocation.trim();
      }

      // Update tags
      if (bulkEditTags.trim()) {
        const newTags = bulkEditTags.split(',').map(t => t.trim()).filter(Boolean);
        if (bulkEditMode === 'replace') {
          updates.tags = newTags;
        } else {
          updates.tags = [...new Set([...(item.tags || []), ...newTags])];
        }
      }

      return { ...item, ...updates };
    }));

    toast.success(`Updated ${selectedItems.size} item(s)`);
    setShowBulkEditDialog(false);
    setBulkEditCategory('');
    setBulkEditLocation('');
    setBulkEditTags('');
  };

  // Bulk delete selected items
  const bulkDeleteSelected = () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`)) {
      setMedia(media.filter(m => !selectedItems.has(m.id)));
      setSelectedItems(new Set());
      toast.success(`Deleted ${selectedItems.size} item(s)`);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(media.map(m => m.locationName).filter(Boolean))) as string[];

  // Filter and sort media
  const filteredMedia = media
    .filter(m => {
      // Search filter
      const matchesSearch = m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Category filter
      if (filterCategory !== 'all' && m.category !== filterCategory) return false;

      // Media type filter
      if (filterMediaType !== 'all' && m.mediaType !== filterMediaType) return false;

      // Location filter
      if (filterLocation !== 'all' && m.locationName !== filterLocation) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'date-asc':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'name-asc':
          return a.filename.localeCompare(b.filename);
        case 'name-desc':
          return b.filename.localeCompare(a.filename);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-3 sm:px-4 md:px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors min-h-[44px]"
            >
              <ArrowLeft size={20} className="text-stone-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-stone-600">Back to Map</span>
            </Link>
            <div className="flex items-center gap-2">
              <ImageIcon className="text-orange-600 flex-shrink-0" size={20} />
              <h1 className="text-base sm:text-lg font-serif font-bold text-stone-800">
                Media Library
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            {/* Select Mode Toggle */}
            <button
              onClick={() => isSelectMode ? exitSelectMode() : setIsSelectMode(true)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium min-h-[44px] ${
                isSelectMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title={isSelectMode ? 'Exit Select' : 'Select'}
            >
              {isSelectMode ? <X size={18} /> : <CheckSquare size={18} />}
              <span className="hidden sm:inline">{isSelectMode ? 'Exit Select' : 'Select'}</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title={viewMode === 'grid' ? 'List View' : 'Grid View'}
            >
              {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
            </button>

            <button
              onClick={() => setShowUploadDialog(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm min-h-[44px] flex-1 sm:flex-initial justify-center"
            >
              <Upload size={18} />
              <span className="sm:hidden">Upload</span>
              <span className="hidden sm:inline">Bulk Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Search media by filename, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-6 bg-white rounded-lg border border-stone-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="before">Before</option>
                <option value="after">After</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Media Type
              </label>
              <select
                value={filterMediaType}
                onChange={(e) => setFilterMediaType(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('all');
                  setFilterMediaType('all');
                  setFilterLocation('all');
                  setSortBy('date-desc');
                  setSearchQuery('');
                }}
                className="w-full px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-stone-500">
            Showing {filteredMedia.length} of {media.length} items
            {selectedItems.size > 0 && (
              <span className="ml-2 text-purple-600 font-medium">
                ({selectedItems.size} selected)
              </span>
            )}
          </div>
        </div>

        {/* Bulk Action Bar - shown when in select mode */}
        {isSelectMode && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-purple-800 font-medium">
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={selectAllVisible}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Select All Visible ({filteredMedia.length})
                </button>
                {selectedItems.size > 0 && (
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Deselect All
                  </button>
                )}
              </div>

              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBulkEditDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit3 size={16} />
                    Bulk Edit
                  </button>
                  <button
                    onClick={bulkDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
            Uploading files...
          </div>
        )}

        {/* Media Grid/List */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <ImageIcon size={48} className="sm:w-16 sm:h-16 mx-auto text-stone-300 mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-stone-600 mb-2">No media yet</h2>
            <p className="text-sm sm:text-base text-stone-500 mb-4 px-4">Media from map locations will automatically sync here</p>
            <button
              onClick={() => setShowUploadDialog(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px]"
            >
              <Upload size={18} />
              Bulk Upload Files
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            : "space-y-3"
          }>
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all relative ${
                  viewMode === 'list' ? 'flex items-center' : ''
                } ${
                  selectedItems.has(item.id)
                    ? 'border-purple-500 ring-2 ring-purple-300'
                    : 'border-stone-200'
                }`}
                onClick={isSelectMode ? () => toggleItemSelection(item.id) : undefined}
              >
                {/* Selection Checkbox */}
                {isSelectMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemSelection(item.id);
                    }}
                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      selectedItems.has(item.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/90 text-stone-400 hover:bg-white hover:text-stone-600'
                    }`}
                  >
                    {selectedItems.has(item.id) ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                )}
                <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'}`}>
                  {item.mediaType === 'video' ? (
                    (() => {
                      const thumbnail = getYouTubeThumbnail(item.url);
                      const isLocalVideo = !item.url.includes('http://') && !item.url.includes('https://');
                      const embedUrl = getVideoEmbedUrl(item.url);
                      const isDescriptVideo = item.url.includes('share.descript.com');

                      return (
                        <div className="relative w-full h-full bg-stone-900 cursor-pointer" onClick={() => setSelectedMedia(item)}>
                          {thumbnail ? (
                            // Show YouTube thumbnail with play button
                            <>
                              <Image
                                src={thumbnail}
                                alt={item.filename}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-[20px] border-l-stone-800 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                                </div>
                              </div>
                            </>
                          ) : isLocalVideo ? (
                            // Local video file
                            <>
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                preload="metadata"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-[20px] border-l-stone-800 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                                </div>
                              </div>
                            </>
                          ) : isDescriptVideo ? (
                            // Descript video - show iframe preview
                            <>
                              <iframe
                                src={embedUrl}
                                className="w-full h-full pointer-events-none"
                                title={item.filename}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-[20px] border-l-stone-800 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                                </div>
                              </div>
                            </>
                          ) : (
                            // Vimeo or other embed video
                            <>
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700">
                                <div className="text-center text-white">
                                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                                    <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                                  </div>
                                  <p className="text-xs font-medium">Click to Play</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                  {/* Category Badge */}
                  {item.category && item.category !== 'general' && (
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                      item.category === 'before'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {item.category.toUpperCase()}
                    </div>
                  )}
                  {/* Video Badge */}
                  {item.mediaType === 'video' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 text-white rounded text-xs font-bold">
                      VIDEO
                    </div>
                  )}
                </div>

                <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Location Badge */}
                  {item.locationName && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        📍 {item.locationName}
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-medium text-stone-800 truncate mb-1">
                    {item.filename}
                  </p>
                  <p className="text-xs text-stone-500 mb-2">
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyUrl(item.url)}
                      className="flex-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Queue Dialog */}
        {showUploadDialog && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => uploadQueue.length === 0 && setShowUploadDialog(false)}
          >
            <div
              className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {uploadQueue.length > 0 ? `Upload Queue (${uploadQueue.length} files)` : 'Bulk Upload'}
                </h2>
                <p className="text-orange-100 text-xs sm:text-sm mt-1">
                  {uploadQueue.length > 0 ? 'Tag and organise your files before uploading' : 'Drag and drop files or click to browse'}
                </p>
              </div>

              {/* Drag and Drop Zone (shown when queue is empty) */}
              {uploadQueue.length === 0 && (
                <div className="flex-1 p-4 sm:p-6">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center transition-all min-h-[300px] ${
                      isDragging
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-stone-300 hover:border-orange-400 hover:bg-stone-50'
                    }`}
                  >
                    <Upload size={48} className={`sm:w-16 sm:h-16 mb-3 sm:mb-4 ${isDragging ? 'text-orange-500' : 'text-stone-400'}`} />
                    <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 text-center">
                      {isDragging ? 'Drop files here' : 'Drag & Drop Files'}
                    </h3>
                    <p className="text-sm sm:text-base text-stone-600 mb-4 sm:mb-6 text-center max-w-md px-4">
                      {isDragging
                        ? 'Release to add files to the upload queue'
                        : 'Drag images and videos here, or click the button below to browse'
                      }
                    </p>
                    <label className="px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium cursor-pointer text-sm sm:text-base min-h-[44px] flex items-center">
                      Browse Files
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => handleFilesSelected(e.target.files)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-stone-500 mt-3 sm:mt-4">
                      Supports: JPG, PNG, GIF, MP4, MOV, WebM
                    </p>
                  </div>
                </div>
              )}

              {/* Bulk Tagging Controls (only shown when files are in queue) */}
              {uploadQueue.length > 0 && (
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-4">
                  <h3 className="font-bold text-stone-800 mb-3">Apply to All Files</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value as 'before' | 'after' | 'general')}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="general">General</option>
                      <option value="before">Before</option>
                      <option value="after">After</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={bulkLocation}
                      onChange={(e) => setBulkLocation(e.target.value)}
                      placeholder="e.g., Pool, Theatre"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={bulkTags}
                      onChange={(e) => setBulkTags(e.target.value)}
                      placeholder="e.g., renovation, exterior"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                </div>
                  <button
                    onClick={applyBulkTags}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Apply Bulk Tags
                  </button>
                </div>
              )}

              {/* File List (only shown when files are in queue) */}
              {uploadQueue.length > 0 && (
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {uploadQueue.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-stone-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Preview */}
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-stone-100">
                          {file.preview ? (
                            <Image
                              src={file.preview}
                              alt={file.file.name}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-700">
                              <div className="text-white text-xs font-bold">VIDEO</div>
                            </div>
                          )}
                        </div>

                        {/* File Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-stone-800 truncate">{file.file.name}</p>
                              <p className="text-xs text-stone-500">
                                {(file.file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromQueue(file.id)}
                              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Individual Tags */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                            <div>
                              <label className="block text-xs font-medium text-stone-600 mb-1">
                                Category
                              </label>
                              <select
                                value={file.category}
                                onChange={(e) => updateQueueFile(file.id, { category: e.target.value as 'before' | 'after' | 'general' })}
                                className="w-full px-2 py-1 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                              >
                                <option value="general">General</option>
                                <option value="before">Before</option>
                                <option value="after">After</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-600 mb-1">
                                Location
                              </label>
                              <input
                                type="text"
                                value={file.locationName || ''}
                                onChange={(e) => updateQueueFile(file.id, { locationName: e.target.value })}
                                placeholder="Location name"
                                className="w-full px-2 py-1 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-600 mb-1">
                                Tags
                              </label>
                              <input
                                type="text"
                                value={file.tags.join(', ')}
                                onChange={(e) => updateQueueFile(file.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                placeholder="tag1, tag2"
                                className="w-full px-2 py-1 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-xs font-medium text-stone-600 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={file.description || ''}
                              onChange={(e) => updateQueueFile(file.id, { description: e.target.value })}
                              placeholder="Optional description"
                              className="w-full px-2 py-1 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                          </div>

                          {/* Current Tags Display */}
                          {file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {file.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="bg-stone-50 border-t border-stone-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                <button
                  onClick={() => {
                    uploadQueue.forEach(f => URL.revokeObjectURL(f.url));
                    setUploadQueue([]);
                    setShowUploadDialog(false);
                  }}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={processUploadQueue}
                  disabled={uploading || uploadQueue.length === 0}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] order-1 sm:order-2"
                >
                  {uploading ? 'Uploading...' : `Upload ${uploadQueue.length} File${uploadQueue.length === 1 ? '' : 's'}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Edit Dialog */}
        {showBulkEditDialog && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBulkEditDialog(false)}
          >
            <div
              className="bg-white rounded-xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-purple-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">
                  Bulk Edit {selectedItems.size} Item{selectedItems.size !== 1 ? 's' : ''}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  Leave fields empty to keep existing values
                </p>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={bulkEditCategory}
                    onChange={(e) => setBulkEditCategory(e.target.value as 'before' | 'after' | 'general' | '')}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Keep existing --</option>
                    <option value="general">General</option>
                    <option value="before">Before</option>
                    <option value="after">After</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={bulkEditLocation}
                    onChange={(e) => setBulkEditLocation(e.target.value)}
                    placeholder="Leave empty to keep existing"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {uniqueLocations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {uniqueLocations.slice(0, 5).map(loc => (
                        <button
                          key={loc}
                          onClick={() => setBulkEditLocation(loc)}
                          className="px-2 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 rounded transition-colors"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={bulkEditTags}
                    onChange={(e) => setBulkEditTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-stone-600">
                      <input
                        type="radio"
                        name="tagMode"
                        checked={bulkEditMode === 'add'}
                        onChange={() => setBulkEditMode('add')}
                        className="text-purple-600"
                      />
                      Add to existing tags
                    </label>
                    <label className="flex items-center gap-2 text-sm text-stone-600">
                      <input
                        type="radio"
                        name="tagMode"
                        checked={bulkEditMode === 'replace'}
                        onChange={() => setBulkEditMode('replace')}
                        className="text-purple-600"
                      />
                      Replace all tags
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowBulkEditDialog(false);
                    setBulkEditCategory('');
                    setBulkEditLocation('');
                    setBulkEditTags('');
                  }}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyBulkEdits}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Details Modal */}
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <div
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-stone-900">
                {selectedMedia.mediaType === 'video' ? (
                  (() => {
                    const isLocalVideo = !selectedMedia.url.includes('http://') && !selectedMedia.url.includes('https://');
                    const embedUrl = getVideoEmbedUrl(selectedMedia.url);

                    return isLocalVideo ? (
                      // Local video file
                      <video
                        src={selectedMedia.url}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      // YouTube, Vimeo, Descript, or other embed
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()
                ) : (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.filename}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 mb-2">{selectedMedia.filename}</h2>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {selectedMedia.locationName && (
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          📍 {selectedMedia.locationName}
                        </span>
                      )}
                      {selectedMedia.category && selectedMedia.category !== 'general' && (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          selectedMedia.category === 'before'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {selectedMedia.category.toUpperCase()}
                        </span>
                      )}
                      {selectedMedia.mediaType === 'video' && (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                          VIDEO
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Category
                      </label>
                      <select
                        value={selectedMedia.category || 'general'}
                        onChange={(e) => updateMedia(selectedMedia.id, { category: e.target.value as 'before' | 'after' | 'general' })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="general">General</option>
                        <option value="before">Before</option>
                        <option value="after">After</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={selectedMedia.locationName || ''}
                        onChange={(e) => updateMedia(selectedMedia.id, { locationName: e.target.value })}
                        placeholder="Location name"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={selectedMedia.description || ''}
                      onChange={(e) => updateMedia(selectedMedia.id, { description: e.target.value })}
                      placeholder="Add a description..."
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={selectedMedia.tags?.join(', ') || ''}
                      onChange={(e) => updateMedia(selectedMedia.id, {
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                      placeholder="location, type, category..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => copyUrl(selectedMedia.url)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
