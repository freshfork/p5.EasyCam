/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018-2023 by p5.EasyCam authors
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
  
  
var easycam, HUDgrid;

function setup() {  
  pixelDensity(2);
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  console.log(Dw.EasyCam.INFO);
  easycam = new Dw.EasyCam(this._renderer, {distance : 300}); 
  initHUD();
  
  // Handle the mouseup event outside of the canvas
  document.documentElement.addEventListener('mouseup', function(e){
    easycam.cam.mouse.ismousedown=false
  });
} 


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}


function draw() {
 
  // projection
  perspective(60 * PI/180, width/height, 1, 5000);
  
  // BG
  background(32);
  
  // gizmo
  strokeWeight(1);
  stroke(255, 32,  0); line(0,0,0, 100,0,0);
  stroke( 32,255, 32); line(0,0,0, 0,100,0);
  stroke(  0, 32,255); line(0,0,0, 0,0,100);
  
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
function getGLInfo() {
  
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

function setGridCell(c,r, d) {
  var gridItems = Array.from(HUDgrid.elt.querySelectorAll('*'));
  gridItems[(c-1)*8 + (r-1)].innerHTML = d;
}

function initHUD() {
  // init hud
  HUDgrid = select('.gwrap');

  createElement('div', "gpu_renderer:&nbsp;").parent(HUDgrid);
  createElement('div', "wgl_version:" ).parent(HUDgrid);
  createElement('div', "wgl_glsl:"    ).parent(HUDgrid);
  createElement('div', "Framerate:"  ).parent(HUDgrid).attribute('gap', '');
  createElement('div', "Viewport:"   ).parent(HUDgrid);
  createElement('div', "Distance:"   ).parent(HUDgrid).attribute('gap', '');
  createElement('div', "Center:"     ).parent(HUDgrid);
  createElement('div', "Rotation:"   ).parent(HUDgrid);
  
  var info = getGLInfo();
  createElement('div', info.gpu_renderer || '.').parent(HUDgrid).class('green'); 
  createElement('div', info.wgl_version  || '.').parent(HUDgrid).class('green'); 
  createElement('div', info.wgl_glsl     || '.').parent(HUDgrid).class('green'); 
  createElement('div', '.'                     ).parent(HUDgrid).class('').attribute('gap', '');
  createElement('div', '.'                     ).parent(HUDgrid).class(''); 
  createElement('div', '.'                     ).parent(HUDgrid).class('orange').attribute('gap', '');
  createElement('div', '.'                     ).parent(HUDgrid).class('orange'); 
  createElement('div', '.'                     ).parent(HUDgrid).class('orange'); 
}

function displayHUD() {
  easycam.beginHUD();
  
  var state = easycam.getState();
  
  // update data list
  if(frameCount%60==0){
    let state = easycam.getState();
    setGridCell(2,4, nfs(frameRate(), 1, 1));
    setGridCell(2,5, nfs(easycam.getViewport(), 1));
    setGridCell(2,6, nfs(state.distance, 1, 2));
    setGridCell(2,7, nfs(state.center, 1, 2));
    setGridCell(2,8, nfs(state.rotation, 1, 3));
  }

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