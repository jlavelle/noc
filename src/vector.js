import { Obj, IntSum } from '@masaeedu/fp'

const Vec2 = x => y => ({ x, y })
const Vec3 = x => y => z => ({x, y, z})

const add = Obj.zipWith(a => b => a + b)

const subtract = Obj.zipWith(a => b => a - b)

const scale = n => Obj.map(x => x * n)

const dot = v1 => v2 => Obj.fold(IntSum)(Obj.zipWith(a => b => a * b)(v1)(v2))

const magnitude = v => Math.sqrt(Obj.foldMap(IntSum)(x => x * x)(v))

const limit = to => v => {
  const mag = magnitude(v)
  return mag > to ? scale(Math.sqrt((to * to) / (mag * mag)))(v) : v
}

const normalize = v => {
  const m = magnitude(v)
  return scale(1 / (m === 0 ? 1 : m))(v)
}

export {
  Vec2,
  Vec3,
  add,
  subtract,
  scale,
  dot,
  magnitude,
  normalize,
  limit
}