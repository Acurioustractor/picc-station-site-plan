'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Tag } from 'lucide-react';
import { VideoEmbed } from '@/types';

interface VideoPlayerProps {
  video: VideoEmbed;
  showDescription?: boolean;
}

export default function VideoPlayer({ video, showDescription = true }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = () => {
    switch (video.type) {
      case 'youtube':
        // Extract video ID from various YouTube URL formats
        const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;

      case 'vimeo':
        // Extract Vimeo ID
        const vimeoId = video.url.match(/vimeo\.com\/(\d+)/)?.[1];
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;

      case 'direct':
      default:
        // Check if it's a Descript share link
        if (video.url.includes('share.descript.com')) {
          // Convert /view/ to /embed/ for Descript
          return video.url.replace('/view/', '/embed/');
        }
        return video.url;
    }
  };

  const getThumbnail = () => {
    if (video.thumbnail) return video.thumbnail;

    // Generate YouTube thumbnail if no custom thumbnail
    if (video.type === 'youtube') {
      const youtubeId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }

    return null;
  };

  const thumbnail = getThumbnail();
  const isDescriptVideo = video.url.includes('share.descript.com');

  // Use iframe for Descript videos even if type is 'direct'
  if (video.type === 'direct' && !isDescriptVideo) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <video
            controls
            className="w-full aspect-video rounded-lg bg-stone-900"
            poster={video.thumbnail}
          >
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {showDescription && video.description && (
          <p className="text-sm text-stone-600 leading-relaxed">
            {video.description}
          </p>
        )}
        {video.category && (
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Tag size={12} />
            <span>{video.category}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-stone-900 group">
        {!isPlaying && thumbnail ? (
          <>
            <Image
              src={thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-600 group-hover:bg-orange-500 group-hover:scale-110 transition-all shadow-lg">
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
            </button>
          </>
        ) : (
          <iframe
            src={getEmbedUrl()}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>

      {showDescription && video.description && (
        <p className="text-sm text-stone-600 leading-relaxed">
          {video.description}
        </p>
      )}

      {video.category && (
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Tag size={12} />
          <span>{video.category}</span>
        </div>
      )}
    </div>
  );
}
