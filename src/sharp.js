import path from 'path'
import sharp from 'sharp' // auto dependency

import * as effects from './sharp.effects.js'
import extractFromMask from './sharp.extract.js'

export default async function applyMask(
  { width, height, data: imageData },
  mask,
  output,
  { png, webp, heic, jpeg, fxlb, fxsb }
) {
  let idxOutput = 0;
  let idxImage = 0;
  const outputBuffer = Buffer.alloc(width * height * 4);
  for (let idxMask = 0; idxMask < width * height; idxMask++) {
    const alpha = mask.data[idxMask];
    outputBuffer[idxOutput++] = imageData[alpha ? idxImage + 0 : 255]; // Red channel
    outputBuffer[idxOutput++] = imageData[alpha ? idxImage + 1 : 255]; // Green channel
    outputBuffer[idxOutput++] = imageData[alpha ? idxImage + 2 : 255]; // Blue channel
    outputBuffer[idxOutput++] = alpha; // Alpha channel
    idxImage += 3;
  }

  const sharpOpts = { raw: { width, height, channels: 4 } };

  const { ext } = path.parse(output);
  let mySharp = async () => sharp(outputBuffer, sharpOpts)
    .extract(await extractFromMask(mask));

  if (fxlb) {
    const wrapped = mySharp;
    mySharp = async () => effects.lensBlur(wrapped());
  }

  if (fxsb) {
    const wrapped = mySharp;
    mySharp = async () => effects.surfaceBlur(wrapped());
  }

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

  png && (await mySharp())
    .png(pngOptions)
    .toFile(output);

  webp && (await mySharp())
    .webp(webpOpts)
    .toFile(output.replace(ext, '.webp'));

  heic && (await mySharp())
    .toFormat('heic')
    .toFile(output.replace(ext, '.heic'));

  jpeg && (await mySharp())
    .jpeg(jpegOpts)
    .toFile(output.replace(ext, '.jpg'));
}
