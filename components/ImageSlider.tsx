'use client';

import { ImageLayer } from '@/types';
import { Image as ImageIcon, Pencil, Camera, Sparkles } from 'lucide-react';

interface ImageSliderProps {
  onLayerChange: (layer: ImageLayer) => void;
  currentLayer?: ImageLayer;
}

export default function ImageSlider({ onLayerChange, currentLayer = 'photo' }: ImageSliderProps) {
  const layers: { id: ImageLayer; label: string; icon: any }[] = [
    { id: 'photo', label: 'Before', icon: Camera },
    { id: 'photo-after', label: 'After', icon: Sparkles },
    { id: 'drawing', label: 'Drawing (Future)', icon: Pencil }
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-stone-100 p-1 rounded-lg w-full lg:w-auto justify-center">
      {layers.map((layer) => {
        const Icon = layer.icon;
        const isActive = currentLayer === layer.id;

        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            title={layer.label}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-md transition-all font-medium text-xs sm:text-sm min-w-[44px] justify-center ${
              isActive
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-stone-600 hover:bg-white/50'
            }`}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="hidden sm:inline">{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
