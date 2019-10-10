import { randomInt, randomGaussianInt } from "../util"

export const sketch = p => {
  let randomCounts = Array(100).fill(0)
  
  p.setup = () => {
    p.createCanvas(1000, 240)
  }

  p.draw = () => {
    p.background(255)
    
    for (let i = 0; i < 10; i++) {
      let idx = randomInt(randomCounts.length)
      //let idx = (randomGaussianInt(randomCounts.length) + randomCounts.length) / 2
      randomCounts[idx]++
    }

    p.stroke(0)
    p.fill(175)

    const w = p.width / randomCounts.length

    randomCounts.forEach((x, i) => {
      p.rect(i * w, p.height - x, w - 1, x)
    })
  }
}