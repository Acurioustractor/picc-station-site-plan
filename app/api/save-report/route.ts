import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const report = await request.json();

    // Save report to Vercel Blob
    const blob = await put('report.json', JSON.stringify(report, null, 2), {
      access: 'public',
      addRandomSuffix: false, // Always use the same filename
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: 'Report saved successfully'
    });
  } catch (error) {
    console.error('Failed to save report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save report' },
      { status: 500 }
    );
  }
}
