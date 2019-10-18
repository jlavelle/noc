import * as Mover from "../util/mover";
import Mealy from "../util/mealy";
import { Fn, Arr } from "@masaeedu/fp";
import * as Vec from "../util/vector";
import { pipeC } from "../util/misc";
import * as Obj from "../util/fastObj";

const { Vec2, VecSum } = Vec;

const behavior = s =>
  Fn.pipe([
    Mover.bouncingBehavior("velocity")("position")(s),
    Mover.boundingBehavior("position")(s)
  ]);

const friction = c => velocity => Vec.scale(-1 * c)(Vec.normalize(velocity));

const unfoldBall = Mealy.unfold(state => input => {
  const applyBehavior = Mover.positionUpdate(behavior(input));
  const nextState = input.ballUpdate({ state, input })(applyBehavior);
  return [Obj.append(input)(nextState), nextState];
});

const ballUpdate = c => ({ state, input }) => update => {
  const dfs = Arr.map(f => f({ state, input }))(input.dynamicForces);
  return update({
    ...state,
    acceleration: Vec.scale(1 / input.mass)(
      Arr.fold(VecSum)([...dfs, ...input.forces])
    )
  });
};

// Ex 2.3
const edgeRepel = w => h => ({ state: { position } }) => {
  const [t, b, l, r] = Arr.map(x => 1 / x ** 2)([
    position.y,
    h - position.y,
    position.x,
    w - position.x
  ]);
  return Vec.normalize(Vec.add(Vec2(l)(t))(Vec.scale(-1)(Vec2(r)(b))));
};

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  const initialState = {
    acceleration: Vec2(0)(0),
    velocity: Vec2(0)(0),
    position: Vec2(100)(100)
  };

  p.setup = () => {
    p.createCanvas(width, height);
    p.noStroke();
    p.background(0);
  };

  const c = 0.0;

  const ball = pipeC(Mealy)([unfoldBall(initialState), Mover.ellipseRender]);

  const config = {
    width,
    height,
    diameter: 5,
    p5: p,
    forces: [],
    mass: 1,
    ballUpdate: ballUpdate(c),
    dynamicForces: [
      ({ state }) => friction(c)(state.velocity),
      edgeRepel(width)(height)
    ]
  };

  const m = Mover.driveMealy(ball);

  p.draw = () => {
    m(config);
  };
};
