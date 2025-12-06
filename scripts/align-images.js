#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Shift Drawing and Sketch images to align with Photo
 *
 * Usage: node scripts/align-images.js <right> <down>
 * Example: node scripts/align-images.js 10 15
 *          (shifts images 10px right and 15px down)
 */

const args = process.argv.slice(2);
const shiftRight = parseInt(args[0]) || 0;
const shiftDown = parseInt(args[1]) || 0;

console.log('\n🎯 Image Alignment Tool');
console.log('═══════════════════════════════════════════════\n');

if (shiftRight === 0 && shiftDown === 0) {
  console.log('❌ No shift specified!');
  console.log('\nUsage: node scripts/align-images.js <right> <down>');
  console.log('\nExamples:');
  console.log('  node scripts/align-images.js 10 15   # Shift 10px right, 15px down');
  console.log('  node scripts/align-images.js -5 10   # Shift 5px left, 10px down');
  console.log('  node scripts/align-images.js 20 0    # Shift 20px right, no vertical shift');
  console.log('\n💡 Tip: Use the alignment tool to estimate the shift needed:');
  console.log('   http://localhost:3004/admin/alignment\n');
  process.exit(1);
}

console.log(`Shift: ${shiftRight}px right, ${shiftDown}px down\n`);

const images = [
  {
    input: 'public/images/Drawing Colour.webp',
    output: 'public/images/Drawing Colour-aligned.webp',
    name: 'Drawing Colour'
  },
  {
    input: 'public/images/Sketch.webp',
    output: 'public/images/Sketch-aligned.webp',
    name: 'Sketch'
  }
];

async function shiftImage(imagePath, outputPath, name, shiftX, shiftY) {
  console.log(`📸 Processing: ${name}`);

  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Create a new 1920x1440 canvas
    const WIDTH = 1920;
    const HEIGHT = 1440;

    // Calculate the crop box to shift the image
    // If shifting right by 10px, we crop from x=10 to keep left side clear
    // If shifting down by 10px, we crop from y=10 to keep top clear

    const cropLeft = Math.max(0, -shiftX);
    const cropTop = Math.max(0, -shiftY);
    const cropWidth = WIDTH - Math.abs(shiftX);
    const cropHeight = HEIGHT - Math.abs(shiftY);

    // Extract the shifted region
    const extracted = await image
      .extract({
        left: cropLeft,
        top: cropTop,
        width: cropWidth,
        height: cropHeight
      })
      .toBuffer();

    // Place it on a new canvas with the appropriate offset
    const offsetLeft = Math.max(0, shiftX);
    const offsetTop = Math.max(0, shiftY);

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
    .toFile(outputPath);

    console.log(`   ✅ Saved: ${outputPath}`);

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  for (const img of images) {
    await shiftImage(img.input, img.output, img.name, shiftRight, shiftDown);
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('✨ Done! New files created with "-aligned" suffix');
  console.log('\n📋 Next steps:');
  console.log('1. Check the aligned images in public/images/');
  console.log('2. Test them in the alignment tool:');
  console.log('   - Temporarily rename "Drawing Colour-aligned.webp" to "Drawing Colour.webp"');
  console.log('   - Temporarily rename "Sketch-aligned.webp" to "Sketch.webp"');
  console.log('   - Refresh the alignment tool');
  console.log('3. If alignment looks good, replace the original files:');
  console.log('   mv "public/images/Drawing Colour-aligned.webp" "public/images/Drawing Colour.webp"');
  console.log('   mv "public/images/Sketch-aligned.webp" "public/images/Sketch.webp"');
  console.log('4. If not perfect, try different shift values and run again\n');
}

main().catch(console.error);
