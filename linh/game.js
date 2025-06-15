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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#a8d0a8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawPlayer() {
  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.fillStyle = '#702963';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

function drawCastle() {
  if (castleImg.complete) {
    ctx.drawImage(castleImg, castle.x, castle.y, castle.width, castle.height);
  } else {
    ctx.fillStyle = '#d36ba6';
    ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
  }
}

function drawHearts() {
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.font = '40px serif';
      ctx.shadowColor = 'rgba(255,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = 'red';
      ctx.fillText('❤️', h.x, h.y);
      ctx.shadowBlur = 0;
    }
  });
}

function updatePlayer() {
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // keep player inside canvas
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function checkHeartCollision() {
  hearts.forEach((h, index) => {
    if (!h.collected) {
      const heartRect = { x: h.x, y: h.y - 30, width: 40, height: 40 };
      const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };

      if (rectIntersect(heartRect, playerRect)) {
        h.collected = true;
        collected++;
        playSound();
        showMemory(index);
        if (collected === totalHearts) {
          messageDiv.innerText = "You collected all hearts! Go to the castle to unlock your gift!";
          giftBox.classList.remove('hidden');
        } else {
          messageDiv.innerText = `Hearts collected: ${collected} / ${totalHearts}`;
        }
      }
    }
  });
}

function rectIntersect(r1, r2) {
  return !(r2.x > r1.x + r1.width ||
           r2.x + r2.width < r1.x ||
           r2.y > r1.y + r1.height ||
           r2.y + r2.height < r1.y);
}

function playSound() {
  collectSound.currentTime = 0;
  collectSound.play();
}

function showMemory(index) {
  const mem = memories[index];
  memoryImage.src = mem.image;
  memoryText.textContent = mem.text;
  memoryOverlay.style.display = 'flex';
}

function hideMemory() {
  memoryOverlay.style.display = 'none';
}

function gameLoop() {
  drawBackground();
  drawCastle();
  drawHearts();
  drawPlayer();
  updatePlayer();
  checkHeartCollision();

  requestAnimationFrame(gameLoop);
}

// Start game
initializeGame();
gameLoop();

document.getElementById('restartButton').addEventListener('click', () => {
  initializeGame();
  messageDiv.innerText = '';
});
