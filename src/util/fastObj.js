import { Obj } from "@masaeedu/fp";

const zipWith = f => a => b => {
  let result = {};
  for (const k in a) {
    const bk = b[k];
    if (bk !== undefined) {
      result[k] = f(a[k])(b[k]);
    }
  }
  return result;
};

const zipWith3 = f => a => b => c => {
  let result = {};
  for (const k in a) {
    const bk = b[k];
    const ck = c[k];
    if (bk !== undefined && ck !== undefined) {
      result[k] = f(a[k])(b[k])(c[k]);
    }
  }
  return result;
};

const foldMap = ({ append, empty }) => f => a => {
  let result = empty;
  for (const k in a) {
    result = append(result)(f(a[k]));
  }
  return result;
};

const fold = m => foldMap(m)(a => a);

const map = f => a => {
  let result = {};
  for (const k in a) {
    result[k] = f(a[k]);
  }
  return result;
};

const over = prop => f => o => {
  let result = {};
  for (const k in o) {
    result[k] = k === prop ? f(o[k]) : o[k];
  }
  return result;
};

const append = o1 => o2 => {
  let result = {};
  for (const k in o1) {
    result[k] = o1[k];
  }
  for (const k in o2) {
    result[k] = o2[k];
  }
  return result;
};

const fromPairs = ps => {
  let result = {};
  for (let x = 0; x < ps.length; x++) {
    const [k, v] = ps[x];
    result[k] = v;
  }
  return result;
};

const empty = {};

export {
  zipWith,
  zipWith3,
  foldMap,
  fold,
  map,
  over,
  append,
  empty,
  fromPairs
};
