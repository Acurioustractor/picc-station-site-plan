'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { siteData } from '@/lib/siteData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('picc-about-modal-dismissed', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Info className="mt-1 flex-shrink-0" size={24} />
            <div>
              <h2 className="text-2xl font-bold mb-1">About This Project</h2>
              <p className="text-orange-100 text-sm">The Centre</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 prose prose-stone max-w-none">
          <section>
            <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              🌱 A New Season for Old Soil
            </h3>
            <div className="text-stone-600 leading-relaxed prose prose-stone prose-sm max-w-none prose-strong:text-stone-900 prose-strong:font-bold prose-p:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{siteData.about.context}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              🚜 The Site: Assets & Conditions
            </h3>
            <div className="text-stone-600 leading-relaxed prose prose-stone prose-sm max-w-none prose-strong:text-stone-900 prose-strong:font-bold prose-p:my-2 prose-ul:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{siteData.about.site}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              🏗️ The Project
            </h3>
            <div className="text-stone-600 leading-relaxed prose prose-stone prose-sm max-w-none prose-strong:text-stone-900 prose-strong:font-bold prose-p:my-2 prose-ol:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{siteData.about.project}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              🤝 Partnership Model
            </h3>
            <div className="text-stone-600 leading-relaxed prose prose-stone prose-sm max-w-none prose-strong:text-stone-900 prose-strong:font-bold prose-p:my-2 prose-ul:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{siteData.about.partnership}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
              🌻 The Harvest: Intended Impact
            </h3>
            <div className="text-stone-600 leading-relaxed prose prose-stone prose-sm max-w-none prose-strong:text-stone-900 prose-strong:font-bold prose-p:my-2 prose-ul:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{siteData.about.impact}</ReactMarkdown>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 p-4 bg-stone-50 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer hover:text-stone-800 transition-colors">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 focus:ring-2"
            />
            <span>Don&apos;t show this again</span>
          </label>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Explore the Map
          </button>
        </div>
      </div>
    </div>
  );
}
