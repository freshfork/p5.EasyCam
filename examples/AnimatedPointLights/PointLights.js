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
// This example shows how to render a scene using a custom shader for lighting.
//
// Per Pixel Phong lightning:
//
// The lighting calculations for the diffuse and specular contributions are
// all done in the fragment shader, per pixel.
//
// Light-positions/directions are transformed to camera-space before they are 
// passed to the shader.
//



var easycam;
var phongshader;


// material defs
var matWhite  = { diff:[1   ,1   ,1   ], spec:[1,1,1], spec_exp:200.0 };
var matDark   = { diff:[0.2 ,0.3 ,0.4 ], spec:[1,1,1], spec_exp:400.0 };
var matRed    = { diff:[1   ,0.05,0.01], spec:[1,0,0], spec_exp:400.0 };
var matBlue   = { diff:[0.01,0.05,1   ], spec:[0,0,1], spec_exp:400.0 };
var matGreen  = { diff:[0.05,1   ,0.01], spec:[0,1,0], spec_exp:400.0 };
var matYellow = { diff:[1   ,1   ,0.01], spec:[1,1,0], spec_exp:400.0 };

var materials = [ matWhite, matRed, matBlue, matGreen, matYellow ];


// light defs

var ambientlight = { col : [0,0,0] };

var directlights = [
  { dir:[-1,-1,0], col:[0,0,0] },
];

var pointlights = [
  { pos:[0,0,0,1], col:[1.00, 1.00, 1.00], rad:450 },
  { pos:[0,0,0,1], col:[1.00, 0.00, 0.40], rad:200 },
  { pos:[0,0,0,1], col:[0.00, 0.40, 1.00], rad:200 },
  { pos:[0,0,0,1], col:[1.00, 0.40, 0.00], rad:300 },
  { pos:[0,0,0,1], col:[0.10, 0.40, 1.00], rad:300 },
];


// geometry
var torus_def = {
  r1 : 100,
  r2 : 15,
};





// function preload() {
  // phongshader = loadShader('vert.glsl', 'frag.glsl');
// }

function setup () {
  
  pixelDensity(1);
  
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
 
  var phong_vert = document.getElementById("phong.vert").textContent;
  var phong_frag = document.getElementById("phong.frag").textContent;
  
  phongshader = new p5.Shader(this._renderer, phong_vert, phong_frag);
  
  
  var state1 = {
    distance : 2000,
    center   : [0,0,0],
    rotation : [1,1,0,0],
  };
    
  var state2 = {
    distance: 400,
    center  : [0, 0, 60],
    rotation: [0.81146751, 0.5188172, 0.127647, -0.2367598],
  };
  
  console.log(Dw.EasyCam.INFO);
  
  // init camera
  easycam = new Dw.EasyCam(this._renderer, state1);
  
  // set some new state, animated
  easycam.setState(state2, 1500);
  
  easycam.state_reset = state2;
  easycam.setDefaultInterpolationTime(1000);
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}


// function keyReleased(){
  // console.log(easycam.state);
// }



function draw () {

  
  setShader(phongshader);
 
  setAmbientlight(phongshader, ambientlight);
  addDirectlight(phongshader, directlights, 0);
 
  // projection
  perspective(60 * PI/180, width/height, 1, 20000);
  
  // clear BG
  background(0);
  noStroke();
 

  var m4_torus = new p5.Matrix();

  // add pointlights
  // 2 are place somewhere free in space
  // 3 are moving along the torus surface
  push();  
  {
    
    var ang1 = map(mouseX, 0, width, -1, 1);
    var ang = sin(frameCount * 0.01) * 0.2;
    var ty = torus_def.r1 * 2 + (1-abs(ang)) * 100;
    
    push();  
      rotateX( (ang+1) * PI/2);
      translate(0, ty, 0);
      addPointLight(phongshader, pointlights, 0);
    pop();
    
    push();  
      rotateZ(frameCount * 0.02);
      translate(180, 0, 10);
      addPointLight(phongshader, pointlights, 4);
    pop();
    
    
    // torus transformations + surface-pointlights
    push();  
      rotateX(PI/2);
      translate(0,torus_def.r1,0);
      

      var rad1 = torus_def.r1;
      var rad2 = torus_def.r2 + 5; // offset from torus surface

      push();  
        rotateZ(0 * TWO_PI / 3 + frameCount * 0.01);
        translate(rad1, 0, 0);
        rotateY(sin(frameCount * 0.01) * TWO_PI);
        translate(rad2, 0, 0);
        addPointLight(phongshader, pointlights, 2);
      pop();
      
      push();  
        rotateZ(2 * TWO_PI / 3 + frameCount * 0.02);
        translate(rad1, 0, 0);
        rotateY(frameCount * 0.04);
        translate(rad2, 0, 0);
        addPointLight(phongshader, pointlights, 3);

      pop();
      
      push();  
        rotateZ(+PI/2 + sin(frameCount * 0.01) * 2 * PI/3);
        translate(rad1, 0, 0);
        rotateY(frameCount * 0.1);
        translate(rad2, 0, 0);
        addPointLight(phongshader, pointlights, 1);
      pop();
      
      m4_torus.set(this._renderer.uMVMatrix);
      
    pop();
  }
  pop();
  
 
  //////////////////////////////////////////////////////////////////////////////
  //
  // scene, material-uniforms
  //
  //////////////////////////////////////////////////////////////////////////////
  
  // reset shader, after fill() was used previously
  setShader(phongshader);
  
  // ground
  push();  
  translate(0, 0, 0);
  setMaterial(phongshader, matWhite);
  box(1000, 1000, 10);
  pop();
  
  // torus
  push();  
  this._renderer.uMVMatrix.set(m4_torus);
  setMaterial(phongshader, matWhite);
  torus(torus_def.r1, torus_def.r2, 100, 25);
  pop();
  
  // random spheres
  randomSeed(2);
  setMaterial(phongshader, matDark);
  for(var i = 0; i < 20; i++){
    push();
    var tx = random(-1, 1) * 100;
    var ty = random(-1, 1) * 100;
    var tz = random( 0, 2) * 50;
    var rad = random(5, 15);
    
    translate(tx, ty, tz + rad + 5); 
    sphere(rad);
    pop();
  }


}







