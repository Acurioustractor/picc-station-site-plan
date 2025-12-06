'use client';

import { X, Image as ImageIcon, Video, Camera } from 'lucide-react';
import { Location } from '@/types';
import VideoPlayer from './VideoPlayer';
import CompletionTracker from './CompletionTracker';
import MasonryGallery from './MasonryGallery';
import NotesSection from './NotesSection';

interface LocationSidebarProps {
  location: Location | null;
  onClose: () => void;
  onOpenGallery: (index: number) => void;
}

export default function LocationSidebar({ location, onClose, onOpenGallery }: LocationSidebarProps) {
  if (!location) return null;

  const getPinColor = (type: string) => {
    switch (type) {
      case 'building':
        return 'bg-blue-500';
      case 'nature':
        return 'bg-green-500';
      case 'utility':
        return 'bg-orange-500';
      case 'infrastructure':
        return 'bg-purple-500';
      default:
        return 'bg-slate-700';
    }
  };

  const hasMedia = (location.images && location.images.length > 0) || (location.videos && location.videos.length > 0);

  return (
    <>
      <div className="w-full lg:w-96 bg-white lg:border-l border-stone-200 shadow-2xl flex flex-col h-full overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex justify-between items-start bg-stone-50">
          <div className="flex-1 min-w-0">
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 text-white ${getPinColor(location.type)}`}>
              {location.type}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 break-words">
              {location.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 hover:bg-stone-200 p-2 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ml-2 flex-shrink-0"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Completion Tracker */}
          <CompletionTracker
            tasks={location.tasks}
            completionPercentage={location.completionPercentage}
          />

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase mb-2">Description</h3>
            <p className="text-stone-600 leading-relaxed">
              {location.description}
            </p>
          </div>

          {/* Overview */}
          {location.overview && (
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase mb-2">Overview of Work</h3>
              <p className="text-stone-600 leading-relaxed">
                {location.overview}
              </p>
            </div>
          )}

          {/* Future Scope */}
          {location.futureScope && (
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase mb-2">Future Scope</h3>
              <p className="text-stone-600 leading-relaxed">
                {location.futureScope}
              </p>
            </div>
          )}

          {/* Project Notes */}
          <NotesSection notes={location.notes} />

          {/* Before/After Comparison - Hidden for now, access via photo gallery */}

          {/* Photo Gallery */}
          {location.images && location.images.length > 0 ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-bold text-stone-900 uppercase flex items-center gap-2">
                  <Camera size={16} /> Photo Gallery ({location.images.length})
                </h3>
                <button
                  onClick={() => onOpenGallery(0)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors justify-center min-h-[44px]"
                >
                  <ImageIcon size={16} />
                  <span className="whitespace-nowrap">View Fullscreen</span>
                </button>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                Click any image or &ldquo;View Fullscreen&rdquo; to open the gallery over the entire screen
              </p>
              <MasonryGallery
                images={location.images}
                onImageClick={(index) => onOpenGallery(index)}
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-stone-200 rounded-xl aspect-video flex flex-col items-center justify-center text-stone-400 bg-stone-50">
              <ImageIcon size={32} className="mb-2 opacity-50" />
              <span className="text-sm">No photos yet</span>
            </div>
          )}

          {/* Videos */}
          {location.videos && location.videos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase mb-3 flex items-center gap-2">
                <Video size={16} /> Videos
              </h3>
              <div className="space-y-6">
                {location.videos.map((video) => (
                  <div key={video.id}>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">{video.title}</h4>
                    <VideoPlayer video={video} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasMedia && (
            <div className="text-center py-8 text-stone-400">
              <p className="text-sm">
                Photos and videos will be added as the project develops.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
