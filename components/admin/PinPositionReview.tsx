'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Check, AlertCircle, Copy, Download } from 'lucide-react';
import { Location, ImageLayer } from '@/types';

interface PinPositionReviewProps {
  locations: Location[];
  onUpdate?: (locations: Location[]) => void;
}

export default function PinPositionReview({ locations, onUpdate }: PinPositionReviewProps) {
  const [currentLayer, setCurrentLayer] = useState<ImageLayer>('photo');
  const [editingLocations, setEditingLocations] = useState<Location[]>(locations);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedPin) return;

    const container = mapContainerRef.current;
    if (!container) return;

    // Get container bounds
    const rect = container.getBoundingClientRect();

    // Calculate click position relative to container
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to percentage (container is exact image size due to aspect ratio)
    const x = (clickX / rect.width) * 100;
    const y = (clickY / rect.height) * 100;

    // Clamp to 0-100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    const updatedLocations = editingLocations.map(loc =>
      loc.id === selectedPin ? { ...loc, x: clampedX, y: clampedY } : loc
    );

    setEditingLocations(updatedLocations);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save directly to siteData.ts via API
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: editingLocations })
      });

      if (response.ok) {
        setHasChanges(false);
        alert('✅ Pin positions saved! Refresh the main map to see changes.');
        if (onUpdate) {
          onUpdate(editingLocations);
        }
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      alert('❌ Save failed - check console');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <MapPin className="text-orange-600" />
              Pin Position Review
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Click a pin to select it, then click on the map to reposition
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Layer Selector */}
            <select
              value={currentLayer}
              onChange={(e) => setCurrentLayer(e.target.value as ImageLayer)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
            >
              <option value="drawing">Drawing</option>
              <option value="photo">Photo</option>
              <option value="sketch">Sketch</option>
            </select>

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                hasChanges && !isSaving
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Check size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {hasChanges && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle size={16} />
            You have unsaved changes
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div
            ref={mapContainerRef}
            className="relative mx-auto shadow-2xl bg-white cursor-crosshair"
            onClick={handleMapClick}
            style={{
              width: '100%',
              maxWidth: 'min(100%, 1920px)',
              aspectRatio: '1920 / 1440'
            }}
          >
            {/* Map Image - EXACT size match */}
            <Image
              src={getImagePath()}
              alt={`${currentLayer} view`}
              width={1920}
              height={1440}
              className="w-full h-full select-none pointer-events-none"
              sizes="(max-width: 1920px) 100vw, 1920px"
              priority
              style={{ display: 'block' }}
            />

            {/* Location Pins */}
            {editingLocations.map((location) => (
              <button
                key={location.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin(location.id === selectedPin ? null : location.id);
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 focus:outline-none ${
                  selectedPin === location.id ? 'scale-150 z-20' : 'z-10'
                }`}
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full shadow-lg border-2 text-white ${
                    selectedPin === location.id
                      ? 'border-yellow-400 ring-4 ring-yellow-200'
                      : 'border-white'
                  } ${getPinColor(location.type)}`}
                >
                  {selectedPin === location.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar with pin list */}
        <div className="w-80 bg-white border-l border-stone-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Location Pins</h2>

            <div className="space-y-2">
              {editingLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedPin(location.id === selectedPin ? null : location.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedPin === location.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3 h-3 rounded-full mt-1 ${getPinColor(location.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-stone-800 truncate">
                        {location.title}
                      </div>
                      <div className="text-xs text-stone-500 mt-1 font-mono">
                        x: {location.x.toFixed(2)}% / y: {location.y.toFixed(2)}%
                      </div>
                      <div className="text-xs text-stone-400 capitalize mt-0.5">
                        {location.type}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedPin && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Pin selected: {editingLocations.find(l => l.id === selectedPin)?.title}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Click anywhere on the map to reposition this pin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
