var canvas = document.getElementById('myCanvas');
var label = document.getElementById('score');
var timeLabel = document.getElementById('timeLabel');
var progressBar = document.getElementById('progressBar');
var ctx = canvas.getContext('2d');
var xDim = 500;
var yDim = 300;
var raf;
var deltaX = 0;
var deltaY = 0;
var score = 0;
var timePassed = 0;
var GAME_LENGTH = 30; //seconds
var progressPercent = 0;
var randomX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
var randomY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
label.innerText = score;
var pointSound;

function drawBall() {
    ctx.beginPath();
    ctx.arc(xDim + deltaX, yDim + deltaY, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "blue";
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
            if(xDim - deltaX < xDim * 2){
                deltaX -= 10;
            }
            break;
        case 38:
            if(yDim - deltaY < yDim * 2){
                deltaY -= 10;
            }
            break;
        case 39:
            if(xDim - deltaX > 0){
                deltaX += 10;
            }
            break;
        case 40:
            if(yDim - deltaY > 0){
                deltaY += 10;
            }
            break;  
    }   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawX(randomX,randomY);
    drawBall();
    if ( (xDim + deltaX - randomX < 25 && xDim + deltaX - randomX > -25) &&
         (yDim + deltaY - randomY < 25 && yDim + deltaY - randomY > -25) ){
        score += 1;
        //pointSound.play();
        randomX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
        randomY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawX(randomX,randomY);
    }
    label.innerText = score;
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

function startGame(){
    drawBall();
    progressBar.innerHTML = GAME_LENGTH;
    progressBar.style.width = "100%";
    timePassed += 1;
    //pointSound = new sound("coin.mp3");
}

var gameActive = setInterval(function() {
    if(timePassed == GAME_LENGTH){
        progressBar.className = "progress-bar bg-danger";
        progressBar.style.width = "100%"
        progressBar.innerHTML = 0;
        clearInterval(gameActive);
        setTimeout(function() {
            alert("Game Over\nYour Score: " + score)
        }, 650);
    }
    else {
    progressBar.innerHTML = GAME_LENGTH - timePassed;
    progressPercent = 100 - (timePassed / GAME_LENGTH) * 100;
    console.log(Math.floor(progressPercent))
    var percentWidth = Math.floor(progressPercent) + "%";
    progressBar.style.width = percentWidth;
    timePassed += 1;
    }
},1000);



window.addEventListener("keydown", moveSomething, false);

startGame();
