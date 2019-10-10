import { randomGaussian, montecarlo } from "../util"

const gaussianDist = sd => m => {
  const n = randomGaussian()
  return Math.floor(sd * n + m)
}

export const sketch = p => {
  let randomCounts = Array(1000).fill(0)
  
  const w = window.innerWidth - 20
  const h = window.innerHeight - 20

  p.setup = () => {
    p.createCanvas(w, h)
  }

  p.draw = () => {
    p.background(255)
    
    for (let i = 0; i < 1000; i++) {
      const x = Math.floor(montecarlo(x => x) * randomCounts.length)
      randomCounts[x]++
    }

    p.stroke(0)
    p.fill(175)

    const cw = w / randomCounts.length

    randomCounts.forEach((x, i) => {
      p.rect(i * cw, h - x, cw - 1, x)
    })
  }
}