const NUMBER_OF_LIVES = 3;

var canvas, canvasContext;

var ship;
var score = 0;
var waves = 0;
var lives = NUMBER_OF_LIVES;
var showingTitleScreen = true;
var showingGameOverScreen = false;
var colliders = [];

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  ship = new Ship();
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorText("LOADING IMAGES", canvas.width / 2, canvas.height / 2, 'white');
  loadImages();
};

function imageLoadingDoneSoStartGame() {
  var framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);
  setupInput();
  loadLevel();
}

function resetGame() {
  endScore = score;
  endWave = waves;
  score = 0;
  waves = 0;
  lives = 3;
  scoreMultiplier = 1;
  clearAllAsteroids(colliders);
  loadLevel();
  showingGameOverScreen = true;
}

function resetRound() {
  endScore = score;
  endWave = waves;
  scoreMultiplier = 1;
  clearAllAsteroids(colliders);
  loadLevel();
  showingGameOverScreen = true;
}

function loadLevel(whichLevel) {
  ship.reset(shipPic);
  spawnAndResetAsteroids();
}

function updateAll() {
  moveAll();
  drawAll();
}

function moveAll() {
  if (showingGameOverScreen) {
    return;
  }
  else if (showingTitleScreen) {
    return
  }
  sweepAsteroidsReadyForRemoval();
  ship.move(colliders);
  moveAsteroids();
}

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (showingTitleScreen) {
    titleScreen();
  }
  else if (showingGameOverScreen) {
    gameOverScreen();
  }
  else {
    drawUI();
    ship.draw();
    drawAsteroids();
  }
}
