import { Arr, IntSum, Fn } from '@masaeedu/fp'

const randomInt = i => Math.floor(Math.random() * i)

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
  return s / xs.length
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

export {
  randomInt,
  weights,
  cumulative,
  distribution,
  unzip,
  weightedChoice,
  mean,
  stdDev,
  roundToPrecision,
  randomGaussian,
  randomGaussianInt
}