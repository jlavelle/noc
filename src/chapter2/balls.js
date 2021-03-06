import * as Mover from "../util/mover";
import Mealy from "../util/mealy";
import { Fn, Arr } from "@masaeedu/fp";
import * as Vec from "../util/vector";
import { pipeC, circlesOverlap, circleRectOverlap } from "../util/misc";
import { gravity, edgeRepel, dragForce, zones } from "../util/forces";
import Obj from "../util/fastObj";
const { Vec2, VecSum } = Vec;

const behavior = s =>
  Fn.pipe([
    Mover.bouncingBehavior("velocity")("position")(s),
    Mover.boundingBehavior("position")(s)
  ]);

const friction = c => velocity => Vec.scale(-1 * c)(Vec.normalize(velocity));

const unfoldBall = Mealy.unfold(state => input => {
  const applyBehavior = Mover.positionUpdate(behavior({ ...input, ...state }));
  const nextState = input.ballUpdate({ state, input })(applyBehavior);
  return [Obj.append(input)(nextState), nextState];
});

const ballUpdate = c => ({ state, input }) => update => {
  const dfs = Arr.map(f => f({ state, input }))(input.dynamicForces);
  const u = update({
    ...state,
    acceleration: Vec.scale(1 / state.mass)(
      Arr.fold(VecSum)([...dfs, ...input.forces])
    )
  });
  return u;
};

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  const initialState = {
    acceleration: Vec2(0)(0),
    velocity: Vec2(0)(0),
    position: Vec2(100)(100),
    mass: 10,
    diameter: 100
  };

  p.setup = () => {
    p.createCanvas(width, height);
    p.noStroke();
    p.background(0);
    //p.frameRate(1);
  };

  const c = 0.01;
  const g = 1;
  const zs = [
    {
      position: Vec2(width / 2)(height / 2),
      radius: 300,
      force: ({ velocity }) => friction(-1)(velocity),
      collides: ({ position, diameter }) => z =>
        circlesOverlap({ position, radius: diameter / 2 })(z)
    },
    {
      position: Vec2(0)((2 * height) / 3),
      width,
      height: height / 3,
      force: dragForce({ rho: 0.005, c }),
      collides: c => z => {
        const r = circleRectOverlap(c)(z);
        return r;
      }
    }
  ];

  const ball = pipeC(Mealy)([unfoldBall(initialState), Mover.ellipseRender]);

  const config = {
    width,
    height,
    p5: p,
    forces: [],
    ballUpdate: ballUpdate(c),
    dynamicForces: [
      //({ state }) => friction(c)(state.velocity),
      gravity(g),
      //edgeRepel(width)(height),
      zones(zs)
    ]
  };

  const m = Mover.driveMealy(ball);

  p.draw = () => {
    p.background(0);
    m(config);
    p.noFill();
    p.stroke(255);
    zs.forEach(z => {
      z["radius"]
        ? p.ellipse(z.position.x, z.position.y, z.radius * 2, z.radius * 2)
        : p.rect(z.position.x, z.position.y, z.width, z.height);
    });
    p.fill(255);
    p.noStroke();
  };
};
