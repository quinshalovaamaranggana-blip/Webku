
const spaceshipCards = [
  "🚀", "🛸", "🌎", "🌙", "⭐",
  "☄️", "👽", "🪐", "🌌", "🛰️"
];

const gameBoard = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const pairsDisplay = document.getElementById("pairs");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;

// Mengacak posisi kartu
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// Memulai permainan baru
function startGame() {
  clearInterval(timerInterval);

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  gameStarted = false;

  movesDisplay.textContent = "0";
  pairsDisplay.textContent = "0";
  timerDisplay.textContent = "0";
  messageDisplay.textContent = "";

  gameBoard.innerHTML = "";

  // Setiap emoji dibuat menjadi dua kartu
  const cards = shuffle([
    ...spaceshipCards,
    ...spaceshipCards
  ]);

  cards.forEach((emoji) => {
    const card = document.createElement("button");

    card.type = "button";
    card.classList.add("card");
    card.textContent = "❔";
    card.dataset.value = emoji;
    card.setAttribute("aria-label", "Kartu tertutup");

    card.addEventListener("click", () => {
      flipCard(card);
    });

    gameBoard.appendChild(card);
  });
}

// Menjalankan timer saat kartu pertama dibuka
function startTimer() {
  if (gameStarted) return;

  gameStarted = true;

  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = seconds;
  }, 1000);
}

// Membuka kartu
function flipCard(card) {
  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("matched") ||
    card.classList.contains("flipped")
  ) {
    return;
  }

  startTimer();

  card.textContent = card.dataset.value;
  card.classList.add("flipped");
  card.setAttribute("aria-label", card.dataset.value);

  if (firstCard === null) {
    firstCard = card;
    return;
  }

  secondCard = card;

  // Satu langkah dihitung setiap dua kartu dibuka
  moves++;
  movesDisplay.textContent = moves;

  checkMatch();
}

// Memeriksa kecocokan kartu
function checkMatch() {
  const isMatch =
    firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.disabled = true;
    secondCard.disabled = true;

    firstCard = null;
    secondCard = null;

    matchedPairs++;
    pairsDisplay.textContent = matchedPairs;

    // Jika seluruh pasangan ditemukan
    if (matchedPairs === spaceshipCards.length) {
      clearInterval(timerInterval);

      messageDisplay.textContent =
        `🎉 Misi berhasil! Semua pasangan ditemukan dalam ` +
        `${moves} langkah dan ${seconds} detik! 🚀`;
    }
  } else {
    // Kunci papan sementara agar tidak bisa membuka kartu lain
    lockBoard = true;

    setTimeout(() => {
      firstCard.textContent = "❔";
      secondCard.textContent = "❔";

      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      firstCard.setAttribute("aria-label", "Kartu tertutup");
      secondCard.setAttribute("aria-label", "Kartu tertutup");

      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 800);
  }
}

// Tombol untuk mengulang permainan
restartBtn.addEventListener("click", startGame);

// Jalankan permainan saat halaman dibuka
startGame();
