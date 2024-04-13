# hf-bg-remover

Leverage Hugging Face AI model [`briaai/RMBG-1.4`](https://huggingface.co/briaai/RMBG-1.4) for image background removal in Node.js.

Saves the result as PNG, and optionally a compressed PNG and WEBP. This will keep the transparency of the image background.

- required Option: `-i, --input {input}`
  - Input URL, or filepath, or glob*
- required Option: `-o, --output {output}`
  - Output filepath, or folder (if glob*)
- option: `-p, --png`
  - Copy/compress to PNG
  - Note: PNG compression is a WIP. It requires the `pngquant` binary to be installed, and its config is manual atm. 🛑
- option: `-w, --webp`
  - Copy/compress to WEBP
- option: `-s, --skip`
  - Skip found background-removed images

## Credit 🙏

The inspiration and basis for this project was taken from [this](https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client) repo and [transformers.js](https://www.npmjs.com/package/@xenova/transformers).
