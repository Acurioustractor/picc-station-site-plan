// Fixed dimensions of all map images
export const MAP_WIDTH = 1920;
export const MAP_HEIGHT = 1440;

// Convert pixel coordinates to display percentages
export function pixelToPercent(pixelX: number, pixelY: number) {
  return {
    x: (pixelX / MAP_WIDTH) * 100,
    y: (pixelY / MAP_HEIGHT) * 100
  };
}

// Convert percentage coordinates back to pixels
export function percentToPixel(percentX: number, percentY: number) {
  return {
    x: (percentX * MAP_WIDTH) / 100,
    y: (percentY * MAP_HEIGHT) / 100
  };
}

// Convert click position on container to pixel coordinates on image
export function containerClickToPixel(
  clickX: number,
  clickY: number,
  containerRect: DOMRect,
  imageRect: DOMRect
) {
  // Get click position relative to the actual image (not container)
  const relativeX = clickX - imageRect.left;
  const relativeY = clickY - imageRect.top;

  // Scale to image's natural dimensions
  const scaleX = MAP_WIDTH / imageRect.width;
  const scaleY = MAP_HEIGHT / imageRect.height;

  return {
    x: Math.round(relativeX * scaleX),
    y: Math.round(relativeY * scaleY)
  };
}
