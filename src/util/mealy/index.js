import { implement, Functor, Apply, Fn, Arr } from "@masaeedu/fp";
import Profunctor from "../profunctor";
import Mealy from "./def";

const classes = [Functor, Apply, Profunctor];
const augmented = Fn.passthru(Mealy)(Arr.map(implement)(classes));

export default augmented;
