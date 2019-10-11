import { randomGaussian } from '../util/misc'

export const sketch = p => {
  const w = 640
  const h = 360
  
  p.setup = () => {
    p.createCanvas(w, h)
  }

  p.draw = () => {
    const n = randomGaussian()
    const sd = 60
    const m = 320
    const x = sd * n + m
    p.noStroke()
    p.fill(0, 10)
    p.ellipse(x, 180, 16, 16)
  }
}