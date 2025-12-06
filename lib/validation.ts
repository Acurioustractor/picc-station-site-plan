import { z } from 'zod';

// Location Type Schema
export const locationTypeSchema = z.enum(['building', 'nature', 'utility', 'infrastructure']);

// Task Status Schema
export const taskStatusSchema = z.enum(['not-started', 'in-progress', 'completed']);

// Note Category Schema
export const noteCategorySchema = z.enum(['progress', 'challenges', 'next-steps', 'partnership', 'historical', 'general']);

// Video Type Schema
export const videoTypeSchema = z.enum(['youtube', 'vimeo', 'direct']);

// Task Schema
export const taskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  title: z.string().min(1, 'Task title is required').max(200, 'Task title too long'),
  description: z.string().optional(),
  status: taskStatusSchema,
  order: z.number().int().min(0, 'Order must be non-negative'),
  completedDate: z.string().optional(),
});

// Image Metadata Schema
export const imageMetadataSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  caption: z.string().max(500, 'Caption too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  photographer: z.string().max(200, 'Photographer name too long').optional(),
  dateTaken: z.string().optional(),
  category: z.enum(['before', 'during', 'after', 'general']).optional(),
  isBeforeAfter: z.boolean().optional(),
  beforeAfterPair: z.string().optional(),
});

// Video Embed Schema
export const videoEmbedSchema = z.object({
  id: z.string().min(1, 'Video ID is required'),
  title: z.string().min(1, 'Video title is required').max(200, 'Video title too long'),
  url: z.string().url('Invalid video URL'),
  type: videoTypeSchema,
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

// Note Schema
export const noteSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
  content: z.string().min(1, 'Note content is required').max(5000, 'Note content too long'),
  category: noteCategorySchema,
  date: z.string(),
  author: z.string().optional(),
});

// Location Schema
export const locationSchema = z.object({
  id: z.string().min(1, 'Location ID is required').max(100, 'Location ID too long'),
  x: z.number().min(0, 'X coordinate must be non-negative').max(10000, 'X coordinate too large'),
  y: z.number().min(0, 'Y coordinate must be non-negative').max(10000, 'Y coordinate too large'),
  title: z.string().min(1, 'Location title is required').max(200, 'Location title too long'),
  type: locationTypeSchema,
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  overview: z.string().max(2000, 'Overview too long').optional(),
  futureScope: z.string().max(2000, 'Future scope too long').optional(),
  images: z.array(imageMetadataSchema).optional(),
  videos: z.array(videoEmbedSchema).optional(),
  completionPercentage: z.number().int().min(0, 'Completion % must be 0-100').max(100, 'Completion % must be 0-100').optional(),
  tasks: z.array(taskSchema).optional(),
  notes: z.array(noteSchema).optional(),
});

// Site Data Schema
export const siteDataSchema = z.object({
  locations: z.array(locationSchema).min(1, 'At least one location is required'),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Valid file is required' }),
  maxSize: z.number().optional().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).optional().default(['image/jpeg', 'image/png', 'image/webp']),
});

// Validation helper to check file
export function validateFile(file: File, maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
  const errors: string[] = [];

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Export types
export type LocationType = z.infer<typeof locationTypeSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type NoteCategory = z.infer<typeof noteCategorySchema>;
export type VideoType = z.infer<typeof videoTypeSchema>;
export type Task = z.infer<typeof taskSchema>;
export type ImageMetadata = z.infer<typeof imageMetadataSchema>;
export type VideoEmbed = z.infer<typeof videoEmbedSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Location = z.infer<typeof locationSchema>;
export type SiteData = z.infer<typeof siteDataSchema>;
