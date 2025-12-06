'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, CheckCircle2, Clock, Circle } from 'lucide-react';
import { Location, CompletionTask } from '@/types';

interface TaskEditorProps {
  location: Location;
  onUpdate: (id: string, field: keyof Location, value: any) => void;
}

export default function TaskEditor({ location, onUpdate }: TaskEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const tasks = location.tasks || [];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: CompletionTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      status: 'not-started',
      order: tasks.length,
    };

    onUpdate(location.id, 'tasks', [...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddForm(false);

    // Auto-update completion percentage
    updateCompletionPercentage([...tasks, newTask]);
  };

  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    onUpdate(location.id, 'tasks', updatedTasks);
    updateCompletionPercentage(updatedTasks);
  };

  const updateTaskStatus = (taskId: string, status: CompletionTask['status']) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status,
          completedDate: status === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });

    onUpdate(location.id, 'tasks', updatedTasks);
    updateCompletionPercentage(updatedTasks);
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;

    const updatedTasks = [...tasks];
    [updatedTasks[index], updatedTasks[newIndex]] = [updatedTasks[newIndex], updatedTasks[index]];

    // Update order numbers
    updatedTasks.forEach((task, idx) => {
      task.order = idx;
    });

    onUpdate(location.id, 'tasks', updatedTasks);
  };

  const updateCompletionPercentage = (taskList: CompletionTask[]) => {
    if (taskList.length === 0) {
      onUpdate(location.id, 'completionPercentage', 0);
      return;
    }

    const completed = taskList.filter(t => t.status === 'completed').length;
    const percentage = Math.round((completed / taskList.length) * 100);
    onUpdate(location.id, 'completionPercentage', percentage);
  };

  const getStatusIcon = (status: CompletionTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={16} className="text-orange-500" />;
      case 'not-started':
        return <Circle size={16} className="text-stone-300" />;
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">Completion Progress</span>
          <span className="text-2xl font-bold text-blue-900">{location.completionPercentage || 0}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${location.completionPercentage || 0}%` }}
          />
        </div>
        <p className="text-xs text-blue-700 mt-2">
          {tasks.filter(t => t.status === 'completed').length} of {tasks.length} tasks completed
        </p>
      </div>

      {/* Task List */}
      <div>
        <h4 className="text-sm font-bold text-stone-900 mb-3">Tasks</h4>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-stone-400 border-2 border-dashed border-stone-200 rounded-lg">
            <p className="text-sm">No tasks yet. Add your first task below.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="bg-white border border-stone-200 rounded-lg p-3"
              >
                <div className="flex items-start gap-2">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      onClick={() => moveTask(index, 'up')}
                      disabled={index === 0}
                      className="text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <GripVertical size={14} />
                    </button>
                    <button
                      onClick={() => moveTask(index, 'down')}
                      disabled={index === sortedTasks.length - 1}
                      className="text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <GripVertical size={14} />
                    </button>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-stone-500 font-mono">#{index + 1}</span>
                      <h5 className={`text-sm font-medium flex-1 ${
                        task.status === 'completed' ? 'line-through text-stone-500' : 'text-stone-900'
                      }`}>
                        {task.title}
                      </h5>
                    </div>

                    {task.description && (
                      <p className="text-xs text-stone-600 mb-2">{task.description}</p>
                    )}

                    {/* Status Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTaskStatus(task.id, 'not-started')}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          task.status === 'not-started'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <Circle size={12} />
                        Not Started
                      </button>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          task.status === 'in-progress'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <Clock size={12} />
                        In Progress
                      </button>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        Completed
                      </button>
                    </div>

                    {task.completedDate && task.status === 'completed' && (
                      <p className="text-xs text-green-600 mt-2">
                        Completed: {new Date(task.completedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Form */}
      {showAddForm ? (
        <div className="bg-stone-50 border-2 border-dashed border-orange-300 rounded-lg p-4">
          <h4 className="text-sm font-bold text-stone-900 mb-3">Add New Task</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g., Install kitchen equipment"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Additional details about this task..."
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                  setNewTaskDescription('');
                }}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone-300 hover:border-orange-400 hover:bg-orange-50 rounded-lg text-stone-600 hover:text-orange-700 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          Add Task
        </button>
      )}
    </div>
  );
}
