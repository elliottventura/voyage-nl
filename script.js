// Date cible : 12 avril de cette année à 09:00
const targetDate = new Date(new Date().getFullYear(), 3, 12, 9, 0, 0).getTime();
// (Mois en JS : 0 = janvier, donc 3 = avril)[web:60][web:67]

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("countdown-message");

const countdownInterval = setInterval(updateCountdown, 1000);

// Configuration du sprite sheet
// Suppose que tu as 8 tulipes, chacune de 64px de large, alignées horizontalement
const tulipSprite = {
  imageUrl: "images/tulipeClosedAll_small.png",
  frameWidth: 74,   // largeur d'une tulipe en px
  frameHeight: 200,  // hauteur d'une tulipe en px
  cols: 5,          // nombre de tulipes côte à côte
  rows: 1           // nombre de lignes (1 si c'est une ligne, 2 si 2x4, etc.)
};

// Positions des tulipes (chaque entrée = [colonne, ligne])
const tulipPositions = [
  [0, 0], // tulipe 1
  [1, 0], // tulipe 2
  [2, 0], // tulipe 3
  [3, 0], // tulipe 4
  [4, 0], // tulipe 5
];
const tulipGarden = document.getElementById("tulip-garden");

function createTulipElement(posX, posY) {
  const tulip = document.createElement("div");
  tulip.className = "tulip";
  
  // Calculer le positionnement dans le sprite
  const offsetX = -posX * tulipSprite.frameWidth;
  const offsetY = -posY * tulipSprite.frameHeight;
  
  tulip.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  
  return tulip;
}

function renderTulipGarden(daysLeft) {
  if (!tulipGarden || tulipPositions.length === 0) return;

  tulipGarden.innerHTML = "";

  const maxTulips = 40;
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

  const tulipCount = Math.round(minTulips + factor * (maxTulips - minTulips));

  for (let i = 0; i < tulipCount; i++) {
    // Choisir une position aléatoire dans le sprite
    const randomPos = tulipPositions[Math.floor(Math.random() * tulipPositions.length)];
    const tulipEl = createTulipElement(randomPos[0], randomPos[1]);
    tulipGarden.appendChild(tulipEl);
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
    if (messageEl) {
      messageEl.textContent = "C’est le grand jour ! ✨";
    }
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

updateCountdown();
