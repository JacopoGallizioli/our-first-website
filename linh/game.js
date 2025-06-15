const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bgImg = new Image();
const playerImg = new Image();
const castleImg = new Image();

bgImg.src = 'Forest.png'; // Your forest background
playerImg.src = 'Jacopo.png'; // Your character
castleImg.src = 'castle.png'; // Your castle

const collectSound = document.getElementById('collectSound');

let player, castle, hearts, collected, memoryIndex;
const keys = {};
const memories = [
  { text: "Our first year together 🌸", image: "1styear.JPG" },
  { text: "When I made you a surprise", image: "Vietnam1st.JPG" },
  { text: "That time we finally had electricity in the house after a week of blackout", image: "Saronno.JPG" },
  { text: "We moved to Germany 📸", image: "augsburg.jpeg" },
  { text: "We're in Munich now ❤️", image: "Munich.jpeg" }
];

const totalHearts = memories.length;

const memoryOverlay = document.getElementById('memoryOverlay');
const memoryImage = document.getElementById('memoryImage');
const memoryText = document.getElementById('memoryText');
const closeMemoryBtn = document.getElementById('closeMemory');

document.addEventListener('keydown', e => {
  if (memoryOverlay.style.display === 'flex') {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      hideMemory();
    }
  } else {
    keys[e.key] = true;
  }
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

closeMemoryBtn.addEventListener('click', hideMemory);

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
  canvas.style.filter = 'none';
}

function drawBackground() {
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

function update() {
  if (memoryOverlay.style.display === 'flex') return;

  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  hearts.forEach((h, i) => {
    if (!h.collected &&
        player.x < h.x + h.size &&
        player.x + player.width > h.x &&
        player.y < h.y + h.size &&
        player.y + player.height > h.y) {
      h.collected = true;
      collectSound.play();
      showMemory(memoryIndex);
      memoryIndex++;
      collected++;
    }
  });

  if (collected === totalHearts &&
      player.x + player.width > castle.x &&
      player.x < castle.x + castle.width &&
      player.y + player.height > castle.y &&
      player.y < castle.y + castle.height) {
    document.getElementById('message').innerText = 'You made it to the castle with all the hearts! 💖';
    canvas.style.filter = 'blur(3px)';
    document.getElementById('giftBox').style.display = 'block';
  }
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

function openGift() {
  alert("🎁 Here's your surprise! I love you so much! 💌");
}

document.getElementById('restartButton').addEventListener('click', () => {
  initializeGame();
});

let loaded = 0;
const totalImages = 3;
function checkAllLoaded() {
  loaded++;
  if (loaded === totalImages) {
    initializeGame();
    gameLoop();
  }
}

bgImg.onload = checkAllLoaded;
playerImg.onload = checkAllLoaded;
castleImg.onload = checkAllLoaded;
