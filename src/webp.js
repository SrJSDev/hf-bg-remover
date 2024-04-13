import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./webp.config.json")));

const plugins = [
  imageminWebp({
    quality: config.quality,
    preset: config.preset
  }),
];

export default async function compressWEBP(inputFile, outputFile) {
  try {
    // keep dir, remove filename, imagemin-webp will add it automatically
    const destination = path.parse(outputFile).dir;

    await imagemin([inputFile], {
      destination,
      plugins,
      glob: false,
    });

    console.log("[WEBP] file compressed successfully!");
  } catch (err) {
    console.error('[WEBP] Error compressing file:', err);
  }
}
