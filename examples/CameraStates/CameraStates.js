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
// 
// This examples shows the use of EeasyCam States and some DOM interaction.
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
// 1,2,3,4 ... save state
//
//
 
 
 
var easycam, save_id = 1;

let inconsolata;
function preload() {
  inconsolata = loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf');
}

function setup() { 
 
  pixelDensity(2);
  
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  textFont(inconsolata);
  textSize(18);
  console.log(Dw.EasyCam.INFO);
  
  easycam = new Dw.EasyCam(this._renderer, {distance : 300}); 
  
  // attach some actions for setting camera states 
  var div_hud = select("#statehud");
  for(var i = 1; i <= 4; i++){
    var idx = i;
    var div_container = createDiv('' ).class("container");
    var div_state     = createDiv('' ).class("camstate");
    var div_set       = createDiv(idx).class("setState").id("setstate"+idx);
    var div_get       = createDiv('' ).class("getState").id("getstate"+idx);
    div_state.child(div_set).child(div_get);
    div_container.child(div_state);
    div_hud.child(div_container);
    
    // callback: set state
    div_set.idx = i;
    div_set.mouseClicked(function(){
      save_id = this.idx;
    });
    
    // callback: get state
    div_get.elt.camstate === undefined; 
    div_get.mouseClicked(function(){
      easycam.setState(this.elt.camstate, 1000);
    })

  }
  

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
  noStroke();
  
  // lights
  ambientLight(100);
  pointLight(255, 255, 255, 100, 0, 100);

  // gizmo
  displayGizmo(50);

  // objects
  push();
  translate(50, 50, 0);
  ambientMaterial(128,255,0);
  box(50, 50, 25);
  pop();
  
  push();
  translate(-50, -50, 0);
  ambientMaterial(255,0,128);
  box(50, 50, 25);
  pop();
  
  push();
  translate(+50, -50, 0);
  ambientMaterial(0,128,255);
  box(50, 50, 25);
  pop();
  
  push();
  translate(-50, +50, 0);
  scale(1,1,2);
  ambientMaterial(255,196,0);
  sphere(20);
  pop();
  
  push();
  ambientMaterial(160);
  translate(0,0,20);
  rotateX(PI/4);
  rotateY(PI/6);
  torus(50, 10, 50, 25);
  pop();
  
  push();
  var r = (sin(frameCount * 0.01) * 0.5 + 0.5) * 255;
  var g = r - (sin(frameCount * 0.02) * 0.5 + 0.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);
  translate(0,0, 30 + sin(frameCount * 0.05) * 40);
  rotateZ(frameCount * 0.02);
  rotateX(PI/4);
  rotateY(frameCount * 0.05);
  torus(25, 7, 40, 15);
  pop();
  
  
  // save current easycam state
  saveCameraState();
  
  // HeadUpDisplay
  displayHUD();
}



function displayGizmo(size){
  var a = size;
  var b = size / 20;
  var o = a * 0.5;
  push(); translate(o,0,0); ambientMaterial(255,0,0); box(a, b, b); pop();
  push(); translate(0,o,0); ambientMaterial(0,255,0); box(b, a, b); pop();
  push(); translate(0,0,o); ambientMaterial(0,0,255); box(b, b, a); pop();
}



function getScreenshotThumbnail(w, h){
  var ratio_w = width  / w;
  var ratio_h = height / h;
  var ratio   = min(ratio_w, ratio_h);
  
  var cw = Math.floor(w  * ratio);
  var ch = Math.floor(h * ratio);
  var cx = (width  - cw) / 2;
  var cy = (height - ch) / 2;
  var img = get(cx, cy, cw, ch);
  // img.resize(w, h); // aliasing
  img.resizeSmooth(w, h);
  return img;
}


function saveCameraState(){
  if(save_id > 0){
    // select div
    var div = select('#getstate'+save_id);
    if(!div) return;
    
    // create screenshot/thumbnail/canvas
    var img = getScreenshotThumbnail(div.width, div.height);
    var canvas = img.drawingContext.canvas;
    canvas.classList.add('screenshot');
    canvas.id = "easycamstate"+save_id;

    // remove previous canvas
    var old = select("#"+canvas.id);
    if(old) old.remove();
    // set current canvas as thumb
    div.child(canvas);
    // set current state
    div.elt.camstate = easycam.getState();
  }
  save_id = 0;
}


