/**
 * THIS MODULE NOT IS USE ATM, SHARP IS DOING ALL THE IMAGE OUTPUT
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import PngQuant from "pngquant";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./png.config.json")));
PngQuant.setBinaryPath(config.binaryPath);

export default async function compressPNG(inputFile, outputFile, opts = {}) {
  if (!config.binaryPath || !fs.existsSync(config.binaryPath)) {
    console.error("Error: PngQuant 'binaryPath' file not found. Please install it and retry.");
    return;
  }

  try {
    const inStream = fs.createReadStream(inputFile);
    const outStream = fs.createWriteStream(outputFile);
    const myPngQuanter = new PngQuant([256, "--quality", config.quality, "--nofs", "-"]);

    inStream.pipe(myPngQuanter).pipe(outStream);

    await new Promise((resolve, reject) => {
      outStream.on('finish', resolve);
      outStream.on('error', reject);
    });

    console.log('[PNG] file compressed successfully!');
  } catch (err) {
    console.error('[PNG] Error compressing file:', err);
  }
}
