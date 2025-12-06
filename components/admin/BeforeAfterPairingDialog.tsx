'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Check, Link2 } from 'lucide-react';
import { ImageMetadata } from '@/types';

interface BeforeAfterPairingDialogProps {
  images: ImageMetadata[];
  initialIndex: number;
  onConfirm: (index1: number, index2: number) => void;
  onCancel: () => void;
}

export default function BeforeAfterPairingDialog({
  images,
  initialIndex,
  onConfirm,
  onCancel,
}: BeforeAfterPairingDialogProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([initialIndex]);

  const handleImageClick = (index: number) => {
    if (index === initialIndex) return; // Can't pair with itself

    if (selectedIndices.includes(index)) {
      // Deselect
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      // Select (max 2 images)
      if (selectedIndices.length < 2) {
        setSelectedIndices([...selectedIndices, index]);
      } else {
        // Replace the second selection
        setSelectedIndices([selectedIndices[0], index]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedIndices.length === 2) {
      onConfirm(selectedIndices[0], selectedIndices[1]);
    }
  };

  const canConfirm = selectedIndices.length === 2;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Link2 className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800">Create Before/After Pair</h2>
              <p className="text-sm text-stone-600 mt-1">
                Click on two images to pair them together for before/after comparison
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Selection Status */}
        <div className="px-6 py-3 bg-purple-50 border-b border-purple-200">
          <p className="text-sm font-medium text-purple-800">
            {selectedIndices.length === 1 ? (
              <>Selected 1 image. Click another image to create a pair.</>
            ) : selectedIndices.length === 2 ? (
              <>
                <Check className="inline mr-1" size={16} />
                Ready to pair images #{selectedIndices[0]} and #{selectedIndices[1]}
              </>
            ) : (
              <>No images selected</>
            )}
          </p>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => {
              const isSelected = selectedIndices.includes(index);
              const isInitial = index === initialIndex;
              const isDisabled = isInitial && selectedIndices.length === 1;

              return (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  disabled={isDisabled}
                  className={`relative aspect-video rounded-lg overflow-hidden border-4 transition-all ${
                    isSelected
                      ? 'border-purple-500 ring-4 ring-purple-200'
                      : 'border-stone-200 hover:border-purple-300'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Image
                    src={img.url}
                    alt={img.caption || `Image ${index}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />

                  {/* Selection Badge */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="px-2 py-1 bg-stone-900/80 text-white text-xs font-mono rounded">
                      #{index}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded flex items-center gap-1">
                        <Check size={12} />
                        {selectedIndices.indexOf(index) === 0 ? 'BEFORE' : 'AFTER'}
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-xs text-white font-medium truncate">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-stone-200 bg-stone-50">
          <p className="text-sm text-stone-600">
            The first selected image will be the &ldquo;before&rdquo;, the second will be &ldquo;after&rdquo;
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link2 size={18} />
              Create Pair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
