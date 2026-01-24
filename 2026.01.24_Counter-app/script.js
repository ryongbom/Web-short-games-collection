const countNumber = document.getElementById('countNum');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const resetBtn = document.getElementById('resetBtn');

let currentNumber = 0;

document.addEventListener('DOMContentLoaded', function () {
    loadSavedNumber();
    updateDisplay();
    increaseBtn.addEventListener('click', handleIncrease);
    decreaseBtn.addEventListener('click', handleDecrease);
    resetBtn.addEventListener('click', handleReset);

    document.addEventListener('keydown', handleKeyboard);
})

function handleKeyboard(event) {
    switch (event.key) {
        case '+':
        case 'ArrowUp':
        case ' ':
            handleIncrease();
            break;
        case '-':
        case 'ArrowDown':
            handleDecrease();
            break;
        case 'r':
        case 'R':
        case '0':
            handleReset();
            break;
    }
}

function handleIncrease() {
    increaseNumber();
    animateNumberChange();
}

function handleDecrease() {
    decreaseNumber();
    animateNumberChange();
}

function handleReset() {
    if (currentNumber !== 0 && confirm('Do you want to reset counter 0?')) {
        resetNumber();
        animateNumberChange();
    }
}

function loadSavedNumber() {
    const saved = localStorage.getItem('countNumber');
    if (saved) {
        try {
            currentNumber = JSON.parse(saved);
        } catch (error) {
            console.error('Failed to load saved number from localStorage:', error);
            currentNumber = 0;
        }
    }
}


function saveNumber() {
    localStorage.setItem('countNumber', JSON.stringify(currentNumber));
}

function increaseNumber() {
    currentNumber += 1;
}

function resetNumber() {
    currentNumber = 0;
}

function decreaseNumber() {
    if (currentNumber > 0) {
        currentNumber -= 1;
    }
}

function animateNumberChange() {
    countNumber.style.transform = 'scale(1.1)';

    setTimeout(() => {
        countNumber.textContent = currentNumber.toString();
        countNumber.style.transform = 'scale(1)';

        saveNumber();
    }, 150);
}

function updateDisplay() {
    countNumber.textContent = currentNumber.toString();
    saveNumber();
}
