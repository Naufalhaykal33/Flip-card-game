const startBtn = document.getElementById("startBtn");
const exitBtn = document.getElementById("exitBtn");
const confirmModal = document.getElementById("confirm-exit");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const playAgainBtn = document.getElementById("playAgainBtn");
const backBtn = document.getElementById("backBtn");
const difficulty = document.getElementById("difficulty");

let moves = 0;
const moveCounter = document.getElementById("moveCounter");
const movesLeftText = document.getElementById("movesLeft");

let maxMoves = 0;
const retryBtn = document.getElementById("retryBtn");
const backMenuBtn = document.getElementById("backMenuBtn");

const clickSound = new Audio("sound/klik.wav");
const flipSound = new Audio("sound/flip.wav");
const matchSound = new Audio("sound/match.wav");
const winSound = new Audio("sound/win.wav");
const loseSound = new Audio("sound/lose.wav");
clickSound.volume = 0.5;
flipSound.volume = 0.6;
matchSound.volume = 0.4;
winSound.volume = 1;
loseSound.volume = 1;
const bgMusic = new Audio("sound/background.wav");
bgMusic.loop = true;
bgMusic.volume = 0.3;

const board = document.getElementById("board");
const totalWinText = document.getElementById("totalWin");

let soundEnabled = true;
let currentDifficulty = "easy";
const allCards = [
"🍎",
"🍌",
"🍇",
"🍓",
"🍒",
"🍍",
"🥝",
"🍉"
];
let cards = [];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;

loadWin();

playSound(clickSound);

const toggleBtn = document.getElementById("toggleSound");

toggleBtn.addEventListener("click", () => {

  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    toggleBtn.innerText = "🔊 Sound ON";
    playMusic();
  } else {
    toggleBtn.innerText = "🔇 Sound OFF";
    stopMusic();
  }

  localStorage.setItem("sound", soundEnabled);
});

function loadSoundSetting() {
  const saved = localStorage.getItem("sound");

  if (saved !== null) {
    soundEnabled = JSON.parse(saved);
  }

  if (soundEnabled) {
    toggleBtn.innerText = "🔊 Sound ON";
    playMusic();
  } else {
    toggleBtn.innerText = "🔇 Sound OFF";
  }
}

loadSoundSetting();

function showScreen(id){

  const screens = document.querySelectorAll(".screen");
  screens.forEach(screen=>{
    screen.style.display="none";
  });

  document.getElementById(id).style.display="block";
}

startBtn.addEventListener("click",()=>{
  clickSound.currentTime = 0;
  clickSound.play();
  startGame();
  showScreen("game-screen");
});

exitBtn.addEventListener("click",()=>{
  clickSound.currentTime = 0;
  clickSound.play();
  confirmModal.style.display = "flex";
});

confirmYes.addEventListener("click",()=>{
  confirmModal.style.display = "none";
  clickSound.currentTime = 0;
  clickSound.play();
  showScreen("start-screen");
});

confirmNo.addEventListener("click",()=>{
  confirmModal.style.display = "none";
  clickSound.currentTime = 0;
  clickSound.play();
});

playAgainBtn.addEventListener("click",()=>{
  clickSound.currentTime = 0;
  clickSound.play();
  startGame();
  showScreen("game-screen");
});

backBtn.addEventListener("click",()=>{
  clickSound.currentTime = 0;
  clickSound.play();
  showScreen("start-screen");
});

retryBtn.addEventListener("click", () => {
  playSound(clickSound);
  startGame();
  showScreen("game-screen");
});

backMenuBtn.addEventListener("click", () => {
  playSound(clickSound);
  showScreen("start-screen");
});

