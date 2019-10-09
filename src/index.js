import p5 from 'p5'
// import { sketch } from './intro/walker'
import { sketch } from './intro/distribution'

let s;

const main = () => {
  console.log('Running')
  if (!s) { s = new p5(sketch) }
}

main()

if (module.hot) {
  module.hot.dispose(() => {
    if (s) {
      s.remove()
      s = null
    }
  })
  module.hot.accept(() => {
    console.log('Reloading')
    main()
  })
}