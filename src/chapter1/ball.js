import { Fn, Obj } from '@masaeedu/fp'
import * as Vec from '../vector'

const { Vec3 } = Vec

export const sketch = p => {
  const w = 600
  const h = 400

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL)
    p.noStroke()
  }

  const Ball = position => radius => ({ position, radius })

  const render = b => {
    const r = b.radius
    const { x, y, z } = b.position
    p.push()
    p.normalMaterial()
    p.translate(x, y, z)
    p.sphere(10)
    p.pop()
  }

  const collides = c => vc => r => b => {
    const cond = c + (r / 2) >= b || c - (r / 2) <= -b
    return cond ? vc * -1 : vc
  }

  const step = b => v => {
    const r = b.radius
    
    const nv = Fn.passthru(v)([
      Obj.zipWith(a => b => [a, b])(b.position),
      Obj.map(([c, vc]) => collides(c)(vc)(r)(100))
    ])
    
    return [Ball(Vec.add(b.position)(nv))(b.radius), nv]
  }
  
  let ball = Ball(Vec3(0)(0)(0))(20)
  let vel = Vec3(1)(3)(2)
  let angle = 0

  p.draw = () => {
    p.rotateY(angle)
    p.background(0)
    render(ball)
    p.stroke(255)
    p.noFill()
    p.box(200, 200, 200)
    const [nb, nv] = step(ball)(vel)
    ball = nb
    vel = nv
    angle += 0.001
  }
}