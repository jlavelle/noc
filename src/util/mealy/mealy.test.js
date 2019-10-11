import test from 'ava'
import Mealy from '.'
import { Arr } from '@masaeedu/fp'

// :: Mealy () Int
const counter = Mealy.unfold(s => _ => [s, s + 1])(0)

// :: Mealy () (Int -> Int)
const adder = Mealy.map(a => b => a + b)(counter)

// :: Int -> Mealy () a -> [a]
const take = n => mealy => Mealy.scan(Arr)(mealy)(Array(n).fill(0))

test("Functor", t => {
  t.deepEqual([2,3,4], take(3)(Mealy.map(a => a + 2)(counter)))
})

test("Applicative", t => {
  t.deepEqual([0,2,4], take(3)(Mealy.ap(adder)(counter)))
  t.deepEqual([1,1,1], take(3)(Mealy.of(1)))
  t.deepEqual([0,2,4], take(3)(Mealy.lift2(a => b => a + b)(counter)(counter)))
})

test("Profunctor", t => {
  const inputs = ["what", "is", "this"]
  // :: Mealy Int (Int, Int)
  const totaller = Mealy.unfold(s => a => [[a, a + s], a + s])(0)
  
  // :: forall r. Mealy { length :: Int | r } (Int, Int)
  const lengther = Mealy.lcmap(x => x.length)(totaller)
  const lengtherdm = Mealy.dimap(x => x.length)(x => x)(totaller)

  const expect = [[4, 4], [2, 6], [4, 10]]
  t.deepEqual(expect, Mealy.scan(Arr)(lengther)(inputs))
  t.deepEqual(expect, Mealy.scan(Arr)(lengtherdm)(inputs))
})

test("unfold+scan", t => {
  t.deepEqual(Arr.range(1000), take(1000)(counter))
})