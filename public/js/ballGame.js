var canvas = document.getElementById('myCanvas');
var label = document.getElementById('score');
var timeLabel = document.getElementById('timeLabel');
var progressBar = document.getElementById('progressBar');
var spedometer = document.getElementById('spedometer');
var ctx = canvas.getContext('2d');
var raf;
var score = 0;
var timePassed = 1;
var GAME_LENGTH = 30; //seconds
var SPEED = 2;
var MAX_SPEED = 10;
var progressPercent = 0;

label.innerText = score;
var pointSound;
var gameOver = false;
var timeAlreadyCollected = false;

ctx.fillStyle = '#3C3C3C';
ctx.fillRect(0,0,canvas.width, canvas.height);

var interval;

class Sprite {
    constructor(canvas){
        this.randomize();
        this.drawn = false;
    }
    randomize() {
        this.x = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
        this.y = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
    }
}
class Enemy extends Sprite{
    constructor(canvas){
        super(canvas);
    }
    draw(ctx){
        this.drawn = true;
        ctx.beginPath();
        ctx.moveTo(this.x - 20, this.y - 20);
        ctx.lineTo(this.x + 20, this.y + 20);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.moveTo(this.x + 20, this.y - 20);
        ctx.lineTo(this.x - 20, this.y + 20);
        ctx.stroke();
    }
}
class SpeedBoost extends Sprite{
    constructor(canvas){
        super(canvas)
    }
    draw(ctx){
        this.drawn = true;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "yellow";
        ctx.fill();
    }
}
class TimeBoost extends Sprite{
    constructor(canvas){
        super(canvas);
    }
    draw(ctx){
        this.drawn = true;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "green";
        ctx.fill();
    }

}
class Ball {
    constructor(canvas, acceleration){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.acceleration = acceleration
        this.speed = {
            x: 0,
            y: 0
        }
        
    }
    draw() {
        ctx.beginPath();
        this.x += this.speed["x"];
        this.y += this.speed["y"];
        if(this.y > canvas.height){
            this.y = canvas.height;
        }
        else if (this.y < 0){
            this.y = 0;
        }
        if(this.x > canvas.width){
            this.x = canvas.width;
        }
        else if (this.x < 0){
            this.x = 0;
        }
        ctx.arc(this.x, this.y, 25, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();
    }
    move(e){
        switch(e.keyCode) {
            case 37:
                this.speed["x"] = -this.acceleration;
                break;
            case 38:
                this.speed["y"] = -this.acceleration;
                break;
            case 39:
                this.speed["x"] = this.acceleration;
                break;
            case 40:
                this.speed["y"] = this.acceleration;
                break;  
        }   
    }
    stop(e){
        switch(e.keyCode) {
            case 37:
                this.speed["x"] = 0;
                break;
            case 38:
                this.speed["y"] = 0;
                break;
            case 39:
                this.speed["x"] = 0;
                break;
            case 40:
                this.speed["y"] = 0;
                break;  
        }   

    }
}

function redraw(ball, enemy, timeBoost, speedBoost, timePassed){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw(ctx);
    enemy.draw(ctx);

    if(timePassed > (GAME_LENGTH/2) ){
        if(!timeAlreadyCollected){
            timeBoost.draw(ctx);
        }
    }
    if(ball.acceleration != MAX_SPEED)
        speedBoost.draw(ctx);
}
function isColliding(usr, sprite){
    if ( (usr.x - sprite.x < 25 && usr.x - sprite.x > -25) &&
        (usr.y - sprite.y < 25 && usr.y - sprite.y > -25) ){
            sprite.drawn = false;
            return true;
        }
    return false;
}

function update (enemy, ball, speedBoost, timeBoost){
    redraw(ball, enemy, timeBoost, speedBoost, timePassed);
    if (isColliding(ball, enemy)){
        score += 1;
        enemy.randomize();
        redraw(ball, enemy, timeBoost, speedBoost, timePassed);
    }
    if (isColliding(ball, speedBoost)){
        ball.acceleration = ball.acceleration + 1 > MAX_SPEED ? MAX_SPEED : ball.acceleration + 1;
        speedBoost.randomize();
        redraw(ball, enemy, timeBoost, speedBoost, timePassed);
    }
    if (isColliding(ball, timeBoost)){
        timePassed -= 5;
        timeAlreadyCollected = true;
        timeBoost.randomize();
        redraw(ball, enemy, timeBoost, speedBoost, timePassed);
    }
    label.innerText = score;
    spedometer.innerHTML = Math.sqrt(ball.speed.x * ball.speed.x + ball.speed.y * ball.speed.y);
    if (gameOver){
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER\nScore:" + score, canvas.width/2, canvas.height/2);
        clearInterval(interval);
    }

}
function startGame(){
    progressBar.innerHTML = GAME_LENGTH;
    progressBar.style.width = "100%";
    //timePassed += 1;
    var ball = new Ball(canvas, SPEED);
    ball.draw();
    var enemy = new Enemy(canvas);
    var speedBoost = new SpeedBoost(canvas);
    var timeBoost = new TimeBoost(canvas);
    window.addEventListener("keydown", function(e) {
        ball.move(e);
    }, false);
    
    window.addEventListener("keyup", function(e){
        ball.stop(e);
    }, false);
    
    interval = setInterval(update, 20, enemy, ball, speedBoost, timeBoost);
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



startGame();



