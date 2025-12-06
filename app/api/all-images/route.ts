import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const locationsPath = path.join(process.cwd(), 'public', 'images', 'locations');

    const allImages: { url: string; name: string; location: string }[] = [];

    // Read all location folders
    const locationFolders = await readdir(locationsPath);

    for (const folder of locationFolders) {
      const folderPath = path.join(locationsPath, folder);
      const folderStat = await stat(folderPath);

      if (folderStat.isDirectory()) {
        try {
          const files = await readdir(folderPath);

          // Filter for image files
          const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
          );

          // Format location name from folder name (e.g., "kitchen-block" -> "Kitchen Block")
          const locationName = folder
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          for (const file of imageFiles) {
            allImages.push({
              url: `/images/locations/${folder}/${file}`,
              name: file,
              location: locationName
            });
          }
        } catch (err) {
          // Skip folders we can't read
          console.error(`Error reading folder ${folder}:`, err);
        }
      }
    }

    // Sort by location name
    allImages.sort((a, b) => a.location.localeCompare(b.location));

    return NextResponse.json({
      images: allImages,
      count: allImages.length
    });
  } catch (error) {
    console.error('Error scanning all images:', error);
    return NextResponse.json({ images: [], count: 0, error: 'Failed to scan images' }, { status: 500 });
  }
}
