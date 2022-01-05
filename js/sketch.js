// check the framer branch for a more complex version that trims things

let path;
let curve;

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

  path = new Path.Line([50, 50], [150, 150]);
  path.strokeColor = "black";
  path.strokeWidth = 3;

  // Create an arc shaped path:
  curve = new Path({
    strokeColor: "black",
  });

  curve.add(new Point(w / 4, h / 4));
  curve.arcTo(new Point((w * 3) / 4, (h * 3) / 4));

  // Create small circles on the paths:
  var pathCircle = new Path.Circle({
    center: path.getPointAt(path.length / 3), // get the offset on the path
    radius: 20,
    fillColor: "red",
  });

  pointsOnPath(curve, 10);

  // now draw
  paper.view.draw();

  // when view is resized...
  paper.view.onResize = function () {
    // store new view width/height
    w = paper.view.bounds.width;
    h = paper.view.bounds.height;
  };
};

function pointsOnPath(path, num) {
  let start = path.length / (num * 2);
  for (let i = 0; i < num; i++) {
    let curveCircle = new Path.Circle({
      center: path.getPointAt((path.length * i) / num + start), // get the offset on the path
      radius: 10,
      fillColor: "cyan",
    });
  }
}

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};
