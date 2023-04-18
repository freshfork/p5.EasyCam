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
// This example shows how to render a scene using a custom shader for lighting.
//
// Per Pixel Phong lighting:
//
// The lighting calculations for the diffuse and specular contributions are
// all done in the fragment shader, per pixel.
//
// Light-positions/directions are transformed to camera-space before they are 
// passed to the shader.
//

 
 

var easycam;
var phongshader;


// function preload() {
  // phongshader = loadShader('vert.glsl', 'frag.glsl');
// }


function setup () { 

  pixelDensity(1);
  
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  console.log(Dw.EasyCam.INFO);
 
  easycam = createEasyCam();
 
  var phong_vert = document.getElementById("phong.vert").textContent;
  var phong_frag = document.getElementById("phong.frag").textContent;
  
  phongshader = new p5.Shader(this._renderer, phong_vert, phong_frag);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0,0,windowWidth, windowHeight]);
}



var m4_camera = new p5.Matrix();
var m3_camera = new p5.Matrix('mat3');

function backupCameraMatrix(){
  // camera matrix: for transforming positions
  m4_camera.set(easycam.renderer.uMVMatrix);
  // inverse transpose: for transforming directions
  m3_camera.inverseTranspose(m4_camera);
}



function draw () {
  
  // save current state of the modelview matrix
  backupCameraMatrix();

  // some animated pointlight positions
  var radius = 400;
  var angle = -frameCount * 0.005;
  var pl_x = cos(angle) * radius;
  var pl_y = sin(angle) * radius;
  
  var pl_z  = (sin(frameCount * 0.05) * 0.5 + 0.5) * 150;
  var pl_z2 = (sin(frameCount * 0.1) * 0.5 + 0.5) * 50;
  
  var radius1 = 400 + sin(frameCount * 0.1) * 30;
  var pl_x1 = cos(angle) * radius1;
  var pl_y1 = sin(angle) * radius1;
  
  //////////////////////////////////////////////////////////////////////////////
  //
  // MATERIALS
  //
  //////////////////////////////////////////////////////////////////////////////
  
  var matWhite = {
    diff     : [1,1,1],
    spec     : [1,1,1],
    spec_exp : 200.0,
  };
  
  var matDark = {
    diff     : [0.1,0.15,0.2],
    spec     : [1,1,1],
    spec_exp : 200.0,
  };
  
  var matRed = {
    diff     : [1,0.05,0.01],
    spec     : [1,0,0],
    spec_exp : 200.0,
  };
  
  var matBlue = {
    diff     : [0.01,0.05,1],
    spec     : [0,0,1],
    spec_exp : 200.0,
  };
  
  var matGreen = {
    diff     : [0.05,1,0.01],
    spec     : [0,1,0],
    spec_exp : 200.0,
  };
  
  var matYellow = {
    diff     : [1,1,0.01],
    spec     : [1,1,0],
    spec_exp : 200.0,
  };
  
  var materials = [ matWhite, matRed, matBlue, matGreen, matYellow ];
  
  
  //////////////////////////////////////////////////////////////////////////////
  //
  // LIGHTS
  //
  //////////////////////////////////////////////////////////////////////////////
  
  var ambientlight = {
    col : [0.002, 0.006, 0.010],
  };
  
  var directlights = [
    {
      dir : [-1,-1,-2],
      col : [0.02, 0.02, 0.02],
    },
  ];
  
  var pointlights = [
    {
      pos : [pl_x, pl_y, pl_z2,1],
      col : [1, 0.25, 0],
      att : 800,
    },
    
    {
      pos : [pl_y1, pl_x1, 10, 1],
      col : [0, 0.25, 1],
      att : 800,
    },
    
    {
      pos : [pl_x, 0, pl_z, 1],
      col : [1, 0.75, 0.1],
      att : 800,
    },
  ];
  
  
  //////////////////////////////////////////////////////////////////////////////
  //
  // shader, light-uniforms, etc...
  //
  //////////////////////////////////////////////////////////////////////////////
  
  setShader(phongshader);
 
  setAmbientlight(phongshader, ambientlight);
  setDirectlight(phongshader, directlights);
  setPointlight(phongshader, pointlights);
  
  
  
  // projection
  perspective(60 * PI/180, width/height, 1, 5000);
  
  // clear BG
  background(16);
  noStroke();
 

 
  // display pointlights with just fill();
  push();
  var renderer = easycam.renderer;
  for(var i = 0; i < pointlights.length; i++){
    var pl = pointlights[i];
    push();  
    translate(pl.pos[0], pl.pos[1], pl.pos[2]);
    fill(pl.col[0]*255, pl.col[1]*255, pl.col[2]*255);
    sphere(3);
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
  translate(0, 0, -5);
  setMaterial(phongshader, matWhite);
  box(1000, 1000, 10);
  pop();
  

  push();
  translate(0, 0, 100);
  setMaterial(phongshader, matDark);
  sphere(80);
  pop();
  
  push();
  translate(0, 0, 100);
  rotateZ(sin(frameCount * 0.01) * PI);
  rotateX(sin(frameCount * 0.04) * PI*0.1);
  setMaterial(phongshader, matWhite);
  torus(200, 25, 50, 25);

  for(var i = 0; i < 5; i++){
    push();
    rotateZ(i * PI*2 / 5)
    translate(200, 0, 0);
    setMaterial(phongshader, materials[i]);
    sphere(40);
    pop();
  }
  pop();
  
  
  push();
  translate(0, 300, 130);
  rotateX(PI/2);
  setMaterial(phongshader, matWhite);
  torus(100, 30, 40, 20);
  pop();
  
  
  randomSeed(0);
  var NX = 3;
  var NY = 3;
  var radius = 50;
  push();
  var dimx = radius * 2 * (NX-1);
  var dimy = radius * 2 * (NY-1);
  translate(-dimx/2, -dimy * 1.5, radius);
  rotateX(PI/2);
  for(var y = 0; y < NY; y++){
    for(var x = 0; x < NX; x++){
      
      var tx = x * radius * 2;
      var ty = y * radius * 2;
      push();
      
      var idx = 0;//(y * NY + x) % materials.length;
      setMaterial(phongshader, materials[idx]);
      
      translate(tx, ty, 0);
      sphere(radius * 0.8);
      pop();
    }
  }
  pop();
  
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


function setDirectlight(shader, directlights){
  
  for(var i = 0; i < directlights.length; i++){
    
    var light = directlights[i];
    
    // normalize
    var x = light.dir[0];
    var y = light.dir[1];
    var z = light.dir[2];
    var mag = Math.sqrt(x*x + y*y + z*z); // should not be zero length
    var light_dir = [x/mag, y/mag, z/mag];
    
    // transform to camera-space
    light_dir = m3_camera.multVec(light_dir);
    
    // set shader uniforms
    shader.setUniform('directlights['+i+'].dir', light_dir);
    shader.setUniform('directlights['+i+'].col', light.col);
  }
}


function setPointlight(shader, pointlights){
  
  for(var i = 0; i < pointlights.length; i++){
    
    var light = pointlights[i];
    
    // transform to camera-space
    var light_pos = m4_camera.multVec(light.pos);
    
    // set shader uniforms
    shader.setUniform('pointlights['+i+'].pos', light_pos);
    shader.setUniform('pointlights['+i+'].col', light.col);
    shader.setUniform('pointlights['+i+'].att', light.att);
  }
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








