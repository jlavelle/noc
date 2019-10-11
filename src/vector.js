const Vec2 = x => y => ({ x, y })

const add = v1 => v2 => Vec2(v1.x + v2.x)(v1.y + v2.y)

export {
  Vec2,
  add
}