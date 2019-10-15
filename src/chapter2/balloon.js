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

const unfoldBalloon = Mealy.unfold(state => input => {
  const behaviorFn = behavior(input);
  const updater = Mover.positionUpdate(behaviorFn);
  const nextState = updater({
    ...state,
    acceleration: Vec.scale(1 / input.mass)(Arr.fold(VecSum)(input.forces))
  });
  return [Obj.append(input)(nextState), nextState];
});

export const sketch = p => {
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;

  const initialState = {
    acceleration: Vec2(0)(0),
    velocity: Vec2(0)(0),
    position: Vec2(width / 2)(height - 500)
  };

  p.setup = () => {
    p.createCanvas(width, height);
  };

  const foo = unfoldBalloon(initialState);

  const balloon = pipeC(Mealy)([foo, Mover.ellipseRender]);

  const config = {
    width,
    height,
    diameter: 50,
    p5: p,
    forces: [Vec2(0)(-0.1), Vec2(0.1)(0)],
    mass: 10
  };

  const m = Mover.driveMealy(balloon);

  p.draw = () => {
    p.background(0);
    m(config);
  };
};
