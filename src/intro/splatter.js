import { Obj } from '@masaeedu/fp'
import { randomGaussian, configureGaussian } from '../util'
import { add } from '../vector'

// Exercise I.4

export const sketch = p => {
  const w = window.innerWidth - 20
  const h = window.innerHeight - 20

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL)
    p.background(0)
    p.noStroke()
    console.log('foo')
  }

  let angle = 0
  let spheres = []

  p.draw = () => {
    p.background(0)
    p.rotateY(angle)
    for (let i = 0; i <= 10; i++) {
      if (spheres.length > 250) {
        spheres.shift()
      } else {
        const radius = randomGaussian() * 5 + 10
        
        const coords = configureGaussian({
          x: [200, 0],
          y: [100, 0],
          z: [100, 0]
        })

        const velocity = configureGaussian({
          x: [1, 1],
          y: [1, 1],
          z: [1, 1]
        })

        const color = Obj.map(x => x % 255)(configureGaussian({
          r: [1, 0],
          g: [100, 255 / 2],
          b: [100, 255 / 2]
        }))

        spheres.push({coords, velocity, color, radius})
      }
    }
    for (let s of spheres) {
      s.coords = add(s.coords)(s.velocity)
      const { x, y, z } = s.coords
      const { r, g, b } = s.color
      p.push()
      p.fill(r, g, b)
      p.translate(x, y, z)
      p.sphere(s.radius)
      p.pop()
    }
    angle += 0.03
  }
}