//* DESTINED REVIVAL SCRIPT.JS *//

// Game SetUp //
const cnv = document.getElementById("game-canvas");
const ctx = cnv.getContext("2d");
let gameState = "titleScreen";
let firstUserInteraction = false;


// Firebase Setup //
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";

// Check if running in a CI environment with the injected variable
const configSource = process.env.FIREBASE_CONFIG;
                
// The web app's Firebase configuration
const firebaseConfig = configSource
            
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };  
const analytics = getAnalytics(app);


// Global Variables //
let now = Date.now();

let mouse = {
    x: -20, y: -20,
    pressed: false, over: {},
    buttonAlpha: 1,
    angleFromPlayer: 0,
    track: false,
}

let player = {
    x: cnv.width/2, y: cnv.height/2,
    r: 15, facingAngle: 0,
    username: "Soul", password: "",
}


// Event Listeners //
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("click", clickHandler);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);


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
    if (gameState === "titleScreen") {
        drawTitleScreen();
    }
    else if (gameState === "inGame") {
        
    }


    // cursor tracking
    /* drawCursor(); */

    // calls the `draw` function again
    requestAnimationFrame(draw);
}

draw();
