//* DESTINED REVIVAL SCRIPT.JS *//

// Game SetUp
const cnv = document.getElementById("game-canvas");
const ctx = cnv.getContext("2d");
let gameState = "inGame";
let firstUserInteraction = false;

// Global Variables
let now = Date.now();


// Draw Canvas
function draw() {
    // draw(): draws everything in the canvas
  
    // On Refresh (New Frame)
    now = Date.now();
    ctx.clearRect(0, 0, cnv.width, cnv.height);


    //
    requestAnimationFrame();
}

draw();
