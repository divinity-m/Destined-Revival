//* DESTINED REVIVAL SCRIPT.JS *//

// Game SetUp //
const cnv = document.getElementById("game-canvas");
const ctx = cnv.getContext("2d");
let gameState = "titleScreen";



// Global Variables //
let now = Date.now();

let interactionWithPage = false;

let signInActivated = false;
let displayOpacity = 0;
let [passwordTop, errorParaTop] = [46, 69];
let [accountBtnsY, playBtnY] = [cnv.height*0.5, cnv.height*0.585];

let [wPressed, aPressed, sPressed, dPressed] = [false, false, false, false];

let [mapX, mapY] = [0, 0];

const audioElements = document.getElementsByTagName("audio");
let currentSong;

let songAnimation = {
    active: false,

    x: -300, y: cnv.height - 25,

    alpha: 0, fadeIn: true,

    content: "♬ Done With Pain - Thygan Buch",

    reset() {
        this.active = false;
        this.x = -300;
        this.y = cnv.height - 25;
        this.alpha = 0;
        this.fadeIn = true;
    }
}

let mouse = {
    x: -20, y: -20,
    
    pressed: false, over: {},
    
    track: false,
}

let buttonAlpha = {
    play: 1, login: 1, signin: 1, inv: 1,
    
    modifyAlpha(property, mouseOver) {
        if (mouseOver) {
            this[property] = Math.max(0.75, this[property] - 0.025);
        }
        else {
            this[property] = Math.min(1, this[property] + 0.025);
        }
        return this[property];
    },
}

let player = {
    x: 650, y: 350, speed: 14,
    
    leftCollision: false, rightCollision: false, topCollision: false, bottomCollision: false,
    
    r: 16, facingAngle: 0, movingAngle: 0,

    hotbar: [], inventory: [], invOpen: false, hotbarSlot: 1,

    strength: 1,
}
for (let i = 0; i < 9; i++) player.hotbar.push(0);
for (let i = 0; i < 25; i++) player.inventory.push(0);

let mobs = {
    freeroam: [], alter: [],
    lastSpawned: 0,
}

let m1 = {
    active: false,

    state: "retracting", hitting: false,

    lx: 0, rx: 0, ry: 0,

    reset() {
        this.active = false;
        this.state = "retracting";
    }
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
        let type = this.type;

        if (this.type.includes("spawn")) type = "spawn";
        
        ctx.fillStyle = typeColorMatchUp[type];
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
        const hitRadius = player.r*1.1 + player.speed*0.95;
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
                ctx.fillRect(cnv.width/3, cnv.height*0.75, cnv.width/2 - cnv.width/6, cnv.height*0.1);

                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                ctx.font = "25px 'Carter One'";
                ctx.textAlign = "center";
                ctx.fillText("Press space to use the door.", cnv.width*0.5, cnv.height*0.81);

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


class Enemy {
    constructor(x, y, r, type, hostility) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.hostility = hostility; // safe, neutral, dangerous

        this.facingAngle = 0;

        this.roamX = 0;
        this.roamY = 0;
        this.roamDist = 0;
        this.roamSpeed = 0;
        this.startingRoamX = x;
        this.startingRoamY = y;
        this.roamCD = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x-mapX, this.y-mapY);
        ctx.rotate(this.facingAngle);
        
        if (this.type === "pig") {
            // body
            ctx.lineWidth = 4;
            ctx.strokeStyle = "magenta";
            drawCircle(0, 0, this.r, false);
            
            ctx.fillStyle = "pink";
            drawCircle(0, 0, this.r);

            // eyes
            ctx.fillStyle = "black";
            drawCircle(this.r*0.5, -this.r*0.3, this.r*0.2); // left eye
            drawCircle(this.r*0.5, this.r*0.3, this.r*0.2); // right eye
            
            ctx.fillStyle = "white";
            drawCircle(this.r*0.55, -this.r*0.3, this.r*0.1);
            drawCircle(this.r*0.55, this.r*0.3, this.r*0.1);

            // nose
            ctx.fillStyle = "magenta";
            ctx.fillRect(this.r-1, -this.r*0.35, this.r*0.35, this.r*0.7);
        }

        ctx.restore();
    }

    setRoam() {
        // find random vector coordinates from -1 to 1
        this.roamX = Math.random()*2 - 1;
        this.roamY = Math.sqrt(1 - this.roamX**2);

        const posOrNeg = Math.random() < 0.5 ? 1 : -1;
        this.roamY *= posOrNeg;

        this.facingAngle = Math.atan2(this.roamY, this.roamX);
        
        this.roamDist = Math.random()*200 + 150; // 150-350
        this.roamSpeed = this.roamDist/100;

        this.startingRoamX = this.x;
        this.startingRoamY = this.y;
    }

    roam() {
        // if (this.roamCD === 0) this.roamCD = now;
        
        const currentDist = Math.hypot(this.startingRoamX - this.x, this.startingRoamY - this.y);
        
        if (currentDist < this.roamDist && this.roamDist != 0) {
            let proportion = (currentDist - this.roamDist/2) / (this.roamDist/2); // -1 -> 0 -> 1
            
            proportion = Math.abs(proportion); // 1 -> 0 -> 1
            
            proportion = Math.max(1 - proportion, 0.1); // 0 -> 1 -> 0
            
            
            this.x += this.roamX*this.roamSpeed * proportion;
            this.y += this.roamY*this.roamSpeed * proportion;

            this.roamCD = Date.now();
        }
        else if (now - this.roamCD > 5000) this.setRoam();
    }
}

        
// Event Listeners //
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("click", () => {
    interactionWithPage = true;
    clickHandler();
});
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);
document.addEventListener("contextmenu", rightClickHandler);

const userIn = document.getElementById("username");
const displayIn = document.getElementById("display-name");
const passIn = document.getElementById("password");

[userIn, displayIn, passIn].forEach((input) => {
    input.addEventListener("input", accountInputsHandler);
});

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

for (let i = 0; i < audioElements.length; i++) {
    const audioEl = audioElements[i];
    const nextIndex = i === audioElements.length-1 ? 0 : i + 1;
    
    audioEl.addEventListener("ended", () => {
        songAnimation.reset();
        currentSong = audioElements[nextIndex];
        currentSong.play();
    });

    audioEl.addEventListener("playing", () => {
        currentSong = audioEl;
        songAnimation.reset();
        songAnimation.active = true;
        songAnimation.content = "♬ " + audioEl.dataset.credit;
    });
}


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
    ctx.fillRect(-26*50-25 - mapX, -15*50-25 - mapY, 78*50, 1450 + 750);

    // tiling
    drawGroundTiles();
    drawBlockTiles();


    // titleScreen
    if (gameState === "titleScreen") {
        drawTitleScreen();
    }
    else if (gameState === "inGame") {
        drawMobs();
        drawPlayer();
        drawHotbarAndInventory();
        drawInfoPopups();

        
        // collisions();
        recenterPlayer();
        playerMovement();

        autoSpawnMobs();
    }

    // music animation popup
    drawSongAnimation();

    // cursor tracking
    /* drawCursor(); */

}

// Limit FPS //
const fps = 100;
let lastTime = performance.now();

function limitRefreshRate() {
    const currentTime = performance.now();
    const timeDifferenceMS = currentTime - lastTime;

    if (timeDifferenceMS/1000 > 1/fps) {
        draw();
        lastTime = currentTime;
    }

    
    requestAnimationFrame(limitRefreshRate);
}

limitRefreshRate();
