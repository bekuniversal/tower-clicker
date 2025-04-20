const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let blocks = [];
let score = 0;
let coins = parseInt(localStorage.getItem('coins')) || 0;
let time = 60;
let bonusTime = 5;
let mute = false;
let selectedSkin = localStorage.getItem('skin') || 'default';

// Звук
const clickSound = new Audio('assets/sounds/click.mp3');
const bonusSound = new Audio('assets/sounds/bonus.mp3');

// Скины
const SKINS = [
  { id: "default", name: "Classic Brick", price: 0, type: "base", img: "assets/blocks/default.png" },
  { id: "wood", name: "Wooden Block", price: 200, type: "normal", img: "assets/blocks/wood.png" },
  { id: "neon", name: "Neon Dream", price: 500, type: "normal", img: "assets/blocks/neon.png" },
  { id: "stone", name: "Stone Fort", price: 700, type: "normal", img: "assets/blocks/stone.png" },
  { id: "glass", name: "Glass House", price: 900, type: "normal", img: "assets/blocks/glass.png" },
  { id: "tech", name: "Tech Block", price: 1100, type: "normal", img: "assets/blocks/tech.png" },
  { id: "plant", name: "Bio Tower", price: 1300, type: "normal", img: "assets/blocks/plant.png" },
  { id: "gold", name: "Golden Empire", price: 0, type: "premium", img: "assets/blocks/gold.png" },
  { id: "crystal", name: "Crystal Core", price: 0, type: "premium", img: "assets/blocks/crystal.png" },
  { id: "dark", name: "Dark Matter", price: 0, type: "premium", img: "assets/blocks/dark.png" },
  { id: "rocket", name: "Rocket Stack", price: 0, type: "premium", img: "assets/blocks/rocket.png" },
  { id: "alien", name: "Alien Reactor", price: 0, type: "premium", img: "assets/blocks/alien.png" }
];

// Спавн блока
function spawnBlock() {
  const img = new Image();
  const skin = SKINS.find(s => s.id === selectedSkin);
  img.src = skin.img;
  blocks.push({ y: 600 - blocks.length * 40, img });
}

// Отрисовка блоков
function drawBlocks() {
  blocks.forEach(b => {
    ctx.drawImage(b.img, 160, b.y, 40, 40);
  });
}

// Обновить UI
function updateUI() {
  document.getElementById('score').innerText = `Score: ${score}`;
  document.getElementById('coins').innerText = `Coins: ${coins}`;
  document.getElementById('timer').innerText = time;
}

// Таймер
function tick() {
  time--;
  if (time <= 0) {
    alert("Game over!");
    if (score > (parseInt(localStorage.getItem('record')) || 0)) {
      localStorage.setItem('record', score);
    }
    localStorage.setItem('coins', coins);
    location.reload();
  }
  updateUI();
}

// Воспроизвести звук
function playClick() {
  if (!mute) clickSound.play();
}

// Клик по кнопке
document.getElementById('clickBtn').addEventListener('click', () => {
  score++;
  coins++;
  spawnBlock();
  playClick();
  if (score % 10 === 0) {
    time += Math.max(1, bonusTime);
    bonusTime = Math.max(1, bonusTime - 0.5);
    if (!mute) bonusSound.play();
  }
  updateUI();
});

// Переключатель звука
document.getElementById('muteBtn').addEventListener('click', () => {
  mute = !mute;
  document.getElementById('muteBtn').innerText = mute ? '🔇' : '🔊';
});

// Магазин скинов
document.getElementById('shopBtn').addEventListener('click', () => {
  document.getElementById('shop').classList.remove('hidden');
  const container = document.getElementById('skins-list');
  container.innerHTML = '';
  SKINS.forEach(skin => {
    const el = document.createElement('div');
    el.style.marginBottom = '10px';
    el.innerHTML = `
      <p><strong>${skin.name}</strong></p>
      <img src="${skin.img}" width="40"/>
      <br/>
      <button>${skin.type === 'premium' ? 'Купить 💰' :
        (selectedSkin === skin.id ? 'Установлен' :
        (coins >= skin.price ? `Купить за ${skin.price}` : 'Недостаточно монет'))}</button>
    `;
    
    el.querySelector('button').onclick = () => {
      if (skin.type === 'premium') {
        alert('Премиум-скины можно только за донат!');
      } else if (selectedSkin === skin.id) {
        alert('Скин уже активен!');
      } else if (coins >= skin.price) {
        coins -= skin.price;
        selectedSkin = skin.id;
        localStorage.setItem('skin', selectedSkin);
        localStorage.setItem('coins', coins);
        updateUI();
        alert(`Скин ${skin.name} активирован!`);
        closeShop();
      } else {
        alert('Недостаточно монет!');
      }
    };

    container.appendChild(el);
  });
});

// Закрыть магазин
function closeShop() {
  document.getElementById('shop').classList.add('hidden');
}

// Игровой цикл
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBlocks();
  requestAnimationFrame(gameLoop);
}

// Запуск
setInterval(tick, 1000);
updateUI();
gameLoop();
