import { AutoModel, AutoProcessor } from '@xenova/transformers'

export default async function loadModel() {
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
  return { model, processor };
}
