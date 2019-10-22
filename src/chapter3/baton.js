import * as Vec from "../util/vector";

const { Vec2 } = Vec;

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  p.setup = () => {
    p.createCanvas(width, height);
  };

  const step = b => ({ ...b, length: b.length + 0.2, angle: b.angle + 0.01 });

  const render = ({ position, radii, length, angle }) => {
    p.translate(position.x, position.y);
    p.rotate(angle);
    p.pop();
    p.ellipse(length / 2, 0, radii * 2, radii * 2);
    p.ellipse(-length / 2, 0, radii * 2, radii * 2);
    //p.line(length / 2, 0, -length / 2, 0);
  };

  let baton = {
    position: Vec2(width / 2)(height / 2),
    radii: 7,
    length: 0,
    angle: 0
  };

  p.draw = () => {
    p.fill(0);
    p.stroke(100);
    render(baton);
    baton = step(baton);
  };
};
