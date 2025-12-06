'use client';

import { useState } from 'react';
import { Copy, X } from 'lucide-react';
import { Location } from '@/types';

interface DuplicateLocationDialogProps {
  location: Location;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
}

export default function DuplicateLocationDialog({
  location,
  onConfirm,
  onCancel,
}: DuplicateLocationDialogProps) {
  const [newTitle, setNewTitle] = useState(`${location.title} (Copy)`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onConfirm(newTitle.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Copy className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Duplicate Location</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-stone-700">
            Create a copy of <strong>&ldquo;{location.title}&rdquo;</strong> with all its data.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              The following will be duplicated:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
              <li>Location data and description</li>
              {location.tasks && location.tasks.length > 0 && (
                <li>{location.tasks.length} task(s)</li>
              )}
              {location.images && location.images.length > 0 && (
                <li>{location.images.length} image(s) metadata</li>
              )}
              {location.videos && location.videos.length > 0 && (
                <li>{location.videos.length} video(s)</li>
              )}
              <li>All custom settings</li>
            </ul>
          </div>

          <div>
            <label htmlFor="newTitle" className="block text-sm font-medium text-stone-700 mb-2">
              New Location Title
            </label>
            <input
              id="newTitle"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new title"
              required
              autoFocus
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> The duplicate will be created at the default position (100, 100).
              Use &ldquo;Position Pins&rdquo; to place it on the map.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Copy size={18} />
              Create Duplicate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
