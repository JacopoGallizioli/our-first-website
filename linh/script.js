const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bgImg = new Image();
const playerImg = new Image();
const castleImg = new Image();

bgImg.src = 'Forest.png';
playerImg.src = 'Jacopo.png';
castleImg.src = 'castle.png';

const collectSound = document.getElementById('collectSound');

let player, castle, hearts, collected, memoryIndex;
const keys = {};
const memories = [
  { text: "Our first year together 🌸", image: "1styear.JPG" },
  { text: "When I made you a surprise", image: "Vietnam1st.JPG" },
  { text: "That time we finally had electricity in the house after a week of blackout (and also we moved in together)", image: "Saronno.JPG" },
  { text: "We moved to Germany in 3rd year together 📸", image: "augsburg.jpeg" },
  { text: "We are staying in Munich and who knows where we will be next year", image: "Munich.jpeg" }
];

const totalHearts = memories.length;

const memoryOverlay = document.getElementById('memoryOverlay');
const memoryImage = document.getElementById('memoryImage');
const memoryText = document.getElementById('memoryText');
const closeMemoryBtn = document.getElementById('closeMemory');

const finalReward = document.getElementById('finalReward');
const finalRestartButton = document.getElementById('finalRestartButton');

document.addEventListener('keydown', e => {
  if (memoryOverlay.style.display === 'flex') {
    // Close memory popup with arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      hideMemory();
    }
  } else if (finalReward.style.display === 'flex') {
    // Do nothing or block keys while final reward is showing
  } else {
    keys[e.key] = true;
  }
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

closeMemoryBtn.addEventListener('click', hideMemory);

finalRestartButton.addEventListener('click', () => {
  hideFinalReward();
  initializeGame();
});

function initializeGame() {
  player = { x: 50, y: 200, width: 64, height: 64, speed: 3 };
  castle = { x: canvas.width - 128, y: canvas.height / 2 - 64, width: 128, height: 128 };
  hearts = [];
  collected = 0;
  memoryIndex = 0;

  for (let i = 0; i < totalHearts; i++) {
    hearts.push({
      x: Math.random() * (canvas.width - 40),
      y: Math.random() * (canvas.height - 40),
      size: 40,
      collected: false
    });
  }

  document.getElementById('message').innerText = '';
  document.getElementById('giftBox').style.display = 'none';
  hideMemory();
  hideFinalReward();
  canvas.style.filter = 'none';
}

function drawBackground() {
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawCastle() {
  ctx.drawImage(castleImg, castle.x, castle.y, castle.width, castle.height);
}

function drawHearts() {
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.fillStyle = '#ff4da6';
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.arc(h.x - 10, h.y - 10, 14, 0, Math.PI * 2);
      ctx.arc(h.x + 10, h.y - 10, 14, 0, Math.PI * 2);
      ctx.lineTo(h.x, h.y + 20);
      ctx.fill();
    }
  });
}

function showMemory(index) {
  memoryText.innerText = memories[index].text;
  memoryImage.src = memories[index].image;
  memoryOverlay.style.display = 'flex';
  canvas.style.filter = 'blur(3px)';
}

function hideMemory() {
  memoryOverlay.style.display = 'none';
  canvas.style.filter = 'none';
}

function showFinalReward() {
  finalReward.style.display = 'flex';
  canvas.style.filter = 'blur(3px)';
}

function hideFinalReward() {
  finalReward.style.display = 'none';
  canvas.style.filter = 'none';
}

function update() {
  if (memoryOverlay.style.display === 'flex' || finalReward.style.display === 'flex') {
    // Pause game update while overlays are shown
    return;
  }

  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // Boundaries
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Check collisions with hearts
  hearts.forEach((h, i) => {
    if (!h.collected && collision(player, {x: h.x, y: h.y, width: h.size, height: h.size})) {
      h.collected = true;
      collected++;
      collectSound.currentTime = 0;
      collectSound.play();
      showMemory(memoryIndex);
      memoryIndex++;
    }
  });

  // Check if player reached castle after collecting all hearts
  if (collected === totalHearts && collision(player, castle)) {
    showFinalReward();
  }
}

function collision(rect1, rect2) {
  const r2 = {
    x: rect2.x,
    y: rect2.y,
    width: rect2.width || rect2.size || 0,
    height: rect2.height || rect2.size || 0
  };

  return rect1.x < r2.x + r2.width &&
         rect1.x + rect1.width > r2.x &&
         rect1.y < r2.y + r2.height &&
         rect1.y + rect1.height > r2.y;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawCastle();
  drawHearts();
  drawPlayer();
  update();
  requestAnimationFrame(gameLoop);
}

initializeGame();
gameLoop();
