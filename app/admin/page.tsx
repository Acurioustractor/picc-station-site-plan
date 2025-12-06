'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Save, Upload, Plus, Trash2, Copy, Eye, Image as ImageIcon, Video, ListChecks, MapPin, Layers, StickyNote } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Location, VideoEmbed } from '@/types';
import { siteData } from '@/lib/siteData';
import TaskEditor from '@/components/admin/TaskEditor';
import ImageMetadataEditor from '@/components/admin/ImageMetadataEditor';
import NotesEditor from '@/components/admin/NotesEditor';
import DeleteLocationDialog from '@/components/admin/DeleteLocationDialog';
import DuplicateLocationDialog from '@/components/admin/DuplicateLocationDialog';

type TabType = 'basic' | 'tasks' | 'media' | 'notes';

export default function AdminPanel() {
  const [locations, setLocations] = useState<Location[]>(siteData.locations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [showAddPinModal, setShowAddPinModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newPin, setNewPin] = useState({
    title: '',
    type: 'building' as 'building' | 'nature' | 'utility' | 'infrastructure',
    description: ''
  });
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [locationToDuplicate, setLocationToDuplicate] = useState<Location | null>(null);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations })
      });

      if (response.ok) {
        setSaveMessage('✅ Saved successfully!');
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      setSaveMessage('❌ Save failed - check console');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Save to sessionStorage so preview can access it
    sessionStorage.setItem('admin-preview-data', JSON.stringify(locations));
    window.open('/?preview=true', '_blank');
  };

  const handleImageUpload = async (locationId: string, file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('locationId', locationId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Image upload failed');
      console.error(error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const updateLocation = (id: string, field: keyof Location, value: any) => {
    // Use functional setState to avoid stale closure issues
    setLocations(prevLocations => {
      const updatedLocations = prevLocations.map(loc =>
        loc.id === id ? { ...loc, [field]: value } : loc
      );
      return updatedLocations;
    });

    // Update selectedLocation if it's the one being updated
    setSelectedLocation(prevSelected => {
      if (prevSelected?.id === id) {
        return { ...prevSelected, [field]: value };
      }
      return prevSelected;
    });

    setHasUnsavedChanges(true);
  };

  const addVideo = (locationId: string) => {
    const url = prompt('Enter video URL (YouTube, Vimeo, or direct):');
    const title = prompt('Enter video title:');
    if (url && title) {
      const location = locations.find(l => l.id === locationId);
      if (location) {
        const type: 'youtube' | 'vimeo' | 'direct' =
          url.includes('youtube.com') || url.includes('youtu.be') ? 'youtube' :
          url.includes('vimeo.com') ? 'vimeo' : 'direct';

        const newVideo: VideoEmbed = {
          id: Date.now().toString(),
          title,
          url,
          type
        };
        const newVideos = [...(location.videos || []), newVideo];
        updateLocation(locationId, 'videos', newVideos);
      }
    }
  };

  const removeVideo = (locationId: string, videoId: string) => {
    const location = locations.find(l => l.id === locationId);
    if (location && location.videos) {
      const newVideos = location.videos.filter(v => v.id !== videoId);
      updateLocation(locationId, 'videos', newVideos);
    }
  };

  const handleAddNewPin = async () => {
    if (!newPin.title) {
      toast.warning('Please enter a title');
      return;
    }

    const id = newPin.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newLocation: Location = {
      id,
      x: 50,
      y: 50,
      title: newPin.title,
      type: newPin.type,
      description: newPin.description || `${newPin.title} location`,
      overview: '',
      futureScope: '',
      images: [],
      videos: [],
      completionPercentage: 0,
      tasks: [],
      notes: []
    };

    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    setSelectedLocation(newLocation);
    setShowAddPinModal(false);
    setNewPin({ title: '', type: 'building', description: '' });
    setHasUnsavedChanges(true);

    toast.success(`Pin "${newPin.title}" added!`, {
      description: 'Next: Click "Position Pins" button to place it on the map.',
      duration: 5000,
    });
  };

  const handleDeleteLocation = () => {
    if (!locationToDelete) return;

    const updatedLocations = locations.filter(loc => loc.id !== locationToDelete.id);
    setLocations(updatedLocations);

    // If the deleted location was selected, clear selection
    if (selectedLocation?.id === locationToDelete.id) {
      setSelectedLocation(null);
    }

    setLocationToDelete(null);
    setHasUnsavedChanges(true);
    toast.success(`Deleted "${locationToDelete.title}"`, {
      description: 'Remember to save your changes!',
      duration: 4000,
    });
  };

  const handleDuplicateLocation = (newTitle: string) => {
    if (!locationToDuplicate) return;

    // Create a new ID based on the new title
    const id = newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Deep clone the location with new ID and title
    const duplicatedLocation: Location = {
      ...locationToDuplicate,
      id,
      title: newTitle,
      x: 100, // Default position
      y: 100,
      // Clone arrays to avoid reference issues
      images: locationToDuplicate.images ? [...locationToDuplicate.images] : [],
      videos: locationToDuplicate.videos ? [...locationToDuplicate.videos] : [],
      tasks: locationToDuplicate.tasks ? JSON.parse(JSON.stringify(locationToDuplicate.tasks)) : [],
      notes: locationToDuplicate.notes ? JSON.parse(JSON.stringify(locationToDuplicate.notes)) : []
    };

    const updatedLocations = [...locations, duplicatedLocation];
    setLocations(updatedLocations);
    setSelectedLocation(duplicatedLocation);
    setLocationToDuplicate(null);
    setHasUnsavedChanges(true);

    toast.success(`Created "${newTitle}" as a duplicate`, {
      description: 'Use "Position Pins" to place it on the map.',
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Content Management</h1>
            {hasUnsavedChanges && (
              <p className="text-xs text-amber-600 mt-1">● Unsaved changes</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-sm font-medium">{saveMessage}</span>
            )}
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye size={18} />
              Preview
            </button>
            <Link
              href="/admin/pins"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <MapPin size={18} />
              Position Pins
            </Link>
            <Link
              href="/admin/align-live"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Layers size={18} />
              Fix Alignment
            </Link>
            <button
              onClick={handleSaveData}
              disabled={!hasUnsavedChanges || isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                hasUnsavedChanges && !isSaving
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Location List */}
        <div className="w-80 bg-white border-r border-stone-200 overflow-y-auto">
          <div className="p-4 border-b border-stone-200 space-y-3">
            <h2 className="font-bold text-stone-800">Locations</h2>
            <button
              onClick={() => setShowAddPinModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus size={18} />
              Add New Pin
            </button>
          </div>
          <div className="divide-y divide-stone-100">
            {locations.map((loc) => {
              const imageCount = loc.images?.length || 0;
              const videoCount = loc.videos?.length || 0;
              const taskCount = loc.tasks?.length || 0;
              const completedTasks = loc.tasks?.filter(t => t.status === 'completed').length || 0;
              const hasContent = imageCount > 0 || videoCount > 0 || taskCount > 0;

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full p-4 text-left hover:bg-stone-50 transition-colors cursor-pointer ${
                    selectedLocation?.id === loc.id ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-stone-800 truncate">{loc.title}</h3>
                      <p className="text-xs text-stone-500 mt-1 capitalize">{loc.type}</p>

                      {/* Progress bar */}
                      {loc.completionPercentage !== undefined && loc.completionPercentage > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-stone-600">Progress</span>
                            <span className="font-medium text-blue-600">{loc.completionPercentage}%</span>
                          </div>
                          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                              style={{ width: `${loc.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Content indicators */}
                      {hasContent && (
                        <div className="flex gap-2 mt-2">
                          {imageCount > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              {imageCount} 📷
                            </span>
                          )}
                          {videoCount > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                              {videoCount} 🎥
                            </span>
                          )}
                          {taskCount > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {completedTasks}/{taskCount} ✓
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocationToDuplicate(loc);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Duplicate location"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocationToDelete(loc);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete location"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedLocation ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedLocation.title}</h2>
                <span className="inline-block px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded">
                  {selectedLocation.id}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-stone-200">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'basic'
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'tasks'
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ListChecks size={16} />
                  Tasks
                  {selectedLocation.tasks && selectedLocation.tasks.length > 0 && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {selectedLocation.tasks.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'media'
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ImageIcon size={16} />
                  Media
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'notes'
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <StickyNote size={16} />
                  Notes
                  {selectedLocation.notes && selectedLocation.notes.length > 0 && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {selectedLocation.notes.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-800">Basic Information</h3>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={selectedLocation.title}
                    onChange={(e) => updateLocation(selectedLocation.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                  <select
                    value={selectedLocation.type}
                    onChange={(e) => updateLocation(selectedLocation.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="building">Building</option>
                    <option value="nature">Nature</option>
                    <option value="utility">Utility</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                  <textarea
                    value={selectedLocation.description}
                    onChange={(e) => updateLocation(selectedLocation.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Overview of Work</label>
                  <textarea
                    value={selectedLocation.overview || ''}
                    onChange={(e) => updateLocation(selectedLocation.id, 'overview', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Future Scope</label>
                  <textarea
                    value={selectedLocation.futureScope || ''}
                    onChange={(e) => updateLocation(selectedLocation.id, 'futureScope', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <TaskEditor location={selectedLocation} onUpdate={updateLocation} />
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <>
                  {/* Images */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-stone-800 flex items-center gap-2 mb-4">
                      <ImageIcon size={20} />
                      Images
                    </h3>
                    <ImageMetadataEditor location={selectedLocation} onUpdate={updateLocation} />
                  </div>

              {/* Videos */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <Video size={20} />
                    Videos
                  </h3>
                  <button
                    onClick={() => addVideo(selectedLocation.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Video
                  </button>
                </div>

                {selectedLocation.videos && selectedLocation.videos.length > 0 ? (
                  <div className="space-y-3">
                    {selectedLocation.videos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-stone-800 text-sm">{video.title}</p>
                          <p className="text-xs text-stone-500 mt-1">{video.url}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-stone-200 text-stone-700 text-xs rounded">
                            {video.type}
                          </span>
                        </div>
                        <button
                          onClick={() => removeVideo(selectedLocation.id, video.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-400 text-sm text-center py-8">No videos added yet</p>
                )}
              </div>
                </>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <NotesEditor location={selectedLocation} onUpdate={updateLocation} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-stone-400">
              <p>Select a location to edit</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Pin Modal */}
      {showAddPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-bold text-stone-800">Add New Pin</h2>
              <p className="text-sm text-stone-500 mt-1">Fill in basic info, then position it using Pin Review</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={newPin.title}
                  onChange={(e) => setNewPin({ ...newPin, title: e.target.value })}
                  placeholder="e.g., Community Garden"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Type *
                </label>
                <select
                  value={newPin.type}
                  onChange={(e) => setNewPin({ ...newPin, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="building">Building (Blue)</option>
                  <option value="nature">Nature (Green)</option>
                  <option value="utility">Utility (Orange)</option>
                  <option value="infrastructure">Infrastructure (Purple)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Short Description
                </label>
                <textarea
                  value={newPin.description}
                  onChange={(e) => setNewPin({ ...newPin, description: e.target.value })}
                  placeholder="Brief description for the pin hover tooltip"
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-stone-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAddPinModal(false);
                  setNewPin({ title: '', type: 'building', description: '' });
                }}
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewPin}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Add Pin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Location Dialog */}
      {locationToDelete && (
        <DeleteLocationDialog
          location={locationToDelete}
          onConfirm={handleDeleteLocation}
          onCancel={() => setLocationToDelete(null)}
        />
      )}

      {/* Duplicate Location Dialog */}
      {locationToDuplicate && (
        <DuplicateLocationDialog
          location={locationToDuplicate}
          onConfirm={handleDuplicateLocation}
          onCancel={() => setLocationToDuplicate(null)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e7e5e4',
            padding: '16px',
          },
          className: 'sonner-toast',
        }}
        richColors
      />
    </div>
  );
}
