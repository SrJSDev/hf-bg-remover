import fs from 'fs'
import path from 'path'
import { program } from 'commander'
import fg from 'fast-glob'

import loadModel from './model.js'
import predict from './predict.js'
import applyMask from './mask.js'
import compressPNG from './png.js'
import compressWEBP from './webp.js'

const delay = (ms) => () => new Promise((resolve) => setTimeout(resolve, ms))

const { input, output, png, webp, skip } =
  program
    .version('0.1.0')
    .description('Background cropping CLI app')
    .requiredOption('-i, --input <input>', 'Input URL, or filepath, or folder (via glob)')
    .requiredOption('-o, --output <output>', 'Output filepath, or folder (if glob)')
    .option('-p, --png', 'Copy/compress to PNG', false)
    .option('-w, --webp', 'Copy/compress to WEBP', false)
    .option('-s, --skip', 'Skip found background-removed images', false)
    .parse(process.argv)
    .opts();

main();

async function main() {
  const { model, processor } = await loadModel();

  const isGlob = input.includes('*');
  const isUrl = input.match(/^https?:\/\//i);
  if (!isGlob || isUrl) {
    // handle single file input and output
    return await work({
      input,
      output,
      model,
      processor
    }).catch(console.error)
  }

  // handle glob and output folder
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
      processor
    }).catch(console.error)
  }
}



async function work({
  input,
  output,
  model,
  processor
}) {
  try {
    console.log('Background removal begun -->', input);
    const { image, mask } = await predict({ input, processor, model });

    await applyMask(image, mask, output).catch(error => {
      console.error('Error while applying mask to image:', error);
    })
      .then(delay(100)); // wait for file to be written


    png && await compressPNG(output, output + '.compressed.png')
      .then(delay(100));

    webp && await compressWEBP(output + '.compressed.png', output + '.compressed.webp')
      .then(delay(100));

    console.log('Background removal completed -->', output);
  } catch (error) {
    console.error('Background removal failed:', error);
  }
}
