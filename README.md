# hg-bg-remover

Leverage HuggingFace AI model `briaai/RMBG-1.4` for image background removal.

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

* Note: PNG compression is a WIP. It requires `pngquant` binary to be installed, and config is manual atm.
