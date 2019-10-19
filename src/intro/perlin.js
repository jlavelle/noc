import { mapInterval, randomGaussian, randomColor } from "../util/misc";

export const sketch = p => {
  // const w = window.innerWidth - 20
  // const h = window.innerHeight - 20
  const w = 500;
  const h = 500;

  const heightColors = br => {
    if (br > 255 / 2) {
      return [0, 255 - mapInterval([255 / 2, 255])([0, 255])(br), 0];
    } else {
      return [0, 0, mapInterval([0, 255 / 2])([0, 255])(br)];
    }
  };

  const mkNoise = t => {
    p.loadPixels();
    let xoff = 0;
    p.noiseDetail(5, 0.6);
    for (let x = 0; x < w; x++) {
      let yoff = 0;
      for (let y = 0; y < h; y++) {
        const br = Math.round(
          mapInterval([0, 1])([0, 255])(p.noise(xoff, yoff, t))
        );
        const [r, g, b] = heightColors(br);

        const d = p.pixelDensity();
        for (let i = 0; i < d; i++) {
          for (let j = 0; j < d; j++) {
            const index = 4 * ((y * d + j) * w * d + (x * d + i));
            p.pixels[index] = r;
            p.pixels[index + 1] = g;
            p.pixels[index + 2] = b;
            p.pixels[index + 3] = 255;
          }
        }

        yoff += 0.01;
      }
      xoff += 0.01;
    }
    p.updatePixels();
  };

  p.setup = () => {
    p.createCanvas(w, h);
  };

  let t = 0;
  p.draw = () => {
    p.background(0);
    mkNoise(t);
    t += 0.01;
  };
};
