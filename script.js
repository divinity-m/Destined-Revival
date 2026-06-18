//* DESTINED REVIVAL SCRIPT.JS *//

// Game SetUp //
const cnv = document.getElementById("game-canvas");
const ctx = cnv.getContext("2d");
let gameState = "titleScreen";
let firstUserInteraction = false;


// Firebase Setup //
// const app = window.userInfo;


// Global Variables //
let now = Date.now();

let signInActivated = false;
let passwordTop = 46;
let displayOpacity = 0;
let accountBtnsY = cnv.height*0.5;
let playBtnY = cnv.height*0.585;


let mouse = {
    x: -20, y: -20,
    
    pressed: false, over: {},
    
    angleFromPlayer: 0,
    
    track: false,
}

let buttonAlpha = {
    play: 1, login: 1, signin: 1,
    
    modifyAlpha(property, mouseOver) {
        if (mouseOver) {
            this[property] = Math.max(0.75, this[property] - 0.025);
        }
        else {
            this[property] = Math.min(1, this[property] + 0.025);
        }
    },
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


const userIn = document.getElementById("username");
const displayIn = document.getElementById("display-name");
const passIn = document.getElementById("password");

[userIn, displayIn, passIn].forEach((input) => {
    input.addEventListener("input", accountInputHandler);
});


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





