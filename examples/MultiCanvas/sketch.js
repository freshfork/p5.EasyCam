document.oncontextmenu = () => false;

// A demonstration of multiple, independent canvases, 
// each with an instance of EasyCam, operating within
// a CSS grid on three media dimensions (2 break-points).
// Use the <space> key to synchronize camera state across
// all sketches.

let w = 300, h = 253, cams = [], focused = undefined;



// First, add a listener to handle the <space> keydown event
document.addEventListener( "keydown", function (event){
  if( event.key === " " ){
    var delay  = 200,
        active = undefined;

    // find active or focused camera which controls the others
    for( var i in cams ){
      var cam = cams[i];
      if( cam.mouse.isPressed ){
        active = cam;
        break;
      }
    }

    // no active camera, try focused
    active = active || focused;

    // apply state to all other cameras
    if( active ) {
      var state = active.getState();
      event.preventDefault();
      for( var i in cams ){
        var cam = cams[i];
        if( cam != active ){
          cam.setState( state, delay );
        }
      }
    }
  }
} );


// Common scene elements
function renderScene( p, b ){
  p.background( b );
  p.lights();
  p.pointLight( 255,255,255, 0,500,-1000 );
  p.box( 100 );
  p.box( 90,110,90 );
  p.box( 110,90,90 );
  p.box( 90,90,110 );
}


// Variety in color
let specs = [
  ["rgb(177,   0,   0)",  0],
  ["rgb(235, 107,   0)", 10],
  ["rgb(220, 220,   0)", 20],
  ["rgb(  0, 167,   0)",  0],
  ["rgb(  0, 127, 255)", 10],
  ["rgb(137,   0, 255)", 20]
];


//////////////////////////////////////////////
// Create 6 independent sketches

for( let i=0; i<6; i++ )
  new p5( ( p ) => {
     
    p.setup = () => {
      p.createCanvas( w, h, p.WEBGL );
      cams.push( p.createEasyCam() );
      
      // set some random states at the beginning
      let rx = p.random( -p.PI,p.PI ) / 8;
      let ry = p.random( -p.PI,p.PI ) / 4;
      let rz = p.random( -p.PI,p.PI );
      cams[i].setRotation( Dw.Rotation.create( {angles_xyz:[rx,ry,rz]} ), 1000 );
      cams[i].setDistance( p.random( 200, 300 ), 1000 );
      
      p.fill( specs[i][0] );
      p.noStroke();
    };

    p.draw = () => {
      if( cams[i].mouse.insideViewport( p.mouseX, p.mouseY ) ) focused = cams[i];
      renderScene( p, specs[i][1] );
    };
  });