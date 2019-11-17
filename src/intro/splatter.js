import Obj from "../util/fastObj";
import { randomGaussian, configureGaussian } from "../util/misc";
import { add } from "../util/vector";

// Exercise I.4

export const sketch = p => {
  const w = window.innerWidth - 20;
  const h = window.innerHeight - 20;

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.background(0);
    p.noStroke();
    console.log("foo");
  };

  let angle = 0;
  let spheres = [];
  let max = 10;

  p.draw = () => {
    p.background(0);
    p.directionalLight(255, 255, 255, 1, 1, 0);
    p.directionalLight(255, 255, 255, 0, 1, -1);
    p.rotateY(angle);
    if (p.frameRate() < 20) {
      max -= 1;
    } else {
      max += 10;
    }
    for (let i = 0; i <= 10; i++) {
      if (spheres.length > max) {
        spheres.shift();
      } else {
        const radius = randomGaussian() * 5 + 10;

        const coords = configureGaussian({
          x: [200, 0],
          y: [200, 0],
          z: [200, 0]
        });

        const velocity = configureGaussian({
          x: [1, 1],
          y: [1, 1],
          z: [1, 1]
        });

        const color = Obj.map(x => x % 255)(
          configureGaussian({
            r: [500, 255 / 2],
            g: [500, 255 / 2],
            b: [500, 255 / 2]
          })
        );

        spheres.push({ coords, velocity, color, radius });
      }
    }
    for (let s of spheres) {
      s.coords = add(s.coords)(s.velocity);
      const { x, y, z } = s.coords;
      const { r, g, b } = s.color;
      p.push();
      p.ambientMaterial(r, g, b);
      p.translate(x, y, z);
      p.sphere(s.radius);
      p.pop();
    }
    angle += 0.03;
  };
};
