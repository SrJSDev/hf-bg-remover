import path from 'path'
import sharp from 'sharp' // auto dependency

export default async function applyMask(
  { width, height, data: imageData },
  { data: maskData },
  output,
  { png, webp, heic, jpeg }
) {
  let idxOutput = 0;
  let idxImage = 0;
  const outputBuffer = Buffer.alloc(width * height * 4);
  for (let idxMask = 0; idxMask < width * height; idxMask++) {
    outputBuffer[idxOutput++] = imageData[idxImage++]; // Red channel
    outputBuffer[idxOutput++] = imageData[idxImage++]; // Green channel
    outputBuffer[idxOutput++] = imageData[idxImage++]; // Blue channel
    outputBuffer[idxOutput++] = maskData[idxMask]; // Alpha channel
  }

  const sharpOpts = { raw: { width, height, channels: 4 } };
  const pngOptions = {
    compressionLevel: 8, // Adjust compression level (0 to 9, default: 6)
    adaptiveFiltering: true, // Enable adaptive filtering (default: true)
    force: false, // Enable force compression (default: false)
    progressive: true, // Enable progressive rendering (default: false)
  };
  const webpOpts = {
    quality: 77, // Adjust quality value (0 to 100, default: 75)
    alphaQuality: 90, // Adjust quality of alpha layer (0 to 100, default: 100)
    nearLossless: false, // Set to true for near-lossless compression (default: false)
    reductionEffort: 5, // Adjust effort spent on compression (0 to 6, default: 4)
  }
  const jpegOpts = {
    quality: 82, // Adjust quality value (0 to 100, default: 80)
    progressive: true, // Enable progressive rendering (default: false)
    optimiseCoding: true, // Enable optimization (default: false)
  };

  const { ext } = path.parse(output)

  png && await sharp(outputBuffer, sharpOpts)
    .png(pngOptions).toFile(output);

  webp && await sharp(outputBuffer, sharpOpts)
    .webp(webpOpts).toFile(output.replace(ext, '.webp'));

  heic && await sharp(outputBuffer, sharpOpts)
    .toFormat('heic').toFile(output.replace(ext, '.heic'));

  jpeg && await sharp(outputBuffer, sharpOpts)
    .jpeg(jpegOpts).toFile(output.replace(ext, '.jpg'));
}
