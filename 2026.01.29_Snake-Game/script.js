const startBtn = document.getElementById('startBtn');
const startContainer = document.querySelector('.start-container');
const gameContainer = document.querySelector('.game-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let snake = [
    { x: 100, y: 100 },
    { x: 90, y: 100 },
    { x: 80, y: 100 }
]
let mouseDirection = { x: 1, y: 0 };
let gameLoopId = null;
let mouseCoord = { x: 0, y: 0 };

startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const head = snake[0];
    const headCenterX = head.x + 5;
    const headCenterY = head.y + 5;

    const dx = mouseX - headCenterX;
    const dy = mouseY - headCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) {
        mouseDirection.x = dx / distance;
        mouseDirection.y = dy / distance;

        const speedFactor = Math.min(1, distance / 100);
        mouseDirection.x *= speedFactor;
        mouseDirection.y *= speedFactor;
    }

    console.log(`Mouse position: (${mouseX}, ${mouseY})`);
    console.log(`Direction: (${mouseDirection.x.toFixed(2)}, ${mouseDirection.y.toFixed(2)})`);

    // Store mouse position for arrow visualization
    mouseCoord.x = mouseX;
    mouseCoord.y = mouseY;
})

function startGame() {
    startContainer.style.transition = 'opacity 0.3s';
    startContainer.style.opacity = '0';

    setTimeout(() => {
        startContainer.style.display = 'none';
        gameContainer.style.display = 'block';

        gameContainer.style.opacity = '0';
        gameContainer.style.transition = 'opacity 0.3s';

        setTimeout(() => {
            gameContainer.style.opacity = '1';
        }, 10);

        createCanvas();
        initSnake();
        initGame();
        startGameLoop();
    }, 300);
}

function createCanvas() {
    canvas.width = 1200;
    canvas.height = 600;

    ctx.fillStyle = '#0F1C28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initGame() {
    score = 0;
    foods = [];
    updateScoreDisplay();

    for (let i = 0; i < 3; i++) {
        spawnFood();
    }
}

function initSnake() {
    const centerX = Math.floor(canvas.width / 2 / 10) * 10;
    const centerY = Math.floor(canvas.height / 2 / 10) * 10;

    snake = [
        { x: centerX, y: centerY },
        { x: centerX - 10, y: centerY },
        { x: centerX - 20, y: centerY }
    ];
    mouseDirection = { x: 1, y: 0 };
}

function startGameLoop() {
    if (gameLoopId) clearInterval(gameLoopId);

    gameLoopId = setInterval(() => {
        moveSnake();
        checkFoodCollision();
        spawnFood();
        updateScreen();
    }, 50);
}

function drawSnakeWithLines() {
    const CELL_SIZE = 10;
    const RADIUS = 5;

    // 1. Draw connecting lines (first)
    if (snake.length > 1) {
        ctx.strokeStyle = 'rgb(146, 211, 146)';
        ctx.lineWidth = RADIUS * 2;  // Match circle diameter
        ctx.lineCap = 'round';       // Round line ends
        ctx.lineJoin = 'round';      // Round line joints

        ctx.beginPath();
        // Move to first point
        ctx.moveTo(snake[0].x + CELL_SIZE / 2, snake[0].y + CELL_SIZE / 2);

        // Connect each point with lines
        for (let i = 1; i < snake.length; i++) {
            ctx.lineTo(snake[i].x + CELL_SIZE / 2, snake[i].y + CELL_SIZE / 2);
        }
        ctx.stroke();
    }

    // 2. Draw circles (later - on top of lines)
    snake.forEach((coord, index) => {
        ctx.fillStyle = index === 0 ? '#f24141ff' : 'rgb(146, 211, 146)';
        ctx.beginPath();
        ctx.arc(
            coord.x + CELL_SIZE / 2,
            coord.y + CELL_SIZE / 2,
            RADIUS,
            0, Math.PI * 2
        );
        ctx.fill();
    });

    // Draw direction arrow
    ctx.strokeStyle = '#a32089ff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(snake[0].x + CELL_SIZE / 2 + (20 * mouseDirection.x),
        snake[0].y + CELL_SIZE / 2 + (20 * mouseDirection.y));
    ctx.lineTo(mouseCoord.x, mouseCoord.y);
    ctx.stroke();
}

