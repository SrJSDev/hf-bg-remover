import { AutoModel, AutoProcessor, RawImage } from '@xenova/transformers'
import sharp from 'sharp' // auto dependency
import { program } from 'commander'

import compressPNG from './png.js'
import compressWEBP from './webp.js'

const { input, output, png, webp } =
  program
    .version('0.1.0')
    .description('Background cropping CLI app')
    .requiredOption('-i, --input <input>', 'Input file path or URL')
    .requiredOption('-o, --output <output>', 'Output file path')
    .option('-p, --png', 'Compress to PNG', false)
    .option('-w, --webp', 'Compress to WEBP', false)
    .parse(process.argv)
    .opts();

(async function remove(input, output) {
  console.log('Loading model...');
  const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
    config: { model_type: 'custom' },
  });
  const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
    config: {
      do_normalize: true,
      do_pad: false,
      do_rescale: true,
      do_resize: true,
      feature_extractor_type: "ImageFeatureExtractor",
      image_mean: [0.5, 0.5, 0.5],
      image_std: [1, 1, 1],
      resample: 2,
      rescale_factor: 0.00392156862745098,
      size: { width: 1024, height: 1024 },
    }
  });
  console.log('Model loaded.');

  await predict({ input, output, model, processor });
})(input, output);

// Predict foreground of the given image file or URL
async function predict({ input, output, model, processor }) {
  try {
    const image = await RawImage.fromURL(input);

    // Preprocess image
    const { pixel_values } = await processor(image);
    // Predict alpha matte
    const { output: modelOutput } = await model({ input: pixel_values });

    // Resize mask back to original size
    const mask = await RawImage
      .fromTensor(modelOutput[0].mul(255).to('uint8'))
      .resize(image.width, image.height);
    // console.log({ image, mask });

    await applyMask(image, mask, output).catch(error => {
      console.error('Error while applying mask to image:', error);
    });
    png && await compressPNG(output, output + '.compressed.png');
    webp && await compressWEBP(output + '.compressed.png', output + '.compressed.webp');

    console.log('Prediction completed. Result saved as', output);
  } catch (error) {
    console.error('Prediction failed:', error);
  }
}

async function applyMask(
  { width, height, data: imageData },
  { data: maskData },
  output
) {
  const outputBuffer = Buffer.alloc(width * height * 4);
  let idxOutput = 0;
  let idxImage = 0;
  for (let idxMask = 0; idxMask < width * height; idxMask++) {
    outputBuffer[idxOutput++] = imageData[idxImage++]; // Red channel
    outputBuffer[idxOutput++] = imageData[idxImage++]; // Green channel
    outputBuffer[idxOutput++] = imageData[idxImage++]; // Blue channel
    outputBuffer[idxOutput++] = maskData[idxMask]; // Alpha channel
  }

  // save image as png to disk
  await sharp(
    outputBuffer,
    { raw: { width, height, channels: 4 } }
  )
    .png()
    .toFile(output);
}
