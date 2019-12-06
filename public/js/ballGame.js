var canvas = document.getElementById("myCanvas");
var outterLabel = document.getElementById("score");
var label = document.getElementById("score");
var menuLabel = document.getElementById("menuLabel");
var progressBar = document.getElementById("progressBar");
var spedometer = document.getElementById("spedometer");
var playMenu = document.getElementById("playMenu");
var gameOverMenu = document.getElementById("gameOverMenu");
var highScoresMenu = document.getElementById("highScoresMenu");
var gotHighScoreMenu = document.getElementById("gotHighScore");
var ctx = canvas.getContext("2d");
var GAME_LENGTH = 30; //seconds
var SPEED = 2;
var MAX_SPEED = 10;

var score = 0;
var timePassed = 1;
var progressPercent = 0;
label.innerText = score;
var gameOver = false;
var timeAlreadyCollected = false;

ctx.fillStyle = "#3C3C3C";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var interval;

const firebaseConfig = {
  apiKey: "AIzaSyBABLGPycL7g4gjKE3AwPb7fBKkdkq7JpA",
  authDomain: "gamez-98765.firebaseapp.com",
  databaseURL: "https://gamez-98765.firebaseio.com",
  projectId: "gamez-98765",
  storageBucket: "gamez-98765.appspot.com",
  messagingSenderId: "943968616256",
  appId: "1:943968616256:web:15a394e3357e3f5f5404a5",
  measurementId: "G-12KLQ8BKWK"
};

if (!firebase.apps.length) {
  firebase.initializeApp({});
}
var db = firebase.firestore();

function saveScore() {
  let name = document.getElementById("highScoreName").value;
  if (name == "") {
    alert("Please input a name");
  } else {
    db.collection("scores")
      .doc()
      .set({
        name: name,
        score: score
      })
      .then(function() {
        console.log("Document successfully written!");
        updateScores();
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }
  var highScore = false;

  db.collection("scores")
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().name == name && doc.data().score == score) {
          gotHighScoreMenu.innerHTML = "<h5>You got a high score!</h5>";
          highScore = true;
        }
      });
    });
  if (!highScore) {
    gotHighScoreMenu.innerHTML = "<p>Not a high score :(</p>";
  }
}

function updateScores() {
  // Clear current scores in our scoreboard
  document.getElementById("scoreboard").innerHTML =
    "<tr><th>Name</th><th>Score</th></tr>";

  // Get the top 5 scores from our scoreboard
  db.collection("scores")
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        document.getElementById("scoreboard").innerHTML +=
          "<tr>" +
          "<td>" +
          doc.data().name +
          "</td>" +
          "<td>" +
          doc.data().score +
          "</td>" +
          "</tr>";
      });
    });
}

