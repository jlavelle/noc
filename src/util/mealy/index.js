import { implement, Functor, Apply, Arr, ClassDef } from "@masaeedu/fp";
import Profunctor from "../profunctor";
import Mealy from "./def";

const classes = Arr.fold(ClassDef)([Functor, Apply, Profunctor]);
const augmented = implement(classes)(Mealy);

export default augmented;
