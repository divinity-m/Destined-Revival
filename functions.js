//* DESTINED REVIVAL FUNCTIONS.JS *//

// Handlers //
function mousemoveHandler(e) {
    const scaleX = cnv.width/window.innerWidth;
    const scaleY = cnv.height/window.innerHeight;

    mouse.x = e.clientX * scaleX;
    mouse.y = e.clientY * scaleY;
    
    if (mouse.track) console.log(mouse.x, mouse.y);
}

function clickHandler(e) {
    if (gameState === "titleScreen") {
        
        // clicking the play button
        if (mouse.over.playBtn) {
            gameState = "inGame";
            mouse.buttonAlpha = 1;
        }
    }
    else if (gameState === "inGame") {
        
    }
}

function mousedownHandler(e) {
    mousedown = true;
}
function mouseupHandler(e) {
    mousedown = true;
}

// Called Every Frame //
function drawTitleScreen() {
    // drawTitleScreen(): draws the play button and gets the players username

    // title
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(0, 50  , 255)";
    ctx.lineWidth = 5;
    ctx.font = "80px 'Carter One'"
    ctx.textAlign = "center";
    ctx.strokeText("DESTINED REVIVAL", cnv.width*0.5, cnv.height*0.4);
    ctx.fillText("DESTINED REVIVAL", cnv.width*0.5, cnv.height*0.4);


    // username input
    const input = document.getElementById("username");
    input.style.left = "50vw";
    input.style.top = "46vh";


    // play button detection
    mouse.over.playBtn = (
        mouse.x > cnv.width*0.425-2.5 && mouse.x < cnv.width*0.425+cnv.width*0.15+2.5 &&
        mouse.y > cnv.height*0.51-2.5 && mouse.y < cnv.height*0.51+cnv.height*0.1+2.5 && gameState === "titleScreen"
    );

    if (mouse.over.playBtn) {
        mouse.buttonAlpha = Math.max(0.75, mouse.buttonAlpha - 0.025);
    }
    else {
        mouse.buttonAlpha = Math.min(1, mouse.buttonAlpha + 0.025);
    }
    ctx.globalAlpha = mouse.buttonAlpha;

    // play button bg
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(20, 200, 50)";
    ctx.lineWidth = 5;
    ctx.strokeRect(cnv.width*0.425, cnv.height*0.51, cnv.width*0.15, cnv.height*0.1);
    ctx.fillRect(cnv.width*0.425, cnv.height*0.51, cnv.width*0.15, cnv.height*0.1);
    

    // play button text
    ctx.fillStyle = "white";
    ctx.font = "500 70px Akronim"
    ctx.textAlign = "center";
    ctx.fillText("LIVE", cnv.width*0.5, cnv.height*0.595);
    
    ctx.globalAlpha = 1;
}

function drawCursor() {
    // drawCursor(): tracks the cursor movement by drawing it

    // cursor
    ctx.fillStyle = "rgb(0, 120, 255)";
    drawCircle(mouse.x, mouse.y, 5);
}

function drawCircle(x, y, r, fill = true) {
    
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 2, 0);

    if (fill) ctx.fill();
    else ctx.stroke();
}

