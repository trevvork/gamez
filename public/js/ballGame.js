var canvas = document.getElementById('myCanvas');
var label = document.getElementById('score');
var timeLabel = document.getElementById('timeLabel');
var progressBar = document.getElementById('progressBar');
var ctx = canvas.getContext('2d');
var xDim = 500;
var yDim = 300;
var raf;
var speedX = 0;
var speedY = 0;
var score = 0;
var timePassed = 0;
var GAME_LENGTH = 30; //seconds
var SPEED = 1;
var MAX_SPEED = 10;
var progressPercent = 0;
var randomEnemyX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
var randomEnemyY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;

var randomSpeedX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
var randomSpeedY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
label.innerText = score;
var pointSound;
var gameOver = false;

ctx.fillStyle = '#3C3C3C';
ctx.fillRect(0,0,canvas.width, canvas.height);

var interval;

function drawBall() {
    ctx.beginPath();
    xDim += speedX;
    yDim += speedY;
    if(yDim > canvas.height){
        yDim = canvas.height;
    }
    else if (yDim < 0){
        yDim = 0;
    }
    if(xDim > canvas.width){
        xDim = canvas.width;
    }
    else if (xDim < 0){
        xDim = 0;
    }
    ctx.arc(xDim, yDim, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
};

function update (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawX(randomEnemyX,randomEnemyY);
    drawSpeed(randomSpeedX, randomSpeedY);
    if ( (xDim - randomEnemyX < 25 && xDim - randomEnemyX > -25) &&
         (yDim - randomEnemyY < 25 && yDim - randomEnemyY > -25) ){
        score += 1;
        randomEnemyX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
        randomEnemyY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawX(randomEnemyX,randomEnemyY);
    }
    if ( (xDim - randomSpeedX < 25 && xDim - randomSpeedX > -25) &&
         (yDim - randomSpeedY < 25 && yDim - randomSpeedY > -25) ){
        SPEED = SPEED + 1 > MAX_SPEED ? MAX_SPEED : SPEED + 1;
        randomSpeedX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
        randomSpeedY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawX(randomEnemyX,randomEnemyY);
        drawSpeed(randomSpeedX, randomSpeedY);
    }
    label.innerText = score;
    if (gameOver){
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER\nScore:" + score, canvas.width/2, canvas.height/2);
        clearInterval(interval);
    }
}

function drawSpeed(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
};

function drawX(x , y) {
    ctx.beginPath();
    
    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);
    ctx.strokeStyle = "red";
    ctx.stroke();

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();
}



function moveSomething(e) {
    switch(e.keyCode) {
        case 37:
            speedX = -SPEED;
            break;
        case 38:
            speedY = -SPEED;
            break;
        case 39:
            speedX = SPEED;
            break;
        case 40:
            speedY = SPEED;
            break;  
    }   
}
function stopSomething(e) {
    switch(e.keyCode) {
        case 37:
            speedX = 0;
            break;
        case 38:
            speedY = 0;
            break;
        case 39:
            speedX = 0;
            break;
        case 40:
            speedY = 0;
            break;  
    }   
}


function startGame(){
    drawBall();
    progressBar.innerHTML = GAME_LENGTH;
    progressBar.style.width = "100%";
    timePassed += 1;
    interval = setInterval(update, 20);
}

var gameActive = setInterval(function() {
    if(timePassed == GAME_LENGTH){
        progressBar.className = "progress-bar bg-danger";
        progressBar.style.width = "100%"
        progressBar.innerHTML = 0;
        clearInterval(gameActive);
        setTimeout(function() {
            gameOver = true;
        }, 650);
    }
    else {
    progressBar.innerHTML = GAME_LENGTH - timePassed;
    progressPercent = 100 - (timePassed / GAME_LENGTH) * 100;
    var percentWidth = Math.floor(progressPercent) + "%";
    progressBar.style.width = percentWidth;
    timePassed += 1;
    }
},1000);

window.addEventListener("keydown", moveSomething, false);
window.addEventListener("keyup", stopSomething, false);


startGame();
