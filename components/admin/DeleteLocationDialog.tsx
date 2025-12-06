'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Location } from '@/types';

interface DeleteLocationDialogProps {
  location: Location;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteLocationDialog({
  location,
  onConfirm,
  onCancel,
}: DeleteLocationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-stone-800">Delete Location</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-stone-700">
            Are you sure you want to delete <strong>&ldquo;{location.title}&rdquo;</strong>?
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ This action cannot be undone. The following will be permanently deleted:
            </p>
            <ul className="mt-2 text-sm text-red-700 space-y-1 ml-4 list-disc">
              <li>Location data and description</li>
              {location.tasks && location.tasks.length > 0 && (
                <li>{location.tasks.length} task(s)</li>
              )}
              {location.images && location.images.length > 0 && (
                <li>{location.images.length} image(s)</li>
              )}
              {location.videos && location.videos.length > 0 && (
                <li>{location.videos.length} video(s)</li>
              )}
              <li>Pin position on map</li>
            </ul>
          </div>

          <p className="text-sm text-stone-500">
            Note: Image and video files will remain in your public folder. You&apos;ll need to manually delete them if desired.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-stone-200 bg-stone-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-white transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <AlertTriangle size={18} />
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
