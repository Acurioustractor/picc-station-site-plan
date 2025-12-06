const sharp = require('sharp');
const path = require('path');

async function convertLogo() {
  const inputPath = path.join(__dirname, '../../ShareImage_original.webp');
  const outputPath = path.join(__dirname, '../public/images/picc-logo-transparent.png');

  try {
    console.log('Converting webp logo to PNG with transparent background...');

    await sharp(inputPath)
      .removeAlpha() // Remove any existing alpha channel
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // Ensure white background
      .png()
      .toBuffer()
      .then(buffer => {
        // Now process to make white pixels transparent
        return sharp(buffer)
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
      })
      .then(({ data, info }) => {
        // Make white or near-white pixels transparent
        const threshold = 250; // Higher threshold for cleaner white removal

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // If pixel is very close to white, make it transparent
          if (r > threshold && g > threshold && b > threshold) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }

        return sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        })
        .png()
        .toFile(outputPath);
      });

    console.log('✅ Logo converted successfully!');
    console.log(`Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error converting logo:', error);
  }
}

convertLogo();
