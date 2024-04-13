import fs from 'fs'
import path from 'path'
import { program } from 'commander'
import fg from 'fast-glob'

import loadModel from './model.js'
import predict from './predict.js'
import applyMask from './sharp.js'
// import compressPNG from './png.js'
// import compressWEBP from './webp.js'

const { input, output, png, webp, jpeg, heic, skip } =
  program
    .version('0.1.0')
    .description('Background cropping CLI app')
    .requiredOption('-i, --input <input>', 'Input URL, or filepath, or folder (via glob)')
    .requiredOption('-o, --output <output>', 'Output filepath, or folder (if glob)')
    .option('-p, --png', 'Save/compress to PNG', false)
    .option('-w, --webp', 'Save/compress to WEBP', false)
    .option('-h, --heic', 'Save/compress to HEIC', false)
    .option('-j, --jpeg', 'Save/compress to JPEG', false)
    .option('-s, --skip', 'Skip found background-removed images', false)
    .parse(process.argv)
    .opts();

main();

async function main() {
  if (!png && !webp && !heic && !jpeg) {
    console.error('Error: Please specify at least one of the following image formats: --png, --webp, --heic, --jpeg');
    return;
  }
  const { model, processor } = await loadModel();

  const isGlob = input.includes('*');
  const isUrl = input.match(/^https?:\/\//i);
  if (!isGlob || isUrl) {
    // handle single file input and output:
    return await work({
      input,
      output,
      model,
      processor
    }).catch(console.error)
  }

  // handle glob and output folder:
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }

  const entries = fg.stream(input, { onlyFiles: true });
  for await (let inputFile of entries) {
    const { name: inputName } = path.parse(inputFile);
    const outputFile = path.join(output, `${inputName}.png`);

    if (skip && fs.existsSync(outputFile)) {
      console.log(' .*. Found and Skipping', inputFile);
      continue;
    }

    await work({
      input: inputFile,
      output: outputFile,
      model,
      processor,
    }).catch(console.error)
  }
}



async function work({
  input,
  output,
  model,
  processor,
}) {
  try {
    console.log('hf-bg-remover has begun -->', input);
    const { image, mask } = await predict({ input, processor, model });

    await applyMask(image, mask, output, { png, webp, heic, jpeg }).catch(error => {
      console.error('Error while applying mask to image:', error);
    })

    // png && await compressPNG(output, output + '.compressed.png')
    // webp && await compressWEBP(output + '.compressed.png', output + '.compressed.webp')

    console.log('hf-bg-remover has completed -->', output);
  } catch (error) {
    console.error('hf-bg-remover failed:', error);
  }
}
