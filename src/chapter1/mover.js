import * as Vec from '../util/vector'
import { splitNMealy, randomGaussian } from '../util/misc'
import { driveMealy, mouseMover } from '../util/mover'

const { Vec2 } = Vec

// const mover2 = ({ pos, vel, diam, width, height, acc }) => {
//   let _pos = pos
//   let _vel = vel

//   const render = p => {

//   }

//   return {
//     step(p) {

//     }
//   }
// }

export const sketch = p => {
  const w = 600
  const h = 600

  p.setup = () => {
    p.createCanvas(w, h)
    // p.frameRate(1)
  }

  const n = 200

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

  p.draw = () => {
    p.background(0)
    p.fill(255)
    mv(configs)
  }
}