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
//
// MultiView (advanced version)
//
// N x N Camera Views of the same scene, on only one graphics-buffer.
//
// In this demo only one render-target is used -> the primary p5.RendererGL.
// Each Camera still has its own mouse-handler. 
// Only the viewport-position/dimension is used to build the camera state.
//
// For rendering, some OpenGL instructions (viewport, scissors) are used to
// render the scene to its actual camera viewport position/size.
// 
// Window is resizeAble
// 
// pressed SPACE + Mouse-drag, to apply state of active camera to all others
//
//
 
 
var NX = 3;
var NY = 2;
var cameras;

function setup() {
  
  pixelDensity(1);
  
  createCanvas(windowWidth, windowHeight, WEBGL);

  setAttributes('antialias', true);
  
  var RENDERER = this._renderer;
  
  console.log(Dw.EasyCam.INFO);

  cameras = [];
  cameras.length = NX * NY;
 
  for(var i = 0; i < cameras.length; i++){
    // create EasyCam
    cameras[i] = new Dw.EasyCam(RENDERER);
    // set ID
    cameras[i].ID = i;
    // remove canvas, we handle this manually
    cameras[i].setCanvas(null);
    // no autoupdate, also handled manually
    cameras[i].setAutoUpdate(false); 
    // set some random states at the beginning
    var rx = random(-PI,PI)/8;
    var ry = random(-PI,PI)/4;
    var rz = random(-PI,PI)/1;
    cameras[i].setRotation(Dw.Rotation.create({angles_xyz:[rx,ry,rz]}), 2000);
    cameras[i].setDistance(random(400, 600), 2000);
  }
  
  // set camera viewports
  setCameraViewports();
}




function setCameraViewports(){
  var gap = 3;
  
  // tiling size
  var tilex = floor((width  - gap) / NX);
  var tiley = floor((height - gap) / NY);
 
  // viewport offset ... corrected gap due to floor()
  var offx = (width  - (tilex * NX - gap)) / 2;
  var offy = (height - (tiley * NY - gap)) / 2;
  
  // viewport dimension
  var cw = tilex - gap;
  var ch = tiley - gap;
  
  // create new viewport for each camera
  for(var y = 0; y < NY; y++){
    for(var x = 0; x < NX; x++){
      var id = y * NX + x;
      var cx = offx + x * tilex;
      var cy = offy + y * tiley;
      cameras[id].setViewport([cx, cy, cw, ch]); // this is the key of this whole demo
    }
  }

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraViewports();
}



function draw(){

  // update current camera states
  for (var i in cameras){
    cameras[i].update();
  }
  
  // check if god-mode is on
  handleSuperController(cameras)
  
  // clear background once, for the whole window
  setGLGraphicsViewport(0,0,width,height);
  background(0);
  
  randomSeed(0);
  
  // render scene once per camera/viewport
  for (var i in cameras){
    var cam =  cameras[i];
    push();
    displayScene(cam);
    pop();
  }

}


function setGLGraphicsViewport(x,y,w,h){
  var gl = this._renderer.GL;
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor (x,y,w,h);
  gl.viewport(x,y,w,h);
}



