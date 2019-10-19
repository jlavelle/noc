## Mealy Machines
- How can entities represented as Mealy machines interact with eachother?
- Accessing/modifying the state from `Mealy.unfold` is difficult from the outside, e.g. `unfoldBalloon` in `balloon.js` had to be modified to add friction, as there was no way to access the balloon's veclocity from outside
- More complex systems like in `balls.js` devolved into spaghetti, need to find a better way to manage.