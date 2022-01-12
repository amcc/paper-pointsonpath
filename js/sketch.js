// check the framer branch for a more complex version that trims things

let path;
let curve1;
let curve2;
let circle;

let SVGBrushGroup;

let brushSize = 100;
let brushSin = 0;

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
  // curve1 = new Path({
  //   strokeColor: "black",
  // });

  // curve1.add(new Point(w / 4, h / 4));
  // curve1.arcTo(new Point((w * 3) / 4, (h * 3) / 4));

  // curve2 = new Path({
  //   strokeColor: "black",
  // });

  // curve2.add(new Point((w * 3) / 5, (h * 2) / 5));
  // curve2.arcTo(new Point(w / 4, (h * 3) / 4));

  var rectangle = new Path.Rectangle({
    point: view.center,
    size: new Size(10, 100),
    fillColor: "orange",
    // strokeColor: "orange",
    applyMatrix: false,
    visible: false,
  });

  circle = new Path.Circle({
    center: view.center, // get the offset on the path
    radius: 100,
    // fillColor: "cyan",
    strokeColor: "black",
    visible: false,
  });

  // let c1 = new Path.Circle({
  //   center: view.center, // get the offset on the path
  //   radius: 100,
  //   // fillColor: "cyan",
  //   strokeColor: "black",
  //   visible: false,
  //   // insert: false,
  // });

  // let c2 = new Path.Circle({
  //   center: [view.center.x + 50, view.center.y], // get the offset on the path
  //   radius: 100,
  //   // fillColor: "cyan",
  //   strokeColor: "black",
  //   visible: false,
  //   // insert: false,
  // });
  // let c3 = new Path.Circle({
  //   center: [view.center.x - 100, view.center.y], // get the offset on the path
  //   radius: 100,
  //   // fillColor: "cyan",
  //   strokeColor: "black",
  //   visible: false,
  //   // insert: false,
  // });

  // let c4 = new Path.Circle({
  //   center: [view.center.x - 500, view.center.y], // get the offset on the path
  //   radius: 100,
  //   // fillColor: "cyan",
  //   strokeColor: "black",
  //   // visible: false,
  //   // insert: false,
  // });

  // let unite = uniter([c1, c2, c3]);
  // unite.selected = true;

  // let thing = circle.clone();
  // thing.position = [100, 200];

  let svgGroup = new Group();
  svgGroup.importSVG("img/wip.svg", {
    onLoad: svgBrush,
  });
  // let svgPath = paper.view.importSVG("img/wip.svg");
  // svgPath.selected = true;
  // pointsOnPath(curve1, circle, 10, true);
  // pointsOnPath(curve2, rectangle, 10);
  // now draw
  paper.view.draw();

  // when view is resized...
  paper.view.onResize = function () {
    // store new view width/height
    w = paper.view.bounds.width;
    h = paper.view.bounds.height;
  };

  console.log(paper);
  paper.view.onFrame = function (evt) {
    if (svgGroup.children && SVGBrushGroup) {
      // vary the brush
      let currentBrush = Math.sin(brushSin) * brushSize;
      brushSin += 0.01;

      // let brushGroup = new CompoundPath();
      // brushGroup.parent = SVGBrushGroup;

      // console.log("item");
      let circler = new Path.Circle({
        center: view.center, // get the offset on the path
        radius: 20,
        // x: 50,
        // fillColor: "cyan",
        strokeColor: "black",
        visible: false,
        parent: SVGBrushGroup,
      });

      var rectangle = new Path.Rectangle({
        point: view.center,
        size: new Size(currentBrush, currentBrush * 2),
        fillColor: "black",
        strokeColor: "red",
        strokeWidth: 4,
        // applyMatrix: false,
        visible: false,
        rotation: 45 + brushSin * 10,
        parent: SVGBrushGroup,
      });

      onFrameBrush(
        svgGroup.children[0],
        rectangle,
        SVGBrushGroup,
        10,
        true,
        true
      );
    }
  };
};

function svgBrush(item, svg) {
  // console.log("item", item.children);

  SVGBrushGroup = new Group();
  SVGBrushGroup.loaded = true;
}

function onFrameBrush(item, brush, parent, num, unite, includeStray) {
  // make sure the svg is loaded
  if (parent && parent.loaded) {
    // find the item to brush

    // clear the brushes before making more
    parent.children = [];
    for (let i = 0; i < item.children.length; i++) {
      // console.log(item.children[i]);

      // console.log("ho");
      if (item.children[i].segments) {
        // console.log("hi");

        pointsOnPath(item.children[i], brush, num, parent, unite, includeStray);
        item.children[i].strokeWidth = 0;
        // console.log(SVGBrushGroup);
      }
    }
    // SVGBrushGroup.selected = true;
  }
}

function pointsOnPath(
  path,
  brush,
  num,
  parent,
  unite = false,
  includeStray = false
) {
  // enable start point to be spaced into path
  // we could make this zero and ensure we have one at the end somehow

  // make sure we have a whole number of brushes
  num = Math.floor(num);

  if (num > 1) {
    let start = path.length / (num * 2);
    let pathsArray = [];

    for (let i = 0; i < num; i++) {
      var offset = (path.length * i) / num + start;
      // Get point to position the rectangle.
      var point = path.getPointAt(offset);
      // Get tangent vector at this point.
      var tangent = path.getTangentAt(offset);

      let b = brush.clone();
      b.position = point;
      b.rotation = tangent.angle;
      b.visible = unite ? false : true;
      b.parent = parent;
      pathsArray.push(b);
    }
    if (unite) {
      let united = uniter(pathsArray, includeStray);
      if (parent) united.parent = parent;
    }
  }
}

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};

function uniter(array, includeStray = false) {
  let pathGroup = new Group();
  let path = array[0];
  for (let i = 0; i < array.length - 1; i++) {
    if (overlaps(path, array[i + 1])) {
      path = path.unite(array[i + 1]);
    } else if (includeStray) {
      // console.log("er");
      let newpath = array[i + 1];
      newpath.visible = true;
      // newpath.parent = pathGroup;
    }
  }
  path.visible = true;
  // path.parent = pathGroup;
  return path;
}

let overlaps = function (path, other) {
  return !(path.getIntersections(other).length === 0);
};
