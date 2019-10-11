const mdefs = (() => {
  const dimap = ({ lcmap, rmap }) => f => g => p => rmap(g)(lcmap(f)(p))
  const lcmap = ({ dimap }) => f => p => dimap(f)(x => x)(p)
  const rmap = ({ dimap }) => f => p => dimap(x => x)(f)(p)

  return [
    { impl: { lcmap, rmap }, deps: ["dimap"] },
    { impl: { dimap }, deps: ["lcmap", "rmap"] }
  ]
})()

const methods = () => ({})

export default { mdefs, methods }