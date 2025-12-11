const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Target dimensions (maintains 4:3 aspect ratio)
  width: 1920,
  height: 1440,

  // Quality settings
  jpegQuality: 80,
  pngQuality: 80,
  webpQuality: 80,

  // Output format - set to 'webp' for WebP, 'original' to keep original format
  outputFormat: 'webp', // Change to 'original' if you want to keep JPG/PNG
};

// Images to optimize (source files in originals folder)
const images = [
  {
    input: path.join(__dirname, '../originals/Drawing Colour.png'),
    outputName: 'Drawing Colour',
  },
  {
    input: path.join(__dirname, '../originals/Sketch.png'),
    outputName: 'Sketch',
  },
  {
    input: path.join(__dirname, '../originals/Photo.jpg'),
    outputName: 'Photo',
  },
];

async function optimizeImage(imagePath, outputName) {
  console.log(`\n📸 Processing: ${path.basename(imagePath)}`);

  try {
    // Get original image info
    const imageBuffer = fs.readFileSync(imagePath);
    const metadata = await sharp(imageBuffer).metadata();

    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    // Create sharp instance with resize
    let image = sharp(imageBuffer).resize(config.width, config.height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    });

    // Determine output format and path
    let outputPath;
    let outputBuffer;

    if (config.outputFormat === 'webp') {
      outputPath = path.join(__dirname, '../public/images/', `${outputName}.webp`);
      outputBuffer = await image.webp({ quality: config.webpQuality }).toBuffer();
    } else {
      // Keep original format
      const ext = path.extname(imagePath);
      outputPath = path.join(__dirname, '../public/images/', `${outputName}-optimized${ext}`);

      if (ext === '.jpg' || ext === '.jpeg') {
        outputBuffer = await image.jpeg({ quality: config.jpegQuality }).toBuffer();
      } else if (ext === '.png') {
        outputBuffer = await image.png({ quality: config.pngQuality }).toBuffer();
      }
    }

    // Write optimized image
    fs.writeFileSync(outputPath, outputBuffer);

    const newSize = (outputBuffer.length / 1024 / 1024).toFixed(2);
    const reduction = ((1 - outputBuffer.length / imageBuffer.length) * 100).toFixed(1);

    console.log(`   ✅ Optimized: ${config.width}x${config.height}, ${newSize}MB (${reduction}% smaller)`);
    console.log(`   📁 Saved to: ${path.relative(process.cwd(), outputPath)}`);

    return {
      original: imagePath,
      optimized: outputPath,
      originalSize: imageBuffer.length,
      newSize: outputBuffer.length,
      reduction: reduction,
    };

  } catch (error) {
    console.error(`   ❌ Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎨 Image Optimization Script');
  console.log('================================');
  console.log(`Target size: ${config.width}x${config.height}`);
  console.log(`Output format: ${config.outputFormat}`);

  const results = [];

  for (const image of images) {
    const result = await optimizeImage(image.input, image.outputName);
    if (result) {
      results.push(result);
    }
  }

  // Summary
  console.log('\n📊 Summary');
  console.log('================================');
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalReduction = ((1 - totalNew / totalOriginal) * 100).toFixed(1);

  console.log(`Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total optimized size: ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total reduction: ${totalReduction}%`);

  if (config.outputFormat === 'webp') {
    console.log('\n⚠️  Next steps:');
    console.log('1. Update image references in your code to use .webp extensions');
    console.log('2. Consider keeping original files as fallbacks for older browsers');
    console.log('3. Next.js Image component will handle WebP automatically!');
  } else {
    console.log('\n⚠️  Next steps:');
    console.log('1. Review the optimized images to ensure quality is acceptable');
    console.log('2. Replace original files with optimized versions if satisfied');
    console.log('3. Or update your code to use the -optimized versions');
  }

  console.log('\n✨ Optimization complete!');
}

main().catch(console.error);
