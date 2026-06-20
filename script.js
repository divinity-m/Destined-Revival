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
    x: cnv.width/2, y: cnv.height/2, speed: 4,
    
    leftCollision: false, rightCollision: false, topCollision: false, bottomCollision: false,
    
    r: 16, facingAngle: 0, movingAngle: 0,
}



// Classes //
let [groundTiles, blockTiles] = [[], []];
let typeColorMatchUp = {
    "void": "rgb(0, 0, 0)",
    "spawn": "rgba(220, 220, 220, 0.8)",
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
        this.interactable = false;
    }

    draw() {
        let type = this.type;
        
        if (this.type.includes("vertical") || this.type.includes("horizontal")) {
            type = type.split(" ");
            type.shift();
            type = type.join(" ");
        }
            
        ctx.fillStyle = typeColorMatchUp[type];
        ctx.fillRect(this.x-mapX, this.y-mapY, this.w, this.h);
    }

    collide() {
        const hitRadius = player.r * 1.35;
        const bitRadius = player.r * 0.95;
        const [blockX, blockY] = [this.x - mapX, this.y - mapY];

        const betweenBlockY = player.y + bitRadius > blockY && player.y - bitRadius < blockY + this.h;
        const betweenBlockX = player.x + bitRadius > blockX && player.x - bitRadius < blockX + this.w;

        // when the player holds "d" and runs right into the left of the block
        const leftSideCollision = player.x + hitRadius > blockX && player.x + hitRadius < blockX + hitRadius && betweenBlockY;
        if (leftSideCollision) player.leftCollision = true;

        // when the player holds "a" and runs left into the right of the block
        const rightSideCollision = player.x - hitRadius > blockX+this.w - hitRadius && player.x - hitRadius < blockX+this.w && betweenBlockY;
        if (rightSideCollision) player.rightCollision = true;

        // when the player holds "s" and runs down into the top of the block
        const collisionOnTop = player.y + hitRadius > blockY && player.y + hitRadius < blockY + hitRadius && betweenBlockX;
        if (collisionOnTop) player.topCollision = true;

        // when the player holds "w" and runs up into the bottom of the block
        const collisionOnTheBottom = player.y - hitRadius > blockY+this.h - hitRadius && player.y - hitRadius < blockY+this.h && betweenBlockX;
        if (collisionOnTheBottom) player.bottomCollision = true;
    }

    drawDoorOptions() {
        // BlockTile.drawDoorOptions(): If the tile is a door and the player is near it, this function will draw a text box which tells the player to press "space" to pass through the door

        if (this.type.includes("door")) {
            // get the distance from the player to the door
            const doorXCenter = this.x-mapX + this.w/2;
            const doorYCenter = this.y-mapY + this.h/2;

            const distanceFromDoor = Math.hypot(player.x - doorXCenter, player.y - doorYCenter);

            // the distance requirement should be the size of the doors largest dimension
            const maxLength = this.h > this.w ? this.h : this.w;

            if (distanceFromDoor < maxLength*1.2) {
                // draw the doors text box
                ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
                ctx.fillRect(cnv.width/3, cnv.height*0.85, cnv.width/2 - cnv.width/6, cnv.height*0.1);

                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                ctx.font = "25px 'Carter One'";
                ctx.textAlign = "center";
                ctx.fillText("Press space to use the door.", cnv.width*0.5, cnv.height*0.91);

                this.interactable = true;
            }
            else this.interactable = false;
        }
    }

    interactionEvent() {
        // BlockTile.interactionEvent(): If the tile is interactable, the event enacted when "space" is pressed happens in this function
        
        if (this.type.includes("vertical") && this.type.includes("door")) {
            
            if (player.x < this.x-mapX) player.x = this.x-mapX + this.w + player.r*2;

            else if (player.x > this.x-mapX + this.w) player.x = this.x-mapX - player.r*2;

            player.y = this.y-mapY + this.h/2;
        }
            
        else if (this.type.includes("horizontal") && this.type.includes("door")) {
            if (player.y < this.y-mapY) {
                console.log("from the top of the door");
            }

            else if (player.y > this.y-mapY + this.h) {
                console.log("from the bottom of the door");
            }
        }
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
