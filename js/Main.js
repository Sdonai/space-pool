const NUMBER_OF_LIVES = 3;
const FULL_SIZE_CANVAS = true;
const DEBUG = true;
const MOTION_BLUR = !DEBUG;

// framerate-independent movement in ms 
const SIXTY_FPS_IN_MS = 16.666666;
const ALMOST_ZERO = 0.000001; // to avoid divide by zero
var timestampNow = 0; // when did this frame start?
var timestampPrev = 0; // when was the last frame?
var timestampDelta = 0; // elapsed time since last frame

var testingCheats = false;

var canvas, canvasContext;

var ship;
var score = 0;
var waves = 0;
var lives = NUMBER_OF_LIVES;
var showingTitleScreen = true;
var showingGameOverScreen = false;
var colliders = [];

var timesShotWrap=0;//used for Stats
var timesShot=0;//used for Stats
var avgTimesShotsWrapped=0;
var asteroidsHit=0;
var fuelUsed=0;
var accuracy=0;

window.onload = function() {
  if(testingCheats){
    console.log('CHEATS ENABLED SHIP WONT BE DESTROYED DIRECT SHOTS ENABLED, USE C TO TOGGLE');
  }
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  ship = new Ship();
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorText("LOADING IMAGES", canvas.width / 2, canvas.height / 2, 'white');
  loadImages();
  if (FULL_SIZE_CANVAS) {
    window.addEventListener("resize", onResize);
    onResize();
  }
};

function onResize() // full screen
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function imageLoadingDoneSoStartGame() {
  requestAnimationFrame(updateAll);
  setupInput();
  loadLevel();
}

function resetGame() {
  timestampNow = 0;
  timestampPrev = 0;
  timestampDelta = ALMOST_ZERO; 
  ship.xv = 0;
  ship.yv = 0;
  endScore = score;
  endWave = waves;
  score = 0;
  waves = 0;
  lives = 3;
  scoreMultiplier = 1;
  clearAllAsteroids();
  loadLevel();
  showingGameOverScreen = true;
}

function resetRound() {
  endScore = score;
  endWave = waves;
  scoreMultiplier = 1;
  clearAllAsteroids();
  loadLevel();
  showingGameOverScreen = true;
}

function loadLevel(whichLevel) {
  ship.reset(shipPic);
  spawnAndResetAsteroids();
}

function updateAll(now) {
  timestampPrev = timestampNow;
  timestampNow = now;
  timestampDelta = timestampNow - timestampPrev;
  // I am not sure if we need this line at all:
  if (timestampDelta <= 0) timestampDelta = ALMOST_ZERO; // avoid divide by 0 elsewhere?
  moveAll();
  drawAll();
  requestAnimationFrame(updateAll);
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

  if (MOTION_BLUR) {
    darkenRect(0, 0, canvas.width, canvas.height, "rgba(0,0,0,0.25)"); // transparent
  }
  else {
  	colorRect(0, 0, canvas.width, canvas.height, "black"); // opaque
  }

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
