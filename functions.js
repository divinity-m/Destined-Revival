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
    if (gameState === "titleScreen") {
        // log in button
        if (mouse.over.loginBtn) {
            signInActivated = false;
        }

        // sign in button
        if (mouse.over.signinBtn) {
            signInActivated = true;
            displayIn.style.display = "inline";
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
                    if (gameState === "inGame") return;
                    
                    gameState = "inGame";
    
                    // reset necessary variables
                    [buttonAlpha.play, buttonAlpha.login, buttonAlpha.signin] = [1, 1, 1];
                    [player.x, player.y] = [cnv.width/2, cnv.height/2];
                    
                    [userIn, displayIn, passIn].forEach((input) => {
                        input.value = "";
                        input.style.display = "none";
                    });

                    // play a random song
                    if (interactionWithPage) audioElements[Math.floor(Math.random() * audioElements.length)].play();
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
                    
                    p.style.display = "inline";
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
        // literally only for auto-login
        let nothingPlaying = true;
        for (let audio of audioElements) {
            if (!audio.paused) nothingPlaying = false;
        }
        if (nothingPlaying) audioElements[Math.floor(Math.random() * audioElements.length)].play();

        if (mouse.over.inv) {
            player.invOpen = !player.invOpen;
        }
        // m1
        else if (player.hotbar[player.hotbarSlot] === 0) m1.active = true;
    }
}

function rightClickHandler(e) {
    e.preventDefault();
}

