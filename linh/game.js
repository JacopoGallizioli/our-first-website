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

document.addEventListener('keydown', e => {
  if (memoryOverlay.style.display === 'flex') {
    // If memory popup is showing, allow arrow keys to close it
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
      ctx.fillStyle = 'pink';
      ctx.beginPath();
      ctx.moveTo(h.x + h.size / 2, h.y + h.size / 5);
      ctx.bezierCurveTo(h.x + h.size / 2, h.y, h.x, h.y, h.x, h.y + h.size / 3);
      ctx.bezierCurveTo(h.x, h.y + h.size * 0.7, h.x + h.size / 2, h.y + h.size, h.x + h.size / 2, h.y + h.size);
      ctx.bezierCurveTo(h.x + h.size / 2, h.y + h.size, h.x + h.size, h.y + h.size * 0.7, h.x + h.size, h.y + h.size / 3);
      ctx.bezierCurveTo(h.x + h.size, h.y, h.x + h.size / 2, h.y, h.x + h.size / 2, h.y + h.size / 5);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function rectsOverlap(r1, r2) {
  return !(r2.x > r1.x + r1.width ||
           r2.x + r2.width < r1.x ||
           r2.y > r1.y + r1.height ||
           r2.y + r2.height < r1.y);
}

function update() {
  // Move player with arrow keys or WASD
  if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
  if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

  // Boundaries check
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Check collisions with hearts
  hearts.forEach((h, i) => {
    if (!h.collected) {
      const heartRect = { x: h.x, y: h.y, width: h.size, height: h.size };
      const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };

      if (rectsOverlap(playerRect, heartRect)) {
        h.collected = true;
        collected++;
        collectSound.currentTime = 0;
        collectSound.play();
        showMemory(memoryIndex);
        memoryIndex++;
      }
    }
  });

  // If all hearts collected and player reaches castle, show gift box
  if (collected === totalHearts) {
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const castleRect = { x: castle.x, y: castle.y, width: castle.width, height: castle.height };

    if (rectsOverlap(playerRect, castleRect)) {
      document.getElementById('message').innerText = "You reached the castle! Open your gift!";
      document.getElementById('giftBox').style.display = 'block';
      // Stop game loop by not calling update anymore or disabling keys (optional)
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawCastle();
  drawHearts();
  drawPlayer();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function showMemory(index) {
  if (index >= memories.length) return;
  memoryImage.src = memories[index].image;
  memoryText.innerText = memories[index].text;
  memoryOverlay.style.display = 'flex';
}

function hideMemory() {
  memoryOverlay.style.display = 'none';
}

function openGift() {
  alert("🎉 Congratulations! Here's your special surprise! 🎉");
}

document.getElementById('restartButton').addEventListener('click', () => {
  initializeGame();
});

memoryOverlay.addEventListener('click', (e) => {
  if (e.target === memoryOverlay) hideMemory();
});

// Start the game once all images are loaded
let imagesLoaded = 0;
const totalImages = 3;

[bgImg, playerImg, castleImg].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      initializeGame();
      gameLoop();
    }
  };
});
