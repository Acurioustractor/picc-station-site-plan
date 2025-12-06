'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Layers } from 'lucide-react';

export default function ImageAlignmentTool() {
  const [photoOpacity, setPhotoOpacity] = useState(100);
  const [drawingOpacity, setDrawingOpacity] = useState(50);
  const [sketchOpacity, setSketchOpacity] = useState(0);

  return (
    <div className="flex flex-col h-full bg-stone-50">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-orange-600" />
          <h2 className="text-xl font-bold text-stone-800">Image Alignment Diagnostic</h2>
        </div>
        <p className="text-sm text-stone-600">
          Overlay all three map layers to check alignment. If they don&apos;t line up perfectly,
          the source images need to be re-exported from your design software with exact alignment.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="font-bold text-stone-800 mb-4">Opacity Controls</h3>

          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">Photo Layer</span>
                <span className="text-sm text-stone-500">{photoOpacity}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={photoOpacity}
                onChange={(e) => setPhotoOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">Drawing Layer</span>
                <span className="text-sm text-stone-500">{drawingOpacity}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={drawingOpacity}
                onChange={(e) => setDrawingOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">Sketch Layer</span>
                <span className="text-sm text-stone-500">{sketchOpacity}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sketchOpacity}
                onChange={(e) => setSketchOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2 text-sm">How to Use:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Adjust the opacity sliders to see each layer</li>
              <li>Look for features that should align (roads, buildings, landmarks)</li>
              <li>If layers don&apos;t perfectly overlap, your source images are misaligned</li>
              <li>Re-export all images from your design software ensuring identical crop/scale</li>
            </ol>
          </div>
        </div>

        {/* Image Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-stone-800 mb-4">Layer Overlay Preview</h3>

          <div className="relative w-full" style={{ aspectRatio: '1920 / 1440', maxWidth: '100%' }}>
            {/* Base container with checkerboard background */}
            <div
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%)',
                backgroundPosition: '0 0, 10px 10px',
                backgroundSize: '20px 20px'
              }}
            >
              {/* Photo Layer */}
              <div
                className="absolute inset-0"
                style={{ opacity: photoOpacity / 100 }}
              >
                <Image
                  src="/images/Photo.webp"
                  alt="Photo layer"
                  width={1920}
                  height={1440}
                  className="w-full h-full"
                  style={{ display: 'block' }}
                />
              </div>

              {/* Drawing Layer */}
              <div
                className="absolute inset-0"
                style={{ opacity: drawingOpacity / 100 }}
              >
                <Image
                  src="/images/Drawing Colour.webp"
                  alt="Drawing layer"
                  width={1920}
                  height={1440}
                  className="w-full h-full"
                  style={{ display: 'block' }}
                />
              </div>

              {/* Sketch Layer */}
              <div
                className="absolute inset-0"
                style={{ opacity: sketchOpacity / 100 }}
              >
                <Image
                  src="/images/Sketch.webp"
                  alt="Sketch layer"
                  width={1920}
                  height={1440}
                  className="w-full h-full"
                  style={{ display: 'block' }}
                />
              </div>

              {/* Crosshair guides */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Vertical center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500 opacity-50" />
                {/* Horizontal center line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500 opacity-50" />
                {/* Diagonal guides */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke="red" strokeWidth="1" opacity="0.3" />
                  <line x1="100%" y1="0" x2="0" y2="100%" stroke="red" strokeWidth="1" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-bold text-amber-900 mb-2 text-sm">Alignment Checklist:</h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>All three images are 1920x1440 pixels ✓</li>
              <li>Images overlay at same position (check with sliders)</li>
              <li>Key features (buildings, roads) align perfectly across all layers</li>
              <li>No shifting or scaling differences visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
