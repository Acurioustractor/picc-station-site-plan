'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Save, RotateCcw } from 'lucide-react';

export default function LiveAlignmentPage() {
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);
  const [photoScale, setPhotoScale] = useState(100);
  const [drawingOffsetX, setDrawingOffsetX] = useState(0);
  const [drawingOffsetY, setDrawingOffsetY] = useState(0);
  const [drawingScale, setDrawingScale] = useState(100);
  const [sketchOffsetX, setSketchOffsetX] = useState(0);
  const [sketchOffsetY, setSketchOffsetY] = useState(0);
  const [sketchScale, setSketchScale] = useState(100);

  const [photoOpacity, setPhotoOpacity] = useState(100);
  const [drawingOpacity, setDrawingOpacity] = useState(50);
  const [sketchOpacity, setSketchOpacity] = useState(0);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/align-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo: { x: photoOffsetX, y: photoOffsetY, scale: photoScale },
          drawing: { x: drawingOffsetX, y: drawingOffsetY, scale: drawingScale },
          sketch: { x: sketchOffsetX, y: sketchOffsetY, scale: sketchScale }
        })
      });

      if (response.ok) {
        setMessage('✅ Images aligned and saved! Refresh the main map to see changes.');
      } else {
        const error = await response.text();
        setMessage(`❌ Save failed: ${error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    setPhotoScale(100);
    setDrawingOffsetX(0);
    setDrawingOffsetY(0);
    setDrawingScale(100);
    setSketchOffsetX(0);
    setSketchOffsetY(0);
    setSketchScale(100);
  };

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Live Image Alignment</h1>
          <p className="text-stone-600 mb-4">
            Adjust the offsets until all layers align perfectly. Use arrow keys or sliders.
          </p>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Photo Controls */}
            <div className="border border-stone-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-3">Photo Layer</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Horizontal Offset</span>
                    <span className="text-stone-500">{photoOffsetX}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={photoOffsetX}
                    onChange={(e) => setPhotoOffsetX(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Vertical Offset</span>
                    <span className="text-stone-500">{photoOffsetY}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={photoOffsetY}
                    onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Scale (Zoom)</span>
                    <span className="text-stone-500">{photoScale}%</span>
                  </label>
                  <input
                    type="range"
                    min="90"
                    max="110"
                    step="0.1"
                    value={photoScale}
                    onChange={(e) => setPhotoScale(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setPhotoScale(Math.max(90, photoScale - 0.5))}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      Zoom Out
                    </button>
                    <button
                      onClick={() => setPhotoScale(100)}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => setPhotoScale(Math.min(110, photoScale + 0.5))}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      Zoom In
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPhotoOffsetY(photoOffsetY - 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowUp size={16} /> Up
                  </button>
                  <button
                    onClick={() => setPhotoOffsetY(photoOffsetY + 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowDown size={16} /> Down
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPhotoOffsetX(photoOffsetX - 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Left
                  </button>
                  <button
                    onClick={() => setPhotoOffsetX(photoOffsetX + 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} /> Right
                  </button>
                </div>
              </div>
            </div>

            {/* Drawing Controls */}
            <div className="border border-stone-200 rounded-lg p-4">
              <h3 className="font-bold text-orange-600 mb-3">Drawing Layer</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Horizontal Offset</span>
                    <span className="text-stone-500">{drawingOffsetX}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={drawingOffsetX}
                    onChange={(e) => setDrawingOffsetX(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Vertical Offset</span>
                    <span className="text-stone-500">{drawingOffsetY}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={drawingOffsetY}
                    onChange={(e) => setDrawingOffsetY(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Scale (Zoom)</span>
                    <span className="text-stone-500">{drawingScale}%</span>
                  </label>
                  <input
                    type="range"
                    min="90"
                    max="110"
                    step="0.1"
                    value={drawingScale}
                    onChange={(e) => setDrawingScale(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setDrawingScale(Math.max(90, drawingScale - 0.5))}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      Zoom Out
                    </button>
                    <button
                      onClick={() => setDrawingScale(100)}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => setDrawingScale(Math.min(110, drawingScale + 0.5))}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      Zoom In
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDrawingOffsetY(drawingOffsetY - 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowUp size={16} /> Up
                  </button>
                  <button
                    onClick={() => setDrawingOffsetY(drawingOffsetY + 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowDown size={16} /> Down
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDrawingOffsetX(drawingOffsetX - 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Left
                  </button>
                  <button
                    onClick={() => setDrawingOffsetX(drawingOffsetX + 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} /> Right
                  </button>
                </div>
              </div>
            </div>

            {/* Sketch Controls */}
            <div className="border border-stone-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-600 mb-3">Sketch Layer</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Horizontal Offset</span>
                    <span className="text-stone-500">{sketchOffsetX}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={sketchOffsetX}
                    onChange={(e) => setSketchOffsetX(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Vertical Offset</span>
                    <span className="text-stone-500">{sketchOffsetY}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={sketchOffsetY}
                    onChange={(e) => setSketchOffsetY(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                    <span>Scale (Zoom)</span>
                    <span className="text-stone-500">{sketchScale}%</span>
                  </label>
                  <input
                    type="range"
                    min="90"
                    max="110"
                    step="0.1"
                    value={sketchScale}
                    onChange={(e) => setSketchScale(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setSketchScale(Math.max(90, sketchScale - 0.5))}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      Zoom Out
                    </button>
                    <button
                      onClick={() => setSketchScale(100)}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => setSketchScale(Math.min(110, sketchScale + 0.5))}
                      className="flex-1 py-1 text-xs bg-stone-200 hover:bg-stone-300 rounded"
                    >
                      Zoom In
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSketchOffsetY(sketchOffsetY - 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowUp size={16} /> Up
                  </button>
                  <button
                    onClick={() => setSketchOffsetY(sketchOffsetY + 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowDown size={16} /> Down
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSketchOffsetX(sketchOffsetX - 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Left
                  </button>
                  <button
                    onClick={() => setSketchOffsetX(sketchOffsetX + 1)}
                    className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 rounded flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} /> Right
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Opacity Controls */}
          <div className="border-t pt-4 mb-4">
            <h3 className="font-bold text-stone-700 mb-3">Layer Opacity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                  <span>Photo</span>
                  <span className="text-stone-500">{photoOpacity}%</span>
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
                <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                  <span>Drawing</span>
                  <span className="text-stone-500">{drawingOpacity}%</span>
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
                <label className="text-sm font-medium text-stone-700 flex justify-between mb-1">
                  <span>Sketch</span>
                  <span className="text-stone-500">{sketchOpacity}%</span>
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Alignment'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            {message && (
              <div className={`ml-4 px-4 py-2 rounded ${
                message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-stone-800 mb-4">Live Preview</h3>

          <div className="relative w-full bg-stone-200 rounded-lg overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
            {/* Photo Layer (adjustable) */}
            <div
              className="absolute inset-0"
              style={{
                opacity: photoOpacity / 100,
                transform: `translate(${photoOffsetX}px, ${photoOffsetY}px) scale(${photoScale / 100})`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src="/images/old-site.webp"
                alt="Photo layer"
                width={2000}
                height={1500}
                className="w-full h-full object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Drawing Layer (adjustable) */}
            <div
              className="absolute inset-0"
              style={{
                opacity: drawingOpacity / 100,
                transform: `translate(${drawingOffsetX}px, ${drawingOffsetY}px) scale(${drawingScale / 100})`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src="/images/site-plan.webp"
                alt="Drawing layer"
                width={2000}
                height={1493}
                className="w-full h-full object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Sketch Layer (adjustable) */}
            <div
              className="absolute inset-0"
              style={{
                opacity: sketchOpacity / 100,
                transform: `translate(${sketchOffsetX}px, ${sketchOffsetY}px) scale(${sketchScale / 100})`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src="/images/sketch-reference.webp"
                alt="Sketch layer"
                width={2000}
                height={1493}
                className="w-full h-full object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Center crosshair */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500 opacity-30" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500 opacity-30" />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900">
              <strong>How to use:</strong> Adjust the sliders or use the arrow buttons until all layers align perfectly.
              Move any combination of Photo, Drawing, and Sketch until they line up. When satisfied, click &ldquo;Save Alignment&rdquo;.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
