import { Arr, IntSum, Fn } from '@masaeedu/fp'
import * as Obj from './fastObj'

const randomInt = i => Math.floor(Math.random() * i)

const randomR = a => b => Math.random() * (b - a) + a

// weights :: Foldable f -> f Int -> f Int
const weights = F => xs => {
  const s = F.fold(IntSum)(xs)
  return F.map(x => x / s)(xs)
}

const scanl = f => a => Arr.match({
  Nil: [a],
  Cons: x => xs => Arr.Cons(a)(scanl(f)(f(a)(x))(xs))
})

const scanl1 = f => Arr.match({
  Nil: [],
  Cons: x => xs => scanl(f)(x)(xs)
})

const cumulative = scanl1(x => y => x + y)

const distribution = Fn.pipe([weights(Arr), cumulative])

// :: [(a, b)] => ([a], [b])
const unzip = Arr.foldr(([a, b]) => ([as, bs]) => {
  return [[a, ...as], [b, ...bs]]
})([[], []])

// Create a distribution based on a list of weights tupled with outcomes,
// and select an outcome by passing in a number 0 <= p <= 1
// e.g. weightedChoice([[1, "a"], [1, "b"], [2, "c"]])(0.7) == "c"
// :: NonEmpty (Int, a) -> Float -> a
const weightedChoice = xs => p => {
  const [is, vs] = unzip(xs)
  const ws = distribution(is)
  const ww = Arr.zipWith(a => b => [a, b])(ws)(vs)

  const go = ([r, v]) => x => p < r ? v : x
  return Arr.foldr(go)(vs[vs.length - 1])(ww)
}

// :: NonEmpty Number -> Number
const mean = xs => {
  const s = Arr.fold(IntSum)(xs)
  return s / (xs.length > 0 ? xs.length : 1)
}

const stdDev = xs =>
  Fn.passthru(xs)([
    mean,
    m => Arr.map(x => Math.pow(x - m, 2))(xs),
    mean,
    Math.sqrt
  ])

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
const roundToPrecision = n => p => {
  let y = +n + (p === undefined ? 0.5 : p / 2)
  return y - (y % (p === undefined ? 1 : +p))
}

// https://en.wikipedia.org/wiki/Marsaglia_polar_method
let spare = null
const randomGaussian = () => {
  if (spare) {
    let x = spare
    spare = null
    return x
  } else {
    let u, v, s
    do {
      u = Math.random() * 2 - 1
      v = Math.random() * 2 - 1
      s = u * u + v * v
    } while (s >= 1 || s == 0)
    let r = Math.sqrt(-2 * Math.log(s) / s)
    spare = v * r
    return u * r
  }
}

const randomGaussianInt = i => Math.floor(randomGaussian() * i)

const montecarlo = f => {
  while (true) {
    let r1 = Math.random()
    let p = f(r1)
    if (p <= 0) {
      throw Error("montecarlo: Negative probability")
    }
    let r2 = Math.random()
    if (r2 < p) {
      return r1
    }
  }
}

// Does the same thing as p5's map function
const mapInterval = ([cmin, cmax]) => ([nmin, nmax]) => n => {
  const cpos = (n - cmin) / (cmax - cmin)
  const npos = cpos * (nmax - nmin) + nmin
  return npos
}

const configureGaussian =
  Obj.map(([sd, m]) => randomGaussian() * sd + m)

const pipeC = C => Arr.foldl(Fn.flip(C.compose))(C.id)

// :: (a, (b, ... (c, n))) -> (a, b, c, ...n)
const flattenNR = xs => {
  if (xs.length === 2 && !(xs[1] instanceof Array)) {
    return xs
  } else {
    const [x, r] = xs
    return [x, ...flattenNR(r)]
  }
}

const flattenNL = xs => {
  if (xs.length === 2 && !(xs[0] instanceof Array)) {
    return xs
  } else {
    const [r, x] = xs
    return [...flattenNL(r), x]
  }
}

const nestNR = xs => {
  if (xs.length === 2) {
    return xs
  } else {
    const [x, ...rest] = xs
    return [x, nestNR(rest)]
  }
}

const nestNL = xs => {
  if (xs.length === 2) {
    return xs
  } else {
    const rest = xs.slice(0, -1)
    const x = Arr.last(xs)
    return [nestNL(rest), x]
  }
}

// :: Strong + Category p -> p a b -> p x y -> p (a, b) (x, y)
const split = SC => pab => pxy => SC.compose(SC.second(pxy))(SC.first(pab))

// :: Strong + Category p -> [p a b] -> p [a] [b]
const splitN = SC => ([x, ...xs]) => {
  const nested = Arr.foldl(split(SC))(x)(xs)
  return SC.dimap(nestNL)(flattenNL)(nested)
}

// [Mealy a b] -> Mealy [a] [b]
const splitNMealy = xs => {
  const rec = ms => as => {
    let results = []
    let nextms = []
    ms.forEach((x, i) => {
      const [b, next] = x(as[i])
      results.push(b)
      nextms.push(next)
    })
    return [results, rec(nextms)]
  }
  return rec(xs)
}

const frameRateCounter = max => {
  let past = []
  return p => {
    if (past.length >= max) {
      past.pop()
    }
    past.push(p.frameRate())
    return mean(past)
  }
}

export {
  randomInt,
  randomR,
  weights,
  cumulative,
  distribution,
  unzip,
  weightedChoice,
  mean,
  stdDev,
  roundToPrecision,
  randomGaussian,
  randomGaussianInt,
  montecarlo,
  mapInterval,
  configureGaussian,
  pipeC,
  flattenNR,
  flattenNL,
  nestNR,
  nestNL,
  split,
  splitN,
  splitNMealy,
  frameRateCounter
}