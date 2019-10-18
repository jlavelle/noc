import { Fn, Arr, Maybe } from "@masaeedu/fp";
import * as Obj from "./fastObj";
import * as Vec from "./vector";
import Mealy from "./mealy";
import { pipeC } from "./misc";

const { Vec2 } = Vec;

const positionUpdate = f => ({ position, velocity, acceleration }) => {
  const nv = Vec.add(velocity)(acceleration);
  const np = Vec.add(position)(nv);
  return { acceleration, ...f({ position: np, velocity: nv }) };
};

const wrapDim = max => val => (val > max ? 0 : val < 0 ? max : val);
const wrapVec = Obj.zipWith(wrapDim);

const collides = diameter => position => ([upper, lower]) =>
  position + diameter / 2 >= upper || position - diameter / 2 <= lower;

const bounce = diameter => position => velocity => bounds =>
  collides(diameter)(position)(bounds) ? velocity * -1 : velocity;

const bouncingBehavior = velProp => posProp => ({
  width,
  height,
  diameter
}) => o => {
  const bounds = Vec2([width, 0])([height, 0]);
  const position = o[posProp];
  const velocity = o[velProp];
  const nv = Obj.zipWith3(bounce(diameter))(position)(velocity)(bounds);
  return Obj.over(velProp)(Fn.const(nv))(o);
};

// TODO: Fix this, collides should return an Either
const boundingBehavior = posProp => ({ width, height, diameter }) => o => {
  const newPos = diameter => position => ([upper, lower]) => {
    const c = collides(diameter)(position)([upper, lower]);
    if (c) {
      return position + diameter / 2 >= upper
        ? upper - diameter / 2
        : lower + diameter / 2;
    } else {
      return position;
    }
  };
  const np = Obj.zipWith(newPos(diameter))(o[posProp])(
    Vec2([width, 0])([height, 0])
  );
  return Obj.over(posProp)(Fn.const(np))(o);
};

const wrappingBehavior = prop => ({ width, height }) =>
  Obj.over(prop)(wrapVec(Vec2(width)(height)));

const limitingBehavior = prop => ({ topSpeed }) =>
  Obj.over(prop)(Vec.limit(topSpeed));

const mouseAccelerator = Mealy.unfold(mas => s => {
  const behavior = Fn.pipe([
    // wrappingBehavior('position')(s),
    limitingBehavior("velocity")(s),
    bouncingBehavior("velocity")("position")(s),
    boundingBehavior("position")(s)
  ]);
  const updater = positionUpdate(behavior);
  const nas = Maybe.match({
    Just: as => {
      const vec = Vec.limit(s.acceleration)(Vec.subtract(s.mouse)(as.position));
      const acceleration = s.p5.mouseIsPressed ? Vec.scale(-1)(vec) : vec;
      return updater({ ...as, acceleration });
    },
    Nothing: updater({ ...s, acceleration: Vec2(0)(0) })
  })(mas);
  const ns = Arr.fold(Obj)([s, nas]);
  return [ns, Maybe.Just(nas)];
})(Maybe.Nothing);

const withInput = x => Mealy.map(s => Obj.append(s)(x))(Mealy.id);

const mouseVec = Mealy.map(s => {
  const mouse = Vec2(s.p5.mouseX)(s.p5.mouseY);
  return { ...s, mouse };
})(Mealy.id);

const ellipseRender = Mealy.map(s => {
  const { p5, position, diameter } = s;
  p5.ellipse(position.x, position.y, diameter, diameter);
  return s;
})(Mealy.id);

const velRender = Mealy.map(s => {
  const { p5, position, velocity } = s;
  const vabs = Vec.add(position)(Vec.scale(50)(Vec.normalize(velocity)));
  p5.line(position.x, position.y, vabs.x, vabs.y);
  return s;
})(Mealy.id);

const mouseMover = pipeC(Mealy)([
  mouseVec,
  mouseAccelerator,
  ellipseRender,
  velRender
]);

const driveMealy = m => {
  let __m = m;
  return a => {
    const [r, nm] = __m(a);
    __m = nm;
    return r;
  };
};

export {
  mouseMover,
  driveMealy,
  bouncingBehavior,
  boundingBehavior,
  positionUpdate,
  ellipseRender
};
