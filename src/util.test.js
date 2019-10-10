import test from 'ava'
import { prob, unzip } from './util'

test("unzip", t => {
  const [xs, ys] = unzip([
    [1, 4],
    [2, 5],
    [3, 6]
  ])
  t.deepEqual([1,2,3,4,5,6], [...xs, ...ys])
})

test("prob", t => {
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
    t.is(String(p) + v, String(p) + prob(x)(p))
  })
})