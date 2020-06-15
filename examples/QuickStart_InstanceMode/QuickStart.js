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
// p5.EasyCam, testing Instance Mode
//


new p5(function(sketch){

  var easycam;

  sketch.setup = function() {  
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.setAttributes('antialias', true);

    easycam = sketch.createEasyCam();
  } 


  sketch.windowResized = function() {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    easycam.setViewport([0,0,sketch.windowWidth, sketch.windowHeight]);
  }


  sketch.draw = function(){

    sketch.background(32);
    sketch.strokeWeight(1);

    sketch.fill(0, 96, 255);
    sketch.box(250);
   
  }

});