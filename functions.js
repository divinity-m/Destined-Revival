//* DESTINED REVIVAL FUNCTIONS.JS *//

// Handlers //
function mousemoveHandler(e) {
    // get the ratios of the canvas's dimensions to the windows dimensions
    const scaleX = cnv.width/window.innerWidth;
    const scaleY = cnv.height/window.innerHeight;

    // get the mouse's client coordinates and multiply them by the canvas:window ratio
    mouse.x = e.clientX * scaleX;
    mouse.y = e.clientY * scaleY;
    if (mouse.track) console.log(mouse.x, mouse.y);

    getPlayerFacingAngle();
}

function clickHandler() {
    firstUserInteraction = true;
    
    if (gameState === "titleScreen") {
        // log in button
        if (mouse.over.loginBtn) {
            signInActivated = false;
        }

        // sign in button
        if (mouse.over.signinBtn) {
            signInActivated = true;
            displayIn.style.display = "block";
        }
        
        
        // clicking the play button
        if (mouse.over.playBtn) {
            [userIn, displayIn, passIn].forEach((input) => {
                // check if the field is empty
                if (input.value.trim().length == 0) {
                    input.style.setProperty("--ph", "rgba(255, 0, 0, 0.5)");
                    input.style.borderColor = "rgb(255, 0, 0)";
                }

                // check if the field has trailing whitespace
                else if (input.value.trim() != input.value) {
                    input.style.setProperty("--ph", "rgba(255, 255, 0, 0.5)");
                    input.style.borderColor = "rgb(255, 255, 0)";
                }
            })
            
            const displayInputInvalid = displayIn.value.trim().length == 0 || displayIn.value.trim() != displayIn.value;

            // resets the display input field if the sign-in screen isn't open
            if (!signInActivated && displayInputInvalid) {
                displayIn.style.setProperty("--ph", "rgba(255, 255, 255, 0.5)");
                displayIn.style.borderColor = "rgb(255, 255, 255)";
            }

            const userInputInvalid = userIn.value.trim().length == 0 || userIn.value.trim() != userIn.value;
            const passwordInputInvalid = passIn.value.trim().length == 0 || passIn.value.trim() != passIn.value;

            // ends the function if any of the fields are invalid
            if (userInputInvalid || passwordInputInvalid || (displayInputInvalid && signInActivated)) return;

            // define the function for determining log-in logic
            window.globalData.reactToLoginInfo = function(reaction) {
                
                // swap gamestates if the user logs in
                if (reaction === "logged in") {
                    gameState = "inGame";
                    [buttonAlpha.play, buttonAlpha.login, buttonAlpha.signin] = [1, 1, 1];
    
                    [userIn, displayIn, passIn].forEach((input) => {
                        input.value = "";
                        input.style.display = "none";
                    });
                    return;
                }
                    
                // display a message otherwise
                else {
                    const p = document.getElementById("error-in-login");

                    if (reaction === "invalid info") {
                        p.innerHTML = "unrecongnized information provided";
                    }
                    else if (reaction === "username exists") {
                        p.innerHTML = "username is already in use";
                    }
                    
                    p.style.display = "block";
                    p.style.opacity = 1;
                }
                
            }
            
            // attempt to log in / sign in
            if (signInActivated) {
                globalData.createNewAccount(userIn.value, passIn.value, displayIn.value);
            } else {
                globalData.logIntoAccount(userIn.value, passIn.value);
            }
        }
    }
    else if (gameState === "inGame") {
        
    }
}

function mousedownHandler() {
    mousedown = true;
}
function mouseupHandler() {
    mousedown = false;
}

function accountInputsHandler() {
    if (e.target.style.borderColor != "rgb(255, 255, 255)") {
        e.target.style.setProperty("--ph", "rgba(255, 255, 255, 0.75)");
        e.target.style.borderColor = "rgb(255, 255, 255)";
    }
}


function keydownHandler(e) {
    if (e.code === "KeyW" || e.code === "ArrowUp") {
        wPressed = true;
    }
    
    if (e.code === "KeyA" || e.code === "ArrowLeft") {
        aPressed = true;
    }
    
    if (e.code === "KeyS" || e.code === "ArrowDown") {
        sPressed = true;
    }
    
    if (e.code === "KeyD" || e.code === "ArrowRight") {
        dPressed = true;
    }
}


