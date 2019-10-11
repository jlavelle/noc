import { mapInterval, randomR } from "../util"

// Exercise I.10
// TODO: clean this up

export const sketch = p => {
  const w = 600
  const h = 600

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL)
    p.angleMode(p.RADIANS)
    p.noiseDetail(5, 0.5)
  }

  let angle = Math.PI / 3
  let size = 10
  const rows = h / size
  const cols = w / size

  const rzs = (() => {
    let yoff = 0
    let xoff = 0
    return Array(cols + 1).fill(0).map(r => {
      yoff = 0
      const c = Array(rows).fill(0).map(_ => {
        const z = mapInterval([0, 1])([-10, 100])(p.noise(xoff, yoff))
        yoff += 0.11
        return z
      })
      xoff += 0.11
      return c
    })
  })()

  p.draw = () => {
    p.rotateX(Math.PI / 3)
    p.rotateZ(angle)
    p.translate(-w / 2, -h / 2)
    p.background(0)
    p.noFill()
    p.strokeWeight(0.5)
    p.stroke(200)
    for (let x = 0; x < cols; x++) {
      p.beginShape(p.TRIANGLE_STRIP)
      for (let y = 0; y < rows; y++) {
        p.vertex(x * size, y * size, rzs[x][y])
        p.vertex((x + 1) * size, y * size, rzs[x + 1][y])
      }
      p.endShape()
    }
    angle += 0.01
  }
}