//* DESTINED REVIVAL FUNCTIONS.JS *//

// Handlers //
function mousemoveHandler(e) {
    const scaleX = cnv.width/window.innerWidth;
    const scaleY = cnv.height/window.innerHeight;

    mouse.x = e.clientX * scaleX;
    mouse.y = e.clientY * scaleY;
    
    if (mouse.track) console.log(mouse.x, mouse.y);
}

// Called Every Frame //
function drawTitleScreen() {
    // drawTitleScreen(): draws the play button and gets the players username

    // title
    ctx.strokeStyle = "black";
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
    

    // play button bg
    ctx.strokeStyle = "rgb(20, 175, 50)";
    ctx.fillStyle = "rgb(20, 200, 50)";
    ctx.lineWidth = 5;
    ctx.strokeRect(cnv.width*0.425, cnv.height*0.51, cnv.width*0.15, cnv.height*0.1);
    ctx.fillRect(cnv.width*0.425, cnv.height*0.51, cnv.width*0.15, cnv.height*0.1);

    // play button text
    ctx.fillStyle = "white";
    ctx.font = "500 50px Outfit"
    ctx.textAlign = "center";
    ctx.fillText("LIVE", cnv.width*0.5, cnv.height*0.585);
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
