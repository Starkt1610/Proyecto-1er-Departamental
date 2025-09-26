// game.js

// Asegúrate de que las funciones API estén importadas
import { getLeaderboard, saveScore, clearScoresAPI } from './api.js';

// Si usas nombres diferentes en game.js, crea un alias (o renombra la función en api.js)
const getScoresAPI = getLeaderboard;
const saveScoreAPI = saveScore; 

// Cargar imágenes del jugador y obstáculos (RUTAS ORIGINALES RESTAURADAS)
const dinoImg = new Image();
dinoImg.src = 'assets/player/ufo.png'; 

const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacles/Pico.png'; 

const bgImg = new Image();
bgImg.src = 'assets/background/fondo.png';
const fgImg = new Image();
fgImg.src = 'assets/background/frente.png';

let bgX = 0; 
let fgX = 0; 

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const overlay = document.getElementById('overlay');
const finalScoreEl = document.getElementById('finalScore');
const finalLevelEl = document.getElementById('finalLevel');
const playerNameInput = document.getElementById('playerName');
const saveMsg = document.getElementById('saveMsg');
const leaderboardList = document.getElementById('leaderboard');

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const highscoreEl = document.getElementById('highscore');

const BASE_SPEED = 5;
let dino, obstacles, score, level, speed, frameCount, spawnInterval, lastSpawn;
let running = false;
let gameOver = false;
let highScore = parseInt(localStorage.getItem('highScore') || '0', 10);

function createDino() {
  const collisionRadius = 25; 
  return {
    x: 10,
    y: 120,
    width: 55, 
    height: 50,
    r: collisionRadius,
    vy: 10,
    jumping: false
  };
}

function resetGameState() {
  score = 0;
  level = 1;
  speed = BASE_SPEED;
  frameCount = 0;
  obstacles = [];
  lastSpawn = 0;
  spawnInterval = 40;
  gameOver = false;
  running = false;
  dino = createDino();
  playerNameInput.value = '';
  saveMsg.innerText = '';
  overlay.classList.add('hidden'); 
  scoreEl.innerText = 'Score: 0';
  levelEl.innerText = 'Nivel: 1';
  highscoreEl.innerText = 'Máx: ' + highScore;

  bgX = 0;
  fgX = 0;
}

function drawBackground() {
  const fgHeight = canvas.height * 0.6; 
  const fgY = canvas.height - fgHeight; 

  bgX -= speed * 0.2;
  fgX -= speed * 0.5;

  if (bgX <= -canvas.width) bgX = 0;
  if (fgX <= -canvas.width) fgX = 0;

  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

  ctx.drawImage(fgImg, fgX, fgY, canvas.width, fgHeight); 
  ctx.drawImage(fgImg, fgX + canvas.width, fgY, canvas.width, fgHeight); 
}

function drawDino() {
  ctx.drawImage(dinoImg, dino.x, dino.y, dino.width = 55, dino.height = 50);
}

function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  obstacles.forEach(obs => obs.x -= speed);

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
    const height = Math.floor(Math.random() * 30 + 20);
    const width = Math.floor(Math.random() * 20 + 20);
    const y = 200 - height;
    const obs = {
      x: canvas.width + 500,
      y,
      width,
      height,
      p1: { x: canvas.width + 500, y: y + height },
      p2: { x: canvas.width + 500 + width / 2, y: y },
      p3: { x: canvas.width + 500 + width, y: y + height }
    };
    obstacles.push(obs);
  }

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  obstacles.forEach(obs => {
    obs.p1.x = obs.x;
    obs.p2.x = obs.x + obs.width / 2;
    obs.p3.x = obs.x + obs.width;
  });
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      handleGameOver();
      break;
    }
  }
}

function handleGameOver() {
  gameOver = true;
  running = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
  overlay.classList.remove('hidden');
  document.getElementById('overlayTitle').innerText = 'Game Over';
  finalScoreEl.innerText = score;
  finalLevelEl.innerText = level;
}

function startGame() {
  resetGameState();
  running = true;
  requestAnimationFrame(loop);
}

function loop() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  dino.vy += 1.5;
  dino.y += dino.vy;
  if (dino.y > 150) {
    dino.y = 150;
    dino.jumping = false;
  }

  updateObstacles();
  checkCollision();
  drawObstacles();
  drawDino();

  score++;
  if (score % 500 === 0) {
    level++;
    speed += 0.5;
    if (spawnInterval > 40) spawnInterval -= 5;
  }

  scoreEl.innerText = 'Score: ' + score;
  levelEl.innerText = 'Nivel: ' + level;
  highscoreEl.innerText = 'Máx: ' + highScore;

  requestAnimationFrame(loop);
}

// controles
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !dino.jumping && running) {
    dino.vy = -20;
    dino.jumping = true;
  }
});

// Salto con CLIC/TOUCH
canvas.addEventListener('mousedown', (e) => {
  if (!dino.jumping && running) {
    dino.vy = -20;
    dino.jumping = true;
  }
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

async function renderLeaderboard() {
  const list = document.getElementById('leaderboard');
  list.innerHTML = ''; 
  const scores = await getScoresAPI(); // Llama a la API (servidor o local)
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  topScores.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Score: ${item.score} - Nivel: ${item.level}`;
    list.appendChild(li);
  });
}

document.getElementById('saveScoreBtn').addEventListener('click', async () => {
  const name = playerNameInput.value.trim() || 'Jugador';
  await saveScoreAPI(name, score, level); // Llama a la API (servidor o local)
  saveMsg.innerText = '¡Puntuación guardada!';
  renderLeaderboard(); 
});

async function resetLeaderboard() {
  localStorage.removeItem('highScore');
  highScore = 0; 

  const apiCleared = await clearScoresAPI(); // Llama a la API para borrar en el servidor

  await renderLeaderboard(); 

  highscoreEl.innerText = 'Máx: ' + highScore;
  if (apiCleared) {
    saveMsg.innerText = 'Puntajes (servidor y local) y Máximo reseteados.';
  } else {
    saveMsg.innerText = 'Máximo reseteado. Hubo un problema al borrar la lista en el servidor.';
  }
}

document.getElementById('resetLeaderboardBtn').addEventListener('click', () => {
  if (confirm('¿Estás seguro que quieres resetear el Máximo Score y la lista de puntajes? Esta acción es irreversible.')) {
    resetLeaderboard();
  }
});

// render inicial y estado inicial
renderLeaderboard();
resetGameState();