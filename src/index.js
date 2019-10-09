const main = () => {
  console.log('test')
}

main()

if (module.hot) {
  module.hot.dispose(() => {})
  module.hot.accept(main)
}