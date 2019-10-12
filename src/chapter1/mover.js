import { Obj, Fn, Arr } from '@masaeedu/fp'
import * as Vec from '../util/vector'
import Mealy from '../util/mealy'
import { pipeC } from '../util/misc'

const { Vec2 } = Vec

const positionUpdate = f => ({ pos, vel, acc }) => {
  const nv = Vec.add(vel)(acc)
  const np = Vec.add(pos)(nv)
  return f({pos: np, vel: nv})
}

const wrapDim = max => val => val > max ? 0 : val < 0 ? max : val
const wrapVec = Obj.zipWith(wrapDim)

const wrappingBehavior = prop => ({ w, h }) => Obj.over(prop)(wrapVec(Vec2(w)(h)))
const limitingBehavior = prop => ({ s }) => Obj.over(prop)(Vec.limit(s))

const accelerator = Mealy.unfold(as => s => {
  const behavior = Fn.pipe([
    wrappingBehavior('pos')(s),
    limitingBehavior('vel')(s)
  ])
  const acc = Vec.limit(s.a)(Vec.subtract(s.mouse)(as.pos))
  const nas = positionUpdate(behavior)({...as, acc})
  const ns = Arr.fold(Obj)([nas, ns, s])
  return [ ns, nas ]
})

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

const mouseMover = cfg => init => pipeC(Mealy)([
  mouseVec,
  withInput(cfg),
  accelerator(init),
  withInput({ rad: 10 }),
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

export const sketch = p => {
  const w = 600
  const h = 600

  p.setup = () => {
    p.createCanvas(w, h)
  }
  
  let lastp = Vec2(w - 1)(h - 1)
  
  const mv = driveMealy(mouseMover({w, h, s: 5, a: 0.1})({
    pos: Vec2(w - 1)(h - 1),
    vel: Vec2(0)(0)
  }))

  p.draw = () => {
    p.background(0)
    p.fill(255)
    mv({ p5: p })
  }
}