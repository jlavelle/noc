const Vec2 = x => y => ({ x, y })
const Vec3 = x => y => z => ({x, y, z})

const match = ({ Vec2, Vec3 }) => v => {
  return v.hasOwnProperty('z') ? Vec3(v.x)(v.y)(v.z)
                               : Vec2(v.x)(v.y)
}

const up = v2 => z => Vec3(v2.x)(v2.y)(z)

const add = v1 => match({
  Vec2: x => y => Vec2(v1.x + x)(v1.y + y),
  Vec3: x => y => z => Vec3(v1.x + x)(v1.y + y)(v1.z + z)
})

export {
  Vec2,
  Vec3,
  add
}