function keyReleased(){
  if(key == '1') save_id = 1;
  if(key == '2') save_id = 2;
  if(key == '3') save_id = 3;
  if(key == '4') save_id = 4;
  if(key == 's') document.getElementById('easycamhud').style.display ='block'; // display HUD
  if(key == 'h') document.getElementById('easycamhud').style.display ='none'; // hide HUD
}



function initHUD(){
  var hleft  = select('#hud-left');
  var hright = select('#hud-right');

  createElement('li', "Framerate:"  ).parent(hleft);
  createElement('li', "Viewport:"   ).parent(hleft);
  createElement('li', "Distance:"   ).parent(hleft).attribute('gap', '');
  createElement('li', "Center:"     ).parent(hleft);
  createElement('li', "Rotation:"   ).parent(hleft);

  createElement('li', 'stuff'       ).parent(hright).class('');
  createElement('li', 'stuff'       ).parent(hright).class(''); 
  createElement('li', 'stuff'       ).parent(hright).class('orange').attribute('gap', '');
  createElement('li', 'stuff'       ).parent(hright).class('orange'); 
  createElement('li', 'stuff'       ).parent(hright).class('orange'); 
}



function displayHUD(){
  easycam.beginHUD();

  var state = easycam.getState();
  
  // update list
  var ul = select('#hud-right');
  ul.elt.children[0].innerHTML = nfs(frameRate()          , 1, 2);
  ul.elt.children[1].innerHTML = nfs(easycam.getViewport(), 1, 0);
  ul.elt.children[2].innerHTML = nfs(state.distance       , 1, 2);
  ul.elt.children[3].innerHTML = nfs(state.center         , 1, 2);
  ul.elt.children[4].innerHTML = nfs(state.rotation       , 1, 3);

  // Draw screen-aligned text to the canvas
  push();
  translate(15, 200, 0);
  fill(255, 255, 255);
  text("Frame count: "+frameCount,0,0);
  pop();

  easycam.endHUD();
}


































////////////////////////////////////////////////////////////////////////////////
//
// patches, bug fixes, workarounds, ...
//
////////////////////////////////////////////////////////////////////////////////



var log2ceil = function(val){
  return Math.ceil(Math.log(val)/Math.log(2));
};


var halfSize = function(p_src, p_dst, w_dst, h_dst){
  
  var CHANNELS = 4;
  var w_src = w_dst << 1;
  var x,y, r,g,b,a,  ID, IS, i;

  for(y = 0; y < h_dst; y++){
    for(x = 0; x < w_dst; x++){
      
      ID = (y * w_dst + x) * CHANNELS;
      IS = (y * w_src + x) * CHANNELS * 2;
      
      i = IS;
      r  = p_src[i++]; g  = p_src[i++]; b  = p_src[i++]; a  = p_src[i++];
      r += p_src[i++]; g += p_src[i++]; b += p_src[i++]; a += p_src[i++];
      i = IS + w_src * CHANNELS;
      r += p_src[i++]; g += p_src[i++]; b += p_src[i++]; a += p_src[i++];
      r += p_src[i++]; g += p_src[i++]; b += p_src[i++]; a += p_src[i++];
      
      p_dst[ID++] = r >> 2;
      p_dst[ID++] = g >> 2;
      p_dst[ID++] = b >> 2;
      p_dst[ID++] = a >> 2;
    }
  }
};



p5.Image.prototype.resizeSmooth = function(width, height){
  
  var img = this;
  
  // get best pow2
  var ratio_w = img.width  / width;
  var ratio_h = img.height / height;
  var ratio   = max(ratio_w, ratio_h);
  var pow2    = log2ceil(ratio);

  // upscale, singlepass
  img.resize(width << pow2, height << pow2);
  img.loadPixels();
  
  // downscale, multipass
  {
    var w = img.width;
    var h = img.height;
    var pixels = img.pixels;
    for(var i = 0; i < pow2; i++){
      halfSize(pixels, pixels, w >>= 1, h >>= 1);
    }
    img.pixels = pixels.slice(0, w * h * 4);
    img.width  = w;
    img.height = h;
  }
  
  img.updatePixels();

  // update image data
  var ctx = img.drawingContext;
      ctx.canvas.width  = img.width;
      ctx.canvas.height = img.height;
  
  var imgdata = ctx.createImageData(img.width, img.height);
      imgdata.data.set(img.pixels);
      
  ctx.putImageData(imgdata, 0, 0);
  
  img.setModified(true);
}



