// check the framer branch for a more complex version that trims things

let path;
let curve1;

let curve2;

// store paper size
let w;
let h;

// Make the paper scope global, by injecting it into window:
paper.install(window);

window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  w = paper.view.bounds.width;
  h = paper.view.bounds.height;

  // Create an arc shaped path:
  curve1 = new Path({
    strokeColor: "black",
  });

  curve1.add(new Point(w / 4, h / 4));
  curve1.arcTo(new Point((w * 3) / 4, (h * 3) / 4));

  curve2 = new Path({
    strokeColor: "black",
  });

  curve2.add(new Point((w * 3) / 5, (h * 2) / 5));
  curve2.arcTo(new Point(w / 4, (h * 3) / 4));

  var rectangle = new Path.Rectangle({
    point: view.center,
    size: new Size(10, 100),
    fillColor: "orange",
    // strokeColor: "orange",
    applyMatrix: false,
    visible: false,
  });

  let circle = new Path.Circle({
    center: view.center, // get the offset on the path
    radius: 10,
    fillColor: "cyan",
    visible: false,
  });

  let thing = circle.clone();
  thing.position = [100, 200];

  pointsOnPath(curve1, circle, 10);
  pointsOnPath(curve2, rectangle, 10);
  // now draw
  paper.view.draw();

  // when view is resized...
  paper.view.onResize = function () {
    // store new view width/height
    w = paper.view.bounds.width;
    h = paper.view.bounds.height;
  };
};

function pointsOnPath(path, brush, num) {
  // enable start point to be spaced into path
  // we could make this zero and ensure we have one at the end somehow
  let start = path.length / (num * 2);

  for (let i = 0; i < num; i++) {
    let b = brush.clone();

    var offset = (path.length * i) / num + start;
    // Get point to position the rectangle.
    var point = path.getPointAt(offset);
    // Get tangent vector at this point.
    var tangent = path.getTangentAt(offset);

    b.position = point;
    b.rotation = tangent.angle;
    b.visible = true;
  }
}

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};
