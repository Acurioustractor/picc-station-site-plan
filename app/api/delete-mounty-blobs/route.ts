import { list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// GET to preview what will be deleted
// POST to actually delete
export async function GET() {
  try {
    const { blobs } = await list();

    // Find Mounty uploads (Dec 14, 2025)
    const mountyBlobs = blobs.filter(b =>
      b.uploadedAt && new Date(b.uploadedAt).toISOString().startsWith('2025-12-14')
    );

    // Find PICC uploads (everything else - to keep)
    const piccBlobs = blobs.filter(b =>
      !b.uploadedAt || !new Date(b.uploadedAt).toISOString().startsWith('2025-12-14')
    );

    return NextResponse.json({
      preview: true,
      toDelete: {
        count: mountyBlobs.length,
        files: mountyBlobs.map(b => ({ pathname: b.pathname, uploadedAt: b.uploadedAt }))
      },
      toKeep: {
        count: piccBlobs.length,
        files: piccBlobs.map(b => ({ pathname: b.pathname, uploadedAt: b.uploadedAt }))
      }
    });
  } catch (error) {
    console.error('Failed to list blobs:', error);
    return NextResponse.json({ error: 'Failed to list blobs' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { blobs } = await list();

    // Find Mounty uploads (Dec 14, 2025) - ONLY THESE WILL BE DELETED
    const mountyBlobs = blobs.filter(b =>
      b.uploadedAt && new Date(b.uploadedAt).toISOString().startsWith('2025-12-14')
    );

    const deleted: string[] = [];
    const errors: string[] = [];

    for (const blob of mountyBlobs) {
      try {
        await del(blob.url);
        deleted.push(blob.pathname);
      } catch (err) {
        errors.push(blob.pathname);
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deleted.length,
      deletedFiles: deleted,
      errors: errors.length,
      errorFiles: errors
    });
  } catch (error) {
    console.error('Failed to delete blobs:', error);
    return NextResponse.json({ error: 'Failed to delete blobs' }, { status: 500 });
  }
}
