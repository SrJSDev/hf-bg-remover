// Define a Gaussian kernel for lens blur
const lensKernel = [
  [0, 0, .55, .55, .55, 0, 0],
  [0, .55, .85, .85, .85, .55, 0],
  [.55, .85, .95, .95, .95, .85, .55],
  [.55, .85, .95, 1, .95, .85, .55],
  [.55, .85, .95, .95, .95, .85, .55],
  [0, .55, .85, .85, .85, .55, 0],
  [0, 0, .55, .55, .55, 0, 0]
];
export function lensBlur(sharpImage) {
  return sharpImage
    .convolve({
      width: lensKernel[0].length,
      height: lensKernel.length,
      kernel: lensKernel.flat(),
    })
}

const surfaceKernel = [
  [1, 4, 7, 4, 1],
  [4, 16, 26, 16, 4],
  [7, 26, 41, 26, 7],
  [4, 16, 26, 16, 4],
  [1, 4, 7, 4, 1]
];
export function surfaceBlur(sharpImage) {
  const variable = .9; /// <<< play
  const kernelSum = surfaceKernel.flat().reduce((sum, value) => sum + (value * variable), 0);
  const normalizedKernel = surfaceKernel.map(row => row.map(value => value / kernelSum)).flat();
  return sharpImage
    .sharpen({
      sigma: 2,
      m1: 1, // "flat" areas
      m2: 5, // "jagged" areas
      x1: 4, // threshold between "flat" and "jagged"
      y2: 10, // maximum amount of brightening
      y3: 12, // maximum amount of darkening
    })
    .convolve({
      width: surfaceKernel[0].length,
      height: surfaceKernel.length,
      kernel: normalizedKernel,
    })
    .sharpen({
      sigma: 2,
      m1: 0.8, // "flat" areas
      m2: 6, // "jagged" areas
      x1: 3, // threshold between "flat" and "jagged"
      y2: 8, // maximum amount of brightening
      y3: 10, // maximum amount of darkening
    })
}

/*
export function surfaceBlur2(sharpImage, threshold, radius) {
  // Define the surface blur kernel
  const kernelSize = radius * 2 + 1;
  const center = radius;
  const kernel = Array(kernelSize * kernelSize).fill(0);

  for (let y = 0; y < kernelSize; y++) {
    for (let x = 0; x < kernelSize; x++) {
      const distance = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
      const value = distance <= radius ? threshold : 0;
      kernel[y * kernelSize + x] = value;
    }
  }

  return sharpImage
    .sharpen({
      sigma: 2,
      m1: 1,
      m2: 4,
      x1: 4,
      y2: 10,
      y3: 12
    })
    .convolve({
      width: kernelSize,
      height: kernelSize,
      kernel: kernel,
    })
}
*/

export function smartBlur(sharpImage) {
  return sharpImage
    .blur(3)
    .sharpen(1, 0.5)
}

export function sharpen(sharpImage) {
  return sharpImage
    .sharpen(1)
    .convolve({
      height: 3,
      width: 3,
      kernel: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0,
      ],
    })
}

export function emboss(sharpImage) {
  return sharpImage
    .convolve([
      -2, -1, 0,
      -1, 1, 1,
      0, 1, 2,
    ])
}

export function edgeDetect(sharpImage) {
  return sharpImage
    .threshold(127)
    .convolve({
      height: 3,
      width: 3,
      kernel: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0,
      ],
    })
}
