import { innerWidthHeight, mapInterval, asum } from "../util/misc";
import { Fn, Arr } from "@masaeedu/fp";
import Obj from "../util/fastObj";
import * as Vec from "../util/vector";
import {
  positionUpdate,
  limitingBehavior,
  wrappingBehavior
} from "../util/mover";
import { Maybe } from "@masaeedu/fp/dist/instances";
const { Vec2, VecSum } = Vec;

export const sketch = p => {
  const [w, h] = innerWidthHeight(16);
  p.setup = () => {
    p.createCanvas(w, h);
    p.background(0);
    //p.frameRate(5);
  };

  const maxForce = 0.2;
  const topSpeed = 4;
  const s = 7;
  const arriveDist = 100;
  const wanderRadius = 25;
  const wanderDistance = 100;
  const wallInset = 200;

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

  // TODO: Need a lazy Alt for Maybe and a way to lazily share things like
  // the magnitude of the desired vector between different behaviors

  // :: Number -> Vec2 Number Number -> Maybe (Vec2 Number Number)
  const arrive = dist => dir =>
    dist < arriveDist
      ? Maybe.Just(
          Vec.setMagnitude(mapInterval([0, arriveDist])([0, topSpeed])(dist))(
            dir
          )
        )
      : Maybe.Nothing;

  const move = dir => Maybe.Just(Vec.setMagnitude(topSpeed)(dir));

  const avoid = bool => prop => dir => {
    const d = move(dir);
    return bool ? Maybe.map(Obj.over(prop)(x => x * -1))(d) : Maybe.Nothing;
  };

  const avoidWalls = position => dir =>
    asum(Maybe)([
      avoid(position.x < wallInset)("x")(dir),
      avoid(position.x > w - wallInset)("x")(dir),
      avoid(position.y < wallInset)("y")(dir),
      avoid(position.y > h - wallInset)("y")(dir)
    ]);

  const arriver = vehicle => target => {
    const desired = Vec.subtract(target)(vehicle.position);
    const dist = Vec.magnitude(desired);
    const nd = Maybe.fromMaybe(Vec2(0)(0))(
      asum(Maybe)([
        //avoidWalls(vehicle.position)(desired),
        arrive(dist)(desired),
        move(desired)
      ])
    );
    return Vec.limit(maxForce)(Vec.subtract(nd)(vehicle.velocity));
  };

  // todo
  let xoff = 0;
  let yoff = 0;

  // TODO: Refactor this to pick allowed quadrants
  const avoidWallsAngle = position => {
    let interval = [0, Math.PI * 2];
    if (position.x < wallInset) {
      yoff += 0.05;
      interval = [-Math.PI / 2, Math.PI / 2];
    } else if (position.x > w - wallInset) {
      yoff += 0.05;
      interval = [Math.PI / 2, (3 * Math.PI) / 2];
    }

    if (position.y < wallInset) {
      yoff += 0.05;
      interval = [0, Math.min(Math.PI, interval[1])];
    } else if (position.y > h - wallInset) {
      yoff += 0.05;
      interval = [0, -Math.PI]; // TODO: account for the x angle
    }
    xoff += 0.01;
    const r = mapInterval([0, 1])(interval)(p.noise(xoff, yoff));
    //console.log(interval, r);
    return r;
  };

  const wanderer = vehicle => {
    const vd = Vec.setMagnitude(wanderDistance)(vehicle.velocity);
    const vp = Vec.add(vehicle.position)(vd);
    const theta = avoidWallsAngle(vehicle.position);
    // const theta = avoidWallsAngle(vehicle.position)(Math.PI);
    const target = Vec.add(vp)(
      Vec2(wanderRadius * Math.cos(theta))(wanderRadius * Math.sin(theta))
    );
    return [{ position: vp, target }, arriver(vehicle)(target)];
  };

  const step = vehicle => target => {
    const [t, f] = wanderer(vehicle);
    return [t, Fn.passthru(vehicle)([applyForces([f]), updatePos])];
  };

  const render = wanderTarget => ({ position, velocity }) => {
    p.stroke(100);
    p.line(
      position.x,
      position.y,
      wanderTarget.position.x,
      wanderTarget.position.y
    );
    p.line(
      wanderTarget.position.x,
      wanderTarget.position.y,
      wanderTarget.target.x,
      wanderTarget.target.y
    );
    p.fill("red");
    p.ellipse(wanderTarget.target.x, wanderTarget.target.y, 6, 6);
    p.noFill();
    p.ellipse(
      wanderTarget.position.x,
      wanderTarget.position.y,
      wanderRadius * 2,
      wanderRadius * 2
    );
    p.fill(255);
    p.push();
    p.translate(position.x, position.y);
    p.rotate(Vec.heading2D(velocity) + Math.PI / 2);
    p.beginShape();
    p.vertex(0, -s * 2);
    p.vertex(-s, s * 2);
    p.vertex(s, s * 2);
    p.endShape();
    p.pop();
    p.push();
  };

  let v = vehicle;
  let t = Vec2(0)(0);

  p.draw = () => {
    p.background(0);
    [t, v] = step(v)({ x: p.mouseX, y: p.mouseY });
    render(t)(v);
  };
};
