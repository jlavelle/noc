import { randomGaussian } from '../util'

export const sketch = p => {
  const w = 640
  const h = 360
  
  p.setup = () => {
    p.createCanvas(w, h)
    console.log(p.randomGaussian())
  }

  p.draw = () => {
    const n = p.randomGaussian()
    const sd = 60
    const m = 320
    const x = sd * n + m
    p.noStroke()
    p.fill(0, 10)
    p.ellipse(x, 180, 16, 16)
  }
}