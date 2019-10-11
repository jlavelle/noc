import * as Vec from '../vector'

const { Vec2 } = Vec

export const sketch = p => {
  const w = 600
  const h = 400

  p.setup = () => {
    p.createCanvas(w, h)
  }

  const Ball = position => radius => ({ position, radius })

  const render = b => {
    const r = b.radius
    const { x, y } = b.position
    p.ellipse(x, y, r, r)
  }

  const step = b => v => {
    const { x, y } = b.position
    const r = b.radius
    const collideX = x + (r / 2) >= w || x - (r / 2) <= 0
    const collideY = y + (r / 2) >= h || y - (r / 2) <= 0
    
    const nx = collideX ? v.x * -1 : v.x
    const ny = collideY ? v.y * -1 : v.y

    const nv = Vec2(nx)(ny)
    
    return [Ball(Vec.add(b.position)(nv))(b.radius), nv]
  }
  
  let ball = Ball(Vec2(w / 2)(h / 2))(20)
  let vel = Vec2(3)(3)
  
  p.draw = () => {
    p.background(0)
    render(ball)
    const [nb, nv] = step(ball)(vel)
    ball = nb
    vel = nv
  }
}