const mdefs = (() => {
  const dimap = ({ lcmap, rmap }) => f => g => p => rmap(g)(lcmap(f)(p));
  const lcmap = ({ dimap }) => f => p => dimap(f)(x => x)(p);
  const rmap = ({ dimap }) => f => p => dimap(x => x)(f)(p);

  return {
    dimap: [{ deps: ["lcmap", "rmap"], fn: dimap }],
    lcmap: [{ deps: ["dimap"], fn: lcmap }],
    rmap: [{ deps: ["dimap"], fn: rmap }]
  };
})();

const methods = () => ({});

export default { mdefs, methods };
