import * as Vec from '../util/vector'
import { splitNMealy, randomGaussian, frameRateCounter } from '../util/misc'
import { driveMealy, mouseMover } from '../util/mover'

const { Vec2 } = Vec

export const sketch = p => {
  const w = window.innerWidth - 20
  const h = window.innerHeight - 20

  p.setup = () => {
    p.createCanvas(w, h)
    // p.frameRate(1)
  }

  const n = 300

  const randomConfig = () => ({
    p5: p,
    w, h, 
    s: Math.random() * 10,
    a: Math.random() / 10 + 1,
    rad: randomGaussian() * 10 + 30,
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

  const mv = driveMealy(splitNMealy(Array(n).fill(mouseMover)))
  const fr = frameRateCounter(20)

  p.draw = () => {
    p.background(0)
    p.fill(255)
    mv(configs)
    p.text(Math.round(fr(p)), 10, 15)
  }
}