const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const giftBox = document.getElementById('giftBox');
const restartButton = document.getElementById('restartButton');
const collectSound = document.getElementById('collectSound');

let player = { x: 50, y: 50, width: 40, height: 40 };
let hearts = [];
let castle = { x: 720, y: 420, width: 60, height: 60 };
let keys = {};

let heartImg = new Image();
heartImg.src = 'heart.png';

let playerImg = new Image();
playerImg.src = 'Jacopo.png';

let castleImg = new Image();
castleImg.src = 'castle.png';

function spawnHearts() {
  hearts = [];
  for (let i = 0; i < 5; i++) {
    hearts.push({
      x: Math.random() * 740,
      y: Math.random() * 440,
      width: 30,
      height: 30,
      collected: false
    });
  }
}

function rectsCollide(r1, r2) {
  return !(
    r1.x + r1.width < r2.x ||
    r1.x > r2.x + r2.width ||
    r1.y + r1.height < r2.y ||
    r1.y > r2.y + r2.height
  );
}

function update() {
  let speed = 3;
  if (keys['ArrowUp']) player.y -= speed;
  if (keys['ArrowDown']) player.y += speed;
  if (keys['ArrowLeft']) player.x -= speed;
  if (keys['ArrowRight']) player.x += speed;

  hearts.forEach(h => {
    if (!h.collected && rectsCollide(player, h)) {
      h.collected = true;
      collectSound.play();
    }
  });

  let allCollected = hearts.every(h => h.collected);
  if (allCollected && rectsCollide(player, castle)) {
    giftBox.style.display = 'flex';
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  hearts.forEach(h => {
    if (!h.collected) {
      ctx.drawImage(heartImg, h.x, h.y, h.width, h.height);
    }
  });

  ctx.drawImage(castleImg, castle.x, castle.y, castle.width, castle.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function openGift() {
  alert('🎁 You got a surprise! Thank you for playing!');
}

restartButton.addEventListener('click', () => {
  player = { x: 50, y: 50, width: 40, height: 40 };
  spawnHearts();
  giftBox.style.display = 'none';
});

window.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
});

window.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// Start
spawnHearts();
gameLoop();
