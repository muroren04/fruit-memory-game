let matchedPairs = 0;

const timerDisplay = document.getElementById("timer");

const clearScreen = document.getElementById("clear-screen");

const clearTime = document.getElementById("clear-time");

const clearMoves = document.getElementById("clear-moves");

const bestTime = document.getElementById("best-time");

const bestMoves = document.getElementById("best-moves");

let seconds = 0;
let timer = null;
let started = false;

const fruits = [
    "apple",
    "banana",
    "peach",
    "watermelon",
    "cherry",
    "strawberry",
    "grape",
    "melon"
];

// 2枚ずつにする
let cards = [...fruits, ...fruits];

// シャッフル
cards.sort(() => Math.random() - 0.5);

const board = document.getElementById("game-board");

const startScreen = document.getElementById("start-screen");

const gameScreen = document.getElementById("game-screen");

const startButton = document.getElementById("start-button");

const restartButton = document.getElementById("restart");

const movesDisplay = document.getElementById("moves");

const clearRestart = document.getElementById("clear-restart");

const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const clearSound = new Audio("sounds/clear.mp3");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedCards = [];


// カードを作る
function createCards(){

    cards.forEach(fruit => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <div class="card-inner">

            <div class="card-front">
                <img src="images/${fruit}.png" alt="${fruit}">
            </div>

            <div class="card-back">
                <img src="images/back.png" alt="back">
            </div>

        </div>
        `;

        card.dataset.fruit = fruit;


        card.addEventListener("click", () => {

            if (lockBoard) return;

            if (card === firstCard) return;

            if (matchedCards.includes(card)) return;

            card.classList.add("flipped");


            flipSound.currentTime = 0;
            flipSound.play();


            if (!firstCard){

                firstCard = card;
                return;

            }


            secondCard = card;

            lockBoard = true;


            moves++;

            movesDisplay.textContent = moves;


            checkMatch();


        });


        board.appendChild(card);

    });

}

function checkMatch() {

    const firstFruit = firstCard.dataset.fruit;
    const secondFruit = secondCard.dataset.fruit;

    if (firstFruit === secondFruit) {

        matchSound.currentTime = 0;
        matchSound.play();

        matchedPairs++;

        matchedCards.push(firstCard);
        matchedCards.push(secondCard);

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard = null;
        secondCard = null;
        lockBoard = false;

        if (matchedPairs === 8) {

            clearInterval(timer);

            clearSound.play();

            setTimeout(() => {

                clearScreen.style.display = "block";

board.style.display = "none";

restartButton.style.display = "none";

createConfetti();

clearTime.textContent = seconds;

clearMoves.textContent = moves;

saveBestScore();

            }, 300);

        }

    }else{

    wrongSound.currentTime = 0;
    wrongSound.play();

    setTimeout(()=>{

        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        firstCard = null;
        secondCard = null;
        lockBoard = false;

    },1000);

}

}

restartButton.addEventListener("click", () => {

    location.reload();

});

startButton.addEventListener("click", () => {

    startScreen.style.display = "none";

    gameScreen.style.display = "block";


    started = true;

    timer = setInterval(() => {

    seconds += 0.1;

    seconds = Number(seconds.toFixed(1));

    timerDisplay.textContent = seconds;

},100);


    createCards();

});

clearRestart.addEventListener("click", () => {

    location.reload();

});

function saveBestScore(){

    let bestTimeValue = localStorage.getItem("bestTime");

    let bestMovesValue = localStorage.getItem("bestMoves");


    if(bestTimeValue === null || seconds < Number(bestTimeValue)){

        localStorage.setItem("bestTime", seconds.toFixed(1));

    }


    if(bestMovesValue === null || moves < Number(bestMovesValue)){

        localStorage.setItem("bestMoves", moves);

    }


    bestTime.textContent = Number(localStorage.getItem("bestTime")).toFixed(1);

    bestMoves.textContent = localStorage.getItem("bestMoves");

}

const canvas = document.getElementById("confetti");

const ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let confettis = [];


function createConfetti(){

    confettis = [];


    for(let i = 0; i < 150; i++){

        confettis.push({

            x: Math.random() * canvas.width,

            y: Math.random() * canvas.height - canvas.height,

            size: Math.random() * 10 + 5,

            speed: Math.random() * 3 + 2,

            angle: Math.random() * 360

        });

    }


    animateConfetti();

}


function animateConfetti(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    confettis.forEach(c => {


        c.y += c.speed;


        ctx.save();


        ctx.translate(c.x,c.y);


        ctx.rotate(c.angle);


        ctx.fillStyle =
        `hsl(${Math.random()*360},100%,50%)`;


        ctx.fillRect(
            0,
            0,
            c.size,
            c.size
        );


        ctx.restore();



        if(c.y > canvas.height){

            c.y = -20;

        }


    });


    requestAnimationFrame(animateConfetti);

}