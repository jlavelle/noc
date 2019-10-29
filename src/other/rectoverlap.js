import { innerWidthHeight, rectOverlap } from "../util/misc";
import * as Vec from "../util/vector";

const { Vec2 } = Vec;

export const sketch = p => {
  const [width, heigth] = innerWidthHeight(20);
  p.setup = () => {
    p.createCanvas(width, heigth);
    p.stroke(100);
  };

  const rect1 = {
    position: Vec2(width / 2 - 250)(heigth / 2 - 250),
    width: 500,
    height: 500,
    color: [255, 255, 255]
  };

  const drawRect = ({ position, width, height, color }) => {
    p.fill(color[0], color[1], color[2]);
    p.rect(position.x, position.y, width, height);
  };

  const step = position => r => {
    const nr = { ...r, position };
    const color = rectOverlap(rect1)(nr) ? [100, 0, 0] : [255, 255, 255];
    return { ...nr, color };
  };

  let mp = {
    position: Vec2(0)(0),
    width: 50,
    height: 50,
    color: [255, 255, 255]
  };

  p.draw = () => {
    p.background(0);
    drawRect(rect1);
    mp = step(Vec2(p.mouseX - 25)(p.mouseY - 25))(mp);
    drawRect(mp);
  };
};
