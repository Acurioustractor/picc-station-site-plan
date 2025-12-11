import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { photo, drawing, sketch } = await request.json();

    const imagesDir = path.join(process.cwd(), 'public', 'images');

    // Process Photo layer
    if (photo && (photo.x !== 0 || photo.y !== 0 || photo.scale !== 100)) {
      await transformImage(
        path.join(imagesDir, 'old-site.webp'),
        path.join(imagesDir, 'old-site.webp'),
        photo.x || 0,
        photo.y || 0,
        photo.scale || 100
      );
    }

    // Process Drawing layer
    if (drawing && (drawing.x !== 0 || drawing.y !== 0 || drawing.scale !== 100)) {
      await transformImage(
        path.join(imagesDir, 'site-plan.webp'),
        path.join(imagesDir, 'site-plan.webp'),
        drawing.x || 0,
        drawing.y || 0,
        drawing.scale || 100
      );
    }

    // Process Sketch layer
    if (sketch && (sketch.x !== 0 || sketch.y !== 0 || sketch.scale !== 100)) {
      await transformImage(
        path.join(imagesDir, 'sketch-reference.webp'),
        path.join(imagesDir, 'sketch-reference.webp'),
        sketch.x || 0,
        sketch.y || 0,
        sketch.scale || 100
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Images aligned successfully',
      offsets: { photo, drawing, sketch }
    });

  } catch (error) {
    console.error('Alignment error:', error);
    return NextResponse.json(
      { error: 'Failed to align images', details: String(error) },
      { status: 500 }
    );
  }
}

async function transformImage(
  inputPath: string,
  outputPath: string,
  shiftX: number,
  shiftY: number,
  scale: number
) {
  const WIDTH = 1920;
  const HEIGHT = 1440;

  // Read the original image
  let imageBuffer = await sharp(inputPath).toBuffer();

  // Apply scale if not 100%
  if (scale !== 100) {
    const scaleFactor = scale / 100;
    const scaledWidth = Math.round(WIDTH * scaleFactor);
    const scaledHeight = Math.round(HEIGHT * scaleFactor);

    // Resize the image
    imageBuffer = await sharp(imageBuffer)
      .resize(scaledWidth, scaledHeight, { fit: 'fill' })
      .toBuffer();

    // If scaled up, crop from center to fit canvas
    if (scale > 100) {
      const cropLeft = Math.round((scaledWidth - WIDTH) / 2);
      const cropTop = Math.round((scaledHeight - HEIGHT) / 2);
      imageBuffer = await sharp(imageBuffer)
        .extract({
          left: cropLeft,
          top: cropTop,
          width: WIDTH,
          height: HEIGHT
        })
        .toBuffer();
    }
    // If scaled down, it will be placed on canvas with shift below
  }

  // Apply shift
  const metadata = await sharp(imageBuffer).metadata();
  const currentWidth = metadata.width || WIDTH;
  const currentHeight = metadata.height || HEIGHT;

  // Calculate crop dimensions for shift
  const cropLeft = Math.max(0, -shiftX);
  const cropTop = Math.max(0, -shiftY);
  const cropWidth = Math.min(currentWidth, currentWidth - Math.abs(shiftX));
  const cropHeight = Math.min(currentHeight, currentHeight - Math.abs(shiftY));

  // Extract the region that will be visible after shift
  const extracted = await sharp(imageBuffer)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight
    })
    .toBuffer();

  // Calculate placement on new canvas
  const offsetLeft = Math.max(0, shiftX);
  const offsetTop = Math.max(0, shiftY);

  // Create new canvas with transformed image
  const tempPath = outputPath + '.tmp';
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{
    input: extracted,
    top: offsetTop,
    left: offsetLeft
  }])
  .webp({ quality: 90 })
  .toFile(tempPath);

  // Replace original with aligned version
  fs.renameSync(tempPath, outputPath);
}
