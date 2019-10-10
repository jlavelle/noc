import { mapInterval, randomGaussian, randomColor } from '../util'

export const sketch = p => {
  
  // const w = window.innerWidth - 20
  // const h = window.innerHeight - 20
  const w = 800
  const h = 800
  
  const mkNoise = () => {
    p.loadPixels()
    let xoff = 0
    for (let x = 0; x < w; x++) {
      let yoff = 0
      for (let y = 0; y < h; y++) {
        const br = Math.round(mapInterval([0, 1])([0,255])(p.noise(xoff, yoff)))
        const i = 4 * (x + y * w)
        p.pixels[i] = br
        p.pixels[i + 1] = br
        p.pixels[i + 2] = br
        p.pixels[i + 3] = 255
        yoff += 0.01
      }
      xoff += 0.01
    }
    p.updatePixels()
  }

  p.setup = () => {
    p.createCanvas(w, h)
    console.log('wat')
    p.ellipse(10, 10, 10, 10)
  }
  
  p.draw = () => {
    p.background(0)
    mkNoise()
    p.noLoop()
  }
}