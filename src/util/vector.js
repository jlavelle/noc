import { IntSum } from "@masaeedu/fp";
import Obj from "./fastObj";

const { zipWith, map, fold, foldMap } = Obj;

const Vec2 = x => y => ({ x, y });
const Vec3 = x => y => z => ({ x, y, z });

const add = zipWith(a => b => a + b);

const subtract = zipWith(a => b => a - b);

const scale = n => map(x => x * n);

const dot = v1 => v2 => fold(IntSum)(zipWith(a => b => a * b)(v1)(v2));

const magnitudeSq = v => foldMap(IntSum)(x => x * x)(v);

const magnitude = v => Math.sqrt(magnitudeSq(v));

// Ignores vectors with magnitude 0
const setMagnitude = to => v => {
  const m = magnitudeSq(v);
  return m === 0 ? v : scale(to / Math.sqrt(m))(v);
};

const limit = to => v => {
  const mag = magnitude(v);
  return mag > to ? scale(to / mag)(v) : { ...v };
};

const normalize = v => {
  const m = magnitudeSq(v);
  return scale(1 / (m === 0 ? 1 : Math.sqrt(m)))(v);
};

const distanceSq = v1 => v2 => magnitudeSq(subtract(v2)(v1));

const distance = v1 => v2 => Math.sqrt(distanceSq(v1)(v2));

const heading2D = ({ x, y }) => {
  const t = Math.atan2(y, x);
  return t < 0 ? t : t;
};

const VecSum = {
  append: add,
  empty: Vec3(0)(0)(0)
};

export {
  Vec2,
  Vec3,
  add,
  subtract,
  scale,
  dot,
  magnitude,
  magnitudeSq,
  setMagnitude,
  normalize,
  limit,
  VecSum,
  distanceSq,
  distance,
  heading2D
};
