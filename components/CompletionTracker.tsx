'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { CompletionTask } from '@/types';

interface CompletionTrackerProps {
  tasks?: CompletionTask[];
  completionPercentage?: number;
}

export default function CompletionTracker({ tasks = [], completionPercentage = 0 }: CompletionTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no tasks, don't show the component
  if (tasks.length === 0) {
    return null;
  }

  const getStatusIcon = (status: CompletionTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />;
      case 'in-progress':
        return <Clock size={18} className="text-orange-500 flex-shrink-0" />;
      case 'not-started':
        return <Circle size={18} className="text-stone-300 flex-shrink-0" />;
    }
  };

  const getStatusLabel = (status: CompletionTask['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
    }
  };

  const getStatusColor = (status: CompletionTask['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-orange-500';
      case 'not-started':
        return 'text-stone-400';
    }
  };

  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
      {/* Header with Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-blue-900 uppercase">Project Progress</h3>
          <span className="text-2xl font-bold text-blue-900">{completionPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-stone-600">{completedCount} completed</span>
          </div>
          {inProgressCount > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-orange-500" />
              <span className="text-stone-600">{inProgressCount} in progress</span>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Task List */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 px-3 bg-white/60 hover:bg-white/80 rounded-lg transition-colors text-sm font-medium text-blue-900"
        >
          <span>View Tasks ({tasks.length})</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg p-3 border border-blue-100 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {task.title}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'in-progress'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {task.completedDate && task.status === 'completed' && (
                      <p className="text-xs text-green-600 mt-1">
                        Completed: {new Date(task.completedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
