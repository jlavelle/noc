import { Arr, Obj, Fn } from '@masaeedu/fp'
import { randomInt, prob } from '../util'

const sketch = p => {
  const randomStep = () => {
    const dx = randomInt(3) - 1
    const dy = randomInt(3) - 1
    return { dx, dy }
  }
  
  const moves = (() => {
    const cardinal = [
      ['n',  0, -1],
      ['s',  0,  1],
      ['e',  1,  0],
      ['w', -1,  0]
    ]
    
    const toPairs = ([n, dx, dy]) => [n, {dx, dy}]
    const addc = x => y => Arr.map(i => x[i] + y[i])(Arr.range(3))
    
    return Fn.passthru(cardinal)([
      Arr.lift2(addc)(cardinal),
      Arr.append(cardinal),
      Arr.map(toPairs),
      Obj.fromPairs
    ])
  })()
  
  const downRightStep = () => prob([
    [10, moves.s ],
    [10, moves.e ],
    [8 , moves.n ],
    [8 , moves.w ]
  ])(Math.random())

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
  }

  p.draw = () => {
    render(walker)
    walker = stepWalker(walker)(downRightStep())
  }
}

export { sketch }