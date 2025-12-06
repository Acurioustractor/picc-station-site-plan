import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // List blobs to find our report
    const { blobs } = await list({ prefix: 'report' });

    if (blobs.length === 0) {
      return NextResponse.json({ exists: false }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      });
    }

    // Get the report blob
    const reportBlob = blobs.find(b => b.pathname === 'report.json');

    if (!reportBlob) {
      return NextResponse.json({ exists: false }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      });
    }

    // Fetch the report content with cache-busting
    const response = await fetch(`${reportBlob.url}?t=${Date.now()}`, {
      cache: 'no-store'
    });
    const report = await response.json();

    return NextResponse.json({
      exists: true,
      report,
      updatedAt: reportBlob.uploadedAt
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (error) {
    console.error('Failed to load report:', error);
    return NextResponse.json(
      { exists: false, error: 'Failed to load report' },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
