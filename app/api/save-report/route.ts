import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const report = await request.json();

    // Delete existing report blob first (if any)
    try {
      const { blobs } = await list({ prefix: 'report' });
      for (const blob of blobs) {
        if (blob.pathname === 'report.json') {
          await del(blob.url);
        }
      }
    } catch (delError) {
      // Ignore delete errors - file might not exist
      console.log('No existing blob to delete or delete failed:', delError);
    }

    // Save new report to Vercel Blob
    const blob = await put('report.json', JSON.stringify(report, null, 2), {
      access: 'public',
      addRandomSuffix: false,
    });

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
