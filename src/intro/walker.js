import { Arr, Obj, Fn } from '@masaeedu/fp'
import { randomInt, weightedChoice, randomGaussian } from '../util'

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

  const diagonalMoves = [
    [1, moves.nw],
    [1, moves.ne],
    [1, moves.sw],
    [1, moves.se]
  ]

  const noMove = [[1, moves.ns]]

  const replaceWeights = ms => ws =>
    Arr.zipWith(([_, m]) => w => [w, m])(ms)(ws)
  
  const standard = () => weightedChoice(standardMoves)(Math.random())
  const anyStep = () => 
    weightedChoice([...standardMoves, ...diagonalMoves, ...noMove])(Math.random())
  
  // Exercise I.1
  const downRightStep = () => weightedChoice(
    replaceWeights(standardMoves)([10, 10, 8, 8])
  )(Math.random())

  // Exercise I.3
  const mouseBias = walker => {
    const dx = Math.sign(p.mouseX - walker.x)
    const dy = Math.sign(p.mouseY - walker.y)
    
    return weightedChoice([
      [9, { dx, dy }],
      ...standardMoves,
      ...diagonalMoves,
      ...noMove
    ])(Math.random())
  }

  // Exercise I.5
  // :: { sx :: (StdDev, Mean), sy :: (StdDev, Mean) } 
  // -> { dx :: Int, dy :: Int } 
  // -> { dx :: Int, dy :: Int }
  const gaussianScale = opts => ({ dx, dy }) => {
    const { sx, sy } = Obj.map(([sd, m]) => randomGaussian() * sd + m)(opts)
    return { dx: dx * sx, dy: dy * sy }
  }

  const gaussianOpts = {
    sx: [5, 5],
    sy: [5, 5]
  }

  const stepWalker = ({ x, y }) => ({ dx, dy }) => ({ x: x + dx, y: y + dy })

  const render = prev => curr => {
    p.stroke(0)
    p.point(prev.x, prev.y)
    p.point(curr.x, curr.y)
    p.line(prev.x, prev.y, curr.x, curr.y)
  }
  
  const w = window.innerWidth - 20
  const h = window.innerHeight - 20

  let walker = { x: w / 2, y: h / 2 }
  
  p.setup = () => {
    p.createCanvas(w, h)
  }

  p.draw = () => {
    const prev = walker
    const next = stepWalker(prev)(gaussianScale(gaussianOpts)(standard()))
    render(prev)(next)
    walker = next
  }
}

export { sketch }