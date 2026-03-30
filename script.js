// Target date: April 12 of this year at 09:00
const targetDate = new Date(new Date().getFullYear(), 3, 12, 9, 0, 0).getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("countdown-message");
const tulipGarden = document.getElementById("tulip-garden");

// Sprite sheet configuration
const tulipSprite = {
  imageUrl: "images/tulipeClosedAll_small.png",
  frameWidth: 74,
  frameHeight: 200,
  cols: 5,
  rows: 1,
};

// Positions of the 5 tulips in the sprite [column, row]
const tulipPositions = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
];

// Array that stores the chosen positions once and for all on load
let assignedPositions = [];

function calcTulipCount(daysLeft) {
  const maxTulips = Math.floor(
    window.innerWidth / (tulipSprite.frameWidth + 2)
  );
  const minTulips = 3;
  const revealDays = 30;
  let factor;
  if (daysLeft >= revealDays) {
    factor = 0;
  } else if (daysLeft <= 0) {
    factor = 1;
  } else {
    factor = 1 - daysLeft / revealDays;
  }
  return Math.round(minTulips + factor * (maxTulips - minTulips));
}

function renderTulipGarden(daysLeft) {
  if (!tulipGarden || tulipPositions.length === 0) return;

  const newCount = calcTulipCount(daysLeft);

  // On n'ajoute des tulipes que si le nombre augmente (jamais de reset)
  if (newCount <= assignedPositions.length) return;

  for (let i = assignedPositions.length; i < newCount; i++) {
    const randomPos =
      tulipPositions[Math.floor(Math.random() * tulipPositions.length)];
    assignedPositions.push(randomPos);

    const tulip = document.createElement("div");
    tulip.className = "tulip";
    const offsetX = -randomPos[0] * tulipSprite.frameWidth;
    tulip.style.backgroundPosition = `${offsetX}px 0px`;
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

// First immediate call, then every second
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
