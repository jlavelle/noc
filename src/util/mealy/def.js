const Mealy = (() => {
  // type Mealy a b = a -> (b, Mealy a b)

  // Functor
  const map = f => {
    const rec = mealy => a => {
      const [b, next] = mealy(a)
      return [f(b), rec(next)]
    }
    return rec
  }

  // Applicative
  const of = x => _ => [x, of(x)]

  const ap = mealyf => mealya => a => {
    const [f, next1] = mealyf(a)
    const [x, next2] = mealya(a)
    return [f(x), ap(next1)(next2)]
  }

  // Profunctor
  const rmap = map
  
  const lcmap = f => {
    const rec = mealy => a => {
      const [x, next] = mealy(f(a))
      return [x, rec(next)]
    }
    return rec
  }

  // Misc

  // :: (s -> a -> (b, s)) -> s -> Mealy a b
  const unfold = f => {
    const rec = s => a => {
      const [x, next] = f(s)(a)
      return [x, rec(next)]
    }
    return rec
  }

  // :: Foldable f -> Mealy a b -> f a -> [b]
  const scan = F => mealy => as => {
    const go = ([m, rs]) => x => {
      const [v, next] = m(x)
      return [next, [...rs, v]]
    }
    const [_,vs] = F.foldl(go)([mealy, []])(as)
    return vs
  }

  return {
    map,
    of,
    ap,
    rmap,
    lcmap,
    unfold,
    scan
  }
})()

export default Mealy