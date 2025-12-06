import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateFile } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const locationId = formData.get('locationId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size and type
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'File validation failed',
          details: validation.errors,
          message: validation.errors.join(' ')
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const blobPath = `images/locations/${locationId}/${filename}`;

    // Upload to Vercel Blob storage
    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
  }
}
