//* DESTINED REVIVAL FUNCTIONS.JS *//

// Handlers //


// Called Every Frame //
function drawTitleScreen() {
    // drawTitleScreen(): draws the play button and gets the players username

    // play button bg
    ctx.fillStyle = "rgb(20, 200, 50)";
    ctx.rect(cnv.width*0.35, cnv.height*0.6, cnv.width*0.3, cnv.height*0.1);

    // play button text
    ctx.fillStyle = "white";
    ctx.font = "500 30px Outfit"
    ctx.textAlign = "center";
    ctx.fillText("LIVE", cnv.width*0.5, cnv.height*0.55);
}
