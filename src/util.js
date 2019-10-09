// toEnum :: Int -> AdtDef a -> a
const toEnum = i => d => d[Object.keys(d.def)[i]]

export { toEnum }