import * as Vec from "../util/vector";
import { innerWidthHeight } from "../util/misc";

const { Vec2 } = Vec;

export const sketch = p => {
  const [width, height] = innerWidthHeight(20);

  p.setup = () => {
    p.createCanvas(width, height);
  };

  const g = 1;
  const damp = 0.999;

  const render = ({ base, length, radius, angle }) => {
    const bx = base.x + length * Math.sin(angle);
    const by = base.y + length * Math.cos(angle);
    p.line(base.x, base.y, bx, by);
    p.ellipse(bx, by, radius * 2, radius * 2);
  };

  const step = s => {
    const aAcceleration = (-1 * g * Math.sin(s.angle)) / s.length;
    const aVelocity = s.aVelocity + aAcceleration;
    const angle = (s.angle + aVelocity) * damp;
    return {
      ...s,
      aVelocity,
      angle
    };
  };

  let pendulum = {
    base: Vec2(width / 2)(height / 2),
    aVelocity: 0,
    length: 200,
    radius: 20,
    angle: Math.PI / 4,
    mass: 1
  };

  p.draw = () => {
    p.stroke(255);
    p.background(0);
    render(pendulum);
    pendulum = step(pendulum);
  };
};
