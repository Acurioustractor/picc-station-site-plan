#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

console.log('\n🎨 Setting up new images...\n');

const images = [
  {
    input: path.join(__dirname, '../../New images/New-photo.jpg'),
    output: path.join(__dirname, '../public/images/Photo.webp'),
    name: 'Photo'
  },
  {
    input: path.join(__dirname, '../../New images/New drawing.jpg'),
    output: path.join(__dirname, '../public/images/Drawing Colour.webp'),
    name: 'Drawing Colour'
  },
  {
    input: path.join(__dirname, '../../New images/New sketch.jpg'),
    output: path.join(__dirname, '../public/images/Sketch.webp'),
    name: 'Sketch'
  }
];

async function processImage(imagePath, outputPath, name) {
  console.log(`📸 Processing: ${name}`);

  try {
    // Check if input exists
    if (!fs.existsSync(imagePath)) {
      console.error(`   ❌ Input file not found: ${imagePath}`);
      return false;
    }

    // Get original image info
    const metadata = await sharp(imagePath).metadata();
    console.log(`   Original: ${metadata.width}x${metadata.height}`);

    // Convert to WebP WITHOUT resizing - keep original dimensions!
    await sharp(imagePath)
      .webp({ quality: 90 })
      .toFile(outputPath);

    console.log(`   Kept original size: ${metadata.width}x${metadata.height}`);

    console.log(`   ✅ Created: ${outputPath}`);
    return true;

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  let success = true;

  for (const img of images) {
    const result = await processImage(img.input, img.output, img.name);
    if (!result) success = false;
  }

  if (success) {
    console.log('\n✨ All images processed successfully!');
    console.log('\n📋 Next step:');
    console.log('   Test alignment at: http://localhost:3004/admin/align-live\n');
  } else {
    console.log('\n❌ Some images failed to process. Please check the errors above.\n');
    process.exit(1);
  }
}

main().catch(console.error);
