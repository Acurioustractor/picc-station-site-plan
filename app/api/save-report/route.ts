import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const report = await request.json();

    // Delete existing report blobs first (required - put doesn't overwrite)
    try {
      const { blobs } = await list({ prefix: 'report' });
      for (const blob of blobs) {
        await del(blob.url);
        console.log('Deleted old report blob:', blob.pathname);
      }
    } catch (delErr) {
      console.log('No existing blobs to delete:', delErr);
    }

    // Save the new report
    const blob = await put('report.json', JSON.stringify(report, null, 2), {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('Report saved successfully to:', blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: 'Report saved successfully'
    });
  } catch (error: any) {
    console.error('Failed to save report:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save report' },
      { status: 500 }
    );
  }
}
