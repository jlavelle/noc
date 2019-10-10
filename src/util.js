import { Arr, IntSum, Fn } from '@masaeedu/fp'

// toEnum :: Int -> AdtDef a -> a
const toEnum = i => d => d[Object.keys(d.def)[i]]

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
// e.g. prob([[1, "a"], [1, "b"], [2, "c"]])(0.7) == "c"
// :: NonEmpty (Int, a) -> Float -> a
const prob = xs => p => {
  const [is, vs] = unzip(xs)
  const ws = distribution(is)
  const ww = Arr.zipWith(a => b => [a, b])(ws)(vs)
  
  const go = ([r, v]) => x => p < r ? v : x
  return Arr.foldr(go)(vs[vs.length - 1])(ww)
}

// want to take a list of weights and 

export { 
  toEnum,
  randomInt,
  weights,
  cumulative,
  distribution,
  unzip,
  prob
}