import { adt } from '@masaeedu/adt'
import { toEnum } from '../util'

const Step = adt({ Left: [], Right: [], Up: [], Down:[] })

const stepWalker = ({ x, y }) => Step.match({
  Left:  { x: x - 1, y },
  Right: { x: x + 1, y },
  Up:    { x, y: y + 1 },
  Down:  { x, y: y - 1 }
})

const render = p => w => {
  p.stroke(0);
  p.point(w.x, w.y)
}

const sketch = p => {
  const w = 800
  const h = 400

  let walker = { x: w / 2, y: h / 2 }
  
  p.setup = () => {
    p.createCanvas(w, h)
    const step = toEnum(Math.floor(p.random(4)))(Step)
    console.log(step)
    console.log(stepWalker(walker)(step))
  }

  p.draw = () => {
    render(p)(walker)
    const step = toEnum(Math.floor(p.random(4)))(Step)
    walker = stepWalker(walker)(step)
  }
}

export { sketch }