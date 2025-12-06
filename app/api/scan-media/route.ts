import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const mediaLibraryPath = path.join(process.cwd(), 'public', 'images', 'locations', 'media-library');

    const files = await readdir(mediaLibraryPath);

    const mediaFiles = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif|mp4|mov|webm)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/images/locations/media-library/${file}`,
        mediaType: /\.(mp4|mov|webm)$/i.test(file) ? 'video' : 'image'
      }));

    return NextResponse.json({ files: mediaFiles });
  } catch (error) {
    console.error('Error scanning media folder:', error);
    return NextResponse.json({ files: [], error: 'Failed to scan media folder' }, { status: 500 });
  }
}
