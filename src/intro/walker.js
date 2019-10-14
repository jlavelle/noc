import { Arr, Fn } from '@masaeedu/fp'
import * as Obj from '../util/fastObj'
import { 
  randomInt,
  weightedChoice,
  randomGaussian,
  montecarlo,
  randomR,
  mapInterval
} from '../util/misc'
import * as Vec from '../util/vector'

const { Vec2 } = Vec

const sketch = p => {
  const randomStep = () => {
    const dx = randomInt(3) - 1
    const dy = randomInt(3) - 1
    return Vec2(dx)(dy)
  }
  
  const moves = (() => {
    const cardinal = [
      ['n',  0, -1],
      ['s',  0,  1],
      ['e',  1,  0],
      ['w', -1,  0]
    ]
    
    const toPairs = ([n, dx, dy]) => [n, Vec2(dx)(dy)]
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
      [9, Vec2(dx)(dy)],
      ...standardMoves,
      ...diagonalMoves,
      ...noMove
    ])(Math.random())
  }

  const perlinStep = ({walker, width, height, t}) => {
    const f = mapInterval([0,1])
    return Vec2
      (f([0,w])(p.noise(t)) - walker.x)
      (f([0,h])(p.noise(t + 10000)) - walker.y)
  }

  const scaleStep = ({ x, y }) => ({ sx, sy }) => {
    return { x: x * sx, y: y * sy }
  }

  // Exercise I.5
  // :: { sx :: (StdDev, Mean), sy :: (StdDev, Mean) } 
  // -> { dx :: Int, dy :: Int } 
  // -> { dx :: Int, dy :: Int }
  const gaussianScale = opts => step => {
    const scale = Obj.map(([sd, m]) => randomGaussian() * sd + m)(opts)
    return scaleStep(step)(scale)
  }

  // Exercise I.6
  const customScale = f => step => {
    const ss = montecarlo(f) * 30
    const scale = {
      sx: randomR(-ss)(ss),
      sy: randomR(-ss)(ss)
    }
    return scaleStep(step)(scale)
  }

  // Exercise I.7
  const perlinScale = t => step => {
    const f = mapInterval([0, 1])([0, 10])
    const scale = {
      sx: f(p.noise(t)),
      sy: f(p.noise(t + 10000))
    }
    return scaleStep(step)(scale)
  }

  const gaussianOpts = {
    sx: [5, 5],
    sy: [5, 5]
  }

  const stepWalker = Vec.add

  const render = prev => curr => {
    p.stroke(0)
    p.line(prev.x, prev.y, curr.x, curr.y)
  }
  
  const w = window.innerWidth - 20
  const h = window.innerHeight - 20

  let walker = Vec2(w / 2)(h / 2)
  let t = 0

  p.setup = () => {
    p.createCanvas(w, h)
  }

  p.draw = () => {
    const prev = walker
    const next = stepWalker(prev)(perlinStep({
      walker: prev,
      width: w,
      height: h,
      t
    }))
    render(prev)(next)
    walker = next
    t += 0.003
  }
}

export { sketch }