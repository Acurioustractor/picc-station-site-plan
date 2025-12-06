// Image with metadata
export interface ImageMetadata {
  url: string;
  caption?: string;
  description?: string;
  photographer?: string;
  dateTaken?: string;
  category?: 'before' | 'during' | 'after' | 'general';
  isBeforeAfter?: boolean;
  beforeAfterPair?: string; // URL of paired image
}

// Completion task
export interface CompletionTask {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  order: number;
  completedDate?: string;
}

// Categorized note
export interface Note {
  id: string;
  category: 'progress' | 'challenges' | 'next-steps' | 'partnership' | 'historical' | 'general';
  content: string;
  date: string; // ISO date string
  author?: string;
}

export interface Location {
  id: string;
  x: number; // Percentage position (0-100)
  y: number; // Percentage position (0-100)
  title: string;
  type: 'building' | 'nature' | 'utility' | 'infrastructure';
  description: string;
  overview?: string;
  futureScope?: string;

  // Enhanced media
  images?: ImageMetadata[]; // Changed from string[]
  videos?: VideoEmbed[];

  // Completion tracking
  completionPercentage?: number; // 0-100
  tasks?: CompletionTask[];

  // Notes system
  notes?: Note[];
}

export interface VideoEmbed {
  id: string;
  title: string;
  url: string; // YouTube, Vimeo, or direct video URL
  type: 'youtube' | 'vimeo' | 'direct';
  thumbnail?: string;
  description?: string;
  category?: string; // "Progress Update", "Interview", etc.
}

export interface SiteContent {
  about: {
    title: string;
    context: string;
    site: string;
    project: string;
    partnership: string;
    impact: string;
  };
  locations: Location[];
}

export type ImageLayer = 'drawing' | 'photo' | 'photo-after' | 'sketch';