function keyupHandler(e) {
    if (e.code === "KeyW" || e.code === "ArrowUp") {
        wPressed = false;
    }
    
    if (e.code === "KeyA" || e.code === "ArrowLeft") {
        aPressed = false;
    }
    
    if (e.code === "KeyS" || e.code === "ArrowDown") {
        sPressed = false;
    }
    
    if (e.code === "KeyD" || e.code === "ArrowRight") {
        dPressed = false;
    }
}

    

// Draw Functions //
function drawCircle(x, y, r, fill = true) {
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 2, 0);

    if (fill) ctx.fill();
    else ctx.stroke();
}



function drawTitleScreen() {
    // drawTitleScreen(): draws the play button and gets the players username

    // title
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(0, 50  , 255)";
    ctx.lineWidth = 5;
    ctx.font = "80px 'Carter One'"
    ctx.textAlign = "center";
    ctx.strokeText("DESTINED REVIVAL", cnv.width*0.5, cnv.height*0.345);
    ctx.fillText("DESTINED REVIVAL", cnv.width*0.5, cnv.height*0.345);
    

    // display input, password input, and error-in-login paragraph
    displayOpacity = signInActivated ? Math.min(displayOpacity + 1/30, 1) : Math.max(displayOpacity - 1/30, 0);
    displayIn.style.opacity = displayOpacity;
    
    if (displayOpacity === 0)  displayIn.style.display = "none";
    
    passwordTop = signInActivated ? Math.min(passwordTop + 0.175, 52) : Math.max(passwordTop - 0.25, 46);
    passIn.style.top = passwordTop + "vh";
    
    const errorPara = document.getElementById("error-in-login");
    errorPara.style.opacity = Math.max(0, errorPara.style.opacity - 0.01);
    if (errorPara.style.opacity == 0) errorPara.style.display = "none";

    errorParaTop = signInActivated ? Math.min(errorParaTop + 0.3, 75) : Math.max(errorParaTop - 0.15, 69);
    errorPara.style.top = errorParaTop + "vh";
    

    // login/signin btn detection
    accountBtnsY = signInActivated ? Math.min(accountBtnsY+1.75, cnv.height*0.565) : Math.max(accountBtnsY-1.5, cnv.height*0.5);
    
    mouse.over.loginBtn = (
        mouse.x > cnv.width*0.4-1.5 && mouse.x < cnv.width*0.48+1.5 &&
        mouse.y > accountBtnsY-1.5 && mouse.y < accountBtnsY+cnv.height*0.057+1.5 && gameState === "titleScreen"
    )
    mouse.over.signinBtn = (
        mouse.x > cnv.width*0.52-1.5 && mouse.x < cnv.width*0.6+1.5 &&
        mouse.y > accountBtnsY-1.5 && mouse.y < accountBtnsY+cnv.height*0.057+1.5 && gameState === "titleScreen"
    )

    // log in button
    buttonAlpha.modifyAlpha("login", mouse.over.loginBtn);
    ctx.globalAlpha = buttonAlpha.login;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(20, 200, 50)";
    ctx.lineWidth = 3;
    
    ctx.strokeRect(cnv.width*0.4, accountBtnsY, cnv.width*0.08, cnv.height*0.057);
    ctx.fillRect(cnv.width*0.4, accountBtnsY, cnv.width*0.08, cnv.height*0.057);

    
    ctx.fillStyle = "white";
    ctx.font = "35px Akronim";
    ctx.textAlign = "center";
    
    ctx.fillText("Log In", cnv.width*0.44, accountBtnsY+cnv.height*0.04);
    
    ctx.globalAlpha = 1;

    
    // sign in button
    buttonAlpha.modifyAlpha("signin", mouse.over.signinBtn);
    ctx.globalAlpha = buttonAlpha.signin;

    
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(20, 200, 50)";
    ctx.lineWidth = 3;
    
    ctx.strokeRect(cnv.width*0.52, accountBtnsY, cnv.width*0.08, cnv.height*0.057);
    ctx.fillRect(cnv.width*0.52, accountBtnsY, cnv.width*0.08, cnv.height*0.057);

    
    ctx.fillStyle = "white";
    ctx.font = "35px Akronim";
    ctx.textAlign = "center";

    ctx.fillText("Sign In", cnv.width*0.56, accountBtnsY+cnv.height*0.04);
    
    ctx.globalAlpha = 1;


    
    // play button detection
    playBtnY = signInActivated ? Math.min(playBtnY+2, cnv.height*0.65) : Math.max(playBtnY-1.25, cnv.height*0.585);
    
    mouse.over.playBtn = (
        mouse.x > cnv.width*0.425-2.5 && mouse.x < cnv.width*0.575+2.5 &&
        mouse.y > playBtnY-2.5 && mouse.y < playBtnY+cnv.height*0.1+2.5 && gameState === "titleScreen"
    );

    // play button fade
    buttonAlpha.modifyAlpha("play", mouse.over.playBtn);
    ctx.globalAlpha = buttonAlpha.play;

    // play button bg
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(20, 200, 50)";
    ctx.lineWidth = 5;
    ctx.strokeRect(cnv.width*0.425, playBtnY, cnv.width*0.15, cnv.height*0.1);
    ctx.fillRect(cnv.width*0.425, playBtnY, cnv.width*0.15, cnv.height*0.1);
    

    // play button text
    ctx.fillStyle = "white";
    ctx.font = "500 70px Akronim";
    ctx.textAlign = "center";
    ctx.fillText("LIVE", cnv.width*0.5, playBtnY+cnv.height*0.085);
    
    ctx.globalAlpha = 1;
}



