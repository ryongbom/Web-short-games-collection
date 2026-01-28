const RockBtn = document.getElementById('RockBtn');
const PaperBtn = document.getElementById('PaperBtn');
const ScissorsBtn = document.getElementById('ScissorsBtn');
const PlayerBoard = document.querySelector('.player-board');
const ComputerBoard = document.querySelector('.computer-board');
const PlayGameBtn = document.getElementById('gamePlayBtn');
const resetGameBtn = document.getElementById('gameResetBtn');
const historySection = document.querySelector('.history-section');
const numScorePlayer = document.querySelector('.number-score-player');
const numScoreCom = document.querySelector('.number-score-computer');
const roundDisplay = document.querySelector('.count-round');
const explainText = document.querySelector('.text-explain');

let currentPlayerStatus = null;
let currentComputerStatus = null;
let gameWinStatus = null;
let countRound = 0;
let currentPlayerScore = 0;
let currentComScore = 0;

document.addEventListener('DOMContentLoaded', () => {
    PlayerBoard.style.backgroundImage = 'url(waiting/playerboard.png)';
    PlayerBoard.style.backgroundSize = 'cover';
    ComputerBoard.style.backgroundImage = 'url(waiting/computerboard1.png)';
    ComputerBoard.style.backgroundSize = 'cover';
})


function addEventClick() {
    RockBtn.addEventListener('click', () => {
        handleEventClick('Rock');
    })

    PaperBtn.addEventListener('click', () => {
        handleEventClick('Paper');
    })

    ScissorsBtn.addEventListener('click', () => {
        handleEventClick('Scissors');
    })
    PlayGameBtn.addEventListener('click', () => {
        if (!currentPlayerStatus) {
            explainText.textContent = 'Please select Rock, Paper, or Scissors first!';
            return;
        }
        randomImageCom();
    })
    resetGameBtn.addEventListener('click', () => {
        resetGame();
    })
}

function handleEventClick(event) {
    PlayerBoard.style.backgroundImage = `url(boards/${event}-board.jpg)`;
    currentPlayerStatus = event;
    ComputerBoard.style.backgroundImage = 'url(waiting/computerboard2.png)';

    explainText.textContent = `${event} seleted!`;
}

function randomImageCom() {
    const types = [
        'Rock',
        'Paper',
        'Scissors'
    ]
    if (currentPlayerStatus) {
        const randomIndex = Math.floor(Math.random() * types.length);
        const randomType = types[randomIndex];
        ComputerBoard.style.backgroundImage = `url(boards/${randomType}-board.jpg)`;
        currentComputerStatus = randomType;
        displayHistory();
    }
}

function resultWinLose() {
    if (currentPlayerStatus === 'Rock') {
        if (currentComputerStatus === 'Scissors') {
            return true;
        }
        else if (currentComputerStatus === 'Paper') {
            return false;
        }
        else {
            return -1;
        }
    }
    else if (currentPlayerStatus === 'Scissors') {
        if (currentComputerStatus === 'Rock') {
            return false;
        }
        else if (currentComputerStatus === 'Paper') {
            return true;
        }
        else {
            return -1;
        }
    }
    else if (currentPlayerStatus === 'Paper') {
        if (currentComputerStatus === 'Rock') {
            return true;
        }
        else if (currentComputerStatus === 'Scissors') {
            return false;
        }
        else {
            return -1;
        }
    }
}

// function displayHistory() {
//     countRound += 1;

//     gameWinStatus = resultWinLose();
//     const historyItem = document.createElement('div');

//     let resultMess = '';
//     let resultType = '';
//     if (gameWinStatus === true) {
//         resultMess = `Round ${countRound.toString()}: ${currentPlayerStatus} vs
//             ${currentComputerStatus} - You Win!`;
//         currentPlayerScore += 1;
//         resultType = 'win';
//     }
//     else if (gameWinStatus === false) {
//         resultMess = `Round ${countRound.toString()}: ${currentPlayerStatus} vs
//             ${currentComputerStatus} - Computer Wins!`;
//         currentComScore += 1;
//         resultType = 'lose';
//     }
//     else if (gameWinStatus === -1) {
//         resultMess = `Round ${countRound.toString()}: ${currentPlayerStatus} vs
//             ${currentComputerStatus} - Draw!`;
//         resultType = 'draw';
//     }
//     historyItem.className = `element-history ${resultType}`;

//     historyItem.textContent = resultMess;
//     historySection.prepend(historyItem);

//     displayResult();

//     currentPlayerStatus = null;
//     currentComputerStatus = null;
// }

function displayHistory() {
    countRound += 1;
    gameWinStatus = resultWinLose();
    const historyItem = document.createElement('div');

    // 이모지 매핑
    const emojis = {
        'Rock': '✊',
        'Paper': '✋',
        'Scissors': '✌️'
    };

    let resultMess = '';
    let resultType = '';
    let prefixEmoji = '';

    if (gameWinStatus === true) {
        resultMess = `Round ${countRound}: ${emojis[currentPlayerStatus]} ${currentPlayerStatus} vs 
            ${emojis[currentComputerStatus]} ${currentComputerStatus} - ✅ You Win!`;
        currentPlayerScore += 1;
        explainText.textContent = 'You win!';
        resultType = 'win';
        prefixEmoji = '🎯';
    }
    else if (gameWinStatus === false) {
        resultMess = `Round ${countRound}: ${emojis[currentPlayerStatus]} ${currentPlayerStatus} vs 
            ${emojis[currentComputerStatus]} ${currentComputerStatus} - ❌ Computer Wins!`;
        currentComScore += 1;
        explainText.textContent = 'You lose!';
        resultType = 'lose';
        prefixEmoji = '💥';
    }
    else if (gameWinStatus === -1) {
        resultMess = `Round ${countRound}: ${emojis[currentPlayerStatus]} ${currentPlayerStatus} vs 
            ${emojis[currentComputerStatus]} ${currentComputerStatus} - 🔄 Draw!`;
        explainText.textContent = 'It`s a draw!';
        resultType = 'draw';
        prefixEmoji = '⚡';
    }

    historyItem.className = `element-history ${resultType}`;
    historyItem.innerHTML = `${prefixEmoji} ${resultMess}`;
    historySection.prepend(historyItem);
    displayResult();
    currentPlayerStatus = null;
    currentComputerStatus = null;
}

function resetGame() {
    currentPlayerStatus = null;
    currentComputerStatus = null;
    gameWinStatus = null;
    countRound = 0;
    currentPlayerScore = 0;
    currentComScore = 0;

    PlayerBoard.style.backgroundImage = 'url(waiting/playerboard.png)';
    PlayerBoard.style.backgroundSize = 'cover';
    ComputerBoard.style.backgroundSize = 'cover';

    ComputerBoard.style.backgroundImage = 'url(waiting/computerboard1.png)';
    ComputerBoard.style.backgroundSize = 'cover';

    historySection.innerHTML = '';
    explainText.textContent = 'Select Rock, Paper, or Scissors!';

    displayResult();
}

function displayResult() {
    numScorePlayer.textContent = currentPlayerScore.toString();
    numScoreCom.textContent = currentComScore.toString();
    roundDisplay.textContent = countRound.toString();
}



function updateScreen() {
    addEventClick();
}

updateScreen();
