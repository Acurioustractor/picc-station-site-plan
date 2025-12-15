'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Info, Plus, BookOpen, DollarSign, Camera, FolderOpen, FileText } from 'lucide-react';
import { ImageLayer, Location } from '@/types';
import { siteData } from '@/lib/siteData';
import ImageSlider from './ImageSlider';
import LocationSidebar from './LocationSidebar';
import AboutModal from './AboutModal';
import PhotoGallery from './PhotoGallery';

export default function InteractiveMap() {
  const [currentLayer, setCurrentLayer] = useState<ImageLayer>('photo');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Check if user has dismissed the about modal before
  useEffect(() => {
    const dismissed = localStorage.getItem('picc-about-modal-dismissed');
    if (!dismissed) {
      setShowAboutModal(true);
    }
  }, []);

  const handlePinClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    // Close sidebar if clicking on the map background
    if (!selectedLocation) return;
    if ((e.target as HTMLElement).closest('.map-pin')) return;
    setSelectedLocation(null);
  };

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

  const getImagePath = () => {
    switch (currentLayer) {
      case 'drawing':
        return '/images/site-plan.webp';
      case 'photo':
        return '/images/old-site.webp';
      case 'photo-after':
        return '/images/current-site.webp';
      case 'sketch':
        return '/images/sketch-reference.webp';
      default:
        return '/images/old-site.webp';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stone-100 font-sans text-slate-800 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-b from-white to-stone-50/50 border-b border-stone-200/60 px-3 sm:px-4 md:px-8 py-3 md:py-4 flex flex-col lg:flex-row items-center justify-between shadow-sm z-20 gap-3 md:gap-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/images/mounty-logo.png"
                alt="Mounty Yarns Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
              />
            </div>
            <div className="border-l border-stone-300 pl-2 sm:pl-4 h-8 sm:h-12 flex items-center">
              <Link href="/" className="text-lg sm:text-xl md:text-2xl font-serif font-light tracking-wide text-stone-800 relative hover:opacity-80 transition-opacity">
                <span className="font-semibold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">Mounty</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap justify-center w-full lg:w-auto">
          {/* Image Layer Buttons */}
          <div className="w-full lg:w-auto mb-2 lg:mb-0 lg:mr-4">
            <ImageSlider onLayerChange={setCurrentLayer} currentLayer={currentLayer} />
          </div>

          {/* Navigation Links - Icon only on mobile, text on larger screens */}
          <Link
            href="/wiki"
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 min-w-[44px] justify-center"
            title="Wiki"
          >
            <BookOpen size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm hidden md:inline">Wiki</span>
          </Link>

          <Link
            href="/report"
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 min-w-[44px] justify-center"
            title="Report"
          >
            <FileText size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm hidden md:inline">Report</span>
          </Link>

          <Link
            href="/grants"
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 min-w-[44px] justify-center"
            title="Grants"
          >
            <DollarSign size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm hidden md:inline">Grants</span>
          </Link>

          <Link
            href="/gallery"
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 min-w-[44px] justify-center"
            title="Gallery"
          >
            <Camera size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm hidden md:inline">Gallery</span>
          </Link>

          <Link
            href="/media"
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 min-w-[44px] justify-center"
            title="Media"
          >
            <FolderOpen size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm hidden md:inline">Media</span>
          </Link>

          {/* About Button */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-200 min-w-[44px] justify-center"
            title="About"
          >
            <Info size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm hidden md:inline">About</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map Area */}
        <div className="flex-1 bg-stone-200 relative overflow-auto">
          <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
            <div
              ref={mapContainerRef}
              className="relative shadow-2xl bg-white cursor-default"
              style={{
                width: '100%',
                maxWidth: 'min(100%, 1920px)',
                aspectRatio: '1920 / 1440'
              }}
              onClick={handleMapClick}
            >
              {/* Current Layer Image - EXACT size match */}
              <Image
                src={getImagePath()}
                alt={`${currentLayer} view`}
                width={1920}
                height={1440}
                className="w-full h-full select-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw, 1920px"
                priority
                style={{ display: 'block' }}
              />

            {/* Location Pins */}
            {siteData.locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handlePinClick(location)}
                className="map-pin absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none z-10"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
              >
                {/* Pulse Effect */}
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping ${getPinColor(location.type)}`}></span>

                {/* Pin Head */}
                <div className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-lg border-2 border-white text-white ${getPinColor(location.type)} hover:scale-125 transition-transform`}>
                  {selectedLocation?.id === location.id ? (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  ) : (
                    <Plus size={12} className="transform rotate-45 group-hover:rotate-0 transition-transform" />
                  )}
                </div>

                {/* Completion Badge */}
                {location.completionPercentage !== undefined && location.completionPercentage > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-md border border-white">
                    {location.completionPercentage}
                  </div>
                )}

                {/* Hover Tooltip */}
                {selectedLocation?.id !== location.id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-stone-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                    <div className="font-medium">{location.title}</div>
                    {location.completionPercentage !== undefined && location.completionPercentage > 0 && (
                      <div className="text-[10px] text-blue-300 mt-0.5">
                        {location.completionPercentage}% complete
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-stone-200 z-10 hidden md:block">
              <h3 className="text-xs font-bold text-stone-500 uppercase mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-stone-700">Building</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-stone-700">Nature</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-stone-700">Utility</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-stone-700">Infrastructure</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Sidebar - full screen on mobile, slides in from right on desktop */}
        <div
          className={`fixed lg:relative right-0 top-0 bottom-0 left-0 lg:left-auto z-30 transform transition-transform duration-300 ease-in-out ${
            selectedLocation ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <LocationSidebar
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            onOpenGallery={(index) => {
              setGalleryIndex(index);
              setGalleryOpen(true);
            }}
          />
        </div>
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Photo Gallery - Rendered at root level to cover everything */}
      {selectedLocation?.images && (
        <PhotoGallery
          images={selectedLocation.images}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={galleryIndex}
        />
      )}
    </div>
  );
}
