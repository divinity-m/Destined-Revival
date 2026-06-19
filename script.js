//* DESTINED REVIVAL SCRIPT.JS *//

// Game SetUp //
const cnv = document.getElementById("game-canvas");
const ctx = cnv.getContext("2d");
let gameState = "titleScreen";
let firstUserInteraction = false;



// Global Variables //
let now = Date.now();

let signInActivated = false;
let displayOpacity = 0;
let [passwordTop, errorParaTop] = [46, 69];
let [accountBtnsY, playBtnY] = [cnv.height*0.5, cnv.height*0.585];

let [wPressed, aPressed, sPressed, dPressed] = [false, false, false, false];

let [mapX, mapY] = [0, 0];

let mouse = {
    x: -20, y: -20,
    
    pressed: false, over: {},
    
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
    x: cnv.width/2, y: cnv.height/2, speed: 10, // normally 4
    
    r: 16, facingAngle: 0, movingAngle: 0,
}



// Classes //
let [groundTiles, blockTiles] = [[], []];
let typeColorMatchUp = {
    "void": "rgb(0, 0, 0)",
    "spawn": "rgb(255, 255, 255)",
    "dirt": "rgb(145, 100, 67)",
    "grass": "rgb(74, 185, 88)",
    "brick floor": "rgb(150, 119, 87)",
    "stone floor": "rgb(139, 139, 139)",
    
    "void wall": "rgb(10, 10, 10)",
    "wood wall": "rgb(97, 170, 78)",
    "brick wall": "rgb(81, 48, 39)",
    "stone wall": "rgb(73, 78, 79)",
    "brick door": "rgb(133, 102, 55)",
    "stone door": "rgb(130, 130, 135)",
}

class GroundTile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;

        this.type = type;
    }

    draw() {
        ctx.fillStyle = typeColorMatchUp[this.type];
        ctx.fillRect(this.x-mapX, this.y-mapY, this.w, this.h);
    }
}


class BlockTile {
    constructor(x, y, w, h, type) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.type = type;
    }

    draw() {
        ctx.fillStyle = typeColorMatchUp[this.type];
        ctx.fillRect(this.x-mapX, this.y-mapY, this.w, this.h);
    }

    collide() {
        
    }
}

setUpGroundTiles();
setUpBlockTiles();


        
// Event Listeners //
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("click", clickHandler);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);


const userIn = document.getElementById("username");
const displayIn = document.getElementById("display-name");
const passIn = document.getElementById("password");

[userIn, displayIn, passIn].forEach((input) => {
    input.addEventListener("input", accountInputsHandler);
});

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);



// Draw Canvas //
function draw() {
    // draw(): draws everything in the canvas
  
    // On Refresh (New Frame)
    now = Date.now();
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    
    // ground
    ctx.fillStyle = "rgb(69, 173, 89)";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    
    ctx.fillStyle = "rgb(74, 185, 88)";
    ctx.fillRect(-26*50 - mapX, -15*50 - mapY, 78*50, 1450 + 750);

    // tiling
    drawGroundTiles();
    drawBlockTiles();


    // titleScreen
    if (gameState === "titleScreen") {
        drawTitleScreen();
    }
    else if (gameState === "inGame") {
        drawPlayer();
        // drawEnemies();

        
        // collisions();
        recenterPlayer();
        playerMovement();
    }


    // cursor tracking
    /* drawCursor(); */

    // calls the `draw` function again
    requestAnimationFrame(draw);
}

draw();
