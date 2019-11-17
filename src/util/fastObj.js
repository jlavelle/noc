import { Obj } from "@masaeedu/fp";

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

const patched = { ...Obj, zipWith3 };

export default patched;
