const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Max dimension (maintains aspect ratio)
  maxWidth: 1920,
  maxHeight: 1440,

  // WebP quality (0-100)
  webpQuality: 82,

  // Also generate AVIF for even better compression (modern browsers)
  generateAvif: true,
  avifQuality: 65,
};

// Source directories and their target outputs
const imageSources = [
  // Final Photos to public/images
  {
    input: path.join(__dirname, '../../Final Photos/Old-site.jpg'),
    outputDir: path.join(__dirname, '../public/images'),
    outputName: 'old-site',
  },
  {
    input: path.join(__dirname, '../../Final Photos/Old-site-Day-1.jpg'),
    outputDir: path.join(__dirname, '../public/images'),
    outputName: 'old-site-day-1',
  },
  {
    input: path.join(__dirname, '../../Final Photos/Site plan.png'),
    outputDir: path.join(__dirname, '../public/images'),
    outputName: 'site-plan',
  },
  {
    input: path.join(__dirname, '../../Final Photos/Sketch.png'),
    outputDir: path.join(__dirname, '../public/images'),
    outputName: 'sketch-reference',
  },
];

async function optimizeImage({ input, outputDir, outputName }) {
  console.log(`\n📸 Processing: ${path.basename(input)}`);

  if (!fs.existsSync(input)) {
    console.log(`   ⚠️  File not found: ${input}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(input);
    const metadata = await sharp(imageBuffer).metadata();
    const originalSize = imageBuffer.length;

    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create base sharp instance with resize (maintaining aspect ratio)
    const resizedImage = sharp(imageBuffer)
      .resize(config.maxWidth, config.maxHeight, {
        fit: 'inside', // Maintains aspect ratio, fits within bounds
        withoutEnlargement: true, // Don't upscale small images
      });

    const results = [];

    // Generate WebP
    const webpPath = path.join(outputDir, `${outputName}.webp`);
    const webpBuffer = await resizedImage
      .clone()
      .webp({ quality: config.webpQuality, effort: 6 })
      .toBuffer();

    fs.writeFileSync(webpPath, webpBuffer);
    const webpReduction = ((1 - webpBuffer.length / originalSize) * 100).toFixed(1);
    console.log(`   ✅ WebP: ${(webpBuffer.length / 1024).toFixed(0)}KB (${webpReduction}% smaller)`);
    results.push({ format: 'webp', path: webpPath, size: webpBuffer.length });

    // Generate AVIF (even better compression for modern browsers)
    if (config.generateAvif) {
      const avifPath = path.join(outputDir, `${outputName}.avif`);
      const avifBuffer = await resizedImage
        .clone()
        .avif({ quality: config.avifQuality, effort: 6 })
        .toBuffer();

      fs.writeFileSync(avifPath, avifBuffer);
      const avifReduction = ((1 - avifBuffer.length / originalSize) * 100).toFixed(1);
      console.log(`   ✅ AVIF: ${(avifBuffer.length / 1024).toFixed(0)}KB (${avifReduction}% smaller)`);
      results.push({ format: 'avif', path: avifPath, size: avifBuffer.length });
    }

    return {
      original: input,
      originalSize,
      results,
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🎨 Image Optimization Script');
  console.log('================================');
  console.log(`Max dimensions: ${config.maxWidth}x${config.maxHeight}`);
  console.log(`WebP quality: ${config.webpQuality}`);
  if (config.generateAvif) {
    console.log(`AVIF quality: ${config.avifQuality}`);
  }

  const allResults = [];

  for (const source of imageSources) {
    const result = await optimizeImage(source);
    if (result) {
      allResults.push(result);
    }
  }

  // Summary
  console.log('\n📊 Summary');
  console.log('================================');

  if (allResults.length === 0) {
    console.log('No images were processed.');
    return;
  }

  const totalOriginal = allResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalWebP = allResults.reduce((sum, r) => {
    const webp = r.results.find(res => res.format === 'webp');
    return sum + (webp ? webp.size : 0);
  }, 0);
  const totalAvif = allResults.reduce((sum, r) => {
    const avif = r.results.find(res => res.format === 'avif');
    return sum + (avif ? avif.size : 0);
  }, 0);

  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`WebP total: ${(totalWebP / 1024 / 1024).toFixed(2)}MB (${((1 - totalWebP / totalOriginal) * 100).toFixed(1)}% reduction)`);
  if (config.generateAvif) {
    console.log(`AVIF total: ${(totalAvif / 1024 / 1024).toFixed(2)}MB (${((1 - totalAvif / totalOriginal) * 100).toFixed(1)}% reduction)`);
  }

  console.log('\n💡 Usage in Next.js:');
  console.log('The Next.js Image component will automatically serve the best format.');
  console.log('For manual use, prefer AVIF for modern browsers, WebP as fallback.');

  console.log('\n✨ Optimization complete!');
}

main().catch(console.error);
