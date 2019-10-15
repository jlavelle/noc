import * as Vec from "../util/vector";
import { splitNMealy, randomGaussian, frameRateCounter } from "../util/misc";
import { driveMealy, mouseMover } from "../util/mover";

const { Vec2 } = Vec;

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  p.setup = () => {
    p.createCanvas(width, height);
    p.frameRate(60);
  };

  const n = 300;

  const randomConfig = () => ({
    p5: p,
    width,
    height,
    topSpeed: Math.random() * 10,
    acceleration: Math.random() / 10 + 1,
    diameter: randomGaussian() * 10 + 30,
    position: Vec2(Math.random() * width)(Math.random() * width),
    velocity: Vec2(Math.random())(Math.random())
  });

  const configs = Array(n)
    .fill(0)
    .map(x => randomConfig());

  const mv = driveMealy(splitNMealy(Array(n).fill(mouseMover)));
  const fr = frameRateCounter(20);

  p.draw = () => {
    p.background(0);
    p.fill(255);
    mv(configs);
    p.text(Math.round(fr(p)), 10, 15);
  };
};
