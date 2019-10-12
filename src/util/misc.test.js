import test from 'ava'
import { 
  weightedChoice, 
  unzip, 
  stdDev, 
  mean, 
  roundToPrecision, 
  mapInterval,
  flattenNL,
  flattenNR,
  nestNL,
  nestNR,
  split,
  splitN
} from './misc'
import Mealy from './mealy/def'

test("unzip", t => {
  const [xs, ys] = unzip([
    [1, 4],
    [2, 5],
    [3, 6]
  ])
  t.deepEqual([1,2,3,4,5,6], [...xs, ...ys])
})

test("weightedChoice", t => {
  const x = [
    [1, 'a'],
    [1, 'b'],
    [2, 'c']
  ]
  const expect = [
    [0   , 'a'],
    [0.1 , 'a'],
    [0.25, 'b'],
    [0.4 , 'b'],
    [0.5 , 'c'],
    [0.75, 'c'],
    [1   , 'c']
  ]
  expect.forEach(([p, v]) => {
    t.is(String(p) + v, String(p) + weightedChoice(x)(p))
  })
})

// Example taken from the Introduction to the book
test("stdDev", t => {
  const scores = [
    85, 82, 88, 86, 85, 93, 98, 40, 73, 83
  ]
  t.is(81.3, mean(scores))
  t.is(15.13, roundToPrecision(stdDev(scores))(0.01))
})

test("mapInterval", t => {
  t.is(2.5, mapInterval([0, 1])([0, 10])(0.25))
  t.is(75, mapInterval([0, 50])([50, 100])(25))
  t.is(-5, mapInterval([0, 10])([-10, 0])(5))
  t.is(95, mapInterval([10,20])([90,100])(15))
})

const nestedR = [1,[2,[3,4]]]
const nestedL = [[[1,2],3],4]

test("flattenN", t => {
  t.deepEqual([1,2,3,4], flattenNR(nestedR))
  t.deepEqual([1,2,3,4], flattenNL(nestedL))
  t.deepEqual([1,2], flattenNR([1,2]))
  t.deepEqual([1,2], flattenNL([1,2]))
})

test("nestN", t => {
  t.deepEqual(nestedR, nestNR([1,2,3,4]))
  t.deepEqual(nestedL, nestNL([1,2,3,4]))
  t.deepEqual([1,2], nestNR([1,2]))
  t.deepEqual([1,2], nestNL([1,2]))
})

const plusOne = Mealy.map(x => x + 1)(Mealy.id)

test("split", t => {
  const x = split(Mealy)(plusOne)(plusOne)
  const [r, _] = x([1, 2])
  t.deepEqual([2, 3], r)
})

test("splitN", t => {
  const xs = splitN(Mealy)(Array(5).fill(plusOne))
  const [r, _] = xs([1,2,3,4,5])
  t.deepEqual([2,3,4,5,6], r)
})