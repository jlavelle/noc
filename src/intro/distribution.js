import { randomGaussian } from "../util"

export const sketch = p => {
  let randomCounts = Array(1000).fill(0)
  
  p.setup = () => {
    p.createCanvas(1000, 500)
  }

  p.draw = () => {
    p.background(255)
    
    for (let i = 0; i < 40; i++) {
      const n = randomGaussian()
      const sd = 100
      const m = 500
      const x = Math.floor(sd * n + m)
      //console.log(x)
      randomCounts[x]++
    }

    p.stroke(0)
    p.fill(175)

    const w = p.width / randomCounts.length

    randomCounts.forEach((x, i) => {
      p.rect(i * w, p.height - x, w - 1, x)
    })
  }
}