function drawPlayer() {
    // player name
    ctx.font = "35px Akronim";
    ctx.textAlign = "center";

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.strokeText(globalData.destinedData.displayName, player.x, player.y - player.r*2);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(globalData.destinedData.displayName, player.x, player.y - player.r*2);


    // rotate the player towards the location of the cursor
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.facingAngle);


    // player outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(198, 134, 66)";
    drawCircle(0, 0, player.r - 1, false); // head
    drawCircle(0 + player.r*1.2, 0 - player.r*1.2, player.r*0.35, false); // left/top hand
    drawCircle(0 + player.r*1.2, 0 + player.r*1.2, player.r*0.35, false); // right/bottom hand

    // player fill
    ctx.fillStyle = "rgb(241, 194, 125)";
    drawCircle(0, 0, player.r - 1.5);
    drawCircle(0 + player.r*1.2, 0 - player.r*1.2, player.r*0.35 - 0.45); // left/top hand
    drawCircle(0 + player.r*1.2, 0 + player.r*1.2, player.r*0.35 - 0.45); // right/bottom hand


    ctx.restore();
}



function drawCursor() {
    // drawCursor(): tracks the cursor movement by drawing it

    // cursor
    ctx.fillStyle = "rgb(0, 120, 255)";
    drawCircle(mouse.x, mouse.y, 5);
}

    


// Continuous Process Functions //
function getPlayerFacingAngle() {
    const dx = mouse.x - player.x;
    const dy = mouse.y - player.y;
    player.facingAngle = Math.atan2(dy, dx);
}


function playerMovement() {
    let [dx, dy] = [0, 0]

    // determine the direction the player is moving in
    if (wPressed) dy--;
    
    if (aPressed) dx--;

    if (sPressed) dy++;
    
    if (dPressed) dx++;

    // account for diagonal movement
    if (dx != 0 && dy != 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    // limit the distance the player can move from the center
    const dxCenter = cnv.width/2 - player.x;
    const dyCenter = cnv.height/2 - player.y;
    const distCenter = Math.hypot(dxCenter, dyCenter);

    const limit = 1 - (distCenter / 20);
    
    const speed = player.speed;

    const moveX = dx * speed;
    const moveY = dy * speed;

    // update the player and map coordinates
    player.x += moveX * limit;
    player.y += moveY * limit;

    mapX += moveX;
    mapY += moveY;

    getPlayerFacingAngle();
}


function recenterPlayer() {
    // recenterPlayer(): pulls the player back the to center of the screen when they move

    // get the distance to the center of the screen
    const dx = cnv.width/2 - player.x;
    const dy = cnv.height/2 - player.y;
    const dist = Math.hypot(dx, dy);

    // move the player once they pass a certain distance
    if (dist > 1) {
        const speed = player.speed * 0.2;
        
        player.x += dx/dist * speed;
        player.y += dy/dist * speed;
   
        mapX -= dx/dist * speed;
        mapY -= dy/dist * speed;
    }
}



