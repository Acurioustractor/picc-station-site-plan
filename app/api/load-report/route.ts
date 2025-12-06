import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // List blobs to find our report
    const { blobs } = await list({ prefix: 'report' });

    if (blobs.length === 0) {
      // No saved report exists yet
      return NextResponse.json({ exists: false });
    }

    // Get the report blob
    const reportBlob = blobs.find(b => b.pathname === 'report.json');

    if (!reportBlob) {
      return NextResponse.json({ exists: false });
    }

    // Fetch the report content
    const response = await fetch(reportBlob.url);
    const report = await response.json();

    return NextResponse.json({
      exists: true,
      report,
      updatedAt: reportBlob.uploadedAt
    });
  } catch (error) {
    console.error('Failed to load report:', error);
    return NextResponse.json(
      { exists: false, error: 'Failed to load report' },
      { status: 500 }
    );
  }
}
