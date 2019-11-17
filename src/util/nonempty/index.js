import NonEmpty from "./def";
import {
  implement,
  Functor,
  Apply,
  Foldable,
  Traversable,
  Chain,
  ClassDef,
  Arr
} from "@masaeedu/fp";

const classes = Arr.fold(ClassDef)([
  Functor,
  Apply,
  Chain,
  Foldable,
  Traversable
]);
const augmented = implement(classes)(NonEmpty);

export default augmented;
