const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bgImg = new Image();
const playerImg = new Image();
const castleImg = new Image();

bgImg.src = 'Forest.png';
playerImg.src = 'Jacopo.png';
castleImg.src = 'castle.png';

const collectSound = document.getElementById('collectSound');

const memories = [
  { text: "Our first year together 🌸", image: "1styear.JPG" },
  { text: "When I made you a surprise", image: "Vietnam1st.JPG" },
  { text: "That time we finally had electricity in the house after a week of blackout", image: "Saronno.JPG" },
  { text: "We moved to Germany 📸", image: "augsburg.jpeg" },
  { text: "We're in Munich now ❤️", image: "Munich.jpeg" }
];

const totalHearts = memories.length;

let player, castle, hearts, collected, memoryIndex;
const keys = {};

const memoryOverlay = document.getElementById('memoryOverlay');
const memoryImage = document.getElementById('memoryImage');
const memoryText = document.getElementById('memoryText');
const closeMemoryBtn = document.getElementById('closeMemory');
const messageDiv = document.getElementById('message');
const giftBox = document.getElementById('giftBox');
const openGiftBtn = document.getElementById('openGiftBtn');

document.addEventListener('keydown', e => {
  if (memoryOverlay.style.display === 'flex') {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) {
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

openGiftBtn.addEventListener('click', () => {
  alert("🎁 Here's your surprise! I love you so much! 💌");
});

function initializeGame() {
  player = { x: 50, y: 200, width: 64, height: 64, speed: 4 };
  castle = { x: canvas.width - 140, y: canvas.height / 2 - 64, width: 128, height: 128 };
  collected = 0;
  memoryIndex = 0;
  messageDiv.innerText = '';
  giftBox.classList.add('hidden');
  hideMemory();

  // Hearts array with x,y and collected flag
  hearts = [];
  for (let i = 0; i < totalHearts; i++) {
    hearts.push({
      x: 100 + i * 120, // spread hearts horizontally
      y: 100 + (i % 2) * 120, // alternate row
      size: 30,
      collected: false
    });
  }
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
      ctx.font = '30px serif';
      ctx.fillStyle = 'red';
      ctx.fillText('❤️', h.x, h.y);
    }
  });
}

function showMemory(index) {
  if(index < memories.length){
    memoryText.innerText = memories[index].text;
    memoryImage.src = memories[index].image;
    memoryOverlay.style.display = 'flex';
    canvas.style.filter = 'blur(3px)';
  }
}

function hideMemory() {
  memoryOverlay.style.display = 'none';
  canvas.style.filter = 'none';
}

function rectanglesOverlap(r1, r2) {
  return !(r2.x > r1.x + r1.width || 
           r2.x + r2.width < r1.x || 
           r2.y > r1.y + r1.height ||
           r2.y + r2.height < r1.y);
}

function update() {
  if (memoryOverlay.style.display === 'flex') return;

  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // Keep player inside canvas
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Check collision with hearts
  hearts.forEach((h, i) => {
    if (!h.collected) {
      const heartRect = { x: h.x - 20, y: h.y - 30, width: 30, height: 30 };
      if (rectanglesOverlap(player, heartRect)) {
        h.collected = true;
        collected++;
        collectSound.currentTime = 0;
        collectSound.play();
        showMemory(memoryIndex);
        memoryIndex++;
      }
    }
  });

  // Check if all hearts collected and near castle
  if (collected === totalHearts) {
    const castleRect = castle;
    if (rectanglesOverlap(player, castleRect)) {
      messageDiv.innerText = "You made it to the castle with all the hearts! 💖";
      giftBox.classList.remove('hidden');
      canvas.style.filter = 'blur(3px)';
    }
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

document.getElementById('restartButton').addEventListener('click', () => {
  initializeGame();
  canvas.style.filter = 'none';
  messageDiv.innerText = '';
  giftBox.classList.add('hidden');
});

let loadedImages = 0;
function imageLoaded() {
  loadedImages++;
  if (loadedImages === 3) {
    initializeGame();
    gameLoop();
  }
}

bgImg.onload = imageLoaded;
playerImg.onload = imageLoaded;
castleImg.onload = imageLoaded;
