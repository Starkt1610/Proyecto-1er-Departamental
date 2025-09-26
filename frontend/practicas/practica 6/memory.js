// Juego de memoria con 12 cartas (6 parejas)

document.addEventListener('DOMContentLoaded', () => {
    const icons = ['🍎', '🍌', '🍇', '🍓', '🥝', '🍉'];
    let cardsArray = [...icons, ...icons];
    const grid = document.getElementById('memoryGrid');
    const movesSpan = document.getElementById('moves');
    const timeSpan = document.getElementById('time');
    const restartBtn = document.getElementById('restartBtn');
    const winMessage = document.getElementById('winMessage');
    const finalMoves = document.getElementById('finalMoves');
    const finalTime = document.getElementById('finalTime');
    const playAgain = document.getElementById('playAgain');

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let timer = null;
    let seconds = 0;
    let gameStarted = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function initGame() {
        grid.innerHTML = '';
        shuffle(cardsArray);
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        gameStarted = false;
        movesSpan.textContent = '0';
        timeSpan.textContent = '0';
        clearInterval(timer);
        cardsArray.forEach(icon => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.value = icon;
            card.innerHTML = `
  <div class="card-inner">
    <div class="card-front">?</div>
    <div class="card-back">${icon}</div>
  </div>`;

            grid.appendChild(card);
        });
        addCardListeners();
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            timeSpan.textContent = seconds;
        }, 1000);
    }

    function addCardListeners() {
        document.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', () => flipCard(card));
        });
    }

    function flipCard(card) {
        if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
        card.classList.add('flip');
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }
        if (!firstCard) {
            firstCard = card;
            return;
        }
        secondCard = card;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === icons.length) {
                gameWon();
            }
        } else {
            unflipCards();
        }
        moves++;
        movesSpan.textContent = moves;
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function gameWon() {
        clearInterval(timer);
        finalMoves.textContent = moves;
        finalTime.textContent = seconds;
        winMessage.classList.add('show');
    }

    restartBtn.addEventListener('click', initGame);
    playAgain.addEventListener('click', () => {
        winMessage.classList.remove('show');
        initGame();
    });

    initGame();
});
