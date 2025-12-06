import { NextResponse } from 'next/server';
import { siteData } from '@/lib/siteData';

export async function GET() {
  try {
    const allImages: { url: string; name: string; location: string }[] = [];

    // Get images from siteData (works reliably on Vercel)
    for (const location of siteData.locations) {
      if (location.images && location.images.length > 0) {
        for (const img of location.images) {
          allImages.push({
            url: img.url,
            name: img.caption || img.url.split('/').pop() || 'Image',
            location: location.title
          });
        }
      }
    }

    // Sort by location name
    allImages.sort((a, b) => a.location.localeCompare(b.location));

    return NextResponse.json({
      images: allImages,
      count: allImages.length
    });
  } catch (error) {
    console.error('Error getting images:', error);
    return NextResponse.json({ images: [], count: 0, error: 'Failed to get images' }, { status: 500 });
  }
}
