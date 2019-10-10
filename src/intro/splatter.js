import { Obj } from '@masaeedu/fp'
import { randomGaussian, randomColor, randomCoord } from '../util'

// Exercise I.4

export const sketch = p => {
  const w = window.innerWidth - 20
  const h = window.innerHeight - 20

  p.setup = () => {
    p.createCanvas(w, h)
    p.background(0)
    p.noStroke()
  }

  p.draw = () => {
    for (let i = 0; i <= 10; i++) {
      const radiusX = randomGaussian() * 20 + 10
      const radiusY = randomGaussian() * 2 + radiusX
      
      const coord = randomCoord({
        getRandom: randomGaussian,
        sdx: 200,
        sdy: 120,
        mx: w / 2,
        my: h / 2
      })
  
      const { r, g, b } = randomColor({
        r: [1, 0],
        g: [100, 255 / 2],
        b: [100, 255 / 2]
      })
      
      p.fill(r, g, b)
  
      p.ellipse(coord.x, coord.y, radiusX, radiusY)
    }
  }
}