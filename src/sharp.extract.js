export default async function extractFromMask(rawMask, rawImage) {

  // Ensure that the mask and input image have the same dimensions
  if (rawImage && (rawImage.width !== rawMask.width || rawImage.height !== rawMask.height)) {
    throw new Error('[EXTRACT] Mask dimensions must match the image dimensions.');
  }

  const { width, height, channels, data } = rawMask;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  // Find the minimum and maximum non-transparent coordinates
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * channels;
      const alpha = data[pixelIndex + (channels === 4 ? 3 : 0)];

      if (alpha !== 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const trimmedWidth = maxX - minX + 1;
  const trimmedHeight = maxY - minY + 1;

  const dimensions = { left: minX, top: minY, width: trimmedWidth, height: trimmedHeight };
  return dimensions;
}
