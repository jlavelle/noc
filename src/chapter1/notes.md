## Translating OOP concepts

The book defines a Mover class that starts out as:

```java
class Mover {
  PVector location;
  PVector velocity;

  Mover() {
    location = new PVector(random(width), random(height));
    velocity = new PVector(random(-2,2), random(-2,2))
  }

  void update() {
    location.add(velocity);
  }

  void display() {
    stroke(0);
    fill(175);
    ellipse(location.x, location.y, 16, 16);
  }

  // wrap around edges
  void checkEdges() {
    if (location.x > width) {
      location.x = 0;
    } else if (location.x < 0) {
      location.x = width;
    }

    if (location.y > height) {
      location.y = 0;
    } else if (location.y < 0) {
      location.y = height;
    }
  }
}
```

It is to be used in a sketch like this:

```java
Mover mover;

void setup() {
  size(640, 360);
  mover = new Mover();
}

void draw() {
  background(255);

  mover.update();
  mover.checkEdges();
  mover.display();
}
```

Eventually, `Mover` gets an acceleration vector and is modified a number of times to change how the acceleration is calculated (fixed, random, towards mouse).  The book doesn't show an OOP way of changing the behavior of `Mover` without modifying the source.