'use client';

import { Note } from '@/types';
import { FileText, AlertCircle, TrendingUp, Calendar } from 'lucide-react';

interface NotesSectionProps {
  notes?: Note[];
}

export default function NotesSection({ notes }: NotesSectionProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center text-stone-400 bg-stone-50">
        <FileText size={32} className="mb-2 opacity-50" />
        <span className="text-sm">No project notes yet</span>
      </div>
    );
  }

  // Group notes by category
  const categorizedNotes = {
    progress: notes.filter(note => note.category === 'progress'),
    challenges: notes.filter(note => note.category === 'challenges'),
    'next-steps': notes.filter(note => note.category === 'next-steps'),
  };

  const getCategoryConfig = (category: 'progress' | 'challenges' | 'next-steps') => {
    switch (category) {
      case 'progress':
        return {
          title: 'Progress Updates',
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'challenges':
        return {
          title: 'Challenges',
          icon: AlertCircle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      case 'next-steps':
        return {
          title: 'Next Steps',
          icon: Calendar,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-stone-900 uppercase mb-3 flex items-center gap-2">
        <FileText size={16} /> Project Notes
      </h3>

      {(['progress', 'challenges', 'next-steps'] as const).map((category) => {
        const categoryNotes = categorizedNotes[category];
        if (categoryNotes.length === 0) return null;

        const config = getCategoryConfig(category);
        const Icon = config.icon;

        return (
          <div key={category} className="space-y-2">
            <div className={`flex items-center gap-2 ${config.color} font-semibold text-xs uppercase`}>
              <Icon size={14} />
              <span>{config.title}</span>
            </div>

            <div className="space-y-2">
              {categoryNotes
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs text-stone-500 font-medium">
                        {formatDate(note.date)}
                      </span>
                      {note.author && (
                        <span className="text-xs text-stone-400 italic">
                          {note.author}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
