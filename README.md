# hf-bg-remover

Leverage HuggingFace AI model `briaai/RMBG-1.4` for image background removal.

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
