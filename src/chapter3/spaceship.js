import * as Vec from "../util/vector";
const { Vec2 } = Vec;
import { keyListener } from "../util/misc";
import { Arr } from "@masaeedu/fp";
import { wrapVec } from "../util/mover";

const kl = keyListener();

const keyIsPressed = key => kl[key];

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(0);
    p.fill(100);
    p.noStroke();
  };

  const render = ({ position, heading, thrusting, size }) => {
    p.fill(100);
    p.push();
    p.translate(position.x, position.y);
    p.rotate(heading);
    p.beginShape(p.TRIANGLES);
    p.vertex(-size, size / 2);
    p.vertex(size, size / 2);
    p.vertex(0, -size * 1.5);
    p.endShape();
    if (thrusting) {
      p.fill(150, 0, 0);
    }
    const tw = size / 3;
    const th = size / 6;
    p.rect(tw - size, size / 2, tw, th);
    p.rect(size - 2 * tw, size / 2, tw, th);
    p.pop();
  };

  const step = ship => {
    const [l, r] = Arr.map(keyIsPressed)(["ArrowLeft", "ArrowRight"]);
    const heading =
      l && r
        ? ship.heading
        : l
        ? ship.heading - ship.turnRate
        : r
        ? ship.heading + ship.turnRate
        : ship.heading;
    const thrusting = keyIsPressed("z");
    const acceleration =
      thrusting !== undefined && thrusting
        ? Vec.setMagnitude(ship.thrust / ship.mass)(
            Vec2(Math.cos(ship.heading - Math.PI / 2))(
              Math.sin(ship.heading - Math.PI / 2)
            )
          )
        : Vec2(0)(0);
    const velocity = Vec.add(ship.velocity)(acceleration);
    const position = wrapVec(Vec2(width)(height))(
      Vec.add(ship.position)(velocity)
    );
    return {
      ...ship,
      position,
      velocity,
      heading,
      thrusting
    };
  };

  let ship = {
    size: 25,
    position: Vec2(width / 2)(height / 2),
    velocity: Vec2(0)(0),
    heading: 0,
    thrust: 0.1,
    thrusting: false,
    mass: 1,
    turnRate: 0.1
  };

  p.draw = () => {
    p.background(0);
    render(ship);
    ship = step(ship);
  };
};
