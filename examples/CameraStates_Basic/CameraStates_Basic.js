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
// This examples shows the use of EeasyCam States 
// 
// the internal state is defined by 
//   - distance (to center)
//   - center   (where the camera looks at)
//   - rotation (around the center)
//
// A state can be saved and applied at any time to any
// existing camera instance.
// 
// Additionally, a State can be create manually and either be applied
// to an existing camera, or be used to create a new camera.
//
//
// Controls:
//
// 1 ... save state
// 2 ... apply state
//
//
 
 
var easycam;

function setup() { 
 
  pixelDensity(1);
  
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  console.log(Dw.EasyCam.INFO);
  
  easycam = new Dw.EasyCam(this._renderer, {distance : 400}); 
} 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}

function draw(){
  
  // projection
  perspective(60 * PI/180, width/height, 1, 5000);
  
  // BG
  background(255);
  
  // gizmo
  strokeWeight(1);
  stroke(255, 32,  0); line(0,0,0,20,0,0);
  stroke( 32,255, 32); line(0,0,0,0,20,0);
  stroke(  0, 32,255); line(0,0,0,0,0,20);
  
  // objects
  strokeWeight(0.5);
  stroke(0);
  randomSeed(2);
  for(var i = 0; i < 70; i++){
    push();
    var m = 100;
    var tx = random(-m, m);
    var ty = random(-m, m);
    var tz = random(-m, m);

    var r = ((tx / m) * 0.5 + 0.5) * 255;
    var g = ((ty / m) * 0.5 + 0.5) * r;
    var b = ((tz / m) * 0.5 + 0.5) * 255;
    
    translate(tx, ty, tz);
    fill(r,g,255-r);
    box(random(10,40));
    pop();
  }
 
}

var state;

function keyReleased(){
  if(key == '1') state = easycam.getState();
  if(key == '2') easycam.setState(state, 2000);
}
































