import { Fn, Arr, Maybe } from '@masaeedu/fp'
import * as Obj from './fastObj'
import * as Vec from './vector'
import Mealy from './mealy'
import { pipeC } from './misc'

const { Vec2 } = Vec

const positionUpdate = f => ({ pos, vel, acc }) => {
  const nv = Vec.add(vel)(acc)
  const np = Vec.add(pos)(nv)
  return { acc, ...f({pos: np, vel: nv}) }
}

const wrapDim = max => val => val > max ? 0 : val < 0 ? max : val
const wrapVec = Obj.zipWith(wrapDim)

const collides = rad => pos => bound => pos + (rad / 2) >= bound || pos - (rad / 2) <= 0

const bouncingBehavior = velProp => posProp => ({ w, h, rad }) => o => {
  const newVel = rad => pos => vel => bound => 
    collides(rad)(pos)(bound) ? vel * -1 : vel
  const bounds = Vec2(w)(h)
  const pos = o[posProp]
  const vel = o[velProp]
  const nv = Obj.zipWith3(newVel(rad))(pos)(vel)(bounds)
  return Obj.over(velProp)(Fn.const(nv))(o)
}

const boundingBehavoir = posProp => ({ w, h, rad }) => o => {
  const newPos = rad => pos => bound => {
    const c = collides(rad)(pos)(bound)
    if (c) {
      return pos + (rad / 2) >= bound ? bound - rad : 0 + rad
    } else {
      return pos
    }
  }
  const np = Obj.zipWith(newPos(rad))(o[posProp])(Vec2(w)(h))
  return Obj.over(posProp)(Fn.const(np))(o)
}

const wrappingBehavior = prop => ({ w, h }) => Obj.over(prop)(wrapVec(Vec2(w)(h)))

const limitingBehavior = prop => ({ s }) => Obj.over(prop)(Vec.limit(s))

const mouseAccelerator = Mealy.unfold(mas => s => {
  const behavior = Fn.pipe([
    // wrappingBehavior('pos')(s),
    limitingBehavior('vel')(s),
    bouncingBehavior('vel')('pos')(s),
    boundingBehavoir('pos')(s)
  ])
  const updater = positionUpdate(behavior)
  const nas = Maybe.match({
    Just: as => {
      const vec = Vec.limit(s.a)(Vec.subtract(s.mouse)(as.pos))
      const acc = s.p5.mouseIsPressed
        ? Vec.scale(-1)(vec)
        : vec
      return updater({...as, acc})
    },
    Nothing: updater({...s, acc: Vec2(0)(0)})
  })(mas)
  const ns = Arr.fold(Obj)([s, nas])
  return [ ns, Maybe.Just(nas) ]
})(Maybe.Nothing)

const withInput = x => Mealy.map(s => Obj.append(s)(x))(Mealy.id)

const mouseVec = Mealy.map(s => {
  const mouse = Vec2(s.p5.mouseX)(s.p5.mouseY)
  return { ...s, mouse }
})(Mealy.id)

const ellipseRender = Mealy.map(s => {
  const { p5, pos, rad } = s
  p5.ellipse(pos.x, pos.y, rad, rad)
  return s
})(Mealy.id)

const velRender = Mealy.map(s => {
  const { p5, pos, vel } = s
  const vabs = Vec.add(pos)(Vec.scale(50)(Vec.normalize(vel)))
  p5.line(pos.x, pos.y, vabs.x, vabs.y)
  return s
})(Mealy.id)

const mouseMover = pipeC(Mealy)([
  mouseVec,
  mouseAccelerator,
  ellipseRender,
  velRender
])

const driveMealy = m => {
  let __m = m
  return a => {
    const [r, nm] = __m(a)
    __m = nm
    return r
  }
}

export { mouseMover, driveMealy }