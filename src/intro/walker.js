import { randomInt } from '../util'

const sketch = p => {
  
  const randomStep = () => {
    const dx = randomInt(3) - 1
    const dy = randomInt(3) - 1
    return { dx, dy }
  }

  const stepWalker = ({ x, y }) => ({ dx, dy }) => ({ x: x + dx, y: y + dy })

  const render = w => {
    p.stroke(0);
    p.point(w.x, w.y)
  }
  
  const w = 800
  const h = 400

  let walker = { x: w / 2, y: h / 2 }
  
  p.setup = () => {
    p.createCanvas(w, h)
    console.log(stepWalker(walker)(randomStep()))
  }

  p.draw = () => {
    render(walker)
    walker = stepWalker(walker)(randomStep())
  }
}

export { sketch }