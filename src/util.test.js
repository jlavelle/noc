import test from 'ava'
import { weightedChoice, unzip, stdDev, mean, roundToPrecision } from './util'

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