function mousedownHandler() {
    mousedown = true;
    if (player.hotbar[player.hotbarSlot] === 0) m1.active = true;
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

    if (e.code === "Space" && gameState === "inGame") {
        for (let i in blockTiles) {
            const tile = blockTiles[i];
            if (tile.interactable) tile.interactionEvent();
        }
    }

    if (e.code === "KeyG" && gameState === "inGame") {
        player.invOpen = player.invOpen ? false : true;
    }

    if (e.code.includes("Digit") && Number(e.code.at(-1)) != 0 && gameState === "inGame") {
        player.hotbarSlot = Number(e.code.at(-1));
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


function drawCursor() {
    // drawCursor(): tracks the cursor movement by drawing it

    // cursor
    ctx.fillStyle = "rgb(0, 120, 255)";
    drawCircle(mouse.x, mouse.y, 5);
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

    const r = player.r*1.2;

    // player outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(198, 134, 66)";
    drawCircle(0, 0, player.r - 1, false); // head
    
    drawCircle(0 + r + m1.lx, 0 - r, player.r*0.35, false); // left/top hand
    drawCircle(0 + r + m1.rx, 0 + r + m1.ry, player.r*0.35, false); // right/bottom hand

    // player fill
    ctx.fillStyle = "rgb(241, 194, 125)";
    drawCircle(0, 0, player.r - 1.5);
    
    drawCircle(0 + r + m1.lx, 0 - r, player.r*0.35 - 0.45); // left/top hand
    drawCircle(0 + r + m1.rx, 0 + r + m1.ry, player.r*0.35 - 0.45); // right/bottom hand


    ctx.restore();


    // m1 animation
    if (m1.active) {
        if (m1.state === "retracting") {
            m1.lx = Math.min(m1.lx + (4.55 - m1.lx)/4, 4.5);
            m1.rx = Math.max(m1.rx + (-5.05 - m1.rx)/4, -5);

            if (m1.rx === -5) m1.state = "extending";
        }
        else if (m1.state === "extending") {
            m1.lx = Math.max(m1.lx + (-5.05 - m1.lx)/4.5, -5);

            const increment = Math.min(m1.rx + (17.05 - m1.rx)/4.5, 17);
            m1.rx = increment;
            m1.ry = -increment;

            m1.hitting = m1.rx > 7.5;
            if (m1.rx === 17) m1.state = "returning";
        }
        else if (m1.state === "returning") {
            m1.lx = Math.min(m1.lx + (0.05 - m1.lx)/5, 0);

            const increment = Math.max(m1.rx + (-0.05 - m1.rx)/5, 0);
            m1.rx = increment;
            m1.ry = -increment;
            
            if (m1.rx === 0) {
                m1.reset();
                if (mousedown && player.hotbar[player.hotbarSlot] === 0) m1.active = true;
            }
        }
    }
}


function drawMobs() {
    for (let mob of mobs.freeroam) {
        mob.draw();
        mob.roam();
    }
    for (let mob of mobs.alter) {
        mob.draw();
    }
}


function drawGroundTiles() {
    for (let i in groundTiles) {
        let tile = groundTiles[i];
        
        tile.draw();
    }
}
function drawBlockTiles() {
    player.leftCollision = false;
    player.rightCollision = false;
    player.topCollision = false;
    player.bottomCollision = false;
    
    for (let i in blockTiles) {
        let tile = blockTiles[i];
        
        tile.draw();
        tile.collide();
    }
}

function drawInfoPopups() {
    for (let i in blockTiles) {
        let tile = blockTiles[i];
        tile.drawDoorOptions();
    }
}


function drawSongAnimation() {
    if (songAnimation.active) {
        ctx.font = "17.5px 'Carter One'";
        ctx.textAlign = "left";
        ctx.lineWidth = 2;

        // draws the text
        ctx.strokeStyle = `rgba(0, 0, 0, ${songAnimation.alpha})`;
        ctx.strokeText(songAnimation.content, songAnimation.x, songAnimation.y);

        ctx.fillStyle = `rgba(255, 255, 255, ${songAnimation.alpha})`;
        ctx.fillText(songAnimation.content, songAnimation.x, songAnimation.y);

        // increments the x-coordinate based on the distance from the final x
        const distFromX = 31 - songAnimation.x;
        songAnimation.x = Math.min(songAnimation.x + distFromX/30, 30);

        // fades in/out the text
        songAnimation.alpha = songAnimation.fadeIn ? songAnimation.alpha + 0.015 : songAnimation.alpha - 0.03;
        if (songAnimation.alpha >= 5.5) {
            songAnimation.fadeIn = false;
            songAnimation.alpha = 1.1;
        }

        // resets the text once the alph reaches zero while fading out
        if (!songAnimation.fadeIn && songAnimation.alpha <= 0) songAnimation.reset();
    }
}


function drawHotbarAndInventory() {
    // hotbar
    const hotbarLen = player.hotbar.length;
    const sideLen = cnv.width*0.3/hotbarLen;
    
    const hotbarX = (cnv.width - sideLen*hotbarLen) / 2 - 8*(hotbarLen/2);
    const hotbarY = cnv.height*0.875;
    
    const hotbarWidth = (sideLen+8) * hotbarLen;
    
    /* LAYERS MUST BE DRAWN SEPERATELY OR ELSE THEY WILL OVERLAP */
    // far back faded layer
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    ctx.fillRect(hotbarX - 8, hotbarY - 8, hotbarWidth + 8, sideLen + 16);
    
    ctx.fillStyle = "rgba(25, 25, 25, 0.25)";
    ctx.fillRect(hotbarX - 4, hotbarY - 4, hotbarWidth, sideLen + 8);

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(50, 50, 50, 0.75)";
    ctx.strokeRect(hotbarX - 4, hotbarY - 4, hotbarWidth, sideLen + 8);
    
    // inner black layer
    ctx.strokeStyle = "rgb(0, 0, 0)";
    for (let i = 0; i < hotbarLen; i++) {
        ctx.lineWidth = (i+1 === player.hotbarSlot) ? 8 : 6;
        
        ctx.strokeRect(hotbarX + sideLen*i + 8*i, hotbarY, sideLen, sideLen);
    }

    // translucent filled layer
    ctx.fillStyle = "rgba(100, 100, 100, 0.25)";
    for (let i = 0; i < hotbarLen; i++) ctx.fillRect(hotbarX + sideLen*i + 8*i, hotbarY, sideLen, sideLen);

    // outer grey layer
    for (let i = 0; i < hotbarLen; i++) {
        ctx.lineWidth = (i+1 === player.hotbarSlot) ? 5 : 4;
        ctx.strokeStyle = (i+1 === player.hotbarSlot) ? "rgb(230, 230, 230)" : "rgb(150, 150, 150)";
        
        ctx.strokeRect(hotbarX + sideLen*i + 8*i, hotbarY, sideLen, sideLen);
    }


    // inventory
    let invY = 0;
    if (player.invOpen) {
        const invLen = player.inventory.length;
        
        const invWidth = ((sideLen+8) * 5);
        const invHeight = (sideLen+8) * Math.ceil(invLen/5);
        hotbarBottomDist = cnv.height - cnv.height*0.875 - sideLen;

        invY = cnv.height - (invHeight - 8) - hotbarBottomDist;
        const invX = cnv.width - invWidth - hotbarBottomDist;

        // far back layer
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        ctx.fillRect(invX - 8, invY - 8, invWidth + 8, invHeight + 8);
        
        ctx.fillStyle = "rgba(25, 25, 25, 0.25)";
        ctx.fillRect(invX - 4, invY - 4, invWidth, invHeight);
    
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(50, 50, 50, 0.75)";
        ctx.strokeRect(invX - 4, invY - 4, invWidth, invHeight);
        
        // 2st layer
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 6;
        for (let i = 0; i < invLen; i++) {
            ctx.strokeRect(invX + (i%5)*sideLen + (i%5)*8, invY + Math.floor(i/5)*sideLen + Math.floor(i/5)*8, sideLen, sideLen);
        }
        
        // 3nd layer
        ctx.fillStyle = "rgba(100, 100, 100, 0.25)";
        for (let i = 0; i < invLen; i++) {
            ctx.fillRect(invX + (i%5)*sideLen + (i%5)*8, invY + Math.floor(i/5)*sideLen + Math.floor(i/5)*8, sideLen, sideLen);
        }
        
        // 4th layer
        ctx.strokeStyle = "rgb(150, 150, 150)";
        ctx.lineWidth = 4;
        for (let i = 0; i < invLen; i++) {
            ctx.strokeRect(invX + (i%5)*sideLen + (i%5)*8, invY + Math.floor(i/5)*sideLen + Math.floor(i/5)*8, sideLen, sideLen);
        }
    }

    const invBtnY = !player.invOpen ? cnv.height*0.875 + sideLen*0.25 : invY-8 - sideLen*0.5-8;
    
    mouse.over.inv = (
        mouse.x > cnv.width*0.875-8-2 && mouse.x < (cnv.width*0.875-8-2) + (sideLen*2.5+16) &&
        mouse.y > invBtnY-8 && mouse.y < (invBtnY-8) + (sideLen*0.5 + 16)
    );
        
    ctx.globalAlpha = buttonAlpha.modifyAlpha("inv", mouse.over.inv);

        
    // far back layer
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    ctx.fillRect(cnv.width*0.875 - 8 - 2, invBtnY - 8, sideLen*2.5 + 16, sideLen*0.5 + 16);

    ctx.fillStyle = "rgba(25, 25, 25, 0.25)";
    ctx.fillRect(cnv.width*0.875 - 4 - 2, invBtnY - 4, sideLen*2.5 + 8, sideLen*0.5 + 8);
        
    ctx.fillStyle = "rgb(50, 50, 50)";
    ctx.fillRect(cnv.width*0.875 - 4 - 2, invBtnY - 4, sideLen*2.5 + 8, sideLen*0.5 + 8);

    // text
    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.textAlign = "center";
    ctx.font = "15px 'Carter One'";

    ctx.fillText("INVENTORY (G)", cnv.width*0.875-2 + sideLen*1.25, invBtnY + sideLen*0.35);

        
    ctx.globalAlpha = 1;
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
    if (wPressed && !player.bottomCollision) dy--;
    
    if (aPressed && !player.rightCollision) dx--;

    if (sPressed && !player.topCollision) dy++;
    
    if (dPressed && !player.leftCollision) dx++;

    // account for diagonal movement
    if (dx != 0 && dy != 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    // limit the distance the player can move from the center
    const dxCenter = cnv.width/2 - player.x;
    const dyCenter = cnv.height/2 - player.y;
    const distCenter = Math.hypot(dxCenter, dyCenter);

    const limit = Math.max(1 - (distCenter / 20), 0.1);
    
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
    if (dist > player.speed/4) {
        const speed = player.speed * 0.2;
        
        player.x += dx/dist * speed;
        player.y += dy/dist * speed;
   
        mapX -= dx/dist * speed;
        mapY -= dy/dist * speed;
    }
}


function autoSpawnMobs() {
    // autoSpawnMobs(): when the player comes near a certain zone, mobs for that zone will start spawning

    // find the pig spawn tile to get its coordinates
    const pigSpawnTile = groundTiles.find((tile) => tile.type === "pig spawn");
    const pigSpawnX = pigSpawnTile.x - mapX - 6*50;
    const pigSpawnY = pigSpawnTile.y - mapY - 6*50;

    const playerInPigSpawn = (
        player.x+player.r > pigSpawnX && player.x-player.r < pigSpawnX + 13*50 &&
        player.y+player.r > pigSpawnY && player.y-player.r < pigSpawnY + 13*50
    );

    // limits the amount of pigs that can spawn
    // mobs.freeroam.map(mob => mob.type === "pig")
    let numPigs = 0;
    for (let mob of mobs.freeroam) {
        if (mob.type === "pig") numPigs++;
    }

    if (!playerInPigSpawn || numPigs >= 10) mobs.lastSpawned = now;
    
    if (playerInPigSpawn && numPigs < 7 && now - mobs.lastSpawned > 5000) {
        const randX = Math.random() * (13*50) + pigSpawnTile.x-6*50;
        const randY = Math.random() * (13*50) + pigSpawnTile.y-6*50;
        
        const pig = new Enemy(randX, randY, 20, "pig", "safe"); // (x, y, r, type, hostility)

        mobs.freeroam.push(pig);
        mobs.lastSpawned = now;
    }
}


// Momentary Functions
function setUpGroundTiles() {
    // cnv.width/2 and cnv.height/2 are not multiples of 50 at all
    const halfCnvWidth = 650;
    const halfCnvHeight = 350;
    
    
    // the house's floor
    const houseLen = 7;
    
    for (let i = 0; i < houseLen**2; i++) {
        const tileX = (halfCnvWidth - (houseLen*50)/2) + (i%houseLen) * 50;
        const tileY = (halfCnvHeight - (houseLen*50)/2) + Math.floor(i/houseLen) * 50;
        
        const brickFloorTile = new GroundTile(tileX, tileY, "brick floor");

        groundTiles.push(brickFloorTile);
    }

    groundTiles.push(new GroundTile(halfCnvWidth - 25, halfCnvHeight - 25, "spawn"));

    // dirt path to pig spawns
    const pathLen = 20;
    
    for (let i = 0; i < pathLen*3; i++) {
        const pathX = halfCnvWidth + houseLen*50/2;
        const pathY = halfCnvHeight - houseLen*50/2 + (Math.floor(houseLen/2)-1) * 50;
        
        const dirtPathTile = new GroundTile(pathX + (i%pathLen)*50, pathY + Math.floor(i/pathLen)*50, "dirt");
        
        groundTiles.push(dirtPathTile);
    }

    // dirt section for pigs
    const pigLen = 13;

    for (let i = 0; i < pigLen**2; i++) {
        const tileX = halfCnvWidth + houseLen*50/2 + pathLen*50;
        const tileY = halfCnvHeight - houseLen*50/2 + (Math.floor(houseLen/2)-2) * 50;

        // make a pig spawn tile at the center
        if (i === Math.floor(pigLen**2 / 2)) {
            const spawnTile = new GroundTile(tileX + (i%pigLen)*50, tileY + Math.floor(i/pigLen)*50, "pig spawn");
            groundTiles.push(spawnTile);
        }
        
        const dirtTile = new GroundTile(tileX + (i%pigLen)*50, tileY + Math.floor(i/pigLen)*50, "dirt");
        groundTiles.push(dirtTile);
    }
}

function setUpBlockTiles() {
    // cnv.width/50 = 25.6  |  cnv.height/50 = 14.4

    let [dx, dy] = [25, 25];
    
    // top and bottom borders
    for (let i = 0; i < 26*3; i++) {
        const topBorderTile = new BlockTile(-26*50 + i*50 - dx, -15*50 - dy, 50, 50, "void wall");
        
        const bottomBorderTile = new BlockTile(-26*50 + i*50 - dx, cnv.height-20 + 15*50 - dy, 50, 50, "void wall");

        blockTiles.push(topBorderTile, bottomBorderTile);
    }

    // left and right borders
    for (let i = 1; i < 15*3 - 1; i++) {
        const leftBorderTile = new BlockTile(-26*50 - dx, -15*50 + i*50 - dy, 50, 50, "void wall");
        
        const rightBorderTile = new BlockTile(51*50 - dx, -15*50 + i*50 - dy, 50, 50, "void wall");

        blockTiles.push(leftBorderTile, rightBorderTile);
    }

    // the house's walls
    let len = 7;
    const houseLen = len;
    const halfCnvWidth = 650;
    const halfCnvHeight = 350;
    
    for (let i = 0; i < len; i++) {
        const tileX = halfCnvWidth - (len*50)/2;
        const tileY = halfCnvHeight - (len*50)/2;
        
        const topHouseTile = new BlockTile(tileX + i*50, tileY, 50, 50, "brick wall");
        const bottomHouseTile = new BlockTile(tileX + i*50, tileY + (len-1)*50, 50, 50, "brick wall");

        const leftHouseTile = new BlockTile(tileX, tileY + i*50, 50, 50, "brick wall");
        
        const rightHouseTileWall = new BlockTile(tileX + (len-1)*50, tileY + i*50, 50, 50, "brick wall");
        const rightHouseTileDoor = new BlockTile(tileX + (len-1)*50 + 12.5, tileY + i*50, 25, 50, "vertical brick door");

        const isEvenAndHalf = len%2 === 0 && i === len/2-1

        const rightHouseTile = (i != Math.floor(len/2) && !isEvenAndHalf) ? rightHouseTileWall : rightHouseTileDoor;

        
        blockTiles.push(topHouseTile, bottomHouseTile, leftHouseTile, rightHouseTile);
    }
    

    
}
