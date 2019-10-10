import { Arr, Obj, Fn } from '@masaeedu/fp'
import { randomInt, weightedChoice } from '../util'

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

  const standardMoves = [
    [1, moves.s],
    [1, moves.e],
    [1, moves.n],
    [1, moves.w]
  ]

  const replaceWeights = ms => ws =>
    Arr.zipWith(([_, m]) => w => [w, m])(ms)(ws)
  
  // Exercise I.1
  const downRightStep = () => weightedChoice(
    replaceWeights(standardMoves)([10, 10, 8, 8])
  )(Math.random())

  // Exercise I.3
  const mouseBias = walker => {
    const dx = Math.sign(p.mouseX - walker.x)
    const dy = Math.sign(p.mouseY - walker.y)
    
    return weightedChoice([
      [4, { dx, dy }],
      ...standardMoves
    ])(Math.random())
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
  }

  p.draw = () => {
    render(walker)
    walker = stepWalker(walker)(mouseBias(walker))
  }
}

export { sketch }