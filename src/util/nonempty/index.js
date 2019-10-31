import NonEmpty from "./def";
import {
  implement,
  Functor,
  Apply,
  Foldable,
  Traversable,
  Chain,
  Fn,
  Arr
} from "@masaeedu/fp";

const classes = [Functor, Apply, Chain, Foldable, Traversable];
const augmented = Fn.passthru(NonEmpty)(Arr.map(implement)(classes));

export default augmented;
