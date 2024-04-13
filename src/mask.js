import sharp from 'sharp' // auto dependency

export default async function applyMask(
  { width, height, data: imageData },
  { data: maskData },
  output
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

  await sharp(
    outputBuffer,
    { raw: { width, height, channels: 4 } }
  )
    .png()
    .toFile(output);
}
