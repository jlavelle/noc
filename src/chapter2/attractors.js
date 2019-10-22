import { Arr } from "@masaeedu/fp";
import * as Vec from "../util/vector";

const { Vec2 } = Vec;

const G = 0.01;

const gravity = system => body =>
  Arr.foldl(acc => x => {
    const dist = Vec.subtract(x.position)(body.position);
    const r = Vec.magnitude(dist);
    const gf = (G * x.mass * body.mass) / r ** 2;
    const degen = gf === Infinity || r === 0;
    const fvec = degen ? Vec2(0)(0) : Vec.setMagnitude(gf)(dist);
    return Vec.add(acc)(fvec);
  })(Vec2(0)(0))(system);

const step = system =>
  Arr.map(body => {
    const gforce = gravity(system)(body);
    const acceleration = Vec.scale(1 / body.mass)(gforce);
    const nv = Vec.add(acceleration)(body.velocity);
    const np = Vec.add(nv)(body.position);
    return {
      ...body,
      velocity: nv,
      position: np
    };
  })(system);

const render = p => system =>
  system.forEach(({ position, color, radius }) => {
    const [r, g, b] = color;
    p.fill(r, g, b);
    p.ellipse(position.x, position.y, radius, radius);
  });

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  p.setup = () => {
    p.createCanvas(width, height);
  };

  let system = [
    {
      position: Vec2(width / 2)(height / 2),
      velocity: Vec2(0)(0),
      mass: 10000,
      radius: 30,
      color: [255, 255, 255]
    },
    {
      position: Vec2(width / 2 - 50)(height / 2),
      velocity: Vec2(0)(1.5),
      mass: 1,
      radius: 5,
      color: [255, 255, 255]
    },
    {
      position: Vec2(width / 2 - 200)(height / 2),
      velocity: Vec2(0)(0.7),
      mass: 100,
      radius: 10,
      color: [100, 100, 100]
    },
    {
      position: Vec2(width / 2 - 210)(height / 2),
      velocity: Vec2(0)(1),
      mass: 0.1,
      radius: 3,
      color: [255, 0, 255]
    }
  ];

  p.draw = () => {
    p.background(0);
    render(p)(system);
    system = step(system);
  };
};
