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

            // attempt to log in / sign in
            if (signInActivated) {
                createNewAccount(userIn.value, passIn.value, displayIn.value);
            } else {
                logIntoAccount(userIn.value, passIn.value);
            }

            window.reactToLoginInfo = function() {
                
                // swap gamestates if the user logs in
                if (window.destinedData) {
                    gameState = "inGame";
                    [buttonAlpha.play, buttonAlpha.login, buttonAlpha.signin] = [1, 1, 1];
    
                    [userIn, displayIn, passIn].forEach((input) => {
                        input.value = "";
                        input.style.display = "none";
                    });
                }
                    
                // display a message otherwise
                else {
                    const p = document.getElementById("unknown-login-info");
                    p.style.display = "block";
                    p.style.opacity = 1;
                }
            }
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

function accountInputHandler(e) {
    if (e.target.style.borderColor != "rgb(255, 255, 255)") {
        e.target.style.setProperty("--ph", "rgba(255, 255, 255, 0.75)");
        e.target.style.borderColor = "rgb(255, 255, 255)";
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
    

    // display input, password input, and unknown-login-info paragraph
    displayOpacity = signInActivated ? Math.min(displayOpacity + 1/30, 1) : Math.max(displayOpacity - 1/30, 0);
    displayIn.style.opacity = displayOpacity;
    
    if (displayOpacity === 0)  displayIn.style.display = "none";
    
    passwordTop = signInActivated ? Math.min(passwordTop + 0.175, 52) : Math.max(passwordTop - 0.25, 46);
    passIn.style.top = passwordTop + "vh";
    
    const unknownPara = document.getElementById("unknown-login-info");
    unknownPara.style.opacity = Math.max(0, unknownPara.style.opacity - 0.01);
    if (unknownPara.style.opacity == 0) unknownPara.style.display = "none";

    unknownInfoTop = signInActivated ? Math.min(unknownInfoTop + 0.3, 75) : Math.max(unknownInfoTop - 0.15, 69);
    unknownPara.style.top = unknownInfoTop + "vh";
    

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
    ctx.font = "35px Akronim"
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
    ctx.font = "35px Akronim"
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
    ctx.font = "500 70px Akronim"
    ctx.textAlign = "center";
    ctx.fillText("LIVE", cnv.width*0.5, playBtnY+cnv.height*0.085);
    
    ctx.globalAlpha = 1;
}



function drawPlayer() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    drawCircle(player.x, player.y, player.r-1.5, false);
    
    ctx.fillStyle = "rgb(255, 255, 255)";
    drawCircle(player.x, player.y, player.r-1.5);
}



function drawCursor() {
    // drawCursor(): tracks the cursor movement by drawing it

    // cursor
    ctx.fillStyle = "rgb(0, 120, 255)";
    drawCircle(mouse.x, mouse.y, 5);
}
