# hf-bg-remover

Leverage Hugging Face AI model [`briaai/RMBG-1.4`](https://huggingface.co/briaai/RMBG-1.4) for image background removal in Node.js.

Saves the result as a compressed PNG, WEBP, and HEIC, which will keep the transparency of the image background. Also supports JPEG.

- required Option: `-i, --input {input}`
  - Input URL, or filepath, or glob*
- required Option: `-o, --output {output}`
  - Output filepath, or folder (if glob*)
  - Note: if a filepath, it should be named `.png`.
- option: `-p, --png`
  - Save/compress to PNG
- option: `-w, --webp`
  - Save/compress to WEBP
- option: `-h, --heic`
  - Save/compress to HEIC
- option: `-j, --jpeg`
  - Save/compress to JPEG
- option: `-s, --skip`
  - Skip found background-removed images
  - Save/compress to JPEG
- option: `--fxlb`
  - Apply FX: lens blur
- option: `--fxsb`
  - Apply FX: surface blur

## Credit 🙏

The inspiration and basis for this project was taken from [this](https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client) repo and [transformers.js](https://www.npmjs.com/package/@xenova/transformers).
