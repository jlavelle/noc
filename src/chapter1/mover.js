import { Obj, Fn, Arr, Maybe } from '@masaeedu/fp'
import * as Vec from '../util/vector'
import Mealy from '../util/mealy'
import { pipeC, splitN } from '../util/misc'

const { Vec2 } = Vec

const positionUpdate = f => ({ pos, vel, acc }) => {
  const nv = Vec.add(vel)(acc)
  const np = Vec.add(pos)(nv)
  return { acc, ...f({pos: np, vel: nv}) }
}

const wrapDim = max => val => val > max ? 0 : val < 0 ? max : val
const wrapVec = Obj.zipWith(wrapDim)

const wrappingBehavior = prop => ({ w, h }) => Obj.over(prop)(wrapVec(Vec2(w)(h)))
const limitingBehavior = prop => ({ s }) => Obj.over(prop)(Vec.limit(s))

const accelerator = Mealy.unfold(mas => s => {
  const behavior = Fn.pipe([
    wrappingBehavior('pos')(s),
    limitingBehavior('vel')(s)
  ])
  const updater = positionUpdate(behavior)
  const nas = Maybe.match({
    Just: as => {
      const acc = Vec.limit(s.a)(Vec.subtract(s.mouse)(as.pos))
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
  accelerator,
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

  const n = 10

  const randomConfig = () => ({
    p5: p,
    w, h, 
    s: Math.random() * 10,
    a: Math.random() / 10 + 1,
    rad: Math.random() * 30 + 5,
    pos: Vec2(Math.random() * w)(Math.random() * w),
    vel: Vec2(Math.random())(Math.random())
  })

  const configs = Array(n).fill(0).map(x => randomConfig())
  
  const config = {
    w, h,
    s: 5,
    a: 1,
    rad: 10,
    pos: Vec2(w / 2)(h / 2),
    vel: Vec2(0)(0)
  }

  const mv = driveMealy(splitN(Mealy)(Array(n).fill(mouseMover)))

  p.draw = () => {
    p.background(0)
    p.fill(255)
    mv(configs)
  }
}