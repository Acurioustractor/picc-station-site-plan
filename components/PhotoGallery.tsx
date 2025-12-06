'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera, Calendar } from 'lucide-react';
import { ImageMetadata } from '@/types';

interface PhotoGalleryProps {
  images: ImageMetadata[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function PhotoGallery({ images, isOpen, onClose, initialIndex = 0 }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation - MUST be before early return
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10"
      >
        <X size={32} />
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Main image */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        <div className="relative w-full h-full">
          <Image
            src={currentImage.url}
            alt={currentImage.caption || `Photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Image metadata overlay */}
        {(currentImage.caption || currentImage.description || currentImage.photographer || currentImage.dateTaken) && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-2xl w-full mx-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-xl">
            {currentImage.caption && (
              <h3 className="text-lg font-bold mb-2">{currentImage.caption}</h3>
            )}
            {currentImage.description && (
              <p className="text-sm text-white/90 mb-2">{currentImage.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-xs text-white/70">
              {currentImage.photographer && (
                <span className="flex items-center gap-1">
                  <Camera size={14} />
                  {currentImage.photographer}
                </span>
              )}
              {currentImage.dateTaken && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(currentImage.dateTaken).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
              {currentImage.category && currentImage.category !== 'general' && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  currentImage.category === 'before' ? 'bg-red-500/80' :
                  currentImage.category === 'during' ? 'bg-orange-500/80' :
                  currentImage.category === 'after' ? 'bg-green-500/80' :
                  'bg-blue-500/80'
                }`}>
                  {currentImage.category.charAt(0).toUpperCase() + currentImage.category.slice(1)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image counter */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-2 rounded-lg max-w-full overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-orange-500 scale-110' : 'border-white/30 hover:border-white/60'
              }`}
              title={img.caption || `Photo ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.caption || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
