import { del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // List and delete all report blobs
    const { blobs } = await list({ prefix: 'report' });

    for (const blob of blobs) {
      await del(blob.url);
    }

    return NextResponse.json({
      success: true,
      message: 'Report reset to default. Refresh the page.'
    });
  } catch (error) {
    console.error('Failed to reset report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset report' },
      { status: 500 }
    );
  }
}
