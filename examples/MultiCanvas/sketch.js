document.oncontextmenu = () => false;

// A demonstration of multiple, independent canvases, 
// each with an instance of EasyCam, operating within
// a CSS grid on three media dimensions (2 break-points).

let w = 280, h = 220;


//////////////////////////////////////////////
// Sketch 1

new p5( ( p ) => {
   
  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.createEasyCam({distance : 220});
    p.fill(127,0,0);
  };

  p.draw = () => {
    p.background(0);
    p.box(100);
  };
});



//////////////////////////////////////////////
// Sketch 2

new p5 (( p ) => {

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.createEasyCam({distance : 250});
    p.fill(255,127,0);
  };

  p.draw = () => {
    p.background(10);
    p.box(100);
  };
});



//////////////////////////////////////////////
// Sketch 3

new p5( ( p ) => {

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.createEasyCam({distance : 230});
    p.fill(180,180,0);
  };

  p.draw = () => {
    p.background(20);
    p.box(100);
  };
});



//////////////////////////////////////////////
// Sketch 4

new p5( ( p ) => {
   
  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.createEasyCam({distance : 220});
    p.fill(0,127,0);
  };

  p.draw = () => {
    p.background(0);
    p.box(100);
  };
});



//////////////////////////////////////////////
// Sketch 5

new p5 (( p ) => {

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.createEasyCam({distance : 250});
    p.fill(0,127,255);
  };

  p.draw = () => {
    p.background(10);
    p.box(100);
  };
});



//////////////////////////////////////////////
// Sketch 6

new p5( ( p ) => {

  p.setup = () => {
    p.createCanvas(w, h, p.WEBGL);
    p.createEasyCam({distance : 235});
    p.fill(127,0,255);
  };

  p.draw = () => {
    p.background(20);
    p.box(100);
  };
});