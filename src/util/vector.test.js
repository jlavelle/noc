import test from "ava";
import {
  Vec2,
  Vec3,
  add,
  subtract,
  scale,
  dot,
  magnitude,
  normalize,
  limit
} from "./vector";

const a = Vec2(2)(2);
const b = Vec2(1)(2);
const a2 = Vec3(1)(2)(8);
const b2 = Vec3(4)(5)(4);

test("add", t => {
  const r = Vec2(3)(4);
  t.deepEqual(r, add(a)(b));

  const r2 = Vec3(5)(7)(12);
  t.deepEqual(r2, add(a2)(b2));
});

test("subtract", t => {
  const r = Vec2(1)(0);
  t.deepEqual(r, subtract(a)(b));

  const r2 = Vec3(-3)(-3)(4);
  t.deepEqual(r2, subtract(a2)(b2));
});

test("scale", t => {
  const r = Vec2(4)(4);
  t.deepEqual(r, scale(2)(a));

  const r2 = Vec3(2)(4)(16);
  t.deepEqual(r2, scale(2)(a2));
});

test("dot", t => {
  t.is(6, dot(a)(b));
  t.is(46, dot(a2)(b2));
});

test("magnitude", t => {
  t.is(0, magnitude(Vec3(0)(0)(0)));
  t.is(Math.sqrt(8), magnitude(a));
  t.is(Math.sqrt(69), magnitude(a2));
});

test("normalize", t => {
  t.is(1, Math.round(magnitude(normalize(a))));
  t.is(1, Math.round(magnitude(normalize(b2))));
  t.is(0, magnitude(normalize(Vec3(0)(0)(0))));
  t.is(1, Math.round(magnitude(normalize(Vec3(-19)(30)(-3)))));
});

test("limit", t => {
  t.is(10, Math.round(magnitude(limit(10)(Vec3(100)(100)(100)))));
  t.is(1, Math.round(magnitude(limit(1)(Vec2(4)(5)))));
});
