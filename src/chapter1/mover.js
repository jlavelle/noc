import { Obj, Fn } from '@masaeedu/fp'
import * as Vec from '../util/vector'
import Mealy from '../util/mealy'

const { Vec2 } = Vec

const positionUpdate = f => ({ pos, vel, acc }) => {
  const nv = Vec.add(vel)(acc)
  const np = Vec.add(pos)(nv)
  return f({pos: np, vel: nv})
}

const wrapDim = max => val => val > max ? 0 : val < 0 ? max : val
const wrapVec = Obj.zipWith(wrapDim)

const wrappingBehavior = prop => ({w, h}) => v => {
  return {
    ...v,
    [prop]: wrapVec(Vec2(w)(h))(v[prop])
  }
}

const limitingBehavior = prop => ({ t }) => v => {
  return {
    ...v,
    [prop]: Vec.limit(t)(v[prop])
  }
}

const mouseMover = cfg => Mealy.unfold(s => mouse => {
  const behavior = Fn.pipe([
    wrappingBehavior('pos')(cfg),
    limitingBehavior('vel')(cfg)
  ])
  const acc = Vec.normalize(Vec.subtract(mouse)(s.pos))
  const ns = positionUpdate(behavior)({ acc, ...s })
  return [ ns, ns ]
})

const driveMealy = m => {
  let __m = m
  return a => {
    const [r, nm] = __m(a)
    __m = nm
    return r
  }
}

export const sketch = p => {
  const w = 600
  const h = 600

  p.setup = () => {
    p.createCanvas(w, h)
  }
  
  let lastp = Vec2(w - 1)(h - 1)
  
  const mv = driveMealy(mouseMover({w, h, t: 10})({
    pos: Vec2(w - 1)(h - 1),
    vel: Vec2(0)(0)
  }))

  p.draw = () => {
    p.background(0)
    p.fill(255)
    const mouseVec = Vec2(p.mouseX)(p.mouseY)
    const { pos, vel } = mv(mouseVec)
    p.ellipse(pos.x, pos.y, 10, 10)
    p.stroke(255)
    const vabs = Vec.add(pos)(Vec.scale(50)(Vec.normalize(vel)))
    p.line(pos.x, pos.y, vabs.x, vabs.y)
  }
}