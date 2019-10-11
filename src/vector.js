import { Obj } from '@masaeedu/fp'

const Vec2 = x => y => ({ x, y })
const Vec3 = x => y => z => ({x, y, z})

const add = Obj.zipWith(a => b => a + b)

export {
  Vec2,
  Vec3,
  add
}