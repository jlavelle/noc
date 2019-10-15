import p5 from "p5";
// import { sketch } from './intro/walker'
// import { sketch } from './intro/distribution'
// import { sketch } from './intro/gaussian'
// import { sketch } from './intro/splatter'
//import { sketch } from './intro/perlin'
// import { sketch } from './intro/landscape'
//import { sketch } from './chapter1/ball'
// import { sketch } from './chapter1/mover'
import { sketch } from "./chapter2/balloon";

let s;

const main = () => {
  console.log("Running");
  if (!s) {
    s = new p5(sketch);
  }
};

main();

if (module.hot) {
  module.hot.dispose(() => {
    if (s) {
      s.remove();
      s = null;
    }
  });
  module.hot.accept(() => {
    console.log("Reloading");
    main();
  });
}
