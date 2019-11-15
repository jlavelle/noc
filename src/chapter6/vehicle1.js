import { innerWidthHeight } from "../util/misc";
import { Fn, Arr } from "@masaeedu/fp";
import * as Vec from "../util/vector";
import { positionUpdate, limitingBehavior } from "../util/mover";
const { Vec2, VecSum } = Vec;

export const sketch = p => {
  const [w, h] = innerWidthHeight(16);
  p.setup = () => {
    p.createCanvas(w, h);
    p.background(0);
    //p.frameRate(5);
  };

  const maxForce = 0.1;
  const topSpeed = 4;
  const s = 5;

  const vehicle = {
    position: Vec2(w / 2)(h / 2),
    velocity: Vec2(0)(0),
    acceleration: Vec2(0)(0),
    mass: 1
  };

  const updatePos = vehicle =>
    positionUpdate(limitingBehavior("velocity")({ topSpeed }))(vehicle);

  const applyForces = forces => vehicle => ({
    ...vehicle,
    acceleration: Vec.scale(1 / vehicle.mass)(Arr.fold(VecSum)(forces))
  });

  const seek = vehicle => target => {
    const desired = Vec.setMagnitude(topSpeed)(
      Vec.subtract(target)(vehicle.position)
    );
    return Vec.limit(maxForce)(Vec.subtract(desired)(vehicle.velocity));
  };

  const step = vehicle => target => {
    const f = seek(vehicle)(target);
    return Fn.passthru(vehicle)([applyForces([f]), updatePos]);
  };

  const render = ({ position, velocity }) => {
    p.push();
    p.translate(position.x, position.y);
    p.rotate(Vec.heading2D(velocity) + Math.PI / 2);
    p.beginShape();
    p.vertex(0, -s * 2);
    p.vertex(-s, s * 2);
    p.vertex(s, s * 2);
    p.endShape();
    p.pop();
  };

  let v = vehicle;

  p.draw = () => {
    p.background(0);
    v = step(v)({ x: p.mouseX, y: p.mouseY });
    render(v);
  };
};
