const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSize = 64;
const heartSize = 30;
const castleSize = 120;

let player = { x: 50, y: 200, width: playerSize, height: playerSize, speed: 4 };
const castle = { x: canvas.width - castleSize - 30, y: canvas.height/2 - castleSize/2, width: castleSize, height: castleSize };

const memories = [
  { text: "Our first year together 🌸", image: "1styear.JPG" },
  { text: "When I made you a surprise", image: "Vietnam1st.JPG" },
  { text: "Blackout & moved in together", image: "Saronno.JPG" },
  { text: "Moved to Germany 📸", image: "augsburg.jpeg" },
  { text: "Now in Munich! ✨", image: "Munich.jpeg" }
];

let hearts = [];
let collected = 0;
let memoryIndex = 0;
const keys = {};

const memoryOverlay = document.getElementById('memoryOverlay');
const memoryImage = document.getElementById('memoryImage');
const memoryText = document.getElementById('memoryText');
const closeMemoryBtn = document.getElementById('closeMemory');

const giftContainer = document.getElementById('giftContainer');
const openGiftBtn = document.getElementById('openGiftBtn');
const restartBtn = document.getElementById('restartBtn');

const message = document.getElementById('message');

const collectSound = document.getElementById('collectSound');

// Load player and castle images
const playerImg = new Image();
playerImg.src = 'Jacopo.png'; // Replace with your character image filename

const castleImg = new Image();
castleImg.src = 'castle.png'; // Replace with your castle image filename

document.addEventListener('keydown', (e) => {
  if(memoryOverlay.style.display === 'flex' || giftContainer.style.display === 'flex') return;
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

closeMemoryBtn.onclick = () => {
  memoryOverlay.style.display = 'none';
  canvas.style.filter = 'none';
  message.innerText = '';
};

restartBtn.onclick = () => {
  giftContainer.style.display = 'none';
  initializeGame();
  message.innerText = '';
};

openGiftBtn.onclick = () => {
  alert('🎁 Surprise! Thank you for playing! 🎉');
};

function initializeGame() {
  player.x = 50;
  player.y = 200;
  collected = 0;
  memoryIndex = 0;
  hearts = [];

  for(let i = 0; i < memories.length; i++) {
    hearts.push({
      x: Math.random() * (canvas.width - heartSize - 100) + 50,
      y: Math.random() * (canvas.height - heartSize - 50) + 50,
      collected: false
    });
  }

  memoryOverlay.style.display = 'none';
  giftContainer.style.display = 'none';
  canvas.style.filter = 'none';
  message.innerText = '';
}

function drawPlayer() {
  if(playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    // fallback rectangle if image not loaded
    ctx.fillStyle = '#900c3f';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

function drawCastle() {
  if(castleImg.complete) {
    ctx.drawImage(castleImg, castle.x, castle.y, castle.width, castle.height);
  } else {
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
  }
}

function drawHearts() {
  hearts.forEach(h => {
    if(!h.collected) {
      ctx.fillStyle = '#ff4da6';
      ctx.beginPath();
      ctx.arc(h.x + heartSize/2, h.y + heartSize/2, heartSize/2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function collision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function update() {
  if(memoryOverlay.style.display === 'flex' || giftContainer.style.display === 'flex') return;

  if(keys['ArrowUp']) player.y -= player.speed;
  if(keys['ArrowDown']) player.y += player.speed;
  if(keys['ArrowLeft']) player.x -= player.speed;
  if(keys['ArrowRight']) player.x += player.speed;

  // Keep player inside canvas
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Check collision with hearts
  hearts.forEach((h, idx) => {
    if(!h.collected && collision(player, {x: h.x, y: h.y, width: heartSize, height: heartSize})) {
      h.collected = true;
      collected++;
      collectSound.currentTime = 0;
      collectSound.play();
      showMemory(memoryIndex);
      memoryIndex++;
      message.innerText = `Hearts collected: ${collected}/${memories.length}`;
    }
  });

  // Check if all hearts collected and player reached castle
  if(collected === memories.length && collision(player, castle)) {
    showGiftAndRestart();
  }
}

function showMemory(idx) {
  memoryText.innerText = memories[idx].text;
  memoryImage.src = memories[idx].image;
  memoryOverlay.style.display = 'flex';
  canvas.style.filter = 'blur(3px)';
}

function showGiftAndRestart() {
  giftContainer.style.display = 'flex';
  canvas.style.filter = 'blur(3px)';
  message.innerText = 'You collected all hearts and reached the castle! 🎉';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCastle();
  drawHearts();
  drawPlayer();

  update();

  requestAnimationFrame(gameLoop);
}

initializeGame();
gameLoop();
