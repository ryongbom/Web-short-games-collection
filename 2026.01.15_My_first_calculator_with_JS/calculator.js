let currentNumber = "0";
let shouldResetScreen = false;
let firstOperand = "";
let currentOperator = null;
let currentExpression = "";

const screenElement = document.querySelector(".curr-operand");
const screenResult = document.querySelector(".prev-operand");
const numberButtons = document.querySelectorAll('.btn-number, .btn-number-zero');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const additionButton = document.querySelector('[data-action="addition"]');
const subtractButton = document.querySelector('[data-action="subtract"]');
const divideButton = document.querySelector('[data-action="divide"]');
const multiplyButton = document.querySelector('[data-action="multiply"]');
const equalButton = document.querySelector('[data-action="equals"]');
const percentButton = document.querySelector('[data-action="percent"]');

function updateScreen() {
    screenElement.textContent = currentNumber;
}

function updateExpression() {
    screenResult.textContent = currentExpression;
}

updateScreen();
updateExpression();

numberButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const number = button.getAttribute('data-number');

        if (number === '.') {
            if (currentNumber.includes('.')) {
                return;
            }

            if (currentNumber === '0' || currentNumber === '') {
                currentNumber = '0.';
            } else {
                if (currentNumber.length < 15) {
                    currentNumber += '.';
                }
            }
        }

        else {
            if (currentNumber === "0" || shouldResetScreen) {
                currentNumber = number;
                shouldResetScreen = false;
            } else {
                if (currentNumber.length < 15) {
                    currentNumber += number;
                }
            }
        }
    
        updateScreen();
    })
})

function clearAll() {
    currentNumber = "0";
    firstOperand = "";
    currentOperator = null;
    shouldResetScreen = false;
    currentExpression = "";
    updateScreen();
    updateExpression();
}

clearButton.addEventListener('click', clearAll);

backspaceButton.addEventListener('click', function() {
    if (currentNumber === "0" || currentNumber.length === 1) {
        currentNumber = "0";
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }

    updateScreen();
})

percentButton.addEventListener('click', function() {
    currentNumber = (parseFloat(currentNumber) / 100).toString();
    updateScreen();
})

function getOperatorSymbol(operator) {
    switch(operator) {
        case 'addition': return '+';
        case 'subtract': return '-';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

additionButton.addEventListener('click', function() {
    handleOperator('addition');
})

subtractButton.addEventListener('click', function() {
    handleOperator('subtract');
})

divideButton.addEventListener('click', function() {
    handleOperator('divide');
})

multiplyButton.addEventListener('click', function() {
    handleOperator('multiply');
})

function handleOperator(operator) {
    if (firstOperand !== "" && currentOperator !== null && !shouldResetScreen) {
        compute();
    }

    firstOperand = currentNumber;
    currentOperator = operator;

    currentExpression = `${firstOperand} ${getOperatorSymbol(operator)}`;
    updateExpression();

    shouldResetScreen = true;
}

equalButton.addEventListener('click', function() {
    compute();
})

function compute() {
    if (firstOperand === "" || currentOperator === null) {
        return;
    }

    const firstNumber = parseFloat(firstOperand);
    const secondNumber = parseFloat(currentNumber);
    let result;

    if (currentOperator === 'addition') {
        result = firstNumber + secondNumber;
    } else if (currentOperator === 'subtract') {
        result = firstNumber - secondNumber;
    } else if (currentOperator === 'divide') {
        if (secondNumber === 0) {
            alert("can not divide 0");
            clearAll();
            return;
        }
        result = firstNumber / secondNumber;
    } else if (currentOperator === 'multiply') {
        result = firstNumber * secondNumber;
    }

    result = Math.round(result * 1000000) / 1000000;

    currentExpression = `${firstOperand} ${getOperatorSymbol(currentOperator)} ${currentNumber} =`;
    updateExpression();

    currentNumber = result.toString();
    updateScreen();

    firstOperand = "";
    currentOperator = null;
    shouldResetScreen = true;
}