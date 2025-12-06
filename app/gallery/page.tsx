'use client';

import { useState } from 'react';
import { MapPin, ArrowLeft, Camera, Video, Image as ImageIcon, Filter } from 'lucide-react';
import Link from 'next/link';
import { siteData } from '@/lib/siteData';
import { ImageMetadata, VideoEmbed } from '@/types';
import MasonryGallery from '@/components/MasonryGallery';
import PhotoGallery from '@/components/PhotoGallery';
import VideoPlayer from '@/components/VideoPlayer';
import Footer from '@/components/Footer';

type MediaType = 'all' | 'photos' | 'videos';
type LocationFilter = 'all' | string;

export default function GalleryPage() {
  const [mediaType, setMediaType] = useState<MediaType>('all');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Aggregate all media from all locations
  const allImages: (ImageMetadata & { locationTitle: string; locationId: string })[] = [];
  const allVideos: (VideoEmbed & { locationTitle: string; locationId: string })[] = [];

  siteData.locations.forEach((location) => {
    if (location.images) {
      location.images.forEach((img) => {
        allImages.push({
          ...img,
          locationTitle: location.title,
          locationId: location.id,
        });
      });
    }
    if (location.videos) {
      location.videos.forEach((vid) => {
        allVideos.push({
          ...vid,
          locationTitle: location.title,
          locationId: location.id,
        });
      });
    }
  });

  // Filter media
  const filteredImages = locationFilter === 'all'
    ? allImages
    : allImages.filter(img => img.locationId === locationFilter);

  const filteredVideos = locationFilter === 'all'
    ? allVideos
    : allVideos.filter(vid => vid.locationId === locationFilter);

  // Get locations that have media
  const locationsWithMedia = siteData.locations.filter(
    loc => (loc.images && loc.images.length > 0) || (loc.videos && loc.videos.length > 0)
  );

  const showPhotos = mediaType === 'all' || mediaType === 'photos';
  const showVideos = mediaType === 'all' || mediaType === 'videos';

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 md:px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-stone-600" />
              <span className="text-sm font-medium text-stone-600">Back to Map</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <Camera className="text-orange-600" />
              <h1 className="text-lg font-serif font-bold text-stone-800">
                Media Gallery
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Camera size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{allImages.length}</p>
                <p className="text-sm text-stone-600">Photos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Video size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{allVideos.length}</p>
                <p className="text-sm text-stone-600">Videos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{locationsWithMedia.length}</p>
                <p className="text-sm text-stone-600">Locations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900 uppercase">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Media Type Filter */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-2">
                Media Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMediaType('all')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    mediaType === 'all'
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMediaType('photos')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                    mediaType === 'photos'
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Camera size={16} />
                  Photos
                </button>
                <button
                  onClick={() => setMediaType('videos')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                    mediaType === 'videos'
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Video size={16} />
                  Videos
                </button>
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-2">
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Locations</option>
                {locationsWithMedia.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        {showPhotos && filteredImages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                <Camera size={24} className="text-orange-600" />
                Photos ({filteredImages.length})
              </h2>
              <button
                onClick={() => {
                  setGalleryIndex(0);
                  setGalleryOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <ImageIcon size={16} />
                View Fullscreen
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <MasonryGallery
                images={filteredImages.map((img, idx) => ({
                  ...img,
                  caption: img.caption || img.locationTitle,
                }))}
                onImageClick={(index) => {
                  setGalleryIndex(index);
                  setGalleryOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Videos Section */}
        {showVideos && filteredVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Video size={24} className="text-orange-600" />
              Videos ({filteredVideos.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVideos.map((video, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">{video.title}</h3>
                      <p className="text-sm text-stone-600">{video.locationTitle}</p>
                    </div>
                  </div>
                  <VideoPlayer video={video} showDescription={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((showPhotos && filteredImages.length === 0) || (showVideos && filteredVideos.length === 0)) && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-stone-200 p-12 text-center">
            <ImageIcon size={48} className="mx-auto mb-4 text-stone-300" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">No media found</h3>
            <p className="text-stone-600">
              {locationFilter !== 'all'
                ? 'This location doesn\'t have any media yet.'
                : 'Photos and videos will appear here as they are added to locations.'}
            </p>
          </div>
        )}
      </main>

      {/* Photo Gallery - Fullscreen */}
      {filteredImages.length > 0 && (
        <PhotoGallery
          images={filteredImages}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={galleryIndex}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
