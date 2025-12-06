import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // List all uploaded images from Vercel Blob storage
    const { blobs } = await list({ prefix: 'images/' });

    const mediaFiles = blobs
      .filter(blob => /\.(jpg|jpeg|png|webp|gif|mp4|mov|webm)$/i.test(blob.pathname))
      .map(blob => ({
        filename: blob.pathname.split('/').pop() || blob.pathname,
        url: blob.url,
        mediaType: /\.(mp4|mov|webm)$/i.test(blob.pathname) ? 'video' : 'image'
      }));

    return NextResponse.json({ files: mediaFiles });
  } catch (error) {
    console.error('Error scanning media from blob:', error);
    return NextResponse.json({ files: [], error: 'Failed to scan media' }, { status: 500 });
  }
}
