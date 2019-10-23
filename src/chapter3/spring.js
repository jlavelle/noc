import { innerWidthHeight } from "../util/misc";
import * as Vec from "../util/vector";
import { dragForce } from "../util/forces";
import { Arr } from "@masaeedu/fp";

const { Vec2 } = Vec;

export const sketch = p => {
  const [width, height] = innerWidthHeight(20);

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(0);
    //p.frameRate(1);
  };

  const render = ({ spring, bob }) => {
    p.rect(spring.anchor.x - 5, spring.anchor.y - 5, 10, 10);
    p.ellipse(bob.position.x, bob.position.y, bob.radius * 2, bob.radius * 2);
    p.line(spring.anchor.x, spring.anchor.y, bob.position.x, bob.position.y);
  };

  const step = ({ spring, bob, gravity }) => {
    const fs = Vec.subtract(bob.position)(spring.anchor);
    const d = Vec.magnitude(fs);
    const stretch = d - spring.length;
    const gravForce = Vec.scale(bob.mass)(gravity);
    const springForce = Vec.scale(-1 * spring.k * stretch)(Vec.normalize(fs));
    const drag = dragForce({ rho: 0.0001, c: 0.001 })({
      velocity: bob.velocity,
      diameter: bob.radius * 2
    });
    const acceleration = Vec.scale(1 / bob.mass)(
      Arr.fold(Vec.VecSum)([springForce, gravForce, drag])
    );
    const velocity = Vec.add(acceleration)(bob.velocity);
    const position = Vec.add(velocity)(bob.position);
    return {
      spring,
      bob: {
        ...bob,
        velocity,
        position
      },
      gravity
    };
  };

  let system = {
    gravity: Vec2(0)(1),
    spring: {
      anchor: Vec2(width / 2)(height / 2),
      length: 100,
      k: 0.2 // spring constant
    },
    bob: {
      position: Vec2(width / 2 + 110)(height / 2),
      velocity: Vec2(0)(0),
      radius: 20,
      mass: 10
    }
  };

  p.draw = () => {
    p.background(0);
    p.stroke(255);
    render(system);
    system = step(system);
  };
};
