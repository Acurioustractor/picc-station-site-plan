import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { blobs } = await list();

    // Group by folder/prefix
    const grouped: Record<string, { count: number; files: string[] }> = {};

    blobs.forEach(blob => {
      const parts = blob.pathname.split('/');
      const prefix = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';

      if (!grouped[prefix]) {
        grouped[prefix] = { count: 0, files: [] };
      }
      grouped[prefix].count++;
      grouped[prefix].files.push(blob.pathname);
    });

    return NextResponse.json({
      total: blobs.length,
      grouped,
      allFiles: blobs.map(b => ({
        pathname: b.pathname,
        url: b.url,
        uploadedAt: b.uploadedAt
      }))
    });
  } catch (error) {
    console.error('Failed to list blobs:', error);
    return NextResponse.json({ error: 'Failed to list blobs' }, { status: 500 });
  }
}
