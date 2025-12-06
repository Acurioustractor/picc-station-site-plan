'use client';

import { useState } from 'react';
import { Plus, Trash2, StickyNote, Calendar, User } from 'lucide-react';
import { Location, Note } from '@/types';
import { toast } from 'sonner';

interface NotesEditorProps {
  location: Location;
  onUpdate: (id: string, field: keyof Location, value: any) => void;
}

export default function NotesEditor({ location, onUpdate }: NotesEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Note>>({
    content: '',
    category: 'progress',
    author: '',
  });

  const notes = location.notes || [];

  const resetForm = () => {
    setFormData({
      content: '',
      category: 'progress',
      author: '',
    });
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const addNote = () => {
    if (!formData.content?.trim()) {
      toast.warning('Note content is required');
      return;
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: formData.content,
      category: formData.category || 'progress',
      date: new Date().toISOString(),
      author: formData.author,
    };

    onUpdate(location.id, 'notes', [...notes, newNote]);
    toast.success('Note added successfully');
    resetForm();
  };

  const updateNote = (index: number) => {
    if (!formData.content?.trim()) {
      toast.warning('Note content is required');
      return;
    }

    const updatedNotes = notes.map((note, idx) => {
      if (idx === index) {
        return {
          ...note,
          content: formData.content!,
          category: formData.category || 'progress',
          author: formData.author,
        };
      }
      return note;
    });

    onUpdate(location.id, 'notes', updatedNotes);
    toast.success('Note updated successfully');
    resetForm();
  };

  const removeNote = (index: number) => {
    const updatedNotes = notes.filter((_, idx) => idx !== index);
    onUpdate(location.id, 'notes', updatedNotes);
    toast.success('Note removed');
  };

  const startEdit = (index: number) => {
    const note = notes[index];
    setFormData({
      content: note.content,
      category: note.category,
      author: note.author || '',
    });
    setEditingIndex(index);
    setShowAddForm(false);
  };

  const getCategoryColor = (category: Note['category']) => {
    switch (category) {
      case 'progress':
        return 'bg-blue-100 text-blue-700';
      case 'challenges':
        return 'bg-red-100 text-red-700';
      case 'next-steps':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const getCategoryLabel = (category: Note['category']) => {
    switch (category) {
      case 'progress':
        return 'Progress';
      case 'challenges':
        return 'Challenges';
      case 'next-steps':
        return 'Next Steps';
      default:
        return 'Note';
    }
  };

  // Sort notes by date (newest first)
  const sortedNotes = [...notes].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Notes List */}
      <div>
        <h4 className="text-sm font-bold text-stone-900 mb-3">Project Notes</h4>

        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-stone-400 border-2 border-dashed border-stone-200 rounded-lg">
            <p className="text-sm">No notes yet. Add your first note below.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotes.map((note, index) => {
              const originalIndex = notes.findIndex(n => n.id === note.id);
              return (
                <div
                  key={note.id}
                  className="bg-stone-50 border border-stone-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(note.category)}`}>
                      {getCategoryLabel(note.category)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(originalIndex)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit note"
                      >
                        <StickyNote size={14} />
                      </button>
                      <button
                        onClick={() => removeNote(originalIndex)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-stone-700 mb-2 whitespace-pre-wrap">{note.content}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(note.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {note.author && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {note.author}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingIndex !== null) ? (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
          <h4 className="text-sm font-bold text-stone-900 mb-3">
            {editingIndex !== null ? 'Edit Note' : 'Add New Note'}
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Note['category'] })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="progress">Progress Update</option>
                <option value="challenges">Challenges</option>
                <option value="next-steps">Next Steps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Note Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your note here..."
                rows={4}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Author (optional)
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="flex gap-2">
              {editingIndex !== null ? (
                <>
                  <button
                    onClick={() => updateNote(editingIndex)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={addNote}
                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    Add Note
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone-300 hover:border-orange-400 hover:bg-orange-50 rounded-lg text-stone-600 hover:text-orange-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          Add Note
        </button>
      )}
    </div>
  );
}
