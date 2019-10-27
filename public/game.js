var canvas = document.getElementById('myCanvas');
var label = document.getElementById('score');
var ctx = canvas.getContext('2d');
var raf;

function drawBall() {
    ctx.beginPath();
    ctx.arc(500 + deltaX, 300 + deltaY, 25, 0, Math.PI * 2, true);
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

var deltaX = 0;
var deltaY = 0;

var randomX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
var randomY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;

var score = 0;
label.innerText = score;



window.addEventListener("keydown", moveSomething, false);
  
function moveSomething(e) {
    switch(e.keyCode) {
        case 37:
            deltaX -= 10;
            break;
        case 38:
            deltaY -= 10;
            break;
        case 39:
            deltaX += 10;
            break;
        case 40:
            deltaY += 10;
            break;  
    }   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawX(randomX,randomY);
    drawBall();
    if ( (500 + deltaX - randomX < 25 && 500 + deltaX - randomX > -25) &&
         (300 + deltaY - randomY < 25 && 300 + deltaY - randomY > -25) ){
        score += 1;
        randomX = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
        randomY = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawX(randomX,randomY);
    }
    label.innerText = score;
}

drawBall();