class Sprite {
  constructor(canvas) {
    this.randomize();
    this.drawn = false;
  }
  randomize() {
    this.x = Math.floor(Math.random() * Math.floor(canvas.width - 30)) + 30;
    this.y = Math.floor(Math.random() * Math.floor(canvas.height - 30)) + 30;
  }
}
class Enemy extends Sprite {
  constructor(canvas) {
    super(canvas);
  }
  draw(ctx) {
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
class SpeedBoost extends Sprite {
  constructor(canvas) {
    super(canvas);
  }
  draw(ctx) {
    this.drawn = true;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
}
class TimeBoost extends Sprite {
  constructor(canvas) {
    super(canvas);
  }
  draw(ctx) {
    this.drawn = true;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
  }
}
class Ball {
  constructor(canvas, acceleration) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.acceleration = acceleration;
    this.speed = {
      x: 0,
      y: 0
    };
  }
  draw() {
    ctx.beginPath();
    this.x += this.speed["x"];
    this.y += this.speed["y"];
    if (this.y > canvas.height) {
      this.y = canvas.height;
    } else if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > canvas.width) {
      this.x = canvas.width;
    } else if (this.x < 0) {
      this.x = 0;
    }
    ctx.arc(this.x, this.y, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
  }
  move(e) {
    switch (e.keyCode) {
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
  stop(e) {
    switch (e.keyCode) {
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

function redraw(ball, enemy, timeBoost, speedBoost, timePassed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw(ctx);
  enemy.draw(ctx);

  if (timePassed > GAME_LENGTH / 2) {
    if (!timeAlreadyCollected) {
      timeBoost.draw(ctx);
    }
  }
  if (ball.acceleration != MAX_SPEED) speedBoost.draw(ctx);
}
function isColliding(usr, sprite) {
  if (
    usr.x - sprite.x < 25 &&
    usr.x - sprite.x > -25 &&
    usr.y - sprite.y < 25 &&
    usr.y - sprite.y > -25 &&
    sprite.drawn
  ) {
    sprite.drawn = false;
    return true;
  }
  return false;
}

function reset() {
  score = 0;
  timePassed = 1;
  progressPercent = 0;
  label.innerText = score;
  gameOver = false;
  timeAlreadyCollected = false;

  progressBar.className = "progress-bar";
  progressBar.innerHTML = GAME_LENGTH;
  progressBar.style.width = "100%";
}

function clock() {}

function update(enemy, ball, speedBoost, timeBoost) {
  redraw(ball, enemy, timeBoost, speedBoost, timePassed);
  if (isColliding(ball, enemy)) {
    score += 1;
    enemy.randomize();
    redraw(ball, enemy, timeBoost, speedBoost, timePassed);
  }
  if (isColliding(ball, speedBoost)) {
    ball.acceleration =
      ball.acceleration + 1 > MAX_SPEED ? MAX_SPEED : ball.acceleration + 1;
    speedBoost.randomize();
    redraw(ball, enemy, timeBoost, speedBoost, timePassed);
  }
  if (isColliding(ball, timeBoost)) {
    timePassed -= 5;
    timeAlreadyCollected = true;
    timeBoost.randomize();
    redraw(ball, enemy, timeBoost, speedBoost, timePassed);
  }
  label.innerText = score;
  spedometer.innerHTML = Math.round(Math.sqrt(
    ball.speed.x * ball.speed.x + ball.speed.y * ball.speed.y
  ));
  if (gameOver) {
    fadeIn(gameOverMenu);
    clearInterval(interval);
  }
}

function fadeIn(object) {
  var animate = setInterval(down, 5);
  posistion = -600;
  function down() {
    posistion += 3;
    object.style.transform = "TranslateY(" + posistion + "px)";
    if (posistion > 0) {
      clearInterval(animate);
    }
  }
}
function fadeOut(object) {
  var animate = setInterval(up, 5);
  posistion = 0;
  function up() {
    posistion -= 5;
    object.style.transform = "TranslateY(" + posistion + "px)";
    if (posistion < -600) {
      clearInterval(animate);
    }
  }
}

function revealNewMenu(code) {
  //code
  // 1: playMenu -> highScoreMenu
  // 2: gameOverMenu -> highScoreMenu
  // 3: highScoreMenu -> playMenu
  code == 1
    ? fadeOut(playMenu)
    : code == 2
    ? fadeOut(gameOverMenu)
    : fadeOut(highScoresMenu);
  setTimeout(delay, 500, code);
}
function delay(code) {
  code == 1 || code == 2 ? fadeIn(highScoresMenu) : fadeIn(playMenu);
}

function startGame(code) {
  reset();
  code == 1 ? fadeOut(playMenu) : fadeOut(gameOverMenu);
  var ball = new Ball(canvas, SPEED);
  var enemy = new Enemy(canvas);
  var speedBoost = new SpeedBoost(canvas);
  var timeBoost = new TimeBoost(canvas);
  window.addEventListener(
    "keydown",
    function(e) {
      ball.move(e);
    },
    false
  );

  window.addEventListener(
    "keyup",
    function(e) {
      ball.stop(e);
    },
    false
  );

  interval = setInterval(update, 20, enemy, ball, speedBoost, timeBoost);
  var gameActive = setInterval(function() {
    if (timePassed == GAME_LENGTH) {
      progressBar.className = "progress-bar bg-danger";
      progressBar.style.width = "100%";
      progressBar.innerHTML = 0;
      setTimeout(function() {
        clearInterval(gameActive);
        menuLabel.innerText = score;
        gotHighScoreMenu.innerHTML =
    "<div class='form-group'> <input type='text' class='form-control' id='highScoreName' placeholder='Enter name'> <button type='button' class='btn btn-primary btn-sm' style='margin-top: 5px;' onclick='saveScore()'>Submit</button></div>";
        gameOver = true;
      }, 650);
    } else {
      progressBar.innerHTML = GAME_LENGTH - timePassed;
      progressPercent = 100 - (timePassed / GAME_LENGTH) * 100;
      var percentWidth = Math.floor(progressPercent) + "%";
      progressBar.style.width = percentWidth;
      timePassed += 1;
    }
  }, 1000);
}

fadeIn(playMenu);

window.onload = updateScores();
