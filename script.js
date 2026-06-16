//* DESTINED REVIVAL SCRIPT.JS *//

// Game SetUp //
const cnv = document.getElementById("game-canvas");
const ctx = cnv.getContext("2d");
let gameState = "titleScreen";
let firstUserInteraction = false;

// Global Variables //
let now = Date.now();
let player = {
    x: cnv.width/2, y: cnv.height/2,
    r: 15, facingAngle: 0,
    username: "Life", password: "",
}


// Draw Canvas //
function draw() {
    // draw(): draws everything in the canvas
  
    // On Refresh (New Frame)
    now = Date.now();
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    
    // background
    ctx.fillStyle = "rgb(69, 173, 89)";
    ctx.fillRect(0, 0, cnv.width, cnv.height);


    // titleScreen
    drawTitleScreen();
    

    // calls the `draw` function again
    requestAnimationFrame();
}

draw();
