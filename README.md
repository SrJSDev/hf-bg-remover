# hf-bg-remover

Leverage Hugging Face AI model [`briaai/RMBG-1.4`](https://huggingface.co/briaai/RMBG-1.4) for image background removal in Node.js.

Saves the result as PNG, and optionally a compressed PNG and WEBP. This will keep the transparency of the image background.

> Note: PNG compression is a WIP. It requires `pngquant` binary to be installed, and config is manual atm.

```txt
  .requiredOption(
    '-i, --input <input>', 'Input file path or URL')
  .requiredOption(
    '-o, --output <output>', 'Output file path')
  .option(
    '-p, --png', 'Compress to PNG', false)
  .option(
    '-w, --webp', 'Compress to WEBP', false)
```

## Credit 🙏

The inspiration and basis for this project was taken from [this](https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client) repo and [transformers.js](https://www.npmjs.com/package/@xenova/transformers).
