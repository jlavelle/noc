import { innerWidthHeight, mapInterval } from "../util/misc";
import { Fn, Arr } from "@masaeedu/fp";
import * as Vec from "../util/vector";
import {
  positionUpdate,
  limitingBehavior,
  wrappingBehavior
} from "../util/mover";
const { Vec2, VecSum } = Vec;

export const sketch = p => {
  const [w, h] = innerWidthHeight(16);
  p.setup = () => {
    p.createCanvas(w, h);
    p.background(0);
    //p.frameRate(1);
  };

  const maxForce = 0.1;
  const topSpeed = 4;
  const s = 5;
  const arriveDist = 100;
  const wanderRadius = 10;
  const wanderDistance = 50;

  const vehicle = {
    position: Vec2(w / 2)(h / 2),
    velocity: Vec2(0)(0),
    acceleration: Vec2(0)(0),
    mass: 1
  };

  const updatePos = vehicle =>
    positionUpdate(
      Fn.pipe([
        limitingBehavior("velocity")({ topSpeed }),
        wrappingBehavior("position")({ width: w, height: h })
      ])
    )(vehicle);

  const applyForces = forces => vehicle => ({
    ...vehicle,
    acceleration: Vec.scale(1 / vehicle.mass)(Arr.fold(VecSum)(forces))
  });

  const arriver = vehicle => target => {
    const desired = Vec.subtract(target)(vehicle.position);
    const dist = Vec.magnitude(desired);
    const m =
      dist < arriveDist
        ? mapInterval([0, arriveDist])([0, topSpeed])(dist)
        : topSpeed;
    return Vec.limit(maxForce)(
      Vec.subtract(Vec.setMagnitude(m)(desired))(vehicle.velocity)
    );
  };

  const wanderer = vehicle => {
    const vd = Vec.setMagnitude(wanderDistance)(vehicle.velocity);
    const vp = Vec.add(vehicle.position)(vd);
    const theta = mapInterval([0, 1])([0, Math.PI * 2])(Math.random());
    const target = Vec.add(vp)(
      Vec2(wanderRadius * Math.cos(theta))(wanderRadius * Math.sin(theta))
    );
    return arriver(vehicle)(target);
  };

  const step = vehicle => target => {
    const f = wanderer(vehicle);
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
