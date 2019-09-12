/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018-2019 by p5.EasyCam authors
 *
 *   Source: https://github.com/freshfork/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory notes:
 * 
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
 * and combines new useful features with the great look and feel of its parent.
 * 
 * 
 */
 
//
// p5.EasyCam - ModelView Matrix
// projection - ortho
//


var easycam;

function setup() { 

  pixelDensity(1);

  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  // define initial state
  var state = {
    distance : 200,
    // rotation : Dw.Rotation.create({angles_xyz:[0, 0, 0]}),
  };
  
  console.log(Dw.EasyCam.INFO);
  
  easycam = new Dw.EasyCam(this._renderer, state);
  
  // slower transitions look nicer in the ortho mode
  easycam.setDefaultInterpolationTime(2000); //slower transition
  // start with an animated rotation
  easycam.setRotation(Dw.Rotation.create({angles_xyz:[PI/2, PI/2, PI/2]}), 2500);
  easycam.setDistance(400, 2500);

} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}


function draw(){
  
  // projection
  var cam_dist = easycam.getDistance();
  var oscale = cam_dist * 0.001;
  var ox = width  / 2 * oscale;
  var oy = height / 2 * oscale;
  ortho(-ox, +ox, -oy, +oy, -10000, 10000);
  easycam.setPanScale(0.004 / sqrt(cam_dist));
  
  // BG
	background(255);
  noStroke();
  
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 0);
  
  // objects
  noStroke();
  randomSeed(2);
  for(var i = 0; i < 50; i++){

    var m = 100;
    var tx = random(-m, m);
    var ty = random(-m, m);
    var tz = random(-m, m);

    var r = ((tx / m) * 0.5 + 0.5) * 255;
    var g = ((ty / m) * 0.5 + 0.5) * r/2;
    var b = ((tz / m) * 0.5 + 0.5) * g;
 
    push();
    translate(tx, ty, tz);
    ambientMaterial(r,g,b);
    box(random(10,40));
    pop();
  }
 
}































