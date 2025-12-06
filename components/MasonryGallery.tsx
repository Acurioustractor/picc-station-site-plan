'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageMetadata } from '@/types';

interface MasonryGalleryProps {
  images: ImageMetadata[];
  onImageClick?: (index: number) => void;
}

export default function MasonryGallery({ images, onImageClick }: MasonryGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const getCategoryColor = (category?: ImageMetadata['category']) => {
    switch (category) {
      case 'before':
        return 'bg-red-500';
      case 'during':
        return 'bg-orange-500';
      case 'after':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getCategoryLabel = (category?: ImageMetadata['category']) => {
    if (!category || category === 'general') return null;
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="columns-1 md:columns-2 gap-3 space-y-3">
      {images.map((img, index) => (
        <div
          key={index}
          className="break-inside-avoid relative group cursor-pointer"
          onClick={() => onImageClick?.(index)}
        >
          {/* Image Container */}
          <div className="relative rounded-lg overflow-hidden border-2 border-stone-200 hover:border-orange-500 transition-all duration-300 hover:shadow-xl bg-stone-100">
            <Image
              src={img.url}
              alt={img.caption || `Image ${index + 1}`}
              width={400}
              height={300}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                {img.caption && (
                  <p className="text-white text-sm font-medium mb-1 line-clamp-2">
                    {img.caption}
                  </p>
                )}
                {img.description && (
                  <p className="text-white/80 text-xs line-clamp-2">
                    {img.description}
                  </p>
                )}
              </div>
            </div>

            {/* Category Badge */}
            {getCategoryLabel(img.category) && (
              <div className={`absolute top-2 left-2 px-2 py-1 ${getCategoryColor(img.category)} text-white text-xs font-bold rounded-full shadow-lg`}>
                {getCategoryLabel(img.category)}
              </div>
            )}

            {/* Before/After Indicator */}
            {img.isBeforeAfter && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                Compare
              </div>
            )}
          </div>

          {/* Caption Below (visible always) */}
          {img.caption && (
            <div className="mt-2 px-1">
              <p className="text-sm font-medium text-stone-800 line-clamp-2">
                {img.caption}
              </p>
              {img.photographer && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Photo by {img.photographer}
                </p>
              )}
              {img.dateTaken && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {new Date(img.dateTaken).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