function displayScene(cam){
  
  var viewport = cam.getViewport();
  var w = viewport[2];
  var h = viewport[3];
  var x = viewport[0];
  var y = viewport[1];
  var y_inv =  height - y - h; // inverted y-axis
  
  // scissors-test and viewport transformation
  setGLGraphicsViewport(x,y_inv,w,h);
  
  // modelview - using camera state
  cam.apply(this);
  
  // projection - using camera viewport
  perspective(60 * PI/180, w/h, 1, 5000);
  
  // clear background (scissors makes sure we only clear the region we own)
  background(255);
  
  // render scene as usual
  
	strokeWeight(1);

  var boxes_x = 3;
  var boxes_y = 3;
  
  var dimx = 100;
  var dimy = dimx;
  var dimz = (dimx + dimy) * 0.2;
  
  var gridx = dimx * 1.2;
  var gridx = dimy * 1.2;
  var size_x = boxes_x * gridx;
  var size_y = boxes_y * gridx;
  
  if(cam.ID == 0){
    background(16);
    ambientLight(100);
    pointLight(255, 255, 255, 100, 0, 100);
    noStroke();
  }
  if(cam.ID == 1){
    background(16);
    ambientLight(100);
    pointLight(255, 200, 200, 100, 0, 100);
    noStroke();
  }
  if(cam.ID == 2){
    background(16);
  }
  

  // just some stuff to get a color, playing around here
  var rsin = (sin(cam.ID  + frameCount * 0.01) * 0.5 + 0.5);
  
  var palette = palette_list[1];
  var rgba, cr, cg, cb, idx, tx, ty, tz, ii, inorm;
  
  push();
  translate(-size_x/2, -size_y/2, 0);
  for(var iy = 0; iy < boxes_y; iy++){
    for(var ix = 0; ix < boxes_x; ix++){
      
      ii = (iy * boxes_y + ix);
      inorm = ii / (boxes_x * boxes_y - 1) * rsin;
          
      // position       
      tx = (ix + 0.5) * gridx;
      ty = (iy + 0.5) * gridx;
      tz = 0;
       
      // color
      rgba = getColor(inorm, palette, rgba);
      cr = rgba[0] * 255;
      cg = rgba[1] * 255;
      cb = rgba[2] * 255;
      
      var gs = (cr + cg + cb) / 3;
      
      switch(cam.ID){
        case 0:  ambientMaterial(cr, cg, cb); break;
        case 1:  ambientMaterial(gs, gs, gs); break;
        case 2:  fill(255)                  ; break;
        default: fill(cr, cg, cb)           ; break;
      }
      
      push();
      translate(tx, ty, tz);
      if(ix == 2 && iy == 2){
        torus(dimx/2 - dimz/2, dimz/2, 24, 16);

      } else {
        box(dimx, dimy, dimz);
      }
      pop();
    }
  }
  pop();
  
  
  // testing HUD
  // cam.beginHUD(this._renderer, w, h);
  // noStroke();
  // fill(0, 64);
  // rect(0,h-20, w, 20);
  // fill(255); // transparency issue
  // cam.endHUD(this._renderer);

}






// http://www.iquilezles.org/www/articles/palettes/palettes.htm
var palette_list = [
  [ [0.5, 0.5, 0.5, 1.0],   [0.5, 0.5, 0.5, 0.0],   [1.0, 1.0, 1.0, 1.0],   [0.90, 0.40, 0.20, 1.0] ],
  [ [0.5, 0.5, 0.5, 1.0],   [0.5, 0.5, 0.5, 0.0],   [1.0, 1.0, 1.0, 1.0],   [0.00, 0.10, 0.20, 1.0] ],
  [ [0.5, 0.5, 0.5, 1.0],   [0.5, 0.5, 0.5, 0.0],   [1.0, 1.0, 1.0, 1.0],   [0.30, 0.20, 0.20, 1.0] ],
  [ [0.5, 0.5, 0.5, 1.0],   [0.5, 0.5, 0.5, 0.0],   [1.0, 1.0, 0.5, 1.0],   [0.80, 0.90, 0.30, 1.0] ],
  [ [0.5, 0.5, 0.5, 1.0],   [0.5, 0.5, 0.5, 0.0],   [1.0, 0.7, 0.4, 1.0],   [0.00, 0.15, 0.20, 1.0] ],
  [ [0.5, 0.5, 0.5, 1.0],   [0.5, 0.5, 0.5, 0.0],   [2.0, 1.0, 0.0, 1.0],   [0.50, 0.20, 0.25, 1.0] ],
  [ [0.8, 0.5, 0.4, 1.0],   [0.2, 0.4, 0.2, 0.0],   [2.0, 1.0, 1.0, 1.0],   [0.00, 0.25, 0.25, 1.0] ],
];

function getColor(t, palette, dst){
  dst = ((dst === undefined) || (dst.constructor !== Array)) ? [0, 0, 0, 0] : dst;
  
  dst[0] = colFunc(t, palette[0][0], palette[1][0], palette[2][0], palette[3][0]);
  dst[1] = colFunc(t, palette[0][1], palette[1][1], palette[2][1], palette[3][1]);
  dst[2] = colFunc(t, palette[0][2], palette[1][2], palette[2][2], palette[3][2]);
  dst[3] = colFunc(t, palette[0][3], palette[1][3], palette[2][3], palette[3][3]);
  
  return dst;
}

function colFunc(t, a, b, c, d){
  return a + b * Math.cos(Math.PI * 2 * (c * t + d));
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









// (function () {
 
  // var loadJS = function(filename){
    // var script = document.createElement("script");
    // script.setAttribute("type","text/javascript");
    // script.setAttribute("src", filename);
    // document.getElementsByTagName("head")[0].appendChild(script);
  // }

  // loadJS("https://rawgit.com/diwi/p5.EasyCam/master/p5.easycam.js");
 
  // document.oncontextmenu = function() { return false; }
  // document.onmousedown   = function() { return false; }
 
// })();


