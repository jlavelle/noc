import { Arr } from "@masaeedu/fp";

const NonEmpty = (() => {
  const {
    map,
    ap,
    chain,
    lift2,
    sequence,
    traverse,
    append,
    foldl,
    foldr,
    foldMap
  } = Arr;

  // Comonad
  const extend = f => xs => {
    let result = [f(xs)];
    for (let i = 1; i < xs.length; i++) {
      result.push(f(xs.slice(i)));
    }
    return result;
  };

  const extract = xs => xs[0];

  return {
    map,
    ap,
    chain,
    lift2,
    foldl,
    foldr,
    foldMap,
    sequence,
    traverse,
    append,
    extend,
    extract
  };
})();

module.exports = NonEmpty;
