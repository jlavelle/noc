import * as Vec from "../util/vector";
import { Arr } from "@masaeedu/fp";
import { randomInt, radians } from "../util/misc";

const { Vec2 } = Vec;

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(0);
  };

  const render = ({ projectiles, cannon }) => {
    projectiles.forEach(({ position, radius, angle }) => {
      p.push();
      p.translate(position.x, position.y);
      p.rotate(angle);
      p.rect(-radius / 2, -radius / 2, radius, radius);
      p.pop();
    });
    p.push();
    p.translate(cannon.position.x, cannon.position.y);
    p.rotate(cannon.angle);
    p.rect(-20, -15, 50, 20);
    p.pop();
    p.ellipse(cannon.position.x, cannon.position.y, 30, 30);
  };

  const g = 0.08;

  const fire = ({ cannon, projectiles }) => {
    const mass = 1;
    const position = Vec2(cannon.position.x)(cannon.position.y - 10);
    const rca = cannon.angle + radians(randomInt(4) - 2);
    const velocity = Vec.scale(cannon.forceMag / mass)(
      Vec.normalize(Vec2(Math.cos(rca))(Math.sin(rca)))
    );
    const radius = 10;
    const angle = randomInt(Math.PI * 2);
    return {
      cannon,
      projectiles: [{ position, velocity, mass, radius, angle }, ...projectiles]
    };
  };

  const step = sys => {
    const nps = Arr.map(p => {
      const gf = Vec2(0)(g * p.mass);
      const acceleration = Vec.scale(1 / p.mass)(gf);
      const nv = Vec.add(p.velocity)(acceleration);
      const np = Vec.add(p.position)(nv);
      const na = p.angle + Vec.magnitude(acceleration);
      return {
        ...p,
        position: np,
        velocity: nv,
        angle: na
      };
    })(sys.projectiles);

    const npsf = Arr.filter(
      p => p.position.x <= width && p.position.y <= height
    )(nps);

    return {
      ...sys,
      projectiles: npsf
    };
  };

  p.keyPressed = () => {
    if (p.key === " ") {
      system = fire(system);
      console.log(system);
    }
  };

  let system = {
    projectiles: [],
    cannon: {
      position: Vec2(100)(height - 20),
      angle: -Math.PI / 8,
      forceMag: 15
    }
  };

  p.draw = () => {
    p.background(0);
    render(system);
    system = step(system);
  };
};
