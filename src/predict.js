import { RawImage } from '@xenova/transformers'

export default async function predict({ input, processor, model }) {
  try {
    const image = await RawImage.fromURL(input);

    // Preprocess image
    const { pixel_values } = await processor(image);
    // Predict alpha mask
    const { output: modelOutput } = await model({ input: pixel_values });
    // Resize mask back to orig size
    const mask = await RawImage
      .fromTensor(modelOutput[0].mul(255).to('uint8'))
      .resize(image.width, image.height);

    return { image, mask };
  } catch (error) {
    console.error('Error while predicting mask:', error);
  }
}
