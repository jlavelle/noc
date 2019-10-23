import { Maybe, Arr } from "@masaeedu/fp";
import { mapMaybe } from "./misc";
import * as Vec from "./vector";

const { Just, Nothing } = Maybe;
const { Vec2, VecSum } = Vec;

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

// Ex 2.4
const zones = zs => ({ state }) => {
  const { position, diameter } = state;
  const fs = mapMaybe(z => {
    const o = z.collides({ position, diameter })(z);
    return o ? Just(z.force(state)) : Nothing;
  })(zs);
  return Arr.fold(VecSum)(fs);
};

const gravity = g => ({ state: { mass } }) => {
  return Vec2(0)(g * mass);
};

// Fd = 1/2 * rho * v^2 * A * C * unit(v)
const dragForce = ({ rho, c }) => ({ velocity, diameter }) => {
  const a = diameter * 0.5 * Math.PI;
  const fd = Vec.scale(-0.25 * rho * Math.pow(Vec.magnitude(velocity), 2) * a)(
    Vec.normalize(velocity)
  );
  return fd;
};

export { edgeRepel, zones, gravity, dragForce };