function moveSnake() {
    const head = snake[0];

    const SPEED = 5;

    const newHead = {
        x: head.x + mouseDirection.x * SPEED,
        y: head.y + mouseDirection.y * SPEED
    };

    // Calculate movement distance
    const moveDistance = Math.sqrt(
        Math.pow(newHead.x - head.x, 2) +
        Math.pow(newHead.y - head.y, 2)
    );

    if (moveDistance < 1) {
        // Skip collision check if barely moving
        return;
    }

    if (gameOver(newHead.x, newHead.y)) {
        clearInterval(gameLoopId);
        gameLoopId = null;

        if (confirm('Game Over. Restart?')) {
            createCanvas();
            initGame();
            initSnake();
            startGameLoop();
        }
        return;
    }

    snake.unshift(newHead);
    snake.pop();
}

function updateScreen() {
    ctx.fillStyle = '#0F1C28';
    ctx.fillRect(0, 0, 1200, 600);

    drawSnakeWithLines();
    drawFoods();
}

function gameOver(x, y) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return true;
    }

    for (let i = 10; i < snake.length; i++) {
        // Self-collision check (important!)
        const segment = snake[i];
        const distance = Math.sqrt(
            Math.pow(x - (segment.x + 5), 2) +
            Math.pow(y - (segment.y + 5), 2)
        );
        if (distance < 7) {
            // Radius 5 + margin 2
            return true;
        }
    }

    return false;
}

let foods = [];
let score = 0;

const colors = [
    'red',
    'blue',
    'white',
    'lightgray',
    'green'
];

function spawnFood() {
    if (foods.length >= 5) return;

    const food = {
        x: Math.floor(Math.random() * (canvas.width - 10)) + 5,
        y: Math.floor(Math.random() * (canvas.height - 10)) + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        points: Math.floor(Math.random() * 3) + 1,
        active: true
    };

    foods.push(food);
}

function drawFoods() {
    foods.forEach(food => {
        if (food.active === false) return;
        ctx.fillStyle = food.color;
        ctx.beginPath();
        ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkFoodCollision() {
    const head = snake[0];
    const headCenterX = head.x + 5;
    const headCenterY = head.y + 5;
    const COLLISION_DISTANCE = 10;

    for (let i = 0; i < foods.length; i++) {
        const food = foods[i];

        if (!food.active) continue;

        const distance = Math.sqrt(
            Math.pow(headCenterX - food.x, 2) +
            Math.pow(headCenterY - food.y, 2)
        );

        if (distance < COLLISION_DISTANCE) {
            eatFood(i);
        }
    }
}

function eatFood(foodIndex) {
    const food = foods[foodIndex];

    food.active = false;

    score += food.points;
    updateScoreDisplay();

    growSnake();

    foods.splice(foodIndex, 1);

    setTimeout(() => {
        if (foods.length < 5) {
            spawnFood();
        }
    }, 500);
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');

    scoreElement.textContent = score;

    let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore.toString());
    }

    highScoreElement.textContent = highScore;
}

function growSnake() {
    const tail = snake[snake.length - 1];
    const secondLast = snake[snake.length - 2];

    let newSegment;

    if (secondLast) {
        const dx = tail.x - secondLast.x;
        const dy = tail.y - secondLast.y;

        newSegment = {
            x: tail.x + dx,
            y: tail.y + dy
        };
    } else {
        newSegment = {
            x: tail.x - 10,
            y: tail.y
        };
    }

    snake.push(newSegment);
}