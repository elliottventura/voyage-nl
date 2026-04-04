// Target date: April 12 of this year at 09:00
const targetDate = new Date(new Date().getFullYear(), 3, 12, 9, 0, 0).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("countdown-message");
const tulipGarden = document.getElementById("tulip-garden");

// Sprite sheet configurations (original/real size)
const tulipSpriteClosed = {
  imageUrl: "images/tulipeClosedAll_small.png",
  frameWidth: 74,
  frameHeight: 200,
  cols: 5,
  rows: 1,
  totalWidth: 370,
  totalHeight: 200,
};

const tulipSpriteOpened = {
  imageUrl: "images/tulipeOpenedAll_small.png",
  frameWidth: 103,
  frameHeight: 200,
  cols: 5,
  rows: 1,
  totalWidth: 515,
  totalHeight: 200,
};

// Positions of the 5 tulips in the sprite [column, row]
const tulipPositions = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
];

// Array that stores tulip data: { spriteColumn, row, left, type }
let assignedTulips = [];

function getRandomTulipType() {
  return Math.random() < 0.5 ? "closed" : "opened";
}

function getTulipSprite(type) {
  return type === "opened" ? tulipSpriteOpened : tulipSpriteClosed;
}

function calcTulipCount(daysLeft) {
  const revealDays = 30;
  const minTulips = 10; // Start with 10 tulips
  const maxTulips = 80; // Can go up to 80 tulips

  let factor;
  if (daysLeft >= revealDays) {
    factor = 0;
  } else if (daysLeft <= 0) {
    factor = 1;
  } else {
    factor = 1 - daysLeft / revealDays;
  }

  const targetCount = Math.round(minTulips + factor * (maxTulips - minTulips));

  // Ensure at least 20 tulips at 12 days or less
  if (daysLeft <= 12 && targetCount < 20) {
    return 20;
  }

  return targetCount;
}

function renderTulipGarden(daysLeft) {
  if (!tulipGarden || tulipPositions.length === 0) return;

  const newCount = calcTulipCount(daysLeft);

  // Only add tulips if count increases (never reset)
  if (newCount <= assignedTulips.length) return;

  const tulipHeight = 100;
  const rowHeight = 50; // Space between rows (includes some overlap)
  const gardenWidth = window.innerWidth;
  const rows = 3;

  for (let i = assignedTulips.length; i < newCount; i++) {
    // Random sprite column (0-4)
    const spriteColumn = Math.floor(Math.random() * tulipPositions.length);

    // Random row assignment (0, 1, 2)
    const row = Math.floor(Math.random() * rows);

    // Random left position within garden width (allowing overflow for natural field effect)
    const maxLeft = gardenWidth;
    const left = Math.random() * maxLeft;

    // Randomly choose between closed and opened tulips
    const type = getRandomTulipType();
    const sprite = getTulipSprite(type);

    assignedTulips.push({ spriteColumn, row, left, type });

    const tulip = document.createElement("div");
    tulip.className = type === "opened" ? "tulip tulip-opened" : "tulip";

    // Set absolute positioning
    tulip.style.left = `${left}px`;
    tulip.style.bottom = `${row * rowHeight}px`; // Stack rows from bottom: row 0 at bottom, row 2 higher

    // Z-index: back row (2) lowest, front row (0) highest
    // Add small random variation for natural overlap sorting
    const baseZIndex = (rows - 1 - row) * 100;
    tulip.style.zIndex = baseZIndex + Math.floor(Math.random() * 10);

    // Background image and position based on sprite type and column
    tulip.style.backgroundImage = `url("${sprite.imageUrl}")`;
    // Calculate background position to show the selected frame
    const offsetX = -spriteColumn * sprite.frameWidth;
    tulip.style.backgroundPosition = `${offsetX}px 0px`;
    tulip.style.backgroundSize = `${sprite.totalWidth}px ${sprite.totalHeight}px`;

    tulipGarden.appendChild(tulip);
  }
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    if (messageEl) messageEl.textContent = "It's the big day! ✨";
    renderTulipGarden(0);
    clearInterval(countdownInterval);
    return;
  }

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const days = Math.floor(distance / oneDay);
  const hours = Math.floor((distance % oneDay) / oneHour);
  const minutes = Math.floor((distance % oneHour) / oneMinute);
  const seconds = Math.floor((distance % oneMinute) / oneSecond);

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  renderTulipGarden(days);
}

// Handle window resize to adjust tulip count and sizing
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Clear existing tulips and recalculate with new dimensions
    tulipGarden.innerHTML = "";
    assignedTulips = [];
    const now = new Date().getTime();
    const distance = targetDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    renderTulipGarden(days >= 0 ? days : 0);
  }, 150); // Debounce to avoid excessive recalculations
});

// First immediate call, then every second
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
