import * as Vec from '../vector'

const { Vec3 } = Vec

export const sketch = p => {
  const w = 600
  const h = 400
  const d = 200

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

  const step = b => v => {
    const { x, y, z } = b.position
    const r = b.radius
    const collideX = x + (r / 2) >= 100 || x - (r / 2) <= -100
    const collideY = y + (r / 2) >= 100 || y - (r / 2) <= -100
    const collideZ = z + (r / 2) >= 100 || z - (r / 2) <= -100
    
    const nx = collideX ? v.x * -1 : v.x
    const ny = collideY ? v.y * -1 : v.y
    const nz = collideZ ? v.z * -1 : v.z

    const nv = Vec3(nx)(ny)(nz)
    
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