import { Obj, Fn, Arr, Maybe } from '@masaeedu/fp'
import * as Vec from '../util/vector'
import Mealy from '../util/mealy'
import { pipeC, splitN } from '../util/misc'
import { driveMealy, mouseMover } from '../util/mover'

const { Vec2 } = Vec

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