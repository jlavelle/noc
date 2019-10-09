// toEnum :: Int -> AdtDef a -> a
const toEnum = i => d => d[Object.keys(d.def)[i]]

const randomInt = i => Math.floor(Math.random() * i)

export { toEnum, randomInt }