function playSound(sound) {
  if (!soundEnabled) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function playMusic() {
  if (soundEnabled) {
    bgMusic.play().catch(() => {});
  }
}

function stopMusic() {
  bgMusic.pause();
}

function vibrate(ms = 100) {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

function startGame(){

  moves = 0;

  firstCard=null;
  secondCard=null;
  lockBoard=false;
  matchedCount=0;

  moveCounter.innerText = moves;
  const pairs = parseInt(difficulty.value) || 4;

  // 🎯 set difficulty + max moves
  if(pairs === 4){
    currentDifficulty = "easy";
    maxMoves = 10;
  }

  if(pairs === 6){
    currentDifficulty = "medium";
    maxMoves = 18;
  }

  if(pairs === 8){
    currentDifficulty = "hard";
    maxMoves = 26;
  }

  generateCards(pairs);
  updateGrid();
  shuffleCards();
  renderCards();
}

function generateCards(pairs){

  cards = [];

  for(let i=0;i<pairs;i++){

    cards.push(allCards[i]);
    cards.push(allCards[i]);

  }

}
function updateGrid(){

  const total = cards.length;

  if(total === 8){
    board.style.gridTemplateColumns = "repeat(4,100px)";
  }

  if(total === 12){
    board.style.gridTemplateColumns = "repeat(4,100px)";
  }

  if(total === 16){
    board.style.gridTemplateColumns = "repeat(4,100px)";
  }

}
function shuffleCards(){

  for(let i=cards.length-1;i>0;i--){

    let j=Math.floor(Math.random()*(i+1));

    [cards[i],cards[j]]=[cards[j],cards[i]];
  }
}

function renderCards(){

  board.innerHTML="";

  cards.forEach((card)=>{

    const div=document.createElement("div");
    div.classList.add("card");
    div.dataset.card=card;

    div.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${card}</div>
      </div>
    `;

    div.addEventListener("click",handleCardClick);

    board.appendChild(div);

  });

}

function handleCardClick(){

  flipSound.currentTime = 0;
  flipSound.play();
  if(lockBoard) return;

  if(this.classList.contains("matched")) return;

  if(this===firstCard) return;

  this.classList.add("flip");

  if(!firstCard){

    firstCard=this;
    return;

  }
moves++;
moveCounter.innerText = moves;
  secondCard=this;
  let sisa = maxMoves - moves;
movesLeftText.innerText = sisa;
checkLose(); // 🔥 pindahkan ke sini (langsung cek setiap move)

  checkMatch();
}

function checkMatch(){

  if(firstCard.dataset.card===secondCard.dataset.card){

    matchSound.currentTime = 0;
    matchSound.play();
    vibrate(100);

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    void firstCard.offsetWidth; // trick reflow
    void secondCard.offsetWidth;

    // tambahkan lagi biar animasi jalan
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedCount+=2;

    resetTurn();
    checkWin();

  }else{

    lockBoard=true;

    setTimeout(()=>{

      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");

      resetTurn();

    },800);

  }
  
}

function resetTurn(){
  firstCard=null;
  secondCard=null;
  lockBoard=false;
}

function checkWin(){

  if(matchedCount===cards.length){

    winSound.currentTime = 0;
    winSound.play();
    vibrate(100);

    saveWin();

    document.querySelector("#win-screen h2").innerText =
  `Kamu Menang dalam ${moves} langkah! 🎉`;
  
    setTimeout(()=>{
      showScreen("win-screen");
      loadWin();
    },500);
    launchConfetti();
  }

}

function checkLose(){

  if(moves >= maxMoves && matchedCount !== cards.length){

    setTimeout(() => {

      showScreen("defeat-screen");

      loseSound.play(); // 🔥 sound kalah

    }, 500);

  }

}

function launchConfetti() {

  const container = document.getElementById("confetti-container");
  if (!container) return;

  const colors = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];

  let durationTotal = 8000; // total waktu confetti (8 detik)
  let interval = 100; // tiap 0.2 detik spawn

  let intervalId = setInterval(() => {

    for (let i = 0; i < 15; i++) {

      const confetti = document.createElement("div");
      confetti.classList.add("confetti");

      const size = Math.random() * 8 + 3;

      confetti.style.width = size + "px";
      confetti.style.height = size + "px";

      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-10px";

      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";

      container.appendChild(confetti);

      const fallDuration = Math.random() * 4000 + 4000;

      confetti.animate(
        [
          { transform: "translateY(0px) rotate(0deg)" },
          {
            transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`
          }
        ],
        {
          duration: fallDuration,
          easing: "ease-out"
        }
      );

      setTimeout(() => {
        confetti.remove();
      }, fallDuration);
    }

  }, interval);

  // stop setelah durasi total
  setTimeout(() => {
    clearInterval(intervalId);
  }, durationTotal);

}
function saveWin(){

  let key = "win_" + currentDifficulty;

  let win = localStorage.getItem(key) || 0;

  win++;

  localStorage.setItem(key, win);

}

function loadWin(){

  const easy = localStorage.getItem("win_easy") || 0;
  const medium = localStorage.getItem("win_medium") || 0;
  const hard = localStorage.getItem("win_hard") || 0;

  totalWinText.innerText = `
    Easy: ${easy} | Medium: ${medium} | Hard: ${hard}
  `;
}

//background bergerak
var layerCount = 5;
var starCount = 400;
var maxTime = 30;
var universe = document.getElementById("universe");
var w = window;
var d = document;
var e = d.documentElement;
var g = d.getElementsByTagName("body")[0];
var width = w.innerWidth || e.clientWidth || g.clientWidth;
var height = w.innerHeight || e.clientHeight || g.clientHeight;
for (var i = 0; i < starCount; ++i) {
  var ypos = Math.round(Math.random() * height);
  var star = document.createElement("div");
  var speed = 1000 * (Math.random() * maxTime + 1);
  star.setAttribute("class", "star" + (3 - Math.floor(speed / 1000 / 8)));
  star.style.backgroundColor = "white";

  universe.appendChild(star);
  star.animate(
    [
      {
        transform: "translate3d(" + width + "px, " + ypos + "px, 0)"
      },
      {
        transform:
          "translate3d(-" + Math.random() * 256 + "px, " + ypos + "px, 0)"
      }
    ],
    {
      delay: Math.random() * -speed,
      duration: speed,
      iterations: 1000
    }
  );
}

var elem = document.querySelector(".pulse");
var animation = elem.animate(
  {
    opacity: [0.5, 1],
    transform: ["scale(0.5)", "scale(1)"]
  },
  {
    direction: "alternate",
    duration: 500,
    iterations: Infinity
  }
);
