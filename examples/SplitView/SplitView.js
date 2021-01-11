/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018-2020 by p5.EasyCam authors
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
// SplitView setup
//
// Two cameras, each one owns its own rendertarget.
//
//
 
var easycam1, easycam2;


function setup() {

  pixelDensity(2);

  var canvas = createCanvas(windowWidth, windowHeight);

  var w = Math.ceil(windowWidth / 2);
  var h = windowHeight;
  
  var graphics1 = createGraphics(w, h, WEBGL)
  var graphics2 = createGraphics(w, h, WEBGL);
  
  console.log(Dw.EasyCam.INFO);

  easycam1 = new Dw.EasyCam(graphics1._renderer, {distance : 600});
  easycam2 = new Dw.EasyCam(graphics2._renderer, {distance : 600});
  
  easycam1.setDistanceMin(10);
  easycam1.setDistanceMax(3000);
  
  easycam2.setDistanceMin(10);
  easycam2.setDistanceMax(3000);
  
  easycam1.attachMouseListeners(this._renderer);
  easycam2.attachMouseListeners(this._renderer);
  
  
  // add some custom attributes
  easycam1.IDX = 0;
  easycam2.IDX = 1;
  
  // set viewports
  easycam1.setViewport([0,0,w,h]);
  easycam2.setViewport([w,0,w,h]);
} 



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  var w = Math.ceil(windowWidth / 2);
  var h = windowHeight;
  
  // resize p5.RendererGL
  easycam1.renderer.resize(w,h);
  easycam2.renderer.resize(w,h);
  
  // set new graphics dim
  easycam1.graphics.width  = w;
  easycam1.graphics.height = h;
  
  easycam2.graphics.width  = w;
  easycam2.graphics.height = h;

  // set new viewport
  easycam1.setViewport([0,0,w,h]);
  easycam2.setViewport([w,0,w,h]);
}



function draw(){
  clear();
  handleSuperController([easycam1, easycam2]);
  
  // render a scene for each camera
  displayScene(easycam1);
  displayScene(easycam2);

  // display results
  displayResult_P2D();
  // displayResult_WEBGL();
}

// use this, when the main canvas is P2D ... createCanvas(w,h,P2D)
function displayResult_P2D(){
  var vp1 = easycam1.getViewport();
  var vp2 = easycam2.getViewport();
  
  image(easycam1.graphics, vp1[0], vp1[1], vp1[2], vp1[3]);
  image(easycam2.graphics, vp2[0], vp2[1], vp2[2], vp2[3]);
}


// use this, when the main canvas is WEBGL ... createCanvas(w,h,WEBGL)
function displayResult_WEBGL(){
  var vp1 = easycam1.getViewport();
  var vp2 = easycam2.getViewport();
 
  resetMatrix();
  ortho(0, width, -height, 0, -Number.MAX_VALUE, +Number.MAX_VALUE);

  texture(easycam1.graphics);
  rect(vp1[0], vp1[1], vp1[2], vp1[3]);
  
  texture(easycam2.graphics);
  rect(vp2[0], vp2[1], vp2[2], vp2[3]);
}




function displayScene(cam){

  var pg = cam.graphics;
  
  var w = pg.width;
  var h = pg.height;
  
  var gray = 200;
  
  pg.push();
  pg.noStroke();
  
  // projection
  pg.perspective(60 * PI/180, w/h, 1, 5000);

  // BG
  if(cam.IDX == 0) {pg.clear(220);pg.background(220);}
  if(cam.IDX == 1) {pg.clear(32);pg.background(32);}
 
  pg.ambientLight(100);
  pg.pointLight(255, 250, 244, 0, 0, 0); // sunlight
  
  // objects
  randomSeed(2);
  for(var i = 0; i < 50; i++){
    pg.push();
    var m = 100;
    var tx = random(-m, m);
    var ty = random(-m, m);
    var tz = random(-m, m);

    var r = ((tx / m) * 0.5 + 0.5) * 255;
    var g = ((ty / m) * 0.5 + 0.5) * r/2;
    var b = ((tz / m) * 0.5 + 0.5) * g;
 
    pg.translate(tx, ty, tz);
    
    var gray = random(64,255);

    if(cam.IDX == 0) pg.ambientMaterial(r,g,b);
    if(cam.IDX == 1) pg.ambientMaterial(gray);
    
    pg.box(random(10,40));
    pg.pop();
  }
  
  pg.emissiveMaterial(255, 250, 244);
  pg.box(50, 50, 10);
  
  pg.push();
  pg.rotateZ(sin(frameCount*0.007) * PI*1.5);
  pg.translate(130, 0, 0);
  pg.ambientMaterial(0,128,255);
  pg.sphere(15);
  pg.pop();
    
  pg.push();
  pg.rotateX(sin(frameCount*0.01) * PI);
  pg.translate(0, 160, 0);
  pg.ambientMaterial(128,255,0);
  pg.sphere(15);
  pg.pop();
  
  pg.pop();
}






function handleSuperController(cameralist){

  if(keyIsPressed && key === ' '){
    
    var delay = 150; 
    var active  = undefined;
    var focused = undefined;
    
    // find active or focused camera which controls the others
    for(var i in cameralist){
      var cam = cameralist[i];
      if(cam.mouse.isPressed){
        active = cam;
        break;
      }
      if(cam.mouse.insideViewport(mouseX, mouseY)){
        focused = cam;
      }
    }
    
    // no active camera, try focused
    active = active || focused;
    
    // apply state to all other cameras
    if(active) {
      var state = active.getState();
      for(var i in cameralist){
        var cam = cameralist[i];
        if(cam != active){
          cam.setState(state, delay);
        }
      }
    }
  }
  
}