function setShader(shader){
  this.shader(shader);
}


function setMaterial(shader, material){
  shader.setUniform('material.diff'    , material.diff);
  shader.setUniform('material.spec'    , material.spec);
  shader.setUniform('material.spec_exp', material.spec_exp);
}


function setAmbientlight(shader, ambientlight){
  shader.setUniform('ambientlight.col', ambientlight.col);
}


var m4_modelview = new p5.Matrix();
var m3_directions = new p5.Matrix('mat3');

function addDirectlight(shader, directlights, idx){
  
  // inverse transpose of modelview matrix for transforming directions
  // its probably faster however to transform a startpoint and endpoint
  // using the modelviewmat and creating a direction from that.
  // TODO: profiling
  m4_modelview.set(easycam.renderer.uMVMatrix);
  m3_directions.inverseTranspose(m4_modelview);
  
  var light = directlights[idx];
  
  // normalize direction
  var [x,y,z] = light.dir;
  var mag = Math.sqrt(x*x + y*y + z*z); // should not be zero length
  var light_dir = [x/mag, y/mag, z/mag];
  
  // transform to camera-space
  light_dir = m3_directions.multVec(light_dir);
  
  // set shader uniforms
  shader.setUniform('directlights['+idx+'].dir', light_dir);
  shader.setUniform('directlights['+idx+'].col', light.col);
}


function addPointLight(shader, pointlights, idx){
  
  var light = pointlights[idx];
  
  light.pos_cam = easycam.renderer.uMVMatrix.multVec(light.pos);
  
  shader.setUniform('pointlights['+idx+'].pos', light.pos_cam);
  shader.setUniform('pointlights['+idx+'].col', light.col);
  shader.setUniform('pointlights['+idx+'].rad', light.rad);
  
  var col = light.col;
  
  // display it as a filled sphere
  fill(col[0]*255, col[1]*255, col[2]*255);
  sphere(2);
}







//
// multiplies: vdst = mat * vsrc
//
// vsrc can be euqal vdst
//
p5.Matrix.prototype.multVec = function(vsrc, vdst){
  
  vdst = (vdst instanceof Array) ? vdst : [];
  
  var x=0, y=0, z=0, w=1;
  
  if(vsrc instanceof p5.Vector){
    x = vsrc.x;
    y = vsrc.y;
    z = vsrc.z;
  } else if(vsrc instanceof Array){
    x = vsrc[0];
    y = vsrc[1];
    z = vsrc[2];
    w = vsrc[3]; w = (w === undefined) ? 1 : w;
  } 

  var mat = this.mat4 || this.mat3;
  if(mat.length === 16){
    vdst[0] = mat[0]*x + mat[4]*y + mat[ 8]*z + mat[12]*w;
    vdst[1] = mat[1]*x + mat[5]*y + mat[ 9]*z + mat[13]*w;
    vdst[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
    vdst[3] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15]*w; 
  } else {
    vdst[0] = mat[0]*x + mat[3]*y + mat[6]*z;
    vdst[1] = mat[1]*x + mat[4]*y + mat[7]*z;
    vdst[2] = mat[2]*x + mat[5]*y + mat[8]*z;
  }
 
  return vdst;
}
