import {
  circlesOverlap,
  innerWidthHeight,
  foldlWithKey,
  setAtIndices,
  frameRateCounter,
  randomInt
} from "../util/misc";
import * as Vec from "../util/vector";
import * as Obj from "../util/fastObj";
import { Arr, Fn } from "@masaeedu/fp";
import {
  positionUpdate,
  bouncingBehavior,
  boundingBehavior
} from "../util/mover";
const { Vec2 } = Vec;

export const sketch = p => {
  const [width, height] = innerWidthHeight(20);

  p.setup = () => {
    p.createCanvas(width, height);
    p.background(0);
    //p.frameRate(5);
  };

  const render = balls =>
    balls.forEach(b => {
      p.fill(b.color);
      p.ellipse(b.position.x, b.position.y, b.radius * 2, b.radius * 2);
    });

  const updatePos = x =>
    positionUpdate(
      Fn.pipe([
        bouncingBehavior("velocity")("position")({
          width,
          height,
          diameter: x.radius * 2
        }),
        boundingBehavior("position")({
          width,
          height,
          diameter: x.radius * 2
        })
      ])
    )({ ...x, updated: true });

  const collides = ([id1, x1]) => ([id2, x2]) =>
    id1 !== id2 &&
    circlesOverlap(x1)(x2) &&
    !x2.collidedWith.has(id1) &&
    !x1.collidedWith.has(id2);

  const collision1D = v1 => v2 => m1 => m2 => {
    return (v1 * (m1 - m2) + 2 * m2 * v2) / (m1 + m2);
  };

  const circleCollision = x1 => x2 => {
    const u_norm = Vec.normalize(Vec.subtract(x2.position)(x1.position));
    const u_tang = Vec2(-u_norm.y)(u_norm.x);

    const v1_n = Vec.dot(u_norm)(x1.velocity);
    const v2_n = Vec.dot(u_norm)(x2.velocity);
    const v1_t = Vec.dot(u_tang)(x1.velocity);
    const v2_t = Vec.dot(u_tang)(x2.velocity);

    const next_v1_n = collision1D(v1_n)(v2_n)(x1.mass)(x2.mass);
    const next_v2_n = collision1D(v2_n)(v1_n)(x2.mass)(x1.mass);

    const nv1 = Vec.add(Vec.scale(next_v1_n)(u_norm))(Vec.scale(v1_t)(u_tang));
    const nv2 = Vec.add(Vec.scale(next_v2_n)(u_norm))(Vec.scale(v2_t)(u_tang));

    return [
      {
        ...x1,
        velocity: nv1,
        position: Vec.add(x1.position)(Vec.scale(-1)(u_norm))
      },
      { ...x2, velocity: nv2, position: Vec.add(x2.position)(u_norm) }
    ];
  };

  const updateCollidedWith = x => i =>
    Obj.over("collidedWith")(s => s.add(i))(x);

  const clearCollidedWith = x =>
    Obj.over("collidedWith")(s => {
      s.clear();
      return s;
    })(x);

  const checkCollision = id1 => balls => x1 => {
    return foldlWithKey(id2 => acc => x2 => {
      if (collides([id1, x1])([id2, x2])) {
        const [nx1, nx2] = circleCollision(x1)(x2);
        return setAtIndices([
          [id1, updateCollidedWith(nx1)(id2)],
          [id2, updateCollidedWith(nx2)(id1)]
        ])(acc);
      } else {
        return acc;
      }
    })(balls)(balls);
  };

  const step = balls => {
    const nbs = foldlWithKey(checkCollision)(balls)(balls);
    return Arr.map(Fn.pipe([updatePos, clearCollidedWith]))(nbs);
  };

  const randomBall = () => {
    const radius = randomInt(30) + 10;
    const mass = Math.pow(radius, 3);
    const position = Vec2(randomInt(width))(randomInt(height));
    const velocity = Vec2(randomInt(5))(randomInt(5));
    const color = [randomInt(255), randomInt(255), randomInt(255)];
    return {
      radius,
      mass,
      position,
      velocity,
      acceleration: Vec2(0)(0),
      color,
      collidedWith: new Set()
    };
  };

  let balls = Array(50)
    .fill(0)
    .map(randomBall);

  const kineticE = Arr.foldl(acc => b => {
    const ke = 0.5 * b.mass * Math.pow(Vec.magnitude(b.velocity), 2);
    return acc + ke;
  })(0);

  const fr = frameRateCounter(10);

  p.draw = () => {
    p.background(0);
    render(balls);
    balls = step(balls);
    p.fill(100);
    p.text(`FPS: ${Math.round(fr(p))}`, 10, 15);
    p.text(`KE: ${Math.round(kineticE(balls))}`, 10, 30);
  };
};
