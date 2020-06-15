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
// HeadUpDisplay - HUD
//
// This demo shows how to create a scope for XY-screen-aligned and orthographic rendering.
// 
// ... 3D ....
// easycam.beginHUD();
// ... 2D ....
// easycam.endHUD();
// ... 3D ....
//
//
  
  
var easycam;

function setup() {  

  pixelDensity(2);
  
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  console.log(Dw.EasyCam.INFO);
  
  easycam = new Dw.EasyCam(this._renderer, {distance : 300}); 

  initHUD();
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}


function draw(){
 
  // projection
  perspective(60 * PI/180, width/height, 1, 5000);
  
  // BG
  background(32);
  
  // gizmo
  strokeWeight(1);
  stroke(255, 32,  0); line(0,0,0,100,0,0);
  stroke( 32,255, 32); line(0,0,0,0,100,0);
  stroke(  0, 32,255); line(0,0,0,0,0,100);
  
  // objects
  strokeWeight(0.5);
  stroke(0);
  
  push();
  translate(50, 50, 0);
  fill(255);
  box(50, 50, 25);
  pop();
  
  push();
  translate(-50, -50, 0);
  fill(255,0,128);
  box(50, 50, 25);
  pop();
  
  push();
  translate(+50, -50, 0);
  fill(0,128,255);
  box(50, 50, 25);
  pop();
  
  push();
  translate(-50, +50, 0);
  rotateX(PI/2);
  fill(128);
  sphere(30);
  pop();
  
  // HeadUpDisplay
  displayHUD();
}

// utility function to get some GL/GLSL/WEBGL information
function getGLInfo(){
  
  var gl = this._renderer.GL;
  
  var info = {};
  info.gl = gl;
  
  var debugInfo  = gl.getExtension("WEBGL_debug_renderer_info");
  if (debugInfo) {
    info.gpu_renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    info.gpu_vendor   = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  }
  info.wgl_renderer = gl.getParameter(gl.RENDERER);
  info.wgl_version  = gl.getParameter(gl.VERSION);
  info.wgl_glsl     = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
  info.wgl_vendor   = gl.getParameter(gl.VENDOR);

  return info;
}




function initHUD(){
  // init hud
  var hleft = select('#hud-left');
  var hright = select('#hud-right');

  createElement('li', "gpu_renderer").parent(hleft);
  createElement('li', "wgl_version" ).parent(hleft);
  createElement('li', "wgl_glsl"    ).parent(hleft);
  createElement('li', "Framerate:"  ).parent(hleft).attribute('gap', '');
  createElement('li', "Viewport:"   ).parent(hleft);
  createElement('li', "Distance:"   ).parent(hleft).attribute('gap', '');
  createElement('li', "Center:"     ).parent(hleft);
  createElement('li', "Rotation:"   ).parent(hleft);
  
  var info = getGLInfo();
  createElement('li', info.gpu_renderer || '.').parent(hright).class('green'); 
  createElement('li', info.wgl_version  || '.').parent(hright).class('green'); 
  createElement('li', info.wgl_glsl     || '.').parent(hright).class('green'); 
  createElement('li', '.'                     ).parent(hright).class('').attribute('gap', '');
  createElement('li', '.'                     ).parent(hright).class(''); 
  createElement('li', '.'                     ).parent(hright).class('orange').attribute('gap', '');
  createElement('li', '.'                     ).parent(hright).class('orange'); 
  createElement('li', '.'                     ).parent(hright).class('orange'); 
}



function displayHUD(){
  easycam.beginHUD();
  
  var state = easycam.getState();
  
  // update list
  var ul = select('#hud-right');
  ul.elt.children[3].innerHTML = nfs(frameRate()          , 1, 2);
  ul.elt.children[4].innerHTML = nfs(easycam.getViewport(), 1, 0);
  ul.elt.children[5].innerHTML = nfs(state.distance       , 1, 2);
  ul.elt.children[6].innerHTML = nfs(state.center         , 1, 2);
  ul.elt.children[7].innerHTML = nfs(state.rotation       , 1, 3);

  // draw screen-aligned rectangles
  var ny = 10; 
  var off = 20;
  var rs = (height-off) / ny - off;
  for(var y = 0; y < ny; y++){
    var r = 255 * y / ny;
    var g = 255 - r;
    var b = r+g;
    var px = width - off - rs;
    var py = off + y * (rs+off);
    noStroke();
    fill(r,g,b);
    rect(px, py, rs, rs);
  }

  easycam.endHUD